// 引入共用的變數
import {
  roomId,
  myName,
  myRole,
  myPicture,
  socket,
  roomShareScreenStatus,
  whiteboardShareName,
} from "./begin.js";

// 更換背景的function
// 原始背景
function originBackground(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  // canvasCtx.filter = "blur(0)"

  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  canvasCtx.restore();
}

// 稍微模糊
function slightBlurBackground(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  // canvasCtx.filter = "blur(0)"

  canvasCtx.drawImage(
    results.segmentationMask,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = "source-in";
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = "destination-atop";
  canvasCtx.filter = "blur(10px)";

  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  canvasCtx.restore();
}

// 重度模糊
function heavyBlurBackground(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  // canvasCtx.filter = "blur(0)"

  canvasCtx.drawImage(
    results.segmentationMask,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = "source-in";
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = "destination-atop";
  canvasCtx.filter = "blur(20px)";

  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  canvasCtx.restore();
}

// 更換背景圖片
function imageBackground(results) {
  canvasCtx.save();

  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.segmentationMask,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.globalCompositeOperation = "source-out";

  const backgroundImg = new Image();
  backgroundImg.src = path;
  const pat = canvasCtx.createPattern(backgroundImg, "no-repeat");
  canvasCtx.fillStyle = pat;
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = "destination-atop";
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  canvasCtx.restore();
}

/* ----------------------------- Step 1: 獲取自己視訊畫面的stream ----------------------------- */

// 開啟視訊鏡頭，擷取自己的視訊畫面
const myVideo = document.createElement("video");
myVideo.muted = true;

const myWebcamStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: 1280,
    height: 720,
    aspectRatio: 1.777777778,
  },
  audio: true,
});

myVideo.srcObject = myWebcamStream;
// 當webcam stream開始播放時，執行playing function
myVideo.onplay = playing;
myVideo.addEventListener("loadedmetadata", () => {
  myVideo.play();
  $("#loading").remove();
});

// 將自己視訊的video stream，轉換成canvas，以利更換背景功能運作
const canvasElement = $("div[id='myVideo'] canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

// MediaPipe渲染背景功能
const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
  },
});
selfieSegmentation.setOptions({
  modelSelection: 1,
});

// 選擇背景效果
let path = "";
$("#no-effect").on("click", () => {
  selfieSegmentation.onResults(originBackground);
});
$("#blur-1").on("click", () => {
  selfieSegmentation.onResults(slightBlurBackground);
});
$("#blur-2").on("click", () => {
  selfieSegmentation.onResults(heavyBlurBackground);
});
$("#bg-1").on("click", () => {
  path = $("#bg-1 img").attr("src");
  selfieSegmentation.onResults(imageBackground);
});
$("#bg-2").on("click", () => {
  path = $("#bg-2 img").attr("src");
  selfieSegmentation.onResults(imageBackground);
});
$("#bg-3").on("click", () => {
  path = $("#bg-3 img").attr("src");
  selfieSegmentation.onResults(imageBackground);
});
$("#bg-4").on("click", () => {
  path = $("#bg-4 img").attr("src");
  selfieSegmentation.onResults(imageBackground);
});
$("#bg-5").on("click", () => {
  path = $("#bg-5 img").attr("src");
  selfieSegmentation.onResults(imageBackground);
});
$("#bg-6").on("click", () => {
  path = $("#bg-6 img").attr("src");
  selfieSegmentation.onResults(imageBackground);
});

selfieSegmentation.onResults(originBackground);

async function playing() {
  await selfieSegmentation.send({ image: myVideo });
  /**
   * 當沒有在chrome tab時(最小化 or 不在分頁)，window.requestAnimationFrame()不會執行，會造成其他人看到自己的畫面停格
   * 改成setTimeout就解決這個問題了，但不是效能好的做法，來源：https://github.com/google/mediapipe/issues/3018
   */
  // window.requestAnimationFrame(playing);
  setTimeout(playing, 1000 / 60);
}

