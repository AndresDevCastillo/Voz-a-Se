<script setup>
const emit = defineEmits(["send-video"]);

const CHUNK_SIZE = 100 * 1024; // 100 KB
const webcamRef = ref(null);
const isCameraActive = ref(false);
const isRecording = ref(false);
const isCountdown = ref(false);
let mediaRecorder = null;
let recordedChunks = [];
let recordedBlob = null;

const toggleCamera = async () => {
  if (!isCameraActive.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      webcamRef.value.srcObject = stream;
      isCameraActive.value = true;
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
    }
  } else {
    stopCamera();
  }
};

const stopCamera = () => {
  if (webcamRef.value && webcamRef.value.srcObject) {
    webcamRef.value.srcObject.getTracks().forEach((track) => track.stop());
    webcamRef.value.srcObject = null;
  }
  isCameraActive.value = false;
};

const startCountdown = () => {
  if (!isCameraActive.value) {
    console.error("La cámara no está activa.");
    return;
  }
  startRecording();
  return;

  isCountdown.value = true;
  const countdownVideo = document.getElementById("countdown");
  countdownVideo.play();

  countdownVideo.onended = () => {
    isCountdown.value = false;
    startRecording();
  };
};

const startRecording = () => {
  isRecording.value = true;
  recordedChunks = [];

  const stream = webcamRef.value.srcObject;
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
};

const stopRecording = () => {
  return new Promise((resolve) => {
    mediaRecorder.addEventListener("stop", () => {
      recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });
      isRecording.value = false;
      resolve();
    });

    mediaRecorder.stop();
  });
};
const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
};

const sendVideoInChunks = async (blob) => {
  const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);
  const reader = new FileReader();
  const chunksSendSocket = []; // Mueve esta línea dentro de la función

  const sendChunk = (start) => {
    const end = Math.min(start + CHUNK_SIZE, blob.size);
    const chunk = blob.slice(start, end);

    reader.readAsArrayBuffer(chunk);
    reader.onload = () => {
      chunksSendSocket.push({
        chunk: Array.from(new Uint8Array(reader.result)),
        chunkIndex: start / CHUNK_SIZE,
        totalChunks: totalChunks,
      });

      if (end < blob.size) {
        sendChunk(end); // Llama al siguiente fragmento
      } else {
        emit("send-video", chunksSendSocket); // Llama a emit solo después de que todos los fragmentos estén listos
      }
    };
  };

  sendChunk(0); // Inicia el proceso de fragmentación
};

const sendVideo = async () => {
  if (!recordedBlob) return;

  try {
    await sendVideoInChunks(recordedBlob);
  } catch (error) {
    console.error("Error al enviar el video en fragmentos:", error);
  }
};
</script>

<template>
  <div>
    <div v-show="isCameraActive">
      <video v-show="!isCountdown" ref="webcamRef" width="400" autoplay></video>
      <video
        v-show="isCountdown"
        id="countdown"
        src="/video/countdown.mp4"
        width="400"
      ></video>
    </div>
    <div class="flex justify-center gap-4 p-3">
      <Button
        @click="toggleCamera"
        :severity="isCameraActive ? 'danger' : 'success'"
        rounded
        icon="pi pi-camera"
      />

      <Button
        rounded
        @click="startCountdown"
        :disabled="!isCameraActive || isRecording"
        icon="pi pi-play-circle"
      />
      <Button
        @click="stopRecording"
        icon="pi pi-times"
        :disabled="!isRecording"
        severity="danger"
        rounded
      />
      <Button rounded @click="sendVideo" icon="pi pi-send" />
    </div>
  </div>
</template>
