<template>
  <div>
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
    <p>{{ note.get("content") }}</p>
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
export default {
  name: "NoteCard",
  props: {
    note: AV.Object
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
