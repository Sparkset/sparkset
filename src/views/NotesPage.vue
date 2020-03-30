<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>Notes ({{ notes.length }})</h1>
          <form @submit.prevent="addNote">
            <div class="field">
              <label>
                Title
                <input type="text" v-model="note.title" required />
              </label>
            </div>
            <div class="field">
              <label>
                Content
                <textarea rows="5" v-model="note.content" required></textarea>
              </label>
            </div>
            <div class="field">
              <label>
                Tags
                <multiselect
                  v-model="note.tags"
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
        </section>
      </div>
      <div v-if="notes.length" class="card">
        <section v-for="note in notes" :key="note.id" class="fields">
          <div class="field">
            <h1>{{ note.get("title") }}</h1>
            <p class="time">{{ note.createdAt.toLocaleString("en-US") }}</p>
            <p>{{ note.get("content") }}</p>
            <span v-for="tag in note.get('tags')" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
          <div class="field">
            <button class="danger" @click="removeNote(note)">
              Delete
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
import Multiselect from "vue-multiselect";
export default {
  components: {
    Multiselect
  },
  name: "NotesPage",
  data() {
    return {
      tagOptions: [],
      note: {
        title: "",
        content: "",
        tags: []
      },
      notes: []
    };
  },
  methods: {
    fetchNotes() {
      const vm = this;
      const noteQuery = new AV.Query("Note");
      noteQuery
        .equalTo("owner", AV.User.current())
        .descending("createdAt")
        .limit(1000)
        .find()
        .then(notes => {
          vm.notes = notes;
          vm.tagOptions = Array.from(
            new Set(
              notes.reduce(
                (accumulator, note) => [...accumulator, ...note.get("tags")],
                []
              )
            )
          ).map(tag => ({ name: tag }));
        })
        .catch(error => {
          alert(error);
        });
    },
    addNote() {
      const vm = this;
      const note = new AV.Object("Note");
      note
        .set("title", vm.note.title)
        .set("content", vm.note.content)
        .set(
          "tags",
          vm.note.tags.map(tag => tag.name)
        )
        .save()
        .then(() => {
          vm.fetchNotes();
          vm.note = {
            title: "",
            content: "",
            tags: []
          };
        })
        .catch(error => {
          alert(error);
        });
    },
    removeNote(note) {
      const vm = this;
      note
        .destroy()
        .then(vm.fetchNotes)
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
      vm.note.tags.push(tag);
    }
  },
  created() {
    const vm = this;
    vm.fetchNotes();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
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
.multiselect__content-wrapper {
  position: relative;
  border-radius: 0 0 2px 2px;
}
.multiselect__option--highlight,
.multiselect__option--highlight::after {
  background-color: #36d5d8;
}
</style>

<style scoped>
.time {
  font-size: 9pt;
}
.tag {
  display: inline-block;
  margin: 4px 4px 0 0;
  padding: 4px 8px;
  background-color: #36d5d822;
  color: #36d5d8;
  font-size: 9pt;
  border-radius: 2px;
}
</style>
