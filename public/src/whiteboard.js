// 引入共用的變數
import {
  roomId,
  myName,
  socket,
  whiteboardShareName,
  whiteboardSharePeerId
} from "./constant.js";

import { myPeerId } from "./stream.js";

let openWhiteboardStatus;
// 開啟小白板
$("#start-whiteboard").on("click", async () => {
  openWhiteboardStatus = true;
  // 若有人分享小白版或螢幕，則不能分享
  if ($("#left-items span").length === 1) {
    alert("目前有人正在分享小白版，不能分享");
    return;
  }
  if ($("#share-screen-video video").length === 1) {
    alert("目前有人正在分享螢幕，不能分享小白版");
    return;
  }
  // 通知會議室其他人開啟小白版
  socket.emit("start-whiteboard", roomId, myName, myPeerId);
  $("#left-items").append(
    `<span class="flex items-center bg-gray-300 rounded-lg h-full mt-2 ml-2">&emsp;你正在共享小白版&emsp;</span>`
  );

  $("#right-items").append(`          
    <span id="clean-whiteboard" class="flex items-center h-full bg-gray-300 rounded-lg text-yellow-800 mt-2 mr-2 hover:text-yellow-600 hover:cursor-pointer">&emsp;清空白板&emsp;</span>
  `);

  $("#right-items").append(`          
    <span id="whiteboard-stop-btn" class="flex items-center h-full bg-gray-300 rounded-lg text-yellow-800 mt-2 mr-2 hover:text-yellow-600 hover:cursor-pointer">&emsp;停止共享&emsp;</span>
  `);

  await whiteboardLayout();
  const { canvas, startDrawing, move, stopDrawing } = await startWhiteboard();
  // 關閉小白版的按鈕
  $("#whiteboard-stop-btn").on("click", () => {
    openWhiteboardStatus = false;
    socket.emit("stop-whiteboard", roomId);
    originLayout();
    $("#whiteboard-stop-btn").remove();
    // 取消畫布的監聽
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mousemove", move);
    canvas.removeEventListener("mouseup", stopDrawing);
  });
});

socket.on("start-whiteboard", async (name, peerId) => {
  $("#whiteboard canvas").attr("id", peerId)
  $("#left-items").append(
    `<span class="flex items-center bg-gray-300 rounded-lg h-full mt-2 ml-2">&emsp;${name}正在共享小白版&emsp;</span>`
  );
  $("#right-items").append(`          
    <span class="flex items-center h-full bg-gray-300 rounded-lg text-yellow-800 mt-2 mr-2 hover:text-yellow-600 hover:cursor-pointer">&emsp;清空白板&emsp;</span>
  `);
  await whiteboardLayout();
  const { canvas, startDrawing, move, stopDrawing } = await startWhiteboard();

  socket.on("stop-whiteboard", async () => {
    originLayout();
    // 取消畫布的監聽
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mousemove", move);
    canvas.removeEventListener("mouseup", stopDrawing);
  });
});

// 新user剛進會議室時，偵測會議室是否已開啟小白版
if (
  whiteboardShareName !== "" &&
  whiteboardShareName
) {
  $("#whiteboard canvas").attr("id", whiteboardSharePeerId);
  $("#left-items").append(
    `<span class="flex items-center bg-gray-300 rounded-lg h-full mt-2 ml-2">&emsp;${whiteboardShareName}正在共享小白版&emsp;</span>`
  );
  $("#right-items").append(`          
    <span class="flex items-center h-full bg-gray-300 rounded-lg text-yellow-800 mt-2 mr-2 hover:text-yellow-600 hover:cursor-pointer">&emsp;清空白板&emsp;</span>
  `);
  await whiteboardLayout();
  const { canvas, startDrawing, move, stopDrawing } = await startWhiteboard();
  // 傳送會議室小白版的畫布狀態給新user
  socket.emit("new-user-whiteboard", roomId);

  socket.on("stop-whiteboard", async () => {
    originLayout();
    // 取消畫布的監聽
    canvas.removeEventListener("mousedown", startDrawing);
    canvas.removeEventListener("mousemove", move);
    canvas.removeEventListener("mouseup", stopDrawing);
  });
}

