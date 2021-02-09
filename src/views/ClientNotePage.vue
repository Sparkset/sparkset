<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>
            {{ clientNote.get("title") }}
            {{ " " }}
            <button
              class="primary"
              v-if="!editingTitle"
              @click="editingTitle = true"
            >
              Edit
            </button>
          </h1>
            <form v-if="editingTitle" @submit.prevent="saveTitle">
              <div class="field">
                <textarea v-model="pendingChanges.title" />
              </div>
              <div class="field">
                <button class="primary">
                  Save
                </button>
                 <button type="button" @click="(editingTitle = false)">
                  Cancel
                </button>
              </div>
            </form>
          <div v-if="clientNote.get('title') && !editingTitle" class="field">
                <vue-markdown>
                  {{ clientNote.get("title") }}
                </vue-markdown>
          </div>
        </section>
        <section class="fields">
          <h2>
            Content
            <button
              class="primary"
              v-if="!editingContent"
              @click="editingContent = true"
            >
              Edit
            </button>
          </h2>
          <div v-if="clientNote.get('content') && !editingContent" class="field">
            <vue-markdown>
              {{ clientNote.get("content") }}
            </vue-markdown>
          </div>
          <form v-if="editingContent" @submit.prevent="saveContent">
            <div class="field">
              <textarea v-model="pendingChanges.content" />
            </div>
            <div class="field">
              <button class="primary">
                Save
              </button>
               <button type="button" @click="(editingContent = false)">
                  Cancel
                </button>
            </div>
          </form>
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
      editingContent: false,
      editingTitle: false,
      pendingChanges: {
        content: "",
        title: "",
      }
    };
  },
  methods: {
    saveContent() {
      const vm = this;
      // console.log(vm.clientNote);
      vm.clientNote
        .set("content", vm.pendingChanges.content)
        .save()
        .then(() => {
          vm.editingContent = false;
        })
        .catch(error => {
          alert(error);
        });
    },
    saveTitle()
    {
      const vm = this;
      if(vm.pendingChanges.title.length === 0)
      {
        alert("Client Note Title Cannot Be Empty!");
      }
      else{
        vm.clientNote
          .set("title", vm.pendingChanges.title)
          .save()
          .then(() => {
            vm.editingTitle = false;
          })
          .catch(error => {
            alert(error);
          })
      }
    }
  }
};
</script>

<style scoped>
h1 > svg {
  color: #605e5e;
}
</style>

