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
    // FIXME:要改成送出訊息
    // $(this).closest("form").submit();
  }
});