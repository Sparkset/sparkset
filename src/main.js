import Vue from "vue";
import AV from "leancloud-storage";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faLongArrowAltUp,
  faLongArrowAltDown
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from "./App.vue";
import router from "./router";
import store from "./store";
AV.init({
  appId: "nLNpC0EXtPodRpoeEmjDFnHC-MdYXbMMI",
  appKey: "n9YcJdJ1dFxtpqOBOLUdbaA1"
});
library.add(faBars, faLongArrowAltUp, faLongArrowAltDown, faLinkedin);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
