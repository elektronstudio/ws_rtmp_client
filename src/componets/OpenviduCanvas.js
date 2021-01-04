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
    <video ref="videoRef" autoplay />
    <canvas ref="canvasRef" style="display: block;" />
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