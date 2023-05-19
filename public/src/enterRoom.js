const accessToken = localStorage.getItem("accessToken");
const headers = {
  Authorization: `Bearer ${accessToken}`,
};
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");

let logInStatus;
try {
  await axios({
    method: "get",
    url: "/token",
    headers,
  });
  logInStatus = true;
} catch (e) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userPicture");
  logInStatus = false;
}

if (logInStatus) {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");
  const userPicture = localStorage.getItem("userPicture");

  if (userPicture !== "null") {
    $("#user-avatar-image").attr(
      "src",
      `https://d3u6ahecm1mhmb.cloudfront.net/${userPicture}`
    );
  }

  $("#user-profile").removeClass("hidden");
  $("#user-name").text(userName);
  $("#user-email").text(userEmail);

  $("#name-label").text("準備好加入了嗎？");
  $("#name-label").after(
    `<span class="text-2xl font-medium text-orange-900 text-center m-3">${userName}</span>`
  );
  $("input[name='name']").val(userName).addClass("hidden");
  $("input[name='userId']").val(userId);
  $("input[name='email']").val(userEmail);
} else {
  $("#navbar").append(`    
    <div class="px-1 ml-auto">
      <button id="signin" type="button"
        class="focus:outline-none text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5">登入</a>
    </div>
    <div class="px-1">
      <button id="signup" type="button"
        class="text-orange-700 hover:text-white border border-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">註冊</button>
    </div>
  `);
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

  $("#enter-room-btn").on("click", async (e) => {
    const name = $("input[name='name']").val();
    if (!name) {
      e.preventDefault();
      await Swal.fire({
        icon: "warning",
        text: "請輸入姓名",
      });
      return;
    }
    localStorage.setItem(`name-${roomId}`, name);
    localStorage.setItem(`cameraStatus-${roomId}`, cameraStatus);
    localStorage.setItem(`micStatus-${roomId}`, micStatus);
    localStorage.setItem(`role-${roomId}`, "guest");
  });
} catch (e) {
  console.log(e);
  Swal.fire({
    icon: "warning",
    text: "請允許Current存取您的攝影機和麥克風，否則無法進入會議室",
  });
  $("#loading").remove();
  $("#enter-room").on("submit", async (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "warning",
      text: "請允許Current存取您的攝影機和麥克風，否則無法進入會議室",
    });
  });
}

$("#signin").click(() => {
  localStorage.setItem("room-ready", roomId);
  window.location.href = `/signin`;
});

$("#signup").click(() => {
  localStorage.setItem("room-ready", roomId);
  window.location.href = `/signup`;
});

$("#signout").click(() => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  window.location.href = `/concall?roomId=${roomId}`;
});
