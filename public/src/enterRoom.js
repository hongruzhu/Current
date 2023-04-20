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

$("#enter-room").on("click", async () => {
  if (!$("input[name='name']").val()) {
    alert("請輸入姓名");
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const data = {
    name: $("#name").val(),
    roomId,
  };
  try {
    // const result = await axios({
    //   method: "post",
    //   url: "./enterRoom",
    //   headers,
    //   data,
    // });
    // document.documentElement.innerHTML = await result.data;
    
  } catch (e) {
    // alert(e.response);
  }
  // // 從新內容中取得 <script> 標籤中的 JavaScript 代碼，並執行
  // const scripts = document.getElementsByTagName("script");
  // console.log(scripts);
  // for (let i = 0; i < scripts.length; i++) {
  //   const script = scripts[i];
  //   const newScript = document.createElement("script");
  //   newScript.textContent = script.textContent;
  //   script.parentNode.replaceChild(script, script);
  // }
})