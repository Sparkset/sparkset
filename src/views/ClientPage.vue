<template>
  <div>
    <div class="columns">
      <div class="column column--right">
        <span class="picture-name-combo">
          <img
            :src="
              client.get('picture')
                ? client.get('picture').url()
                : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
            "
          />
        </span>
      </div>
      <div class="column column--left">
        <div class="card">
          <section class="fields">
            <h1>{{ client.get("fullName") }}</h1>
            <div class="field">
              <br /><br /><br />
              <table>
                <tr>
                  <td>Company: {{ client.get("company").get("name") }}</td>
                  <td>Email: {{ client.get("email") }}</td>
                  <td>Address: {{ client.get("address") }}</td>
                </tr>
                <tr>
                  <td>Job Title: {{ client.get("jobTitle") }}</td>
                  <td>Phone: {{ client.get("cellPhone") }}</td>
                  <td>Nickname: {{ client.get("nickName") }}</td>
                </tr>
              </table>
            </div>
          </section>
          <br />
          <h1>
            Events
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientPage",
  data() {
    return {
      client: new AV.Object("Client").set("company", new AV.Object("Company"))
    };
  },
  created() {
    const vm = this;
    const clientQuery = new AV.Query("Client");
    clientQuery
      .include("company")
      .get(vm.$route.params.id)
      .then(client => {
        vm.client = client;
      });
  }
};
</script>

<style scoped>
.picture-name-combo {
  display: flex;
  align-items: center;
}
.picture-name-combo > img {
  width: 200pt;
  height: 200pt;
  object-fit: cover;
}
</style>
