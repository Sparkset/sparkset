import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import AV from "leancloud-storage";
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
  faHamburger,
  faCity,
  faHome,
  faFootballBall,
  faBook,
  faTrophy,
  faExclamationTriangle,
  faUmbrellaBeach,
  faGraduationCap,
  faHistory,
  faClipboard,
  faCrown,
  faArrowRight,
  faUser,
  faCalendarDay,
  faStickyNote
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faFacebookSquare,
  faInstagram,
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
  faHamburger,
  faLinkedin,
  faFacebookSquare,
  faInstagram,
  faCity,
  faHome,
  faFootballBall,
  faBook,
  faTrophy,
  faExclamationTriangle,
  faUmbrellaBeach,
  faGraduationCap,
  faHistory,
  faClipboard,
  faCrown,
  faInstagramSquare,
  faArrowRight
);
Vue.component("font-awesome-icon", FontAwesomeIcon);
import ToggleButton from "vue-js-toggle-button";
Vue.use(ToggleButton);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
