window.addEventListener("load", () => {
  $("#loading").remove();
});

const urlParams = new URLSearchParams(window.location.search);
const createStatus = urlParams.get("create");
const roomId = urlParams.get("roomId");
const myName = localStorage.getItem(`name-${roomId}`);
const myEmail = localStorage.getItem(`userEmail`);
const myRole = localStorage.getItem(`role-${roomId}`);
const socket = io();

// 抓取會議室分享螢幕的狀態
const shareScreenResult = await axios.post("./getShareScreenStatus", { roomId });
const roomShareScreenStatus = shareScreenResult.data;

// 抓取會議室分享小白版的狀態
const whiteboardResult = await axios.post("./getWhiteboardStatus", { roomId });
const whiteboardShareName = whiteboardResult.data.name;
const whiteboardSharePeerId = whiteboardResult.data.peerId;

// 抓取會議名稱，加到會議資訊欄
if (myRole === "host") {
  const title = localStorage.getItem(`title-${roomId}`);
  $("#room-title").text(title);
} else {
  const result = await axios.post("./getRoomTitle", { roomId });
  const title = result.data;
  $("#room-title").text(title);
}

export {
  roomId,
  myName,
  myEmail,
  myRole,
  socket,
  roomShareScreenStatus,
  whiteboardShareName,
  whiteboardSharePeerId
};

// 右側欄位控制項
let chatRoomStatus = false;
let memberListStatus = false;
let infoStatus = false;
// 聊天室開關控制選項
$("#chat-room-btn").on("click", () => {
  if (chatRoomStatus) {
    $("#right-block").addClass("hidden");
    $("#chat-room").addClass("hidden");
    chatRoomStatus = false;
    return;
  }
  $("#right-block").removeClass("hidden");
  $("#chat-room").removeClass("hidden");
  $("#members").addClass("hidden");
  $("#info").addClass("hidden");
  chatRoomStatus = true;
  memberListStatus = false;
  infoStatus = false;
});

// 會議成員開關控制選項
$("#show-members-btn").on("click", () => {
  if (memberListStatus) {
    $("#right-block").addClass("hidden");
    $("#members").addClass("hidden");
    memberListStatus = false;
    return;
  }
  $("#right-block").removeClass("hidden");
  $("#members").removeClass("hidden");
  $("#chat-room").addClass("hidden");
  $("#info").addClass("hidden");
  memberListStatus = true;
  chatRoomStatus = false;
  infoStatus = false;
});

// 會議資訊開關選項
$("#show-info-btn").on("click", () => {
  if (infoStatus) {
    $("#right-block").addClass("hidden");
    $("#info").addClass("hidden");
    infoStatus = false;
    return;
  }
  $("#right-block").removeClass("hidden");
  $("#info").removeClass("hidden");
  $("#chat-room").addClass("hidden");
  $("#members").addClass("hidden");
  infoStatus = true;
  memberListStatus = false;
  chatRoomStatus = false;
});
// 按X關閉右側欄
$(".close-right-block").on("click", () => {
  $("#right-block").addClass("hidden");
  $("#info").addClass("hidden");
  $("#chat-room").addClass("hidden");
  $("#members").addClass("hidden");
})

// 點擊end call btn，跳轉到thankyou頁面
// set the modal menu element
const $targetEl = document.getElementById("popup-modal");

// options with default values
const options = {
  placement: 'bottom-right',
  backdrop: 'dynamic',
  backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
  closable: true,
  onHide: () => {
      console.log('modal is hidden');
  },
  onShow: () => {
      console.log('modal is shown');
  },
  onToggle: () => {
      console.log('modal has been toggled');
  }
};

const modal = new Modal($targetEl, options);

$("#leave-room").on("click", () => {
  localStorage.removeItem(`name-${roomId}`);
  localStorage.removeItem(`cameraStatus-${roomId}`);
  localStorage.removeItem(`micStatus-${roomId}`);
  localStorage.removeItem(`title-${roomId}`);
  localStorage.removeItem(`role-${roomId}`);
  window.location.href = "./thankyou";
})


// 若是創建新會議來到這，把url改成正常樣子
if (createStatus) {
  const domain = window.location.host;
  const protocol = window.location.protocol;
  history.replaceState(
    null,
    "",
    `${protocol}//${domain}/concall?roomId=${roomId}`
  );
}

// 會議計時功能
try {
  const result = await axios({
    method: "get",
    url: "./getStartTime",
    params: { roomId }
  });
  
  let startTime = result.data;
  let elapsedTime = 0;
  let timerInterval;

  function updateTime() {
    const milliseconds = Date.now() - startTime + elapsedTime;
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    document.getElementById("timer").textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    timerInterval = requestAnimationFrame(updateTime);
  }
  function startTimer() {
    timerInterval = requestAnimationFrame(updateTime);
  }
  startTimer();
} catch (e) {
  alert("Something wrong")
  console.log(e);
}

// function stopTimer() {
//   cancelAnimationFrame(timerInterval);
//   elapsedTime += Date.now() - startTime;
//   document.getElementById("clock").textContent = "00:00:00";
// }
