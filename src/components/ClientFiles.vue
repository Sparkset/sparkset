<template>
  <section class="fields">
    <h1>
      Showing {{ client.get("files").length }}
      {{ client.get("files").length === 1 ? "File" : "Files" }}
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
    <div class="field">
      <table>
        <thead>
          <tr>
            <th class="sortable" @click="sortBy('name')">
              Name
              <span v-if="sortedBy === 'name'">
                <font-awesome-icon
                  :icon="[
                    'fas',
                    sortOrder === 1
                      ? 'long-arrow-alt-up'
                      : 'long-arrow-alt-down'
                  ]"
                />
              </span>
            </th>
            <th class="sortable" @click="sortBy('createdAt')">
              Uploaded at
              <span v-if="sortedBy === 'createdAt'">
                <font-awesome-icon
                  :icon="[
                    'fas',
                    sortOrder === 1
                      ? 'long-arrow-alt-up'
                      : 'long-arrow-alt-down'
                  ]"
                />
              </span>
            </th>
            <th class="sortable" @click="sortBy('size')">
              Size
              <span v-if="sortedBy === 'size'">
                <font-awesome-icon
                  :icon="[
                    'fas',
                    sortOrder === 1
                      ? 'long-arrow-alt-up'
                      : 'long-arrow-alt-down'
                  ]"
                />
              </span>
            </th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in sortedFiles" :key="file.id">
            <td>
              <span>
                <a :href="file.url()">
                  {{ file.get("name") }}
                </a>
              </span>
              <br />
              <span class="description">
                {{ file.metaData("description") }}
              </span>
            </td>
            <td>{{ file.createdAt.toLocaleString("en-US") }}</td>
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
import AV from "leancloud-storage";
export default {
  name: "ClientFiles",
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
        fileInFiles.metaData(
          "description",
          prompt(`Enter a description for ${file.name}:`)
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
          vm.query ? file.get("name").includes(vm.query) : true
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
      } else {
        return vm.filteredFiles.sort((a, b) =>
          a.get(vm.sortedBy) > b.get(vm.sortedBy) ? vm.sortOrder : -vm.sortOrder
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
  font-size: 9pt;
  opacity: 0.6;
}
</style>
