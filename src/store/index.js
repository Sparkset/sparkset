import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    sideNavOn: false,
    openedTopNavItem: "",
    searchOn: false
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
    },
    openSearch(state) {
      state.searchOn = true;
    },
    closeSearch(state) {
      state.searchOn = false;
    }
  }
});
