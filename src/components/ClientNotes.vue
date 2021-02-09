<template>
  <section class="fields">
    <h1>
      Showing {{ client.get("clientNotes").length }}
      {{ client.get("clientNotes").length === 1 || client.get("clientNotes").length === 0? "Client Note" : "Client Notes" }}
    </h1>
    <div class="field field--half">
      <label>
        <span>Search By Name</span>
        <input type="text" v-model="query" />
      </label>
    </div>
    <div class="field field--superwide">
      <table>
        <thead>
          <tr>
            <ThWithSort
              by="title"
              :sorted-by="sortedBy"
              :sort-order="sortOrder"
              :sort-by="sortBy"
            >
              Name
            </ThWithSort>
            <ThWithSort
              by="createdAt"
              :sorted-by="sortedBy"
              :sort-order="sortOrder"
              :sort-by="sortBy"
            >
              Created at
            </ThWithSort>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clientNotes in sortedClientNotes" :key="clientNotes.id">
            <td>
              <router-link :to="`/clientNote/${clientNotes.id}`">
                {{ clientNotes.get("title") }}
              </router-link>
              <br />
            </td>
            <td>
              {{
                clientNotes.createdAt.toLocaleString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric"
                })
              }}
            </td>
            <td>
              <button class="danger" @click="deleteClientNote(clientNotes)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!creatingClientNote" class="field">
      <button class="primary" @click="creatingClientNote = true">
        Create Client Note
      </button>
    </div>
    <AddClientNote v-else @cancel-clientNote="cancel" @create-clientNote="createClientNote" />
  </section>
</template>

<script>
import ThWithSort from "@/components/ThWithSort.vue";
import AddClientNote from "@/components/AddClientNote.vue";
import AV from "leancloud-storage";
export default {
  name: "ClientNotes",
  components: {
    ThWithSort,
    AddClientNote
  },
  data() {
    return {
      query: "",
      client: new AV.Object("Client").set("clientNotes", []),
      creatingClientNote: false,
      sortedBy: "createdAt",
      sortOrder: -1
    };
  },
  created() {
    const vm = this;
    vm.search();
  },
  methods: {
    search() {
      const vm = this;
      const clientQuery = new AV.Query("Client");
      clientQuery
        .include("clientNotes")
        .get(vm.$route.params.id)
        .then(client => {
          vm.client = client;
        })
        .catch(error => {
          alert(error);
        });
    },
  
    fetchClientNote() {
      const vm = this;
      const clientyQuery = new AV.Query("Client");
      clientyQuery
        .get(vm.$route.params.id)
        .then(client => {
          vm.clientNotes = client.get("clientNotes");
          vm.fetchClientNote();
        })
        .catch(error => {
          alert(error);
        });
    },

    sortBy(field) {
      const vm = this;
      vm.sortOrder = vm.sortedBy === field ? -vm.sortOrder : 1;
      vm.sortedBy = field;
    },

    deleteClientNote(clientNotes) {
      const vm = this;
      if (confirm(`Are you sure you want to delete ${clientNotes.get("title")}?`)) {
        vm.client
          .remove("clientNotes", clientNotes)
          .save()
          .then(vm.search)
          .catch(error => {
            alert(error);
          });
      }
    },

    createClientNote(newClientNote) {
      const vm = this;
      const client = AV.Object.createWithoutData("Client", vm.$route.params.id);
      const clientNotes = new AV.Object("ClientNote");
      clientNotes
        .set("client", client)
        .set("title", newClientNote.title)
        .set("content", newClientNote.content)

      vm.client.add("clientNotes", clientNotes);
      vm.client
        .save()
        .then(() => {
          alert("Client Note created.");
          vm.fetchClientNote();
          vm.creatingClientNote = false;
          vm.search();
        })
        .catch(error => {
          alert(error);
        });
    },
    cancel() {
      const vm = this;
      vm.creatingClientNote = false;
    }
  },
  computed: {
    filteredClientNotes() {
      const vm = this;
      return vm.client
        .get("clientNotes")
        .filter(clientNotes =>
          vm.query ? clientNotes.get("title").toLowerCase.includes(vm.query.toLowerCase()) : true
        );
    },
    sortedClientNotes() {
      const vm = this;
      if (vm.sortedBy === "createdAt") {
        return vm.filteredClientNotes.sort((a, b) =>
          a.createdAt > b.createdAt ? vm.sortOrder : -vm.sortOrder
        );
      } else {
        return vm.filteredClientNotes.sort((a, b) =>
          a.get(vm.sortedBy).toLowerCase() > b.get(vm.sortedBy).toLowerCase() ? vm.sortOrder : -vm.sortOrder
        );
      }
    }
  }
};
</script>

