// 引入共用的變數
import { roomId, myName, socket } from "./begin.js";

// 自己分享螢幕的狀態
let myShareScreenStatus;

const myPeerScreen = new Peer(undefined, {
  host: "currentmeet.com", // currentmeet.com
  port: "443", // 443
  path: "/myapp",
  debug: 2,
});

let myPeerScreenId;
myPeerScreen.on("open", (peerId) => {
  myPeerScreenId = peerId;
  // 新user進來，傳送自己的myPeerScreenId給聊天室所有人
  socket.emit("new-give-peerScreenId", roomId, myPeerScreenId);
});

/* ----------------------------- Part 1: 點選分享螢幕按鈕，獲取自己螢幕畫面的stream ----------------------------- */
$("#entire").on("click", async () => {
  shareScreen("monitor");
});

$("#window").on("click", async () => {
  shareScreen("window");
});

$("#paging").on("click", async () => {
  shareScreen("browser");
});

async function shareScreen(surface) {
  if ($("#share-screen video").length === 1) {
    Swal.fire({
      icon: "warning",
      text: "現在有人分享螢幕，不能分享",
    });
    return;
  }
  if ($("#left-items span").length === 1) {
    Swal.fire({
      icon: "warning",
      text: "目前有人正在分享小白版，不能分享",
    });
    return;
  }
  socket.on("already-share-screen", (status) => {
    if (status) {
      Swal.fire({
        icon: "warning",
        text: "現在有人分享螢幕，不能分享",
      });
    }
  });

  myShareScreenStatus = true;

  closeShareScreenList();
  const myScreenStream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: "always", displaySurface: surface },
    audio: true,
  });

  const myScreen = document.createElement("video");
  myScreen.setAttribute("id", "myScreen");
  myScreen.setAttribute(
    "class",
    "absolute max-w-full max-h-full w-auto h-auto top-1/2 left-1/2 transform-center"
  );
  shareScreenLayout();
  $("#who-share-screen").text("你正在與所有人分享螢幕畫面");
  $("#share-screen-reminder").append(
    `<span id="stop-share-screen" class="mr-2 text-yellow-800 hover:text-yellow-600 hover:cursor-pointer">停止分享螢幕</span>`
  );
  addShareScreen(myScreen, myScreenStream);

  socket.emit("start-share-screen", roomId, myPeerScreenId);
  socket.on("give-peerScreenId", (peerId) => {
    const options = {
      metadata: { name: myName },
    };
    myPeerScreen.call(peerId, myScreenStream, options);
  });

  // Part 3: 結束分享螢幕的按鈕在開始分享後才會append上來，所以偵測點擊結束按鈕需append完的地方，不然不會載入
  $("#stop-share-screen").on("click", () => {
    socket.emit("stop-share-screen", roomId);
    originLayout();
    const myScreen = $("#share-screen video")[0];
    removeShareScreen(myScreen);
    myShareScreenStatus = false;
  });

  // Part 3: 偵測瀏覽器內建的停止分享按鈕，以及分享的頁面被關閉，做出相對應的行爲
  myScreenStream.getVideoTracks()[0].onended = () => {
    socket.emit("stop-share-screen", roomId);
    originLayout();
    const myScreen = $("#share-screen video")[0];
    removeShareScreen(myScreen);
    myShareScreenStatus = false;
  };

  // 若接收到新user進來的通知，自己是分享螢幕的人的話，傳送screen stream給user
  socket.on("new-give-peerScreenId", (peerId) => {
    if (myShareScreenStatus) {
      const options = {
        metadata: { name: myName },
      };
      myPeerScreen.call(peerId, myScreenStream, options);
    }
  });
}

/* ----------------------------- Part 2: 確定好要交換的stream後，進行stream交換 ----------------------------- */

myPeerScreen.on("call", (call) => {
  call.answer();
  // 抓取分享user的名字
  const { name } = call.metadata;
  $("#who-share-screen").text(`${name}正在與所有人分享螢幕畫面`);
  const shareUserPeerId = call.peer;
  const userScreen = document.createElement("video");
  userScreen.setAttribute("id", shareUserPeerId);
  userScreen.setAttribute(
    "class",
    "absolute max-w-full max-h-full w-auto h-auto top-1/2 left-1/2 transform-center"
  );
  call.on("stream", (stream) => {
    shareScreenLayout();
    addShareScreen(userScreen, stream);
  });
});

socket.on("start-share-screen", (socketId) => {
  socket.emit("give-peerScreenId", socketId, myPeerScreenId);
});

// 若分享螢幕的user離開，通知會議的其他使用者要關掉
socket.on("shareScreen-user-disconnected", (peerScreenId) => {
  if ($("#share-screen-video video").attr("id") === peerScreenId) {
    originLayout();
    const userScreen = $("#share-screen video")[0];
    removeShareScreen(userScreen);
  }
});

// 把共享螢幕append到html上的function
function addShareScreen(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    // FIXME:只有可以順利加載metadata的stream，video tag才會被append到網頁上，這樣便可以阻檔已經結束的share screen
    $("#share-screen-video").append(video);
  });
}

// 分享螢幕時，需要做的版面調整function
function shareScreenLayout() {
  // 取消隱藏分享螢幕部分
  $("#share-screen").removeClass("hidden");
  // 一點選分享螢幕，整個視訊部分css跟著大改
  $("#left-block").addClass("h-full");
  $("#display")
    .removeClass("w-full h-full grid gap-1 items-center")
    .addClass("w-[90%] flex gap-1 items-center justify-center mb-2");
  $("#display div:gt(4)").addClass("hidden");
  $("#display div")
    .removeClass("relative pb-[56.25%] overflow-hidden h-0 bg-gray-100")
    .addClass("relative w-[20%] aspect-video overflow-hidden bg-gray-100");
}

/* ----------------------------- Part 3: 點選停止螢幕按鈕，回到原始畫面的function們 ----------------------------- */
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
    .addClass("w-full h-full grid gap-1 items-center");
  $("#display div")
    .removeClass(
      "hidden relative w-[20%] aspect-video overflow-hidden bg-gray-100"
    )
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
