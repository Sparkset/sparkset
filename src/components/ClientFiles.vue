<template>
  <section class="fields">
    <h1>
      Showing {{ client.get("files").length }}
      {{ client.get("files").length === 1 || client.get("files").length === 0? "File" : "Files" }}
    </h1>
    <div class="field field--half">
      <label>
        <span>Whose Name Contains</span>
        <input type="text" v-model="query" />
      </label>
    </div>
    <div class="field">
      <button id="upload" class="primary" @click="$refs.filesInput.click()">
        Upload Files
      </button>
      <input type="file" @change="uploadFiles" ref="filesInput" multiple />
    </div>
    <div class="field field--superwide">
      <table>
        <thead>
          <tr>
            <ThWithSort
              by="name"
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
              Uploaded at
            </ThWithSort>
            <ThWithSort
              by="size"
              :sorted-by="sortedBy"
              :sort-order="sortOrder"
              :sort-by="sortBy"
            >
              Size
            </ThWithSort>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in sortedFiles" :key="file.id">
            <td>
              <span class="description">
                <a :href="file.url()">
                  {{ file.metaData("description")}}
                </a>
              </span>
            </td>
            <td>
              {{
                file.createdAt.toLocaleString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric"
                })
              }}
            </td>
            <td>{{ addUnitToSize(file.size()) }}</td>
            <td>
              <button class="danger" @click="deleteFile(file)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import ThWithSort from "@/components/ThWithSort.vue";
import AV from "leancloud-storage";
export default {
  name: "ClientFiles",
  components: {
    ThWithSort
  },
  data() {
    return {
      query: "",
      client: new AV.Object("Client").set("files", []),
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
        .include("files")
        .get(vm.$route.params.id)
        .then(client => {
          vm.client = client;
        })
        .catch(error => {
          alert(error);
        });
    },
    uploadFiles() {
      const vm = this;
      const files = vm.$refs.filesInput.files;
      files.forEach(file => {
        const fileInFiles = new AV.File(file.name, file);
        fileInFiles.metaData("description","New File");
        fileInFiles.metaData(
          "description",
          prompt(`Enter a description(new name) for ${file.name}:`)
        );
        vm.client.add("files", fileInFiles);
      });
      vm.client
        .save()
        .then(() => {
          vm.search();
          vm.$refs.filesInput.value = "";
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
    addUnitToSize(size) {
      if(size == undefined)
      {
        return 0 + " KB";
      }
      const units = ["KB", "MB", "GB", "TB"];
      for (let i = units.length; i > 0; i--) {
        if (size >= Math.pow(1024, i)) {
          return `${(size / Math.pow(1024, i)).toFixed(1)} ${units[i - 1]}`;
        }
      }
      return size === 1 ? `${size} byte` : `${size} bytes`;
    },
    deleteFile(file) {
      const vm = this;
      if (confirm(`Are you sure to delete ${file.get("name")}?`)) {
        console.log(file);
        vm.client
          .remove("files", file)
          .save()
          .then(vm.search)
          .catch(error => {
            alert(error);
          });
      }
    }
  },
  computed: {
    filteredFiles() {
      const vm = this;
      return vm.client
        .get("files")
        .filter(file =>
          vm.query ? file.get("description").toLowerCase().includes(vm.query.toLowerCase()) : true
        );
    },
    sortedFiles() {
      const vm = this;
      if (vm.sortedBy === "createdAt") {
        return vm.filteredFiles.sort((a, b) =>
          a.createdAt > b.createdAt ? vm.sortOrder : -vm.sortOrder
        );
      } else if (vm.sortedBy === "size") {
        return vm.filteredFiles.sort((a, b) =>
          a.size() > b.size() ? vm.sortOrder : -vm.sortOrder
        );
      } else { //sort by name
        return vm.filteredFiles.sort((a, b) =>
          a.get("description").toLowerCase() > b.get("description").toLowerCase() ? vm.sortOrder : -vm.sortOrder
        );
      }
    }
  }
};
</script>

<style scoped>
#upload + input[type="file"] {
  display: none;
}
.description {
  font-size: 12pt;
}
</style>
