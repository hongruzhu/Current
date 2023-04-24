const accessToken = localStorage.getItem("accessToken");
const userName = localStorage.getItem("userName");
 $("input[name='name']").val(userName).addClass("hidden");

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
  $("#alert").remove();
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
    return;
  }
  $("#myVideo span").remove();
  myWebcamStream.getVideoTracks()[0].enabled =
    !myWebcamStream.getVideoTracks()[0].enabled;
  $("#hide-camera")
    .removeClass("bg-red-600")
    .addClass("bg-transparent border border-white hover:bg-white");
  cameraStatus = true;
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
    return;
  }
  myWebcamStream.getAudioTracks()[0].enabled =
    !myWebcamStream.getAudioTracks()[0].enabled;
  $("#mute-mic")
    .removeClass("bg-red-600")
    .addClass("bg-transparent border border-white hover:bg-white");
  micStatus = true;
});

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
$("#enter-room").on("click", async (e) => {
  const name = $("input[name='name']").val();
  localStorage.setItem(`name-${roomId}`, name);
  localStorage.setItem(`cameraStatus-${roomId}`, cameraStatus);
  localStorage.setItem(`micStatus-${roomId}`, micStatus);
});

$("#create-room").on("submit", async (e) => {
  e.preventDefault(); 
  const name = $("input[name='name']").val();
  localStorage.setItem(`name-${roomId}`, name);
  localStorage.setItem(`cameraStatus-${roomId}`, cameraStatus);
  localStorage.setItem(`micStatus-${roomId}`, micStatus);

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const data = {
    title: $("input[name='title']").val(),
    storeStatus: $("input[name='store-status']").val(),
  };

  try {
    const result = await axios({
      method: "post",
      url: `./createRoom?roomId=${roomId}`,
      headers,
      data,
    });
    window.location.href = result.request.responseURL;
  } catch (e) {
    if (e.response.data.err) {
      alert(e.response.data.err);
      console.log(e);
      return;
    }
    alert("Something Wrong!");
    console.log(e);
  }
})

// 一鍵複製
$("#invite-code-copy").on("click", () => {
  navigator.clipboard.writeText($("#invite-code").text());
})
$("#invite-url-copy").on("click", () => {
  navigator.clipboard.writeText($("#invite-url").text());
});