// 在member list加入自己，並插入自己的圖片
$("#my-name").text(`${myName} (你)`);
if (myRole === "host") {
  $("#my-role").text("會議主持人");
}
if (myRole === "guest") {
  $("#my-role").text("來賓");
}
console.log(myPicture);
console.log(typeof myPicture);
if (myPicture === "null" || myPicture === null) {
  $("#my-picture").attr("src", "/images/user.png");
} else {
  $("#my-picture").attr("src", `/uploads/${myPicture}`);
}

// PeerJS需傳送stream給其他人，把自己畫面的canvas轉回video stream的function
async function convertCanvasToStream(canvas) {
  // 把canvas的畫面重新轉回stream
  const videoOutput = await canvas.captureStream();
  // canvas的畫面不會有聲音，另外擷取拼回去！
  const mic = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  // Combine both video/audio stream with MediaStream object
  /**
   * 這邊不確定是不是一定要用addTrack的方式，先紀著，如果又壞掉再改用addTrack
   * const combine = new MediaStream();
   * combine.addTrack(videoOutput.getTracks()[0]);
   * combine.addTrack(mic.getTracks()[0]);
   */
  const combine = new MediaStream([
    ...videoOutput.getTracks(),
    ...mic.getTracks(),
  ]);
  return combine;
}
// 取得自己視訊的stream，包含畫面和聲音！
let myStream = await convertCanvasToStream(canvasElement);

// 進入會議房間，建立peer連線，產出自己的peerId，也把自己的名字丟給其他users
let myPeerId;

// 根據進入會議室前，開關畫面和麥克風的狀態不同，調整要丟出去的stream
let myWebcamStatus = localStorage.getItem(`cameraStatus-${roomId}`) === "true";
let myMicStatus = localStorage.getItem(`micStatus-${roomId}`) === "true";
if (!myWebcamStatus) stopVideoTrack(myVideo.srcObject);
if (!myMicStatus) stopMicTrack(myStream);

/* ----------------------------- Step 2: 確定好要交換的stream後，開始處理Peer連線，進行stream交換 ----------------------------- */
// Peer setup
const myPeer = new Peer(undefined, {
  host: "currentmeet.com", // currentmeet.com
  port: "443", // 443
  path: "/myapp",
  debug: 2,
});

myPeer.on("open", (peerId) => {
  myPeerId = peerId;
  console.log(`my peerId: ${peerId}`);
  socket.emit("join-room", roomId, peerId, myName, myRole, myPicture);
});

myPeer.on("call", async (call) => {
  const peerId = call.peer;
  const { name, role, picture } = call.metadata;
  const otherWebcamStatus = call.metadata.myWebcamStatus;
  const otherMicStatus = call.metadata.myMicStatus;
  console.log(`Connection with ${peerId}`);
  await call.answer(myStream);
  addVideoGridElement(peerId);
  const video = document.createElement("video");
  video.setAttribute(
    "class",
    "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
  );
  call.on("stream", async (userVideoStream) => {
    await addVideoStream(userVideoStream, video);
  });
  $(`div[id=${peerId}]`).append(video);
  addUserNameAndPicture(name, picture, peerId);
  addMemberList(name, role, picture, peerId);
  adjustLayout();
  if (!otherWebcamStatus) hideCamera(peerId, "video");
  if (!otherMicStatus) muteMic(peerId);

  // 若自己的視訊鏡頭或mic沒開，讓其他user知道，做出相應處理
  if (!myWebcamStatus) socket.emit("hide-camera", roomId, myPeerId);
  if (!myMicStatus) socket.emit("mute-mic", roomId, myPeerId);
});

socket.on("user-connected", async (peerId, name, role, picture) => {
  connectToNewUser(peerId, name, role, picture, myStream);
});

// 若有user離開，移除他的視訊畫面
socket.on("user-disconnected", (peerId) => {
  $(`div[id=${peerId}]`).remove();
  $(`li[id=${peerId}]`).remove();
  adjustLayout();
  console.log(`Disconnect with ${peerId}`);
});

// 新user加入，建立peer連線的function
async function connectToNewUser(peerId, name, role, picture, stream) {
  const options = {
    metadata: {
      name: myName,
      role: myRole,
      picture: myPicture,
      myWebcamStatus,
      myMicStatus,
    },
  };

  const call = myPeer.call(peerId, stream, options);
  addVideoGridElement(peerId);
  const video = document.createElement("video");
  video.setAttribute(
    "class",
    "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
  );
  call.on("stream", async (userVideoStream) => {
    await addVideoStream(userVideoStream, video);
  });
  $(`div[id=${peerId}]`).append(video);
  addUserNameAndPicture(name, picture, peerId);
  addMemberList(name, role, picture, peerId);
  adjustLayout();
  console.log(`Connection with ${peerId}`);
}

