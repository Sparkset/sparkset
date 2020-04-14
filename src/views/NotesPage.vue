<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>New Note</h1>
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
            {{ filteredNotes.length === 1 ? "Note" : "Notes" }}
          </h1>
          <p>
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
            <h1>{{ note.note.get("title") }}</h1>
            <p class="time">
              {{ note.note.createdAt.toLocaleString("en-US") }}
            </p>
            <p>{{ note.note.get("content") }}</p>
            <p>
              <router-link
                v-for="client in note.note.get('clients')"
                :key="client.id"
                :to="`/client/${client.id}`"
                class="client"
              >
                @{{ client.get("fullName") }}
              </router-link>
            </p>
            <div>
              <router-link
                v-for="tag in note.note.get('tags')"
                :key="tag"
                :to="`/notes?tag=${tag}`"
                class="tag"
              >
                {{ tag }}
              </router-link>
            </div>
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
export default {
  name: "NotesPage",
  components: {
    NoteForm
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
          .then(vm.fetchNotes)
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

<style scoped>
.time {
  font-size: 9pt;
}
.client {
  color: #36d5d8;
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
.tag.active {
  background-color: #36d5d8;
  color: #fff;
}
</style>
