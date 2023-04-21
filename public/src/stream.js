/* ----------------------------- Step 1: 獲取自己視訊畫面stream的code ----------------------------- */

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
});

// 將自己視訊的video stream，轉換成canvas，以利更換背景功能運作
const canvasElement = document.getElementById("output");
const canvasCtx = canvasElement.getContext("2d");

function background_origin() {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  // canvasCtx.filter = "blur(0)"

  canvasCtx.drawImage(myVideo, 0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.restore();
}

async function playing() {
  // await selfieSegmentation.send({ image: myVideo });
  background_origin();
  /**
   * 當沒有在chrome tab時(最小化 or 不在分頁)，window.requestAnimationFrame()不會執行，會造成其他人看到自己的畫面停格
   * 改成setTimeout就解決這個問題了！來源：https://github.com/google/mediapipe/issues/3018
   */
  // window.requestAnimationFrame(playing);
  setTimeout(playing, 0);
}

// PeerJS需傳送stream給其他人，把自己畫面的canvas轉回video stream的function
async function convertCanvasToStream(canvas) {
  // 把canvas的畫面重新轉回stream
  const videoOutput = canvas.captureStream();
  // canvas的畫面不會有聲音，另外擷取拼回去！
  const mic = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  // Combine both video/audio stream with MediaStream object
  const combine = new MediaStream([
    ...videoOutput.getTracks(),
    ...mic.getTracks(),
  ]);
  return combine;
}
// 取得自己視訊的stream後
const myStream = await convertCanvasToStream(canvasElement);

/* ----------------------------- Step 2: 取得要交換的stream後，開始處理socket.io和peerjs的連線 ----------------------------- */

// Socket.IO and Peer setup
let socket = io();
const myPeer = new Peer(undefined, {
  host: "currentmeet.com", // currentmeet.com
  port: "443", // 443
  path: "/myapp",
  debug: 2,
});

// 進入會議房間，建立peer連線，產出自己的peerId，也把自己的名字丟給其他users
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
const myName = localStorage.getItem(`name-${roomId}`);
let myPeerId;

myPeer.on("open", (peerId) => {
  myPeerId = peerId;
  console.log(`my peerId: ${peerId}`);
  socket.emit("join-room", roomId, peerId, myName);
});

myPeer.on("call", async (call) => {
  const peerId = call.peer;
  const name = call.metadata.name;
  console.log(`Connection with ${peerId}`);
  call.answer(myStream);
  addVideoGridElement(peerId);
  const video = document.createElement("video");
  video.setAttribute("id", peerId);
  video.setAttribute(
    "class",
    "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
  );
  call.on("stream", (userVideoStream) => {
    console.log(userVideoStream);
    addVideoStream(userVideoStream, video, peerId);
  });
  addUserName(name, peerId);
});

socket.on("user-connected", async (peerId, name) => {
  connectToNewUser(peerId, name, myStream);
});

// 若有user離開，移除他的視訊畫面
socket.on("user-disconnected", (peerId) => {
  $(`div[id=${peerId}]`).remove();
  console.log(`Disconnect with ${peerId}`);
});

// 新user加入，建立peer連線的function
function connectToNewUser(peerId, name, stream) {
  const options = { metadata: { name: myName } };
  const call = myPeer.call(peerId, stream, options);
  addVideoGridElement(peerId);
  const video = document.createElement("video");
  video.setAttribute("id", peerId);
  video.setAttribute(
    "class",
    "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
  );
  call.on("stream", (userVideoStream) => {
    console.log(userVideoStream);
    addVideoStream(userVideoStream, video, peerId);
  });
  addUserName(name, peerId);
  console.log(`Connection with ${peerId}`);
}

// Append包裹視訊的div到html上的function
function addVideoGridElement(peerId) {
  const videoGridElement = $("<div>", {
    id: peerId,
    class: "relative pb-[56.25%] overflow-hidden h-0 bg-gray-100",
  });
  $("#display").append(videoGridElement);
}

// Append視訊畫面到html上的function
function addVideoStream(stream, video, peerId) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  $(`#${peerId}`).append(video);
}

// Append user名字
function addUserName(name, peerId) {
  const userName = $("<span>", {
    id: peerId,
    text: name,
    class: "absolute z-10 bottom-0 left-0 px-4 py-3 text-base text-white text-shadow",
  });
  $(`div[id=${peerId}]`).append(userName);
}

/* ----------------------------- Step 2: 其他控制畫面雜項 ----------------------------- */

// 開關視訊鏡頭
$("#hide-camera").on("click", async () => {
  const stream = myVideo.srcObject;
  const streamStatus = myVideo.srcObject.active;
  if (streamStatus) {
    socket.emit("hide-camera", roomId, myPeerId);
    $("canvas[id='output']").addClass("hidden");
    $("div[id='myVideo']").append(
      `<img class="hide absolute top-0 right-0 left-0 bottom-0 m-auto h-2/5" width="" src="../images/user-hide-camera.png">`
    );
    await stopStream(stream);
    return;
  }
  socket.emit("show-camera", roomId, myPeerId);
  await startStream();
  $("div[id='myVideo'] img").remove();
  $("canvas[id='output']").removeClass("hidden");
});

async function stopStream(stream) {
  if (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
    stream = null;
  }
}
async function startStream() {
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
  });
}

socket.on("hide-camera", (peerId) => {
  $(`video[id=${peerId}]`).addClass("hidden");
  $(`div[id=${peerId}]`).append(
    `<img class="hide absolute top-0 right-0 left-0 bottom-0 m-auto h-2/5" width="" src="../images/user-hide-camera.png">`
  );
});

socket.on("show-camera", (peerId) => {
  $(`div[id=${peerId}] img`).remove();
  $(`video[id=${peerId}]`).removeClass("hidden");
});


// 監聽關閉視訊頁面，並執行一些動作
window.onbeforeunload = function (e) {
  localStorage.removeItem(`name-${roomId}`);
}