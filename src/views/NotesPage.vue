<template>
  <div>
    <div class="columns">
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
              <p>{{ note.get("createdAt").toLocaleString("en-US") }}</p>
              <p>{{ note.get("content") }}</p>
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
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "NotesPage",
  data() {
    return {
      note: {
        title: "",
        content: ""
      },
      notes: []
    };
  },
  methods: {
    fetchNotes() {
      const vm = this;
      const noteQuery = new AV.Query("Note");
      noteQuery
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
        .save()
        .then(() => {
          vm.fetchNotes();
          vm.note = {
            title: "",
            content: ""
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
    }
  },
  created() {
    const vm = this;
    vm.fetchNotes();
  }
};
</script>

<style scoped></style>
