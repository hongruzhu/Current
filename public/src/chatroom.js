import { roomId, myName, socket } from "./constant.js";

$("#chat").on("submit", (e) => {
  e.preventDefault();
  if ($("#messenge-input").val()) {
    const msg = $("#messenge-input").val();
    socket.emit("chat-message", roomId, myName, msg);
    const time = getTime();
    addMessage(myName, msg, time);
    $("#messenge-input").val("");
  }
});

socket.on("chat-message", (name, msg) => {
  const time = getTime()
  addMessage(name, msg, time);
});

// 增加訊息到聊天室
function addMessage(name, msg, time) {
  const item = $(`    
  <div class="chat chat-start">
    <div class="chat-header text-black">
      ${name}
      <time class="text-xs opacity-50">${time}</time>
    </div>
  </div>
  `);
  const messenge = $(`<div class="chat-bubble text-white">$</div>`).text(msg);
  item.append(messenge);
  $("#messenges").append(item);

  // 隨時顯示最新訊息
  $("#messenges")[0].scrollTop = $("#messenges")[0].scrollHeight;
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

// 聊天室開關控制選項
let chatRoomStatus = false;
$("#chat-room-btn").on("click", () => {
  if (chatRoomStatus) {
    $("#right-block").addClass("hidden");
    chatRoomStatus = false;
    return;
  }
  $("#right-block").removeClass("hidden");
  chatRoomStatus = true;
});

$("#messenge-input").keypress((e) => {
  if (e.which === 13 && !e.shiftKey) {
    e.preventDefault();
    $("#chat").submit();
    $("#messenge-input").attr("val", "");
  }
});
