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
    <input type= "text" v-model= "search" placeholder="Search" id="searchbar"/>

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
        }
      ]
    };
  }
};
</script>

<style scoped>
#logo {
  width: 100%;
  height: 108px;
  padding: 32px;
}
#logo > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center 0;
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
#pages > li > a.router-link-exact-active > span {
  color: #36d5d8;
  font-weight: 500;
}
#searchbar {
  width: 95%;
  margin: 5px;
  margin-left: 5px;
  border-color: #36d5d8;
}
</style>
