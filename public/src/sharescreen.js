// 引入共用的變數
import { roomId, myName, socket } from "./constant.js";

/* ----------------------------- Step 1: 點選分享螢幕按鈕，獲取自己螢幕畫面的stream ----------------------------- */
$("#entire").on("click", async () => {
  closeShareScreenList();
  const myScreenStream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: "always" },
    audio: true,
  });

  const myScreen = document.createElement("video");
  myScreen.setAttribute("id", "myScreen");
  myScreen.setAttribute("class", "h-full object-cover object-center");
  shareScreenLayout();
  $("#who-share-screen").text("你正在與所有人分享螢幕畫面");
  $("#share-screen-reminder").append(
    `<span id="stop-share-screen" class="mr-2 text-yellow-800 hover:text-yellow-600 hover:cursor-pointer">停止分享螢幕</span>`
  );
  addShareScreen(myScreen, myScreenStream);

  // Step 3: 結束分享螢幕的按鈕在開始分享後才會append上來，所以偵測點擊結束按鈕需append完的地方，不然不會載入
  $("#stop-share-screen").on("click", () => {
    socket.emit("stop-share-screen", roomId);
    originLayout();
    const myScreen = $("#share-screen video")[0];
    removeShareScreen(myScreen);
  });
  
  socket.emit("start-share-screen", roomId, myName);
  socket.on("give-peerScreenId", (peerId) => {
    myPeerScreen.call(peerId, myScreenStream);
  });
});

/* ----------------------------- Step 2: 確定好要交換的stream後，開始處理Peer連線，進行stream交換 ----------------------------- */

const myPeerScreen = new Peer(undefined, {
  host: "currentmeet.com", // currentmeet.com
  port: "443", // 443
  path: "/myapp",
  debug: 2,
});

let myPeerScreenId;
myPeerScreen.on("open", (peerId) => {
  myPeerScreenId = peerId;
});

myPeerScreen.on("call", (call) => {
  call.answer();
  const shareUserPeerId = call.peer;
  const userScreen = document.createElement("video");
  userScreen.setAttribute("id", shareUserPeerId);
  userScreen.setAttribute("class", "h-full object-cover object-center");
  call.on("stream", (stream) => {
    shareScreenLayout();
    addShareScreen(userScreen, stream);
  });
});

socket.on("start-share-screen", (socketId, name) => {
  socket.emit("give-peerScreenId", socketId, myPeerScreenId);
  $("#who-share-screen").text(`${name}正在與所有人分享螢幕畫面`);
});

// 把共享螢幕append到html上的function
function addShareScreen(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    // FIXME:只有可以順利加載metadata的stream，video tag才會被append到網頁上，這樣便可以阻檔已經結束的share screen
    $("#share-screen").append(video);
  });
}

// 分享螢幕時，需要做的版面調整function
function shareScreenLayout() {
  // 取消隱藏分享螢幕部分
  $("#share-screen").removeClass("hidden");
  // 一點選分享螢幕，整個視訊部分css跟著大改
  $("#left-block").addClass("h-full");
  $("#display")
    .removeClass(
      "w-full h-full grid grid-cols-fluid-l gap-1 items-center justify-center"
    )
    .addClass("w-[90%] flex gap-1 items-center justify-center mb-2");
  $("#display div")
    .removeClass("relative pb-[56.25%] overflow-hidden h-0 bg-gray-100")
    .addClass("relative w-[20%] aspect-video overflow-hidden bg-gray-100");
}

/* ----------------------------- Step 3: 點選停止螢幕按鈕，回到原始畫面的function們 ----------------------------- */
// $("#stop-share-screen").on("click", () => {
//   socket.emit("stop-share-screen", roomId);
//   originLayout();
//   const myScreen = $("#share-screen video")[0];
//   removeShareScreen(myScreen);
// });

socket.on("stop-share-screen", () => {
  originLayout();
  const userScreen = $("#share-screen video")[0];
  removeShareScreen(userScreen);
});

function removeShareScreen(screen) {
  originLayout();
  let tracks = screen.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  screen.srcObject = null;
  $("#share-screen video").remove();
  $("#who-share-screen").text("");
  console.log($("#stop-share-screen").length);
  if ($("#stop-share-screen").length === 1) {
    $("#stop-share-screen").remove();
  }
}

function originLayout() {
  // 隱藏分享螢幕部分
  $("#share-screen").addClass("hidden");
  // 還原視訊部分css
  $("#left-block").removeClass("h-full");
  $("#display")
    .removeClass("w-[90%] flex gap-1 items-center justify-center mb-2")
    .addClass(
      "w-full h-full grid grid-cols-fluid-l gap-1 items-center justify-center"
    );
  $("#display div")
    .removeClass("relative w-[20%] aspect-video overflow-hidden bg-gray-100")
    .addClass("relative pb-[56.25%] overflow-hidden h-0 bg-gray-100");
}

/* ----------------------------- Other: 其他控制畫面雜項 ----------------------------- */
// function bar按鈕控制項
let shareScreenState = false;
$("#share-screen-btn").on("click", () => {
  if (shareScreenState) {
    $("#share-screen-list").addClass("hidden");
    shareScreenState = false;
    return;
  }
  $("#share-screen-list").removeClass("hidden");
  shareScreenState = true;
});

// 點選螢幕其他地方，也可以收起function bar list
document.addEventListener("click", (e) => {
  if (
    !$("#share-screen-list")[0].contains(e.target) &&
    !$("#share-screen-btn")[0].contains(e.target)
  ) {
    $("#share-screen-list").addClass("hidden");
    shareScreenState = false;
  }
});

// 點選分享螢幕按鈕後，收起選單
function closeShareScreenList() {
  $("#share-screen-list").addClass("hidden");
  shareScreenState = false;
}
