const myWebcamStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: 1280,
    height: 720,
    aspectRatio: 1.777777778,
  },
  audio: true,
});

const myVideo = $("#myVideo video")[0];
myVideo.srcObject = myWebcamStream;
myVideo.addEventListener("loadedmetadata", () => {
  myVideo.play();
});

let cameraStatus = true;
$("#hide-camera").on("click", () => {
  if (cameraStatus) {
    $("#myVideo").append(
      `<span class="absolute text-white text-4xl">攝影機已關閉</span>`
    );
    myWebcamStream.getVideoTracks()[0].enabled =
      !myWebcamStream.getVideoTracks()[0].enabled;
    $("#hide-camera")
      .removeClass("bg-transparent border border-white hover:bg-white")
      .addClass("bg-red-600");
    cameraStatus = false;
    $("input[name='cameraStatus']").attr("value", "false");
    return;
  }
  $("#myVideo span").remove();
  myWebcamStream.getVideoTracks()[0].enabled =
    !myWebcamStream.getVideoTracks()[0].enabled;
  $("#hide-camera")
    .removeClass("bg-red-600")
    .addClass("bg-transparent border border-white hover:bg-white");
  cameraStatus = true;
  $("input[name='cameraStatus']").attr("value", "true");
});

let micStatus = true;
$("#mute-mic").on("click", () => {
  if (micStatus) {
    myWebcamStream.getAudioTracks()[0].enabled =
      !myWebcamStream.getAudioTracks()[0].enabled;
    $("#mute-mic")
      .removeClass("bg-transparent border border-white hover:bg-white")
      .addClass("bg-red-600");
    micStatus = false;
    $("input[name='micStatus']").attr("value", "false");
    return;
  }
  myWebcamStream.getAudioTracks()[0].enabled =
    !myWebcamStream.getAudioTracks()[0].enabled;
  $("#mute-mic")
    .removeClass("bg-red-600")
    .addClass("bg-transparent border border-white hover:bg-white");
  micStatus = true;
  $("input[name='micStatus']").attr("value", "true");
});

$("#enter-room").on("click", (e) => {
  const name = $("input[name='name']").val();
  if (!name) {
    e.preventDefault();
    alert("請輸入姓名");
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");
  localStorage.setItem(`name-${roomId}`, name);
  localStorage.setItem(`cameraStatus-${roomId}`, cameraStatus);
  localStorage.setItem(`micStatus-${roomId}`, micStatus);
});