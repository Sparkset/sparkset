<template>
  <nav>
    <router-link
      :to="'/overview'"
      tabindex="-1"
      @click.native="$store.commit('closeSideNav')"
    >
      <div id="logo">
        <img src="@/assets/logo.png" alt="Sparkset" />
      </div>
    </router-link>
    <div id="search-button">
      <button @click="$store.commit('openGlobalSearch')">
        <font-awesome-icon :icon="['fas', 'search']" />
        Search…
      </button>
    </div>
    <ul id="pages">
      <li v-for="page in pages" :key="page.path">
        <router-link
          :to="page.path"
          @click.native="$store.commit('closeSideNav')"
        >
          <span>{{ page.name }} </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "TheSideNav",
  data() {
    return {
      pages: [
        {
          name: "Overview",
          path: "/overview"
        },
        {
          name: "Clients",
          path: "/clients"
        },
        {
          name: "Companies",
          path: "/companies"
        },
        {
          name: AV.User.current().get("fullName").split(" ")[0]+"'s Memos",
          path: "/notes"
        }
      ]
    };
  }
};
</script>

<style scoped>
#logo {
  width: 100%;
  height: 112px;
  padding: 24px;
}
#logo > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center 0;
}
#search-button {
  padding: 0 16px 16px 16px;
}
#search-button > button {
  width: 100%;
  padding: 8px;
  background-color: #e5e5e5;
  color: #999;
  text-align: left;
  border-radius: 4px;
}
#search-button > button:focus,
#search-button > button:hover {
  background-color: #d8d8d8;
}
#pages {
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: 2px;
  overflow: hidden;
}
#pages > li {
  margin: 0 8px 8px 8px;
}
#pages > li > a > span {
  display: inline-block;
  width: 100%;
  padding: 8px;
  color: #605e5e;
}
#pages > li > a:focus > span,
#pages > li > a:hover > span {
  color: #36d5d8;
}
#pages > li > a.router-link-active > span {
  color: #36d5d8;
  font-weight: 500;
}
</style>
