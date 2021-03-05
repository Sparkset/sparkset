<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>New Memo</h1>
          <NoteForm
            :client-options="clientOptions"
            :tag-options="tagOptions"
            :note="newNote"
            :callback="addNote"
            :key="lastAddedNote.id"
          />
        </section>
      </div>
      <div v-if="filteredNotes.length" class="card">
        <section class="fields">
          <h1>
            Showing {{ filteredNotes.length }}
            {{ filteredNotes.length === 1 ? "Memo" : "Memos" }}
          </h1>
          <p v-if="tagOptions.length">
            Filter by:
            <router-link
              v-for="tag in tagOptions"
              :key="tag.name"
              :to="
                $route.query.tag === tag.name
                  ? '/notes'
                  : `/notes?tag=${tag.name}`
              "
              :class="['tag', $route.query.tag === tag.name ? 'active' : null]"
            >
              {{ tag.name }}
            </router-link>
          </p>
        </section>
        <section
          v-for="note in filteredNotes"
          :key="note.note.id"
          class="fields"
        >
          <div v-if="!note.editing" class="field">
            <NoteCard :note="note.note" />
          </div>
          <NoteForm
            v-else
            :client-options="clientOptions"
            :tag-options="tagOptions"
            :note="note.note"
            :callback="
              () => {
                updateNote(note);
              }
            "
          />
          <div v-if="!note.editing" class="field">
            <button @click="note.editing = true">
              Edit
            </button>
          </div>
          <div v-if="!note.editing" class="field">
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
import NoteForm from "@/components/NoteForm.vue";
import NoteCard from "@/components/NoteCard.vue";
export default {
  name: "NotesPage",
  components: {
    NoteForm,
    NoteCard
  },
  data() {
    return {
      clientOptions: [],
      tagOptions: [],
      lastAddedNote: new AV.Object("Note").set("clients", []).set("tags", []),
      newNote: new AV.Object("Note").set("clients", []).set("tags", []),
      notes: []
    };
  },
  methods: {
    fetchNotes() {
      const vm = this;
      const noteQuery = new AV.Query("Note");
      noteQuery
        .equalTo("owner", AV.User.current())
        .include("clients")
        .descending("createdAt")
        .limit(1000)
        .find()
        .then(notes => {
          vm.notes = notes.map(note => ({
            note,
            editing: false
          }));
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
    fetchClientOptions() {
      const vm = this;
      const clientQuery = new AV.Query("Client");
      clientQuery
        .limit(1000)
        .find()
        .then(clients => {
          vm.clientOptions = clients.map(client => ({
            name: client.get("fullName"),
            id: client.id,
            client
          }));
        })
        .catch(error => {
          alert(error);
        });
    },
    addNote() {
      const vm = this;
      vm.notes.unshift({
        note: vm.newNote,
        editing: false
      });
      vm.lastAddedNote = vm.newNote;
      vm.newNote = new AV.Object("Note").set("clients", []).set("tags", []);
    },
    updateNote(note) {
      note.editing = false;
    },
    removeNote(note) {
      const vm = this;
      if (confirm(`Are you sure to delete "${note.note.get("title")}"?`)) {
        note.note
          .destroy()
          .then(() => {
            vm.notes.splice(vm.notes.indexOf(note), 1);
          })
          .catch(error => {
            alert(error);
          });
      }
    }
  },
  created() {
    const vm = this;
    vm.fetchNotes();
    vm.fetchClientOptions();
  },
  computed: {
    filteredNotes() {
      const vm = this;
      return vm.$route.query.tag
        ? vm.notes.filter(note =>
            note.note.get("tags").includes(vm.$route.query.tag)
          )
        : vm.notes;
    }
  }
};
</script>

<style scoped></style>