// Append包裹視訊的div到html上的function
function addVideoGridElement(peerId) {
  let videoGridElement;
  // 不能只以偵測分享螢幕渲染了沒當基準，加上去redis抓分享螢幕狀態，才可以確保新user的渲染畫面正確
  if (
    (roomShareScreenStatus !== null && roomShareScreenStatus !== "") ||
    $("#share-screen video").length === 1
  ) {
    if ($("#display div").length >= 5) {
      videoGridElement = $("<div>", {
        id: peerId,
        class:
          "hidden relative w-[20%] aspect-video overflow-hidden bg-gray-100",
      });
    } else {
      videoGridElement = $("<div>", {
        id: peerId,
        class: "relative w-[20%] aspect-video overflow-hidden bg-gray-100",
      });
    }
    $("#display").append(videoGridElement);
    return;
  }
  if (
    (whiteboardShareName !== "" && whiteboardShareName) ||
    $("#left-items span").length === 1
  ) {
    if ($("#display div").length >= 5) {
      videoGridElement = $("<div>", {
        id: peerId,
        class:
          "hidden relative w-[20%] aspect-video overflow-hidden bg-gray-100",
      });
    } else {
      videoGridElement = $("<div>", {
        id: peerId,
        class: "relative w-[20%] aspect-video overflow-hidden bg-gray-100",
      });
    }
    $("#display").append(videoGridElement);
    return;
  }
  videoGridElement = $("<div>", {
    id: peerId,
    class: "relative pb-[56.25%] overflow-hidden h-0 bg-gray-100",
  });
  $("#display").append(videoGridElement);
}

// Append視訊畫面到html上的function
async function addVideoStream(stream, video) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
}

// Append user名字
function addUserNameAndPicture(name, picture, peerId) {
  const userName = $("<span>", {
    text: name,
    class:
      "absolute z-10 bottom-0 left-0 px-4 py-3 text-base text-white text-shadow",
  });
  $(`div[id=${peerId}]`).append(userName);

  let userPicture;
  if (picture === "null" || picture === null) {
    userPicture = $("<img>", {
      class: "hidden absolute top-0 right-0 left-0 bottom-0 m-auto h-2/5",
      src: `/images/user.png`,
    });
  } else {
    userPicture = $("<img>", {
      class:
        "hidden absolute top-0 right-0 left-0 bottom-0 m-auto h-2/5 aspect-square rounded-full object-cover",
      src: `/uploads/${picture}`,
    });
  }
  $(`div[id=${peerId}]`).append(userPicture);
}

// Append member list
function addMemberList(name, role, picture, peerId) {
  if (role === "host") {
    role = "會議主持人";
  }
  if (role === "guest") {
    role = "來賓";
  }
  console.log(picture);
  console.log(typeof picture);
  if (picture === "null" || picture === null) {
    picture = "/images/user.png";
  } else {
    picture = `./uploads/${picture}`;
  }

  $("#members-list ul").append(`
    <li id="${peerId}" class="py-2">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <img class="w-10 h-10 rounded-full object-cover" src=${picture} alt="Neil image">
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-base font-medium text-gray-900 truncate dark:text-white">
            ${name}
          </p>
          <p class="text-base text-gray-500 truncate dark:text-gray-400">
            ${role}
          </p>
        </div>
      </div>
    </li>
  `);
}

