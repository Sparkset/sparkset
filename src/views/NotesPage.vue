<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>New Note</h1>
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
                Related Clients
                <multiselect
                  v-model="note.clients"
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
          <div class="field">
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
          <div class="field">
            <button @click="showEdit = !showEdit" v-if="!showEdit">
              Edit
            </button>
            <button @click="save" v-if="showEdit">
              Save
            </button>
            <button v-if="showEdit" @click="showEdit = false">
              Cancel
            </button>
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
      clientOptions: [],
      tagOptions: [],
      note: {
        title: "",
        content: "",
        clients: [],
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
        .include("clients")
        .descending("createdAt")
        .limit(1000)
        .find()
        .then(notes => {
          vm.notes = notes.map(note => ({
            note,
            showEdit: false,
            changes: {
              title: note.get("title"),
              content: note.get("content"),
              clients: note.get("clients"),
              tags: note.get("tags")
            }
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
      const note = new AV.Object("Note");
      note
        .set("title", vm.note.title)
        .set("content", vm.note.content)
        .set(
          "clients",
          vm.note.clients.map(client => client.client)
        )
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
            clients: [],
            tags: []
          };
        })
        .catch(error => {
          alert(error);
        });
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
    vm.fetchClientOptions();
  },
  computed: {
    filteredNotes() {
      const vm = this;
      return vm.$route.query.tag
        ? vm.notes.filter(note =>
            note.get("tags").includes(vm.$route.query.tag)
          )
        : vm.notes;
    }
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
