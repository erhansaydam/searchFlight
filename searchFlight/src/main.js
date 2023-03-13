import Vue from "vue";
import App from "./App.vue";

import vuetify from "./plugins/vuetify";

import "@/assets/css/custom.css";

Vue.use({
  vuetify,
});

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
