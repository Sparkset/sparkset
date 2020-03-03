<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>New Client</h1>
            <div class="field">
              <p>Enter information for new client.</p>
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
                  <button type="submit" class="primary">Continue</button>
                </div>
              </form>
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
  name: "AddClientPage",
  data() {
    return {
      email: "",
      name: "",
      nickname: "",
      cellPhone: "",
      jobTitle: "",
      company: "",
      profilePic: null
    };
  },
  methods: {
    go() {
      const vm = this;
      var client = new AV.Object("Client");
      var avatarUpload = document.getElementById("avatar-upload");
      var file = null;
      if (avatarUpload.files.length) {
        var localFile = avatarUpload.files[0];
        file = new AV.File("avatar.jpg", localFile);
        file.save().then(
          function(file) {
            console.log("File uploaded. ObjectId: " + file.id);
          },
          function(error) {
            alert(error);
          }
        );
      }
      client
        .set("email", vm.email)
        .set("nickName", vm.nickname)
        .set("cellPhone", vm.cellPhone)
        .set("jobTitle", vm.jobTitle)
        .set("fullName", vm.name)
        .set("picture", file)
        .save()
        .then(() => {
          vm.$router.push(vm.$route.query.return || "/clients");
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style scoped></style>
