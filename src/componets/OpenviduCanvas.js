import { onMounted, computed } from "../deps/vue.js";

import { useVideoCanvas } from "../lib/index.js";

const OpenviduVideoElement = {
  props: ["publisher"],
  setup(props) {
    const { videoRef, canvasRef } = useVideoCanvas();
    onMounted(() => {
      props.publisher.addVideoElement(videoRef.value);
    });
    return { videoRef, canvasRef };
  },
  template: `
    <div style="display: flex">
      <div>
        <h3>WebRTC input </h3>
        <video ref="videoRef" autoplay />
      </div>
      <div>
        <h3>Canvas output to RTMP</h3>
        <canvas ref="canvasRef" style="display: block;" />
      </div>
    </div>
  `,
};

export default {
  components: { OpenviduVideoElement },
  props: ["publisher"],
  setup(props) {
    const clientData = computed(() => {
      if (props.publisher) {
        const { connection } = props.publisher.stream;
        return JSON.parse(connection.data);
      }
      return { userName: null };
    });
    return { clientData };
  },
  template: `
	  <div>
      <openvidu-video-element v-if="publisher" :publisher="publisher" />
      <!-- <div>{{ clientData.userName }}</div> -->
    </div>
  `,
};
