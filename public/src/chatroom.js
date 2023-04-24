import { roomId, myName, socket } from "./constant.js";

$("#chat").on("submit", (e) => {
  e.preventDefault();
  if ($("#messenge-input").val()) {
    const now = new Date();
    const time = `${now.getHours()}:${
      now.getMinutes() < 10 ? `0${now.getMinutes()}` : `${now.getMinutes()}`
    }`;
    const msg = $("#messenge-input").val();
    socket.emit("chat-message", roomId, myName, msg);
    addMessage(myName, msg, time);
    $("#messenge-input").val("");
  }
});

socket.on("chat-message", (name, msg) => {
  const now = new Date();
  const time = `${now.getHours()}:${
    now.getMinutes() < 10 ? `0${now.getMinutes()}` : `${now.getMinutes()}`
  }`;
  addMessage(name, msg, time);
});

// 增加訊息到聊天室
function addMessage(name, msg, time) {
  $("#messenges").append(`
    <div class="chat chat-start">
      <div class="chat-header">
        ${name}
        <time class="text-xs opacity-50">${time}</time>
      </div>
      <div class="chat-bubble">${msg}</div>
    </div>
  `);
}

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
