// 引入共用的變數
import { roomId, myName, socket, roomWhiteboardStatus } from "./constant.js";

// 開啟小白板
$("#start-whiteboard").on("click", async () => {
  // 若有人分享小白版或螢幕，則不能分享
  if ($("#whiteboard-reminder span").length === 1) {
    alert("目前有人正在分享小白版，不能分享");
    return;
  }
  if ($("#share-screen-video video").length === 1) {
    alert("目前有人正在分享螢幕，不能分享小白版");
    return;
  }
  // 通知會議室其他人開啟小白版
  socket.emit("start-whiteboard", roomId, myName);
  $("#whiteboard-reminder").append(`<span>&emsp;你正在共享小白版&emsp;</span>`);
  $("#whiteboard").append(`          
      <div id="whiteboard-stop-btn" class="absolute top-2 right-2 bg-gray-300 rounded-lg h-8 flex items-center">
        <span class="text-yellow-800 hover:text-yellow-600 hover:cursor-pointer">&emsp;停止共享&emsp;</span>
      </div>
    `);
  $("#whiteboard-stop-btn").on("click", () => {
    socket.emit("stop-whiteboard", roomId)
    originLayout();
    $("#whiteboard-stop-btn").remove();
  })
  await whiteboardLayout();
  await startWhiteboard();
});

socket.on("start-whiteboard", async (name) => {
  $("#whiteboard-reminder").append(`<span>&emsp;${name}正在共享小白版&emsp;</span>`);
  await whiteboardLayout();
  await startWhiteboard();
});

socket.on("stop-whiteboard", async () => {
  originLayout();
});

// 新user剛進會議室時，偵測會議室是否已開啟小白版
if (
  roomWhiteboardStatus !== "false" &&
  roomWhiteboardStatus !== "" &&
  roomWhiteboardStatus
) {
  $("#whiteboard-reminder").append(
    `<span>&emsp;${roomWhiteboardStatus}正在共享小白版&emsp;</span>`
  );
  await whiteboardLayout();
  await startWhiteboard();
}

async function startWhiteboard() {
  // 抓取包裹canvas的div的寬，依16:9的比例設置div的長
  const whiteboardHeight = $("#whiteboard").height();
  const whiteboardWidth = whiteboardHeight * 16 / 9;
  $("#whiteboard").attr("width", whiteboardWidth);
  $("#my-whiteboard").attr("width", whiteboardWidth);
  $("#my-whiteboard").attr("height", whiteboardHeight);

  // TODO:若包裹canvas的div的長寬變了，canvas的長寬要動態調整，但這蠻細的，要實現非常有難度，先pending

  // 開始畫畫
  const canvas = document.getElementById("my-whiteboard");
  const context = canvas.getContext("2d");
  let eraser = false;
  let pen = "black";

  let step = [];
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // 畫畫相關function
  function startDrawing(event) {
    isDrawing = true;
    move(event);
  }

  function move(event) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (lastX === 0 && lastY === 0) {
      lastX = x;
      lastY = y;
    }

    socket.emit(
      "move",
      roomId,
      lastX,
      lastY,
      x,
      y,
      eraser,
      pen,
      whiteboardWidth,
      whiteboardHeight
    );
    step.push([lastX, lastY, x, y, eraser, pen]);

    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
    lastX = 0;
    lastY = 0;
  }

  function draw(lastX, lastY, x, y, eraser, pen) {
    if (eraser) {
      context.strokeStyle = "#FFFFFF";
      context.lineWidth = 30;
      context.lineCap = "round";
    } else if (pen === "black") {
      context.strokeStyle = "#000000";
      context.lineWidth = 5;
      context.lineCap = "round";
    } else if (pen === "blue") {
      context.strokeStyle = "#0080FF";
      context.lineWidth = 5;
      context.lineCap = "round";
    }

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
  }

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function restore(state) {
    const img = document.createElement("img");
    img.setAttribute("src", state);
    img.onload = () => {
      context.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };
  }

  // 監聽畫布的動作
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", stopDrawing);

  // 執行畫畫的drawEventLoop function
  function drawEventLoop() {
    if (step.length > 0) {
      const task = step.shift();
      if (task === "clear") {
        clear();
      }
      if (task[0] === "restore") {
        restore(task[1]);
      }
      draw(task[0], task[1], task[2], task[3], task[4], task[5]);
    }
    setTimeout(drawEventLoop, 0);
  }
  drawEventLoop();

  // Socket.IO互動
  // 接受其他人的繪畫軌跡，比依螢幕大小不同比例調整
  socket.on("move", (lastX, lastY, x, y, eraser, pen, userWidth, userHeight) => {
    lastX = (lastX * whiteboardWidth) / userWidth;
    lastY = (lastY * whiteboardHeight) / userHeight;
    x = (x * whiteboardWidth) / userWidth;
    y = (y * whiteboardHeight) / userHeight;
    step.push([lastX, lastY, x, y, eraser, pen]);
  });

  // socket.on("clearCanvas", () => {
  //   step.push("clear");
  // });

  // socket.on("user-connected", (userId, newUserSocketId) => {
  //   // 當有新user加入時，擷圖目前畫布，傳送到server
  //   const state = canvas.toDataURL();
  //   socket.emit("state", state, newUserSocketId);
  // });

  // socket.on("drawState", (state) => {
  //   step.push(["restore", state]);
  // });
}

async function whiteboardLayout() {
  // 取消隱藏小白板部分
  $("#whiteboard").removeClass("hidden");
  // 一點選小白版，整個視訊部分css跟著大改
  $("#left-block").addClass("h-full");
  $("#display")
    .removeClass("w-full h-full grid grid-cols-fluid-l gap-1 items-center")
    .addClass("w-[90%] flex gap-1 items-center justify-center mb-2");
  $("#display div")
    .removeClass("relative pb-[56.25%] overflow-hidden h-0 bg-gray-100")
    .addClass("relative w-[20%] aspect-video overflow-hidden bg-gray-100");
}

async function originLayout() {
  // 還原canavs的長和寬，以及包裹canavs的div的長
  $("#whiteboard").removeAttr("width");
  $("#my-whiteboard").removeAttr("width height");
  // 還原視訊部分css跟著大改
  $("#whiteboard-reminder span").remove();
  $("#display div")
    .removeClass("relative w-[20%] aspect-video overflow-hidden bg-gray-100")
    .addClass("relative pb-[56.25%] overflow-hidden h-0 bg-gray-100");
  $("#display")
    .removeClass("w-[90%] flex gap-1 items-center justify-center mb-2")
    .addClass("w-full h-full grid grid-cols-fluid-l gap-1 items-center");
  $("#left-block").removeClass("h-full");
  // 隱藏小白板部分
  $("#whiteboard").addClass("hidden");
}