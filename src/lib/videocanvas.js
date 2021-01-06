import { ref, onMounted } from "../deps/vue.js";

import { wsUrl } from "../../config.js";

export const useVideoCanvas = () => {
  const videoRef = ref(null);
  const canvasRef = ref(null);
  const context = ref(null);

  onMounted(() => {
    context.value = canvasRef.value.getContext("2d");

    const draw = () => {
      context.value.drawImage(
        videoRef.value,
        0,
        0,
        videoRef.value.videoWidth,
        videoRef.value.videoHeight
      );
      context.value.font = "20px Arial";
      context.value.fillText(new Date().toISOString(), 20, 40);
      requestAnimationFrame(draw);
    };

    videoRef.value.addEventListener("loadedmetadata", ({ srcElement }) => {
      canvasRef.value.width = srcElement.videoWidth;
      canvasRef.value.height = srcElement.videoHeight;

      draw();
    });
  });

  const ws = new WebSocket(wsUrl);

  let mediaStream;
  let mediaRecorder;

  ws.addEventListener("open", (e) => {
    // TODO: Make FPS configurable
    mediaStream = canvasRef.value.captureStream(15);
    mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: "video/webm;codecs=h264",
      // TODO: Make BPS configurable
      videoBitsPerSecond: 1 * 1024 * 1024,
    });

    mediaRecorder.addEventListener("dataavailable", (e) => {
      // TODO: Send as urlencoded strng
      ws.send(e.data);
    });

    mediaRecorder.addEventListener("stop", ws.close.bind(ws));

    // TODO: Make interval configurable
    mediaRecorder.start(1000);
  });

  ws.addEventListener("close", (e) => {
    mediaRecorder.stop();
  });

  return { videoRef, canvasRef };
};
