const accessToken = localStorage.getItem("accessToken");
const headers = {
  Authorization: `Bearer ${accessToken}`,
};

let logInStatus;
try {
  const result = await axios({
    method: "get",
    url: "./checkAccessToken",
    headers,
  });
  console.log(result.data);
  logInStatus = true;
} catch (e) {
  console.log(e.response.data);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  logInStatus = false;
}


if (logInStatus) {
  $("input[name='accessToken']").val(accessToken);
  $("#sign").append(
    `<a id="signout" type="button" class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-orange-500 dark:focus:ring-orange-800">登出</a>`
  );
  const userName = localStorage.getItem("userName");
  $("#name-label").text("準備好加入了嗎？");
  $("#name-label").after(
    `<span class="text-xl font-medium text-gray-900 text-center m-3">${userName}</span>`
  );
  $("input[name='name']").val(userName).addClass("hidden");
} else {
  $("#sign").append(
    `<a id="signin" type="button" href="./signin" class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-orange-500 dark:focus:ring-orange-800">登入</a>`
  );
}

try {
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
    $("#alert").remove();
    $("#loading").remove();
  });

  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");
  $("#enter-room-btn").on("click", (e) => {
    const name = $("input[name='name']").val();
    if (!name) {
      e.preventDefault();
      alert("請輸入姓名");
      return;
    }
    localStorage.setItem(`name-${roomId}`, name);
    localStorage.setItem(`cameraStatus-${roomId}`, cameraStatus);
    localStorage.setItem(`micStatus-${roomId}`, micStatus);
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
} catch(e) {
  alert("請允許Current存取您的攝影機和麥克風，否則無法進入會議室");
  console.log(e);
  $("#enter-room").on("submit", async (e) => {
    e.preventDefault();
    alert("請允許Current存取您的攝影機和麥克風，否則無法進入會議室");
  });
}

$("#signin").click(() => {
  localStorage.setItem("room-ready", roomId);
});

$("#signout").click(() => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  window.location.href = `./concall?roomId=${roomId}`;
});