// 偵測現在有會議有幾個畫面，並調整layout
function adjustLayout() {
  const count = $("#display div").length;
  if (count < 5) {
    if ($(".grid-cols-fluid-m").length === 1) {
      $("#display")
        .removeClass("grid-cols-fluid-m")
        .addClass("grid-cols-fluid-l");
    }
  }
  if (count > 4 && count < 10) {
    if ($(".grid-cols-fluid-l").length === 1) {
      $("#display")
        .removeClass("grid-cols-fluid-l")
        .addClass("grid-cols-fluid-m");
    }
    if ($(".grid-cols-fluid-s").length === 1) {
      $("#display")
        .removeClass("grid-cols-fluid-s")
        .addClass("grid-cols-fluid-m");
    }
  }
  if (count > 9) {
    if ($(".grid-cols-fluid-m").length === 1) {
      $("#display")
        .removeClass("grid-cols-fluid-m")
        .addClass("grid-cols-fluid-s");
    }
  }
}

/* ----------------------------- Other: 其他控制畫面雜項 ----------------------------- */

// 開關視訊鏡頭
$("#hide-camera").on("click", async () => {
  const stream = myVideo.srcObject;
  if (stream.getVideoTracks()[0].enabled) {
    socket.emit("hide-camera", roomId, myPeerId);
    $("#tooltip-camera").text("開啟鏡頭");
    stopVideoTrack(stream);
    myWebcamStatus = false;
    return;
  }
  socket.emit("show-camera", roomId, myPeerId);
  $("#tooltip-camera").text("關閉鏡頭");
  $("button[id='hide-camera'] svg")
    .removeClass("text-red-500 group-hover:text-red-500")
    .addClass("text-green-500 group-hover:text-green-500");
  stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
  myWebcamStatus = true;
  showCamera("myVideo", "canvas");
});

socket.on("hide-camera", (peerId) => {
  hideCamera(peerId, "video");
});
socket.on("show-camera", (peerId) => {
  showCamera(peerId, "video");
});

async function stopVideoTrack(stream) {
  $("button[id='hide-camera'] svg")
    .removeClass("text-green-500 group-hover:text-green-500")
    .addClass("text-red-500 group-hover:text-red-500");
  hideCamera("myVideo", "canvas");
  stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
}

function hideCamera(peerId, displayMethod) {
  $(`div[id=${peerId}] ${displayMethod}`).addClass("hidden");
  $(`div[id=${peerId}] img`).removeClass("hidden");
}
function showCamera(peerId, displayMethod) {
  $(`div[id=${peerId}] img`).addClass("hidden");
  $(`div[id=${peerId}] ${displayMethod}`).removeClass("hidden");
}

// 開關麥克風
$("#mute-mic").on("click", async () => {
  if (myStream.getAudioTracks()[0].enabled) {
    socket.emit("mute-mic", roomId, myPeerId);
    $("#tooltip-microphone").text("開啟麥克風");
    stopMicTrack(myStream);
    myMicStatus = false;
    return;
  }
  socket.emit("unmute-mic", roomId, myPeerId);
  $("#tooltip-microphone").text("關閉麥克風");
  $("button[id='mute-mic'] svg")
    .removeClass("text-red-500 group-hover:text-red-500")
    .addClass("text-green-500 group-hover:text-green-500");
  unmuteMic("myVideo");
  myStream.getAudioTracks()[0].enabled = !myStream.getAudioTracks()[0].enabled;
  myMicStatus = true;
});

socket.on("mute-mic", (peerId) => {
  muteMic(peerId);
});
socket.on("unmute-mic", (peerId) => {
  unmuteMic(peerId);
});

async function stopMicTrack(stream) {
  $("button[id='mute-mic'] svg")
    .removeClass("text-green-500 group-hover:text-green-500")
    .addClass("text-red-500 group-hover:text-red-500");
  muteMic("myVideo");
  stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
}

function muteMic(peerId) {
  $(`div[id=${peerId}]`).append(`
    <img id="muted-icon" src="./images/mute-mic.png" class="absolute top-0 right-0 m-3 h-[10%]" alt="...">
  `);
}
function unmuteMic(peerId) {
  $(`div[id=${peerId}] img[id='muted-icon']`).remove();
}

// 監聽關閉頁面時，把存在localStorage的相關資料刪除
window.onbeforeunload = function () {
  localStorage.removeItem(`name-${roomId}`);
  localStorage.removeItem(`cameraStatus-${roomId}`);
  localStorage.removeItem(`micStatus-${roomId}`);
  localStorage.removeItem(`title-${roomId}`);
  localStorage.removeItem(`role-${roomId}`);
};

export { myPeerId };
