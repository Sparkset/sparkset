<template>
  <nav>
    <ul id="left">
      <li>
        <span>Welcome, {{ fullName }}</span>
      </li>
    </ul>
    <ul id="right">
      <li :class="[$store.state.openedTopNavItem === 'user' ? 'open' : '']">
        <button @click.stop="$store.commit('updateOpenedTopNavItem', 'user')">
          <span id="right__name">{{ userEmail }}</span>
        </button>
        <ul class="dialogue">
          <li>
            <router-link :to="'/settings'">
              <span>Settings</span>
            </router-link>
          </li>
          <li v-if="allowAddingNewUsers">
            <router-link :to="'/users'">
              <span>Manage Users</span>
            </router-link>
          </li>
          <li>
            <button @click="logOut">
              <span>Log out</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "TheTopNav",
  data() {
    return {
      fullName: AV.User.current().get("fullName"),
      userEmail: AV.User.current().get("email"),
      allowAddingNewUsers: AV.User.current().get("allowAddingNewUsers")
    };
  },
  created() {
    const vm = this;
    document.addEventListener("click", vm.closeOpenedTopNavItem);
  },
  beforeDestroy() {
    const vm = this;
    document.removeEventListener("click", vm.closeOpenedTopNavItem);
  },
  methods: {
    logOut() {
      const vm = this;
      vm.closeOpenedTopNavItem();
      vm.$store.commit("closeGlobalSearch");
      AV.User.logOut().then(() => {
        vm.$router.push("/");
      });
    },
    closeOpenedTopNavItem() {
      const vm = this;
      vm.$store.commit("updateOpenedTopNavItem", "");
    }
  }
};
</script>

<style scoped>
#left,
#right {
  margin: 0;
  padding: 0;
  list-style: none;
}
#left {
  float: left;
  margin: 0 0 0 8px;
}
#right {
  float: right;
  margin: 0 8px 0 0;
}
#left > li,
#right > li {
  display: inline-block;
  position: relative;
}
#left > li {
  margin: 8px 8px 8px 0;
}
#right > li {
  margin: 8px 0 8px 8px;
}
#left > li > span,
#left > li > a > span,
#left > li > button > span,
#right > li > span,
#right > li > a > span,
#right > li > button > span {
  display: inline-block;
  padding: 8px;
  line-height: 16px;
  color: #605e5e;
  border-radius: 2px;
}
#left > li.open > a > span,
#left > li.open > button > span,
#right > li.open > a > span,
#right > li.open > button > span {
  background-color: #ffffff11;
}
#left > li > a:focus > span,
#left > li > a:hover > span,
#left > li > button:focus > span,
#left > li > button:hover > span,
#right > li > a:focus > span,
#right > li > a:hover > span,
#right > li > button:focus > span,
#right > li > button:hover > span {
  color: #36d5d8;
}
#right__name {
  margin: 0 0 0 8px;
}
.dialogue {
  display: none;
  position: absolute;
  top: 48px;
  margin: 0;
  padding: 8px 0;
  background-color: #f9f9f9;
  border-radius: 2px;
  list-style: none;
}
#left > li > .dialogue {
  left: 0;
}
#right > li > .dialogue {
  right: 0;
}
#left > li.open > .dialogue,
#right > li.open > .dialogue {
  display: block;
}
.dialogue > li > a > span,
.dialogue > li > button > span {
  display: inline-block;
  width: 100%;
  padding: 8px 16px;
  line-height: 16px;
  color: #605e5e;
  white-space: nowrap;
}
.dialogue > li > a:focus > span,
.dialogue > li > a:hover > span,
.dialogue > li > button:focus > span,
.dialogue > li > button:hover > span {
  color: #36d5d8;
}
</style>
