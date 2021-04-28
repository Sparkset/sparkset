<template>
  <form @submit.prevent="go">
    <div class="field">
      <label>
        <span class="required-field">Title</span>
        <input type="text" v-model="title" required />
      </label>
    </div>
    <div class="field">
      <label>
        <span class="required-field">Content</span>
        <textarea rows="5" v-model="content" required></textarea>
      </label>
    </div>
    <div class="field">
      <label>
        <span>Related Clients</span>
        <multiselect
          v-model="clients"
          placeholder="Search"
          label="name"
          track-by="id"
          :options="clientOptions"
          :multiple="true"
          :hide-selected="true"
        ></multiselect>
      </label>
    </div>
    <div class="field">
      <label>
        <span>Tags</span>
        <multiselect
          v-model="tags"
          tag-placeholder="Add this as new tag"
          placeholder="Search or add new tag"
          label="name"
          track-by="name"
          :options="tagOptions"
          :multiple="true"
          :taggable="true"
          :hide-selected="true"
          @tag="addTag"
        ></multiselect>
      </label>
    </div>
    <div class="field">
      <button type="submit" class="primary">
        Save
      </button>
    </div>
  </form>
</template>

<script>
import AV from "leancloud-storage";
import Multiselect from "vue-multiselect";
export default {
  name: "NoteForm",
  components: {
    Multiselect
  },
  props: {
    clientOptions: Array,
    tagOptions: Array,
    note: AV.Object,
    callback: Function
  },
  data() {
    return {
      title: "",
      content: "",
      clients: [],
      tags: []
    };
  },
  methods: {
    go() {
      const vm = this;
      vm.note
        .set("title", vm.title)
        .set("content", vm.content)
        .set(
          "clients",
          vm.clients.map(client => client.client)
        )
        .set(
          "tags",
          vm.tags.map(tag => tag.name)
        )
        .save()
        .then(vm.callback)
        .catch(error => {
          alert(error);
        });
    },
    addTag(newTag) {
      const vm = this;
      const tag = {
        name: newTag
      };
      vm.tagOptions.push(tag);
      vm.tags.push(tag);
    }
  },
  created() {
    const vm = this;
    vm.title = vm.note.get("title");
    vm.content = vm.note.get("content");
    vm.clients = vm.note.get("clients").map(client => ({
      name: client.get("fullName"),
      id: client.id,
      client
    }));
    vm.tags = vm.note.get("tags").map(tag => ({
      name: tag
    }));
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

.required-field::after{
    content:" *";
    color:red;
}

.multiselect__tags,
.multiselect__tag,
.multiselect__tag-icon {
  border-radius: 2px;
}
.multiselect__tag {
  padding: 4px 24px 4px 8px;
  background-color: #36d5d822;
  color: #36d5d8;
  line-height: unset;
  font-size: 9pt;
}
.multiselect__tag-icon {
  border-radius: 0;
  line-height: 24px;
}
.multiselect__tag-icon:hover {
  background-color: #36d5d8;
}
.multiselect__tag-icon::after {
  color: #36d5d8;
}
.multiselect__content * {
  transition: unset;
}
.multiselect__content-wrapper {
  position: relative;
  border-radius: 0 0 2px 2px;
}
.multiselect__option--highlight,
.multiselect__option--highlight::after {
  background-color: #36d5d8;
}
</style>