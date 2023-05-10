import { roomId, myName, socket } from "./begin.js";

$("#chat").on("submit", (e) => {
  e.preventDefault();
  if ($("#message-input").val()) {
    const msg = $("#message-input").val();
    socket.emit("chat-message", roomId, myName, msg);
    const time = getTime();
    addMyMessage(myName, msg, time);
    $("#message-input").val("");
  }
});

socket.on("chat-message", (name, msg) => {
  const time = getTime()
  addUserMessage(name, msg, time);
});

// 增加自己的訊息到聊天室
function addMyMessage(name, msg, time) {
  const item = $(`    
  <div class="chat chat-end">
    <div class="chat-header text-black">
      ${name}
      <time class="text-xs opacity-50">${time}</time>
    </div>
  </div>
  `);
  const message = $(
    `<div class="chat-bubble bg-yellow-600 text-white"></div>`
  ).text(msg);
  item.append(message);
  $("#messages").append(item);

  // 隨時顯示最新訊息
  $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight;
}

// 增加其他user訊息到聊天室
function addUserMessage(name, msg, time) {
  const item = $(`    
  <div class="chat chat-start">
    <div class="chat-header text-black">
      ${name}
      <time class="text-xs opacity-50">${time}</time>
    </div>
  </div>
  `);
  const message = $(
    `<div class="chat-bubble text-black bg-gray-100">$</div>`
  ).text(msg);
  item.append(message);
  $("#messages").append(item);

  // 隨時顯示最新訊息
  $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight;
}

// 產出現在時間
function getTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = `${hours < 10 ? `0${hours}` : `${hours}`}:${
    minutes < 10 ? `0${minutes}` : `${minutes}`
  }`;
  return time;
}

$("#message-input").keypress((e) => {
  if (e.which === 13 && !e.shiftKey) {
    e.preventDefault();
    $("#chat").submit();
    $("#message-input").attr("val", "");
  }
});