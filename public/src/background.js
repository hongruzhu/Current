// MediaPipe更換背景功能
// 不同背景所用function
// 背景模糊
function onResults_selfie_segmentation_blur(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  // canvasCtx.filter = "blur(0)"

  canvasCtx.drawImage(
    results.segmentationMask,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = "source-in";
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = "destination-atop";
  canvasCtx.filter = "blur(10px)";

  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  canvasCtx.restore();
}

// 更換背景圖片
function onResults_selfie_segmentation_image(results) {
  canvasCtx.save();

  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.segmentationMask,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.globalCompositeOperation = "source-out";

  const backgroundImg = new Image();
  backgroundImg.src = `assets/${path}`;
  const pat = canvasCtx.createPattern(backgroundImg, "no-repeat");
  canvasCtx.fillStyle = pat;
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = "destination-atop";
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.restore();
}

// 使用MediaPipe的code
const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
  },
});
selfieSegmentation.setOptions({
  modelSelection: 1,
});

// 選擇背景
let path = "";

$("#background").on("change", () => {
  if ($("#background").val() === "blur") {
    selfieSegmentation.onResults(onResults_selfie_segmentation_blur);
    return;
  }
  if ($("#background").val() === "") {
    selfieSegmentation.onResults(onResults_selfie_segmentation_origin);
    return;
  }
  path = $("#background").val();
  selfieSegmentation.onResults(onResults_selfie_segmentation_image);
});