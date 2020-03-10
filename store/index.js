import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    sideNavOn: false,
    openedTopNavItem: ""
  },
  mutations: {
    closeSideNav(state) {
      state.sideNavOn = false;
    },
    toggleSideNav(state) {
      state.sideNavOn = !state.sideNavOn;
    },
    updateOpenedTopNavItem(state, item) {
      state.openedTopNavItem = state.openedTopNavItem === item ? "" : item;
    }
  }
});
