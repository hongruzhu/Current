const userName = localStorage.getItem("userName");
$("input[name='name']").val(userName).addClass("hidden");

let logInStatus;
try {
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
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
  await Swal.fire({
    icon: "warning",
    text: "請先登入！",
  });
  window.location.href = "/";
}

if (logInStatus) {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPicture = localStorage.getItem("userPicture");
  $("#user-profile").removeClass("hidden");
  $("#user-name").text(userName);
  $("#user-email").text(userEmail);

  if (userPicture !== "null") {
    $("#user-avatar-image").attr(
      "src",
      `https://d3u6ahecm1mhmb.cloudfront.net/uploads/${userPicture}`
    );
  }

  $("#signout").click(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  });
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
  myVideo.addEventListener("loadedmetadata", async () => {
    await myVideo.play();
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

  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");
  $("#create-room button").on("click", async () => {
    const name = $("input[name='name']").val();
    const title = $("input[name='title']").val();
    localStorage.setItem(`name-${roomId}`, name);
    localStorage.setItem(`cameraStatus-${roomId}`, cameraStatus);
    localStorage.setItem(`micStatus-${roomId}`, micStatus);
    localStorage.setItem(`role-${roomId}`, "host");
    localStorage.setItem(`title-${roomId}`, title);

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const data = {
      title,
      storeStatus: $("input[name='store-status']").val(),
    };

    try {
      const result = await axios({
        method: "post",
        url: `/room/create?roomId=${roomId}`,
        headers,
        data,
      });
      window.location.href = result.data.data;
    } catch (e) {
      if (e.response.data.err) {
        await Swal.fire({
          icon: "warning",
          text: "請先登入，再建立新的會議",
        });
        window.location.href = "/";
        return;
      }
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  });
} catch (e) {
  await Swal.fire({
    icon: "warning",
    text: "請允許Current存取您的攝影機和麥克風，否則無法進入會議室",
  });
  console.log(e);
  $("#loading").remove();
  $("#create-room").on("submit", async (e) => {
    e.preventDefault();
    await Swal.fire({
      icon: "warning",
      text: "請允許Current存取您的攝影機和麥克風，否則無法進入會議室",
    });
  });
}

// 一鍵複製
$("#invite-code-copy").on("click", () => {
  navigator.clipboard.writeText($("#invite-code").text());
});
$("#invite-url-copy").on("click", () => {
  navigator.clipboard.writeText($("#invite-url").text());
});
