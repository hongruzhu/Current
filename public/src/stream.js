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
  audio: false,
});

myVideo.srcObject = myWebcamStream;
// 當webcam stream開始播放時，執行playing function
myVideo.onplay = playing;
myVideo.addEventListener("loadedmetadata", () => {
  myVideo.play();
});

// 將自己視訊的video stream，轉換成canvas，以利更換背景功能運作
const canvasElement = $("div[id='myVideo'] canvas")[0];
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
  const { name, webcamStatus, micStatus } = call.metadata;
  console.log(`Connection with ${peerId}`);
  call.answer(myStream);
  addVideoGridElement(peerId);
  const video = document.createElement("video");
  video.setAttribute(
    "class",
    "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
  );
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream, video, peerId, webcamStatus, micStatus);
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
  const options = { metadata: { name: myName, webcamStatus, micStatus } };
  const call = myPeer.call(peerId, stream, options);
  addVideoGridElement(peerId);
  const video = document.createElement("video");
  video.setAttribute(
    "class",
    "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
  );
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream, video, peerId, true, true);
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
function addVideoStream(stream, video, peerId, webcamStatus, micStatus) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  $(`div[id=${peerId}]`).append(video);
  if (!webcamStatus) hideCamera(peerId);
  if (!micStatus) muteMic(peerId);
}

// Append user名字
function addUserName(name, peerId) {
  const userName = $("<span>", {
    text: name,
    class:
      "absolute z-10 bottom-0 left-0 px-4 py-3 text-base text-white text-shadow",
  });
  $(`div[id=${peerId}]`).append(userName);
}

/* ----------------------------- Step 2: 其他控制畫面雜項 ----------------------------- */
let webcamStatus = true;
let micStatus = true;
// 開關視訊鏡頭
$("#hide-camera").on("click", async () => {
  const stream = myVideo.srcObject;
  if (stream.getVideoTracks()[0].enabled) {
    socket.emit("hide-camera", roomId, myPeerId);
    $("button[id='hide-camera'] svg")
      .removeClass("text-green-500 group-hover:text-green-500")
      .addClass("text-red-500 group-hover:text-red-500");
    $("div[id='myVideo'] canvas").addClass("hidden");
    $("div[id='myVideo']").append(
      `<img id="user-icon" class="hide absolute top-0 right-0 left-0 bottom-0 m-auto h-2/5" width="" src="../images/user-hide-camera.png">`
    );
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    webcamStatus = false;
    return;
  }
  socket.emit("show-camera", roomId, myPeerId);
  $("button[id='hide-camera'] svg")
    .removeClass("text-red-500 group-hover:text-red-500")
    .addClass("text-green-500 group-hover:text-green-500");
  stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
  webcamStatus = true;
  $("div[id='myVideo'] img[id='user-icon']").remove();
  $("div[id='myVideo'] canvas").removeClass("hidden");
});

socket.on("hide-camera", (peerId) => {
  hideCamera(peerId);
});

socket.on("show-camera", (peerId) => {
  showCamera(peerId);
});

function hideCamera(peerId) {
  $(`div[id=${peerId}] video`).addClass("hidden");
  $(`div[id=${peerId}]`).append(
    `<img id="user-icon" class="hide absolute top-0 right-0 left-0 bottom-0 m-auto h-2/5" width="" src="../images/user-hide-camera.png">`
  );
}

function showCamera(peerId) {
  $(`div[id=${peerId}] img[id='user-icon']`).remove();
  $(`div[id=${peerId}] video`).removeClass("hidden");
}

// 開關麥克風
$("#mute-mic").on("click", async () => {
  if (myStream.getAudioTracks()[0].enabled) {
    socket.emit("mute-mic", roomId, myPeerId);
    $("button[id='mute-mic'] svg")
      .removeClass("text-green-500 group-hover:text-green-500")
      .addClass("text-red-500 group-hover:text-red-500");
    $("div[id='myVideo']").append(`
      <img id="muted-icon" src="./images/mute-mic.png" class="absolute top-0 right-0 m-3 h-[10%]" alt="...">
    `);
    myStream.getAudioTracks()[0].enabled =
      !myStream.getAudioTracks()[0].enabled;
    micStatus = false;
    return;
  }
  socket.emit("unmute-mic", roomId, myPeerId);
  $("button[id='mute-mic'] svg")
    .removeClass("text-red-500 group-hover:text-red-500")
    .addClass("text-green-500 group-hover:text-green-500");
  $("div[id='myVideo'] img[id='muted-icon']").remove();
  myStream.getAudioTracks()[0].enabled = !myStream.getAudioTracks()[0].enabled;
  micStatus = true;
});

socket.on("mute-mic", (peerId) => {
  muteMic(peerId);  
});

socket.on("unmute-mic", (peerId) => {
  unmuteMic(peerId);
});

function muteMic(peerId) {
  $(`div[id=${peerId}]`).append(`
    <img id="muted-icon" src="./images/mute-mic.png" class="absolute top-0 right-0 m-3 h-[10%]" alt="...">
  `);
}

function unmuteMic(peerId) {
  $(`div[id=${peerId}] img[id='muted-icon']`).remove();
}

// 監聽關閉視訊頁面，並執行一些動作
window.onbeforeunload = function (e) {
  localStorage.removeItem(`name-${roomId}`);
};
