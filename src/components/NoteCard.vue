<template>
  <div>
    <div v-bind:class="{ textIndsidePadding: homePage, textInside: !homePage }">
      <h1>{{ note.get("title") }}</h1>
      <p class="time">
        {{
          note.createdAt.toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
        }}
      </p>
      <p>{{ note.get("content") }}</p>
      <ul class="fa-ul">
        <router-link
          v-for="client in note.get('clients')"
          :key="client.id"
          :to="`/client/${client.id}`"
          class="client"
        >
          <li><font-awesome-icon :icon="['fas', 'arrow-right']" /> {{ client.get("fullName") }}</li>
        </router-link>
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
  </div>
</template>

<script>
export default {
  name: "NoteCard",
  props: {
    note: Object,
    homePage: Boolean,
  },
};
</script>

<style scoped>
.tag {
  display: inline-block;
  margin: 4px 4px 0 0;
  padding: 4px 8px;
  background-color: #36d5d822;
  color: #36d5d8;
  font-size: 9pt;
  border-radius: 2px;
  margin-bottom: 10px;
}

.tag.active {
  background-color: #36d5d8;
  color: #fff;
}

.textInside {
  flex: 1;
  padding-top: 5px;
}

.textIndsidePadding {
  flex: 1;
  padding: 10px;
  padding-top: 5px;
  margin-left: 5px;
  width: 250px;
}

.client {
  color: #36d5d8;
}

.time {
  font-size: 9pt;
}

ul{
  margin-left: 0px;
  padding-left: 0px;
}
</style>
