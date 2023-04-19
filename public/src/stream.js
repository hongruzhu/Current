/* ----------------------------- Step 1: 獲取自己視訊畫面stream的code ----------------------------- */

// 開啟視訊鏡頭，擷取自己的視訊畫面
const myVideo = document.createElement("video");
myVideo.setAttribute("id", "myself");
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
const canvasElement = document.createElement("canvas");
canvasElement.setAttribute("id", "output");
canvasElement.setAttribute("width", 1280);
canvasElement.setAttribute("height", 720);
canvasElement.setAttribute(
  "class",
  "absolute w-full h-full t-0 l-0 transform-rotateY-180"
);
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

// 把自己的視訊畫面canvas，連同包裝的div，append到html上
const videoGrid = document.getElementById("display");
addVideoGridElement("myVideo");
$("#myVideo").append(canvasElement);

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

// 進入會議房間，建立peer連線，產出自己的peerId
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
myPeer.on("open", (peerId) => {
  console.log(`my peerId: ${peerId}`);
  socket.emit("join-room", roomId, peerId);
});

myPeer.on("call", async (call) => {
  const peerId = call.peer;
  console.log(`Connection with ${peerId}`);
  call.answer(myStream);
  addVideoGridElement(peerId);
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream, peerId);
  });
});

socket.on("user-connected", async (peerId) => {
  connectToNewUser(peerId, myStream);
});

// 若有user離開，移除他的視訊畫面
socket.on("user-disconnected", (peerId) => {
  $(`div[id=${peerId}]`).remove();
  console.log(`Disconnect with ${peerId}`);
});

// 新user加入，建立peer連線的function
function connectToNewUser(peerId, stream) {
  const call = myPeer.call(peerId, stream);
  addVideoGridElement(peerId);
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideoStream, peerId);
  });
  console.log(`Connection with ${peerId}`);
}

// Append包裹視訊的div到html上的function
function addVideoGridElement(peerId) {
  const videoGridElement = $("<div>", {
    id: peerId,
    class: "relative pb-[56.25%] overflow-hidden h-0",
  });
  $("#display").append(videoGridElement);
}

// Append視訊畫面到html上的function
function addVideoStream(stream, peerId) {
  const video = document.createElement("video");
  video.setAttribute("id", peerId);
  video.setAttribute(
    "class",
    "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
  );
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  $(`#${peerId}`).append(video);
}