async function startWhiteboard() {
  // 抓取包裹canvas的div的寬，依16:9的比例設置div的長
  const whiteboardHeight = $("#whiteboard").height();
  const whiteboardWidth = (whiteboardHeight * 16) / 9;
  $("#whiteboard").attr("width", whiteboardWidth);
  $("#whiteboard canvas").attr("width", whiteboardWidth);
  $("#whiteboard canvas").attr("height", whiteboardHeight);

  // TODO:若包裹canvas的div的長寬變了，canvas的長寬要動態調整，但這蠻細的，要實現非常有難度，先pending

  // 開始畫畫
  const canvas = $("#whiteboard canvas")[0];
  const context = canvas.getContext("2d");

  const brushMini = $("#brush-mini div").width();
  const brushSmall = $("#brush-small div").width();
  const brushMedium = $("#brush-medium div").width();
  const brushBig = $("#brush-big div").width();

  let color = "#000000";
  let lineWidth = brushMini;

  // 選取畫畫工具列
  // 顏色和橡皮擦部分
  $("#black").on("click", () => {
    color = "#000000";
    $(".pen-color").removeClass("border-2 border-black");
    $("#color #black").addClass("border-2 border-black");
  });
  $("#yellow").on("click", () => {
    color = "#FCD34D";
    $(".pen-color").removeClass("border-2 border-black");
    $("#color #yellow").addClass("border-2 border-black");
  });
  $("#red").on("click", () => {
    color = "#DC2626";
    $(".pen-color").removeClass("border-2 border-black");
    $("#color #red").addClass("border-2 border-black");
  });
  $("#purple").on("click", () => {
    color = "#7C3AED";
    $(".pen-color").removeClass("border-2 border-black");
    $("#color #purple").addClass("border-2 border-black");
  });
  $("#blue").on("click", () => {
    color = "#2563EB";
    $(".pen-color").removeClass("border-2 border-black");
    $("#color #blue").addClass("border-2 border-black");
  });
  $("#green").on("click", () => {
    color = "#059669";
    $(".pen-color").removeClass("border-2 border-black");
    $("#color #green").addClass("border-2 border-black");
  });
  $("#eraser").on("click", () => {
    color = "#ffffff";
    $(".pen-color").removeClass("border-2 border-black");
    $("#eraser .pen-color").addClass("border-2 border-black");
  });
  // 筆刷部分
  $("#brush-mini").on("click", () => {
    lineWidth = brushMini;
    $(".pen-brush").removeClass("border-2 border-black");
    $("#brush-mini").addClass("border-2 border-black");
  });
  $("#brush-small").on("click", () => {
    lineWidth = brushSmall;
    $(".pen-brush").removeClass("border-2 border-black");
    $("#brush-small").addClass("border-2 border-black");
  });
  $("#brush-medium").on("click", () => {
    lineWidth = brushMedium;
    $(".pen-brush").removeClass("border-2 border-black");
    $("#brush-medium").addClass("border-2 border-black");
  });
  $("#brush-big").on("click", () => {
    lineWidth = brushBig;
    $(".pen-brush").removeClass("border-2 border-black");
    $("#brush-big").addClass("border-2 border-black");
  });

  // 清空小白版
  $("#right-items span").on("click", () => {
    step.push("clear-whiteboard");
    socket.emit("clear-whiteboard", roomId);
  });

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
      color,
      lineWidth,
      whiteboardWidth,
      whiteboardHeight
    );
    step.push([lastX, lastY, x, y, color, lineWidth]);

    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
    lastX = 0;
    lastY = 0;
  }

  function draw(lastX, lastY, x, y, color, lineWidth) {
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = "round";

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
        img.width,
        img.height,
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
      if (task === "clear-whiteboard") {
        clear();
      }
      if (task[0] === "restore-whiteboard") {
        restore(task[1]);
      }
      draw(task[0], task[1], task[2], task[3], task[4], task[5]);
    }
    setTimeout(drawEventLoop, 0);
  }
  drawEventLoop();

  // Socket.IO互動
  // 接受其他人的繪畫軌跡，比依螢幕大小不同比例調整
  socket.on(
    "move",
    (lastX, lastY, x, y, color, lineWidth, userWidth, userHeight) => {
      lastX = (lastX * whiteboardWidth) / userWidth;
      lastY = (lastY * whiteboardHeight) / userHeight;
      x = (x * whiteboardWidth) / userWidth;
      y = (y * whiteboardHeight) / userHeight;
      step.push([lastX, lastY, x, y, color, lineWidth]);
    }
  );

  socket.on("clear-whiteboard", () => {
    step.push("clear-whiteboard");
  });

  // 當有新user加入時，擷圖目前畫布，傳送給他
  socket.on("new-user-whiteboard", async (socketId) => {
    if (openWhiteboardStatus) {
      const state = canvas.toDataURL();
      socket.emit("whiteboard-state", state, socketId);
    }
  });

  socket.on("whiteboard-state", (state) => {
    step.push(["restore-whiteboard", state]);
  });

  // 若開啟小白版的user離開，通知會議的其他使用者要關掉
  socket.on("user-disconnected", (peerId) => {
    if ($("#whiteboard canvas").attr("id") === peerId) {
      originLayout();
      // 取消畫布的監聽
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("mouseup", stopDrawing);
    }
  });

  return { canvas, startDrawing, move, stopDrawing };
}

async function whiteboardLayout() {
  // 取消隱藏小白板部分
  $("#whiteboard").removeClass("hidden");
  // 一點選小白版，整個視訊部分css跟著大改
  $("#left-block").addClass("h-full");
  $("#display")
    .removeClass("w-full h-full grid gap-1 items-center")
    .addClass("w-[90%] flex gap-1 items-center justify-center mb-2");
  $("#display div:gt(4)").addClass("hidden");
  $("#display div")
    .removeClass("relative pb-[56.25%] overflow-hidden h-0 bg-gray-100")
    .addClass("relative w-[20%] aspect-video overflow-hidden bg-gray-100");
}

async function originLayout() {
  // 還原canavs的長和寬，以及包裹canavs的div的長
  $("#whiteboard").removeAttr("width");
  $("#whiteboard canvas").removeAttr("width height");
  // 還原視訊部分css跟著大改
  $("#whiteboard-reminder span").remove();
  $("#display div")
    .removeClass("hidden relative w-[20%] aspect-video overflow-hidden bg-gray-100")
    .addClass("relative pb-[56.25%] overflow-hidden h-0 bg-gray-100");
  $("#display")
    .removeClass("w-[90%] flex gap-1 items-center justify-center mb-2")
    .addClass("w-full h-full grid gap-1 items-center");
  $("#left-block").removeClass("h-full");
  // 隱藏小白板部分
  $("#whiteboard").addClass("hidden");
  // 還原小白版畫筆顏色
  $(".pen-color").removeClass("border-2 border-black");
  $("#color #black").addClass("border-2 border-black");
  // 還原小白版筆刷
  $(".pen-brush").removeClass("border-2 border-black");
  $("#brush-mini").addClass("border-2 border-black");
}
