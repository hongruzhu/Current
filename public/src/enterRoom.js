const myWebcamStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: 1280,
    height: 720,
    aspectRatio: 1.777777778,
  },
  audio: true,
});

const myVideo = document.getElementById("myVideo");
myVideo.srcObject = myWebcamStream;
myVideo.addEventListener("loadedmetadata", () => {
  myVideo.play();
});

$("#enter-room").on("click", async (e) => {
  if (!$("input[name='name']").val()) {
    e.preventDefault();
    alert("請輸入姓名");
    return;
  }
})