<template>
  <section class="fields">
    <h1>Upcoming</h1>
    <div class="field field--superwide">
      <ClientNotesTable :clientNotes="displayNotes" :fetch-clientNotes="fetchClientNotes" />
    </div>
    <div v-if="!creatingCustomNote" class="field">
      <button class="primary" @click="creatingCustomNote = true">
        Create Custom Note
      </button>
    </div>
    <AddClientNote v-else @cancel-clientNote="cancel" @create-clientNote="createClientNote" />
  </section>
</template>

<script>
import ClientNotesTable from "@/components/ClientNotesTable.vue";
import AddClientNote from "@/components/AddClientNote.vue";
import AV from "leancloud-storage";
export default {
  name: "ClientNotes",
  components: {
    ClientNotesTable,
    AddClientNote
  },
  data() {
    return {
      displayNotes: [],
      creatingCustomNote: false
    };
  },
  created() {
    const vm = this;
    vm.fetchClientNotes();
  },
  methods: {
    fetchClientNotes() {
      const vm = this;
      const clientNotesQuery = new AV.Query("ClientNote")
      clientNotesQuery.equalTo(
        "client",
        AV.Object.createWithoutData("Client",vm.$route.params.id)
      );
      clientNotesQuery
      .notEqualTo("title",null)
      .include("client")
      .find()
      .then(displayNotes => {
        vm.displayNotes = displayNotes.map(clientNote => ({
          clientNote,
          editing:false
        }));
      })
      .catch(error => {
        alert(error);
      });
    },
    createClientNote(newClientNote) {
      const vm = this;
      const client = AV.Object.createWithoutData("Client", vm.$route.params.id);
      const clientNotes = new AV.Object("ClientNote");
      clientNotes
        .set("client", client)
        .set("title", newClientNote.title)
        .set("content", newClientNote.content)
      
      clientNotes
        .save()
        .then(() => {
          alert("Client Note created.");
          vm.fetchClientNotes();
          vm.creatingCustomNote = false;
        })
        .catch(error => {
          alert(error);
        });
    },
    cancel() {
      const vm = this;
      vm.creatingCustomNote = false;
    }
  }
};
</script>

