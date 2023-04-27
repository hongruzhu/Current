// 開啟小白板
$("#start-whiteboard").on("click", async () => {
  await whiteboardLayout();
  const width = $("#whiteboard").width();
  const height = $("#whiteboard").height();
  console.log(width, height);
  const canvas = new fabric.Canvas("my-whiteboard", {
    width: width, // 讓畫布同視窗大小
    height: height, // 讓畫布同視窗大小
    isDrawingMode: true, // 設置成 true 一秒變身小畫家
  });

  canvas.on("mouse:down", (e) => {
    console.log(e);
  });
});

async function whiteboardLayout() {
  // 取消隱藏小白板部分
  $("#whiteboard").removeClass("hidden");
  // 一點選小白版，整個視訊部分css跟著大改
  $("#left-block").addClass("h-full");
  $("#display")
    .removeClass("w-full h-full grid grid-cols-fluid-l gap-1 items-center")
    .addClass("w-[90%] flex gap-1 items-center justify-center mb-2");
  $("#display div")
    .removeClass("relative pb-[56.25%] overflow-hidden h-0 bg-gray-100")
    .addClass("relative w-[20%] aspect-video overflow-hidden bg-gray-100");
}