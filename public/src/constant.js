window.addEventListener("load", () => {
  $("#loading").remove();
});

const urlParams = new URLSearchParams(window.location.search);
const createStatus = urlParams.get("create");
const roomId = urlParams.get("roomId");
const myName = localStorage.getItem(`name-${roomId}`);
const socket = io();

// 抓取會議室分享螢幕的狀態
const result = await axios.post("./getShareScreenStatus", { roomId });
const roomShareScreenStatus = result.data;

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

export { roomId, myName, socket, roomShareScreenStatus };

// function stopTimer() {
//   cancelAnimationFrame(timerInterval);
//   elapsedTime += Date.now() - startTime;
//   document.getElementById("clock").textContent = "00:00:00";
// }
