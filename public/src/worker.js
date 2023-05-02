let canvas
let canvasCtx
let imageBitmapTmp
let width
let height
let play

// const draw = () => {
//   context.drawImage(imageBitmapTmp, 0, 0, width, height)
//   const pixelData = context.getImageData(0, 0, width, height)
//   const result = applyFilters(pixelData, sliderValueTmp)
//   context.putImageData(result, 0, 0)
//   barrage.draw()
//   requestAnimationFrame(draw)
// }

function background_origin() {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, width, height);
  // canvasCtx.filter = "blur(0)"

  canvasCtx.drawImage(imageBitmapTmp, 0, 0, width, height);
  canvasCtx.restore();
}

function playing() {
  background_origin();
  requestAnimationFrame(playing);
}

onmessage = function(e) {
  console.log(e.data);
  if (e.data.type === 'init') {
    canvas = e.data.offscreen
    canvasCtx = canvas.getContext('2d')
    width = e.data.width
    height = e.data.height
  } else if (e.data.type === 'process' && canvasCtx) {
    const { imageBitmap } = e.data
    imageBitmapTmp = imageBitmap
    playing()
  } 
}
