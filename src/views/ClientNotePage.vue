<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>
            {{clientNote.get("title")}}
            <form v-if="editing" @submit.prevent="save">
              <div class="field">
                <textarea v-model="pendingChanges.title" />
              </div>
            </form>
          </h1>
        </section>
        <section class="fields">
          <h2>Details</h2>
          <div class="field">
            <ul>
              <li>
                Created At:
                {{
                  clientNote.get("createdAt")
                    ? clientNote.get("createdAt").toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })
                    : undefined
                }}
              </li>
              <li v-if="clientNote.get('client')">
                <router-link :to="`/client/${clientNote.get('client').id}`">
                  Client: {{ clientNote.get("client").get("fullName") }}
                </router-link>
              </li>
            </ul>
          </div>
        </section>
        <section class="fields">
          <h2>
            Content
          </h2>
          <div v-if="clientNote.get('content') && !editing" class="field">
            <vue-markdown>
              {{ clientNote.get("content") }}
            </vue-markdown>
          </div>
          <form v-if="editing" @submit.prevent="save">
            <div class="field">
              <textarea v-model="pendingChanges.content" />
            </div>
            <div v-if="editing" class="field">
              <button type="submit" class="primary">Save</button>
              <button type="button" @click="(editing = false)">
                Cancel
              </button>
            </div>
          </form>
          <div v-if="!editing" class="field">
          <button
          class="primary"
          @click="editing = true">
            Edit
          </button>
        </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
import VueMarkdown from "vue-markdown";
export default {
  name: "ClientNotePage",
  components: {
    VueMarkdown
  },
  data() {
    return {
      clientNote: new AV.Object("ClientNote"),
      editing:false,
      pendingChanges: {
        content: "",
        title: "",
      }
    };
  },
  created() {
      const vm = this;
      const clientNoteQuery = new AV.Query("ClientNote");
      clientNoteQuery
        .notEqualTo("title",null)
        .include("client")
        .get(vm.$route.params.id)
        .then(clientNote => {
          vm.clientNote = clientNote;
          vm.pendingChanges.title = clientNote.get("title");
          vm.pendingChanges.content = clientNote.get("content");
        })
        .catch(error => {
          alert(error);
        });
  },
  methods: {
    save(){
      const vm = this;
      if(vm.pendingChanges.title.length === 0)
      {
        alert("Client Note Title Cannot Be Empty!");
      }
      else{
      vm.clientNote
        .set("title",vm.pendingChanges.title)
        .set("content",vm.pendingChanges.content)
        .save()
        .then(() => {
          vm.editing = false;
        })
        .catch(error => {
          alert(error);
        });
      }
    },
  }
};
</script>

<style scoped>
h1 > svg {
  color: #605e5e;
}
</style>

