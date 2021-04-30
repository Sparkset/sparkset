<template>
  <table>
    <thead>
        <tr>
            <ThWithSort by="fullName"
                        :sorted-by="sortedBy"
                        :sort-order="sortOrder"
                        :sort-by="sortBy">
                Name
            </ThWithSort>
            <ThWithSort v-if="showCompany"
                        by="company"
                        :sorted-by="sortedBy"
                        :sort-order="sortOrder"
                        :sort-by="sortBy">
                Company
            </ThWithSort>
            <ThWithSort by="jobTitle"
                        :sorted-by="sortedBy"
                        :sort-order="sortOrder"
                        :sort-by="sortBy">
                Job Title
            </ThWithSort>
            <ThWithSort by="email"
                        :sorted-by="sortedBy"
                        :sort-order="sortOrder"
                        :sort-by="sortBy">
                Email
            </ThWithSort>
            <ThWithSort by="cellPhone"
                        :sorted-by="sortedBy"
                        :sort-order="sortOrder"
                        :sort-by="sortBy">
                Cell Phone
            </ThWithSort>
            <th>Option</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="client in sortedClients" :key="client.id">
            <td>
                <ClientCombo :client="client" />
            </td>
            <td v-if="showCompany">
                <span v-if="client.get('company') == null">
                </span>
                <span v-else>
                    <router-link :to="`/company/${client.get('company').id}`">
                        <CompanyCombo :company="client.get('company')" />
                    </router-link>
                </span>
            </td>
            <td>{{ client.get("jobTitle") }}</td>
            <td>
                <a :href="`mailto:${client.get('email')}`">
                    {{ client.get("email") }}
                </a>
            </td>
            <td>
                <a :href="`tel:${client.get('cellPhone')}`">
                    {{ client.get("cellPhone") }}
                </a>
            </td>
            <td>
                <!--<button v-if="!client.archived" @click="archive(client)">
                    Archive
                </button>-->
                <button v-if="!client.editing"
                        :class="[client.get('archived') ? '' : 'primary']"
                        @click="toggle(client)">
                    {{ client.get("archived") ? "Archive" : "Unarchive" }}
                </button>
            </td>
        </tr>
    </tbody>
  </table>
</template>

<script>
import ThWithSort from "@/components/ThWithSort.vue";
import ClientCombo from "@/components/ClientCombo.vue";
import CompanyCombo from "@/components/CompanyCombo.vue";
export default {
  name: "ClientsTable",
  components: {
    ThWithSort,
    ClientCombo,
    CompanyCombo
  },
  props: {
    clients: Array,
    showCompany: Boolean
  },
  data() {
    return {
      sortedBy: "fullName",
      sortOrder: 1
    };
  },
  methods: {
    sortBy(field) {
      const vm = this;
      vm.sortOrder = vm.sortedBy === field ? -vm.sortOrder : 1;
      vm.sortedBy = field;
      },
      toggle(client) {
          const vm = this;
          client.client
              .set("archive", !client.client.get("archive"))
              .save()
              .then(vm.fetchClients)
              .then(() => {
                  if (client.client.get("archive")) {
                      alert("Client Archived.");
                  } else {
                      alert("Client .");
                  }
              })
              .catch(error => {
                  alert(error);
              });
      },
      archive(client) {
          const vm = this;
          client.lastEvent
              .set("archive")
              .save()
              .then(vm.fetchClients)
              .catch(error => {
                  alert(error);
              });
      }
  },
  computed: {
    sortedClients() {
      const vm = this;
      if (vm.sortedBy === "company") {
        return vm.clients.sort((a, b) =>
          a.get("company").get("name").toLowerCase() > b.get("company").get("name").toLowerCase()
            ? vm.sortOrder
            : -vm.sortOrder
        );
      } else {
        return vm.clients.sort((a, b) =>
          a.get(vm.sortedBy).toLowerCase() > b.get(vm.sortedBy).toLowerCase() ? vm.sortOrder : -vm.sortOrder
        );
      }
    }
  }
};
</script>

<style scoped></style>
