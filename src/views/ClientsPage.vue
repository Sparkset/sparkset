<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>Clients ({{ clients.length }})</h1>
            <div class="field field--half">
              <label>
                <span>Search</span>
                <input type="text" v-model="search" />
              </label>
            </div>
            <div class="field">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Cell Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="client in filteredClients" :key="client.id">
                    <td>
                      <span class="picture-name-combo">
                        <img
                          :src="
                            client.get('picture')
                              ? client.get('picture').url()
                              : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                          "
                        />
                        <span>
                          {{ client.get("firstName") }}
                          <span class="last-name">
                            {{ client.get("lastName") }}
                          </span>
                          <span class="nick-name">
                            {{
                              client.get("nickName")
                                ? `(${client.get("nickName")})`
                                : undefined
                            }}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td>
                      {{
                        client.get("company")
                          ? client.get("company").get("name")
                          : undefined
                      }}
                    </td>
                    <td>{{ client.get("jobTitle") }}</td>
                    <td>{{ client.get("email") }}</td>
                    <td>{{ client.get("cellPhone") }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientsPage",
  data() {
    return {
      search: "",
      clients: []
    };
  },
  created() {
    const vm = this;
    const clientQuery = new AV.Query("Client");
    clientQuery
      .include("company")
      .addAscending("lastName")
      .addAscending("firstName")
      .limit(1000)
      .find()
      .then(clients => {
        vm.clients = clients;
      })
      .catch(error => {
        alert(error);
      });
  },
  computed: {
    filteredClients() {
      const vm = this;
      return vm.clients.filter(client =>
        vm.search
          ? [
              client.get("firstName"),
              client.get("lastName"),
              client.get("nickName"),
              client.get("jobTitle"),
              client.get("company")
                ? client.get("company").get("name")
                : undefined,
              client.get("email"),
              client.get("cellPhone")
            ].reduce(
              (accumulator, field) =>
                accumulator ||
                (field || "").toLowerCase().includes(vm.search.toLowerCase()),
              false
            )
          : true
      );
    }
  }
};
</script>

<style scoped>
.picture-name-combo {
  display: flex;
  align-items: center;
}
.picture-name-combo > img {
  margin: 0 1rem 0 0;
  border-radius: 50%;
  width: 36pt;
  height: 36pt;
  object-fit: cover;
}
.last-name {
  font-weight: 500;
}
.nick-name {
  opacity: 0.8;
}
</style>
