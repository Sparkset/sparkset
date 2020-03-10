<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>New Client</h1>
            <div class="field">
              <p>Enter information for new client.</p>
            </div>
            <form @submit.prevent="go">
              <div class="field">
                <label>
                  <span>Client Name</span>
                  <input v-model="name" required />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Email</span>
                  <input v-model="email" required />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Company</span>
                  <input v-model="company" required />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Job Title</span>
                  <input v-model="jobTitle" required />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Cell Phone</span>
                  <input v-model="cellPhone" required />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Nickname</span>
                  <input v-model="nickname" />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Profile Picture</span>
                  <input type="file" id="avatar-upload" />
                </label>
              </div>
              <div class="field">
                <button type="submit" class="primary">Save</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientsAddPage",
  data() {
    return {
      email: "",
      name: "",
      nickname: "",
      cellPhone: "",
      jobTitle: "",
      company: ""
    };
  },
  methods: {
    go() {
      const vm = this;
      const avatarUpload = document.getElementById("avatar-upload");
      let file = null;
      if (avatarUpload.files.length) {
        const localFile = avatarUpload.files[0];
        file = new AV.File("avatar.jpg", localFile);
      }
      const client = new AV.Object("Client");
      client
        .set("email", vm.email)
        .set("nickName", vm.nickname)
        .set("cellPhone", vm.cellPhone)
        .set("jobTitle", vm.jobTitle)
        .set("fullName", vm.name)
        .set("picture", file)
        .set(
          "company",
          AV.Object.createWithoutData("Company", "5e585d0d6c073d0009d86c05")
        )
        .save()
        .then(() => {
          vm.$router.push("/clients");})
        .then(client => {
          vm.$router.push(`/client/${client.id}`);
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style scoped></style>