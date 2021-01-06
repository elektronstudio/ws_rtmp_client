import { createApp } from "./src/deps/vue.js";
import { useUser, useOpenvidu } from "./src/deps/live.js";
import { OpenviduCanvas } from "./src/componets/index.js";
import { channel } from "./config.js";

const App = {
  components: { OpenviduCanvas },
  setup() {
    return {
      ...useUser(),
      ...useOpenvidu(channel),
    };
  },
  template: `

  <h2>WebRTC to RTMP demo</h2>

  See the output at <a href="https://elektron.live/ws_rtmp" target="_blank">https://elektron.live/ws_rtmp</a> (note it takes a while to start)

  <br /><br />

  <button @click="joinSession">Join session</button>
  <button @click="leaveSession">Leave session</button>
  
  <p><openvidu-canvas :publisher="publisher" /></p>
  
  <p>
    <openvidu-canvas
      v-for="(publisher, i) in subscribers"
      :key="i"
      :publisher="publisher"
    />
  </p>
  </div>
  `,
};

const app = createApp(App);

app.mount("#app");
