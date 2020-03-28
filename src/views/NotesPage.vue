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
            <div>
              <multiselect
                v-model="value"
                tag-placeholder="Add this as new tag"
                placeholder="Search or add new tag (click to interact)"
                label="name"
                track-by="code"
                :options="options"
                :multiple="true"
                :taggable="true"
                @tag="addTag"
              ></multiselect>
            </div>
            <br />
            <br />
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
            <p>{{ note.createdAt.toLocaleString("en-US") }}</p>
            <p>{{ note.get("content") }}</p>
            <h4>Tags</h4>
            <ul>
              <li v-for="(tag, index) in note.get('tags')" :key="index">
                {{ tag.name }}
              </li>
            </ul>
          </div>
          <div class="field">
            <button class="close" @click="removeNote(note)">
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
      value: [],
      options: [
        { name: "Meeting Note", code: "mn100" },
        { name: "BOb", code: "bob100" }
      ],
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
        .set("tags", vm.value)
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
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      vm.options.push(tag);
      vm.value.push(tag);
    }
  },
  created() {
    const vm = this;
    vm.fetchNotes();
  }
};
</script>

<style scoped></style>
