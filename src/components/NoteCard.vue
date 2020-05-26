<template>
  <div ref="self">
    <h2>{{ note.get("title") }}</h2>
    <p class="time">
      {{
        note.createdAt.toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric"
        })
      }}
    </p>
    <vue-markdown>{{ note.get("content") }}</vue-markdown>
    <ul class="fa-ul">
      <li v-for="client in note.get('clients')" :key="client.id">
        <router-link :to="`/client/${client.id}`" class="client">
          <font-awesome-icon :icon="['fas', 'arrow-right']" size="xs" />
          {{ client.get("fullName") }}
        </router-link>
      </li>
    </ul>
    <div>
      <router-link
        v-for="tag in note.get('tags')"
        :key="tag"
        :to="`/notes?tag=${tag}`"
        class="tag"
      >
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
import VueMarkdown from "vue-markdown";
export default {
  name: "NoteCard",
  props: {
    note: AV.Object
  },
  components: {
    VueMarkdown
  },
  mounted() {
    const vm = this;
    if (vm.$route.hash === `#${vm.note.id}`) {
      vm.$refs.self.scrollIntoView({ behavior: "smooth" });
    }
  }
};
</script>

<style scoped>
.time {
  font-size: 9pt;
}
.client {
  color: #36d5d8;
}
ul {
  margin-left: 0;
}
</style>
