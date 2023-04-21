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
  const name = $("input[name='name']").val();
  if (!name) {
    e.preventDefault();
    alert("請輸入姓名");
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");
  localStorage.setItem(`name-${roomId}`, name);
})