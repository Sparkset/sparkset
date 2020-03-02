<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="card">
          <section class="fields">
            <h1>New Client</h1>
            <div class="field">
              <p>This page is for creating new clients.</p>
              <form @submit.prevent="go">
              <div class="field">
                <label>
                  <span>Client Name</span>
                  <input
                    v-model="name"
                    autocomplete=""
                    placeholder="Name"
                    required
                  />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Email</span>
                  <input
                    v-model="email"
                    autocomplete=""
                    placeholder="Email"
                    required
                  />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Company</span>
                  <input
                    v-model="company"
                    autocomplete=""
                    placeholder="Company"
                    required
                  />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Job Title</span>
                  <input
                    v-model="jobTitle"
                    autocomplete=""
                    placeholder="Job Title"
                    required
                  />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Cell Phone</span>
                  <input
                    v-model="cellPhone"
                    autocomplete=""
                    placeholder="Cell Phone"
                    required
                  />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Nickname</span>
                  <input
                    v-model="nickname"
                    autocomplete=""
                    placeholder="Nickname"
                  />
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
  methods: {
      go(){
          const vm = this;
          var nameSplit = vm.name.split(" ", 2);
          console.log("hello");
          console.log(vm.email);
          var clients = new AV.Object('Client');
          clients
            .set("email", vm.email)
            .set("firstName", nameSplit[0])
            .set("lastName", nameSplit[1])
            .set("nickName", vm.nickname)
            .set("cellPhone", vm.cellPhone)
            .set("jobTitle", vm.jobTitle)
            .save()
            .then(() => {
                vm.$router.push(vm.$route.query.return || "/overview");
            })
            .catch(error => {
                 console.log(error);
            });
      }
  }
};
</script>

<style scoped></style>