import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import AV from "leancloud-storage";
import VueMaterial from "vue-material";
// import 'vue-material/dist/vue-material.min.css'
AV.init({
  appId: "nLNpC0EXtPodRpoeEmjDFnHC-MdYXbMMI",
  appKey: "n9YcJdJ1dFxtpqOBOLUdbaA1"
});
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faArrowDown,
  faSearch,
  faPaperPlane,
  faPhoneAlt,
  faBuilding,
  faArrowRight,
  faUser,
  faCalendarDay,
  faStickyNote
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faFacebookSquare,
  faInstagramSquare
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faBars,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faArrowDown,
  faSearch,
  faUser,
  faCalendarDay,
  faStickyNote,
  faPaperPlane,
  faPhoneAlt,
  faBuilding,
  faLinkedin,
  faFacebookSquare,
  faInstagramSquare,
  faArrowRight
);
Vue.component("font-awesome-icon", FontAwesomeIcon);
import ToggleButton from "vue-js-toggle-button";
Vue.use(ToggleButton);
Vue.use(VueMaterial);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
