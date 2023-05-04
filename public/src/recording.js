// 會議錄影
let videoStream;
let audioStream;
let recorder_Video;
let recorder_Audio;
let data_Video = [];
let data_Audio = [];

let videoAudioSource;
let audioSource;
let videoGain;
let audioGain;
let mixedDestination;
let audioContext;

async function startRecording() {
  // For recording the screen
  videoStream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      mediaSource: "screen",
    },
    audio: true,
    restrictOwnAudio: false,
  });

  // For recording the mic audio
  audioStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  // Create an AudioContext to manage the audio processing
  audioContext = new AudioContext();

  // Create a MediaStreamAudioSourceNode for the audio track in the video stream
  videoAudioSource = audioContext.createMediaStreamSource(videoStream);

  // Create a MediaStreamAudioSourceNode for the audio track in the audio stream
  audioSource = audioContext.createMediaStreamSource(audioStream);

  // Create a GainNode to adjust the volume of each stream
  videoGain = audioContext.createGain();
  audioGain = audioContext.createGain();

  // Connect the video audio source to the video gain node, and the audio source to the audio gain node
  videoAudioSource.connect(videoGain);
  audioSource.connect(audioGain);

  // Mix the audio streams by connecting the gain nodes to a single MediaStreamAudioDestinationNode
  mixedDestination = audioContext.createMediaStreamDestination();
  videoGain.connect(mixedDestination);
  audioGain.connect(mixedDestination);

  // Create a new MediaStreamTrack with the mixed audio
  const mixedAudioTrack = mixedDestination.stream.getAudioTracks()[0];

  // Find the original audio track in the video stream
  const videoAudioTrack = videoStream.getAudioTracks()[0];

  // Replace the original audio track with the mixed audio track in the video stream
  videoStream.removeTrack(videoAudioTrack);
  videoStream.addTrack(mixedAudioTrack);

  // Use the video stream for further processing, such as recording or streaming

  /* Record the captured mediastream with MediaRecorder constructor */
  recorder_Video = new MediaRecorder(videoStream);
  recorder_Audio = new MediaRecorder(mixedDestination.stream);

  // Starts the recording when clicked
  recorder_Video.start();
  recorder_Audio.start();

  // For a fresh start
  data_Video = [];
  data_Audio = [];

  // Push the recorded data to data array when data available
  recorder_Video.ondataavailable = (e) => {
    data_Video.push(e.data);
  };
  recorder_Audio.ondataavailable = (e) => {
    data_Audio.push(e.data);
  };

  // 點選停止分享，會結束螢幕錄製
  videoStream.getVideoTracks()[0].onended = async () => {
    $("#recording-icon").addClass("hidden");
    $("#recording-pause").addClass("hidden");
    $("#pause-btn").addClass("hidden");
    $("#resume-btn").addClass("hidden");
    $("#stop-btn").addClass("hidden");
    $("#start-btn").removeClass("hidden");
    await stopRecording();
    stopTimer();
  };
}

async function pauseRecording() {
  recorder_Video.pause();
  recorder_Audio.pause();
}

async function resumeRecording() {
  recorder_Video.resume();
  recorder_Audio.resume();
}

async function stopRecording() {
  // Stops the recording
  recorder_Video.stop();
  recorder_Audio.stop();

  recorder_Video.onstop = () => {
    // Convert the recorded audio to blob type mp4 media
    let blobData = new Blob(data_Video, { type: "video/mp4" });

    // Convert the blob data to a url
    let url = URL.createObjectURL(blobData);

    // Create a new anchor element
    let a = document.createElement("a");
    a.href = url;

    // Set the file name
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get("roomId");
    a.download = `Current-${roomId}.mp4`;

    // Trigger a click event on the anchor element
    a.click();

    // Release the URL object
    URL.revokeObjectURL(url);

    // // Convert the recorded audio to blob type mp4 media
    // let blobData = new Blob(data_Video, { type: "video/mp4" });

    // // Create a WritableStream using StreamSaver.js
    // const fileStream = streamSaver.createWriteStream("video.mp4");

    // // Create a ReadableStream using the blob data
    // const readableStream = blobData.stream();

    // // Pipe the readable stream to the writable stream
    // readableStream.pipeTo(fileStream);

    // 下載完檔案後，stop all tracks
    videoStream.getTracks().forEach((track) => track.stop());
    audioStream.getTracks().forEach((track) => track.stop());

    // Disconnect all audio nodes in the AudioContext
    audioContext.close();

    // Release references to all objects
    videoStream = null;
    audioStream = null;
    mixedDestination = null;
    videoAudioSource = null;
    audioSource = null;
    videoGain = null;
    audioGain = null;
    recorder_Video = null;
    recorder_Audio = null;
    data_Video = [];
    data_Audio = [];
  };
}

// timer
let startTime; // 計時開始時間
let pausedTime; // 被暫停的時間
let isRunning = false; // 計時器是否正在運行
let elapsed = 0; // 已經過的時間

function startTimer() {
  if (!isRunning) {
    startTime = Date.now() - elapsed;
    isRunning = true;
    requestAnimationFrame(updateTimer);
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    pausedTime = Date.now();
  }
}

function resumeTimer() {
  if (!isRunning) {
    isRunning = true;
    startTime += Date.now() - pausedTime;
    requestAnimationFrame(updateTimer);
  }
}

function stopTimer() {
  isRunning = false;
  elapsed = 0;
  document.getElementById("timer").innerHTML = `00:00:00`;
}

function updateTimer() {
  if (isRunning) {
    elapsed = Date.now() - startTime;
    displayTime(elapsed);
    requestAnimationFrame(updateTimer);
  }
}

function displayTime(time) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = ((time % 60000) / 1000).toFixed(0);
  document.getElementById("timer").innerHTML = `${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// 控制timer的按鈕
$("#start-btn").on("click", async () => {
  $("#recording-icon").removeClass("hidden");
  $("#start-btn").addClass("hidden");
  $("#pause-btn").removeClass("hidden");
  $("#stop-btn").removeClass("hidden");
  await startRecording();
  startTimer();
});
$("#pause-btn").on("click", async () => {
  $("#recording-icon").addClass("hidden");
  $("#recording-pause").removeClass("hidden");
  $("#pause-btn").addClass("hidden");
  $("#resume-btn").removeClass("hidden");
  await pauseRecording();
  pauseTimer();
});
$("#resume-btn").on("click", async () => {
  $("#recording-icon").removeClass("hidden");
  $("#recording-pause").addClass("hidden");
  $("#resume-btn").addClass("hidden");
  $("#pause-btn").removeClass("hidden");
  await resumeRecording();
  resumeTimer();
});
$("#stop-btn").on("click", async () => {
  $("#recording-icon").addClass("hidden");
  $("#recording-pause").addClass("hidden");
  $("#pause-btn").addClass("hidden");
  $("#resume-btn").addClass("hidden");
  $("#stop-btn").addClass("hidden");
  $("#start-btn").removeClass("hidden");
  await stopRecording();
  stopTimer();
});

