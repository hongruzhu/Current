let socket = io();
const myPeer = new Peer(undefined, {
  host: "localhost", // hongruzhu.link
  port: "3001", // 443
  path: "/myapp",
  debug: 2,
});

// 把video輸出成canvas
const canvasElement = document.createElement("canvas");
canvasElement.setAttribute("id", "output");
canvasElement.setAttribute("width", 1280);
canvasElement.setAttribute("height", 720);
canvasElement.setAttribute(
  "class",
  "absolute w-full h-full t-0 l-0 transform-rotateY-180"
);
const canvasCtx = canvasElement.getContext("2d");

// 原始背景
function onResults_selfie_segmentation_origin(results) {
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

// 背景模糊
function onResults_selfie_segmentation_blur(results) {
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

// 更換背景圖片
function onResults_selfie_segmentation_image(results) {
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
  backgroundImg.src = `assets/${path}`;
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

const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
  },
});
selfieSegmentation.setOptions({
  modelSelection: 1,
});

// 選擇背景
let path = "";

$("#background").on("change", () => {
  if ($("#background").val() === "blur") {
    selfieSegmentation.onResults(onResults_selfie_segmentation_blur);
    return;
  }
  if ($("#background").val() === "") {
    selfieSegmentation.onResults(onResults_selfie_segmentation_origin);
    return;
  }
  path = $("#background").val();
  selfieSegmentation.onResults(onResults_selfie_segmentation_image);
});

selfieSegmentation.onResults(onResults_selfie_segmentation_origin);

async function playing() {
  await selfieSegmentation.send({ image: myVideo });
  // 當沒有在chrome tab時(最小化 or 不在分頁)，window.requestAnimationFrame()不會執行，會造成其他人看到自己的畫面停格
  // 改成setTimeout就解決這個問題了！來源：https://github.com/google/mediapipe/issues/3018
  // window.requestAnimationFrame(playing);
  setTimeout(playing, 0);
}

// 擷取自己的視訊
const myVideo = document.createElement("video");
myVideo.setAttribute("class", "myself");
myVideo.muted = true;

navigator.mediaDevices
  .getUserMedia({
    video: {
      width: 1280,
      height: 720,
      aspectRatio: 1.777777778,
      
    },
    audio: true,
  })
  .then((stream) => {
    myVideo.srcObject = stream;
    // 把自己的視訊丟給mediapipe進行解析
    myVideo.onplay = playing;
    myVideo.addEventListener("loadedmetadata", () => {
      myVideo.play();
    });
  });

// 把自己的視訊畫面，連同包裝的div，append到html上
const videoGrid = document.getElementById("display");
const videoGridElement = $("<div>", {
  id: "myVideo",
  class: "relative pb-[56.25%] overflow-hidden h-0",
});
$("#display").append(videoGridElement);
$("#myVideo").append(canvasElement);

// 把canvas轉回video stream
async function convertCanvasToStream(canvas) {
  // 把canvas的畫面重新轉回stream
  const videoOutput = canvas.captureStream();

  // 沒有麥克風聲音，拼回去！
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

convertCanvasToStream(canvasElement).then((stream) => {
  myPeer.on("call", async (call) => {
    console.log(`Connection with ${call.peer}`);
    call.answer(stream);
    const video = document.createElement("video");
    video.setAttribute("id", `${call.peer}`);
    video.setAttribute(
      "class",
      "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
    );
    const videoGridElement = $("<div>", {
      id: call.peer,
      class: "relative pb-[56.25%] overflow-hidden h-0",
    });
    $("#display").append(videoGridElement);
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream, call.peer);
    });
  });

  socket.on("user-connected", async (peerId) => {
    connectToNewUser(peerId, stream);
  });
});

// 進入會議房間，建立peer連線，產出自己的id
myPeer.on("open", (peerId) => {
  console.log(`my peerId: ${peerId}`);
  socket.emit("join-room", "room", peerId);
});

socket.on("user-disconnected", (userId) => {
  const video = document.getElementById(userId);
  video.remove();
  console.log(`Disconnect with ${userId}`);
});

// 新user加入
function connectToNewUser(peerId, stream) {
  const call = myPeer.call(peerId, stream);
  const video = document.createElement("video");
  video.setAttribute("id", peerId);
  video.setAttribute(
    "class",
    "absolute w-full h-full t-0 l-0 object-cover transform-rotateY-180"
  );
  const videoGridElement = $("<div>", {
    id: peerId,
    class: "relative pb-[56.25%] overflow-hidden h-0",
  });
  $("#display").append(videoGridElement);
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream, peerId);
  });
  console.log(`Connection with ${peerId}`);
}

// 增加視訊畫面
function addVideoStream(video, stream, userId) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  $(`#${userId}`).append(video);
}
