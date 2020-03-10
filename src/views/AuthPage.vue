<template>
  <div>
    <div class="columns">
      <div class="column column--thin">
        <div class="card card--center card--ghosted">
          <section class="fields">
            <div class="field">
              <img id="logo" src="@/assets/logo.png" alt="Sparkset" />
            </div>
          </section>
        </div>
        <div class="card">
          <section class="fields">
            <h1>Log in</h1>
            <form @submit.prevent="go">
              <div class="field">
                <label>
                  <span>Email</span>
                  <input
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    required
                  />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Password</span>
                  <input
                    v-model="password"
                    type="password"
                    autocomplete="current-password"
                    required
                  />
                </label>
              </div>
              <div class="field">
                <button type="submit" class="primary">Continue</button>
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
  name: "AuthPage",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    go() {
      const vm = this;
      AV.User.logIn(vm.email, vm.password)
        .then(() => {
          vm.$router.push(vm.$route.query.return || "/overview");
        })
        .catch(error => {
          if (error.code === 210) {
            alert("The password you provided is incorrect. Please try again.");
          } else if (error.code === 211) {
            alert(
              "We could not find a user with the username or email provided."
            );
          } else {
            alert(error);
          }
        });
    }
  }
};
</script>

<style scoped>
#logo {
  width: 100%;
}
</style>
