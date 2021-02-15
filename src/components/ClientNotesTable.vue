<template>
  <table>
    <thead>
      <tr>
        <ThWithSort
          by="title"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Title
        </ThWithSort>
        <ThWithSort
          by="createdAt"
          :sorted-by="sortedBy"
          :sort-order="sortOrder"
          :sort-by="sortBy"
        >
          Created At
        </ThWithSort>
      </tr>
    </thead>
    <tbody>
      <tr v-for="clientNote in sortedClientNotes" :key="clientNote.clientNote.id">
            <td>
              <router-link :to="`/clientNote/${clientNote.clientNote.id}`">
                {{ clientNote.clientNote.get("title") }}
              </router-link>
              <br />
            </td>
            <td>
              {{
                clientNote.clientNote.get("createdAt").toLocaleString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric"
                })
              }}
            </td>
          </tr>
    </tbody>
  </table>
</template>

<script>
import ThWithSort from "@/components/ThWithSort.vue";
export default {
  name: "ClientNotesTable",
  components: {
    ThWithSort,
  },
  props: {
    clientNotes: Array,
    fetchClientNotes: Function
  },
  data() {
    return {
      sortedBy: "createdAt",
      sortOrder: 1
    };
  },
  methods: {
    sortBy(field) {
      const vm = this;
      vm.sortOrder = vm.sortedBy === field ? -vm.sortOrder : 1;
      vm.sortedBy = field;
    },
  },
  computed: {
    sortedClientNotes() {
        const vm = this;
        if (vm.sortedBy === "title") {
            return vm.clientNotes.sort((a, b) =>
            a.clientNote.get("title").toLowerCase() > b.clientNote.get("title").toLowerCase()
                ? vm.sortOrder
                : -vm.sortOrder
            );
        } 
        return vm.clientNotes.sort((a, b) =>
            a.clientNote.get(vm.sortedBy) > b.clientNote.get(vm.sortedBy)
            ? vm.sortOrder
            : -vm.sortOrder
        );
        }
  }
};
</script>

<style scoped></style>
