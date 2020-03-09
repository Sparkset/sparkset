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
            <h1>Reset Password</h1>
            <form @submit.prevent="go">
              <div class="field">
                <label>
                  <span>New Password</span>
                  <input
                    v-model="newPassword"
                    type="password"
                    autocomplete="new-password"
                    required
                  />
                </label>
              </div>
              <div class="field">
                <label>
                  <span>Confirm Password</span>
                  <input
                    v-model="confirmPassword"
                    type="password"
                    autocomplete="new-password"
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
export default {
  name: "ResetPage",
  data() {
    return {
      newPassword: "",
      confirmPassword: ""
    };
  },
  methods: {
    go() {
      const vm = this;
      const { token } = vm.$route.query;
      if (vm.newPassword !== vm.confirmPassword) {
        alert("The passwords you entered did not match.");
      } else {
        fetch(
          `https://us.leancloud.cn/1.1/resetPassword/${token}?password=${encodeURIComponent(
            vm.newPassword
          )}`
        )
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              alert(
                "This link has already expired. Please make a new request to reset your password."
              );
            } else {
              alert(
                "You have successfully reset your password. You may log in with your new password now."
              );
              vm.$router.push("/");
            }
          });
      }
    }
  }
};
</script>

<style scoped>
#logo {
  width: 100%;
}
</style>
