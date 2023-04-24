window.addEventListener("load", () => {
  $("#loading").remove();
});

const urlParams = new URLSearchParams(window.location.search);
const createStatus = urlParams.get("create");
const roomId = urlParams.get("roomId");
const myName = localStorage.getItem(`name-${roomId}`);
const socket = io();

// 若是創建新會議來到這，把url改成正常樣子
if (createStatus) {
  const domain = window.location.host;
  const protocol = window.location.protocol;
  console.log(domain, protocol);
  history.replaceState(
    null,
    "",
    `${protocol}//${domain}/concall?roomId=${roomId}`
  );
}

// 會議計時功能
let startTime;
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
  startTime = Date.now();
  timerInterval = requestAnimationFrame(updateTime);
}

startTimer();

export { roomId, myName, socket, startTime };

// function stopTimer() {
//   cancelAnimationFrame(timerInterval);
//   elapsedTime += Date.now() - startTime;
//   document.getElementById("clock").textContent = "00:00:00";
// }
