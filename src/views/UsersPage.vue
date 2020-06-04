<template>
  <div>
    <div class="column">
      <div class="card">
        <section class="fields">
          <h1>Add New User</h1>
          <form @submit.prevent="addNewUser">
            <div class="field field--half">
              <label>
                <span>Full Name</span>
                <input v-model="newUser.fullName" type="text" required />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Email</span>
                <input v-model="newUser.email" type="email" required />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Phone Number</span>
                <input
                  v-model="newUser.mobilePhoneNumber"
                  type="tel"
                  required
                />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Password</span>
                <input v-model="newUser.password" type="password" required />
              </label>
            </div>
            <div class="field field--half">
              <label>
                <span>Allow Adding Users</span>
                <toggle-button
                  :value="newUser.allowAddingNewUsers"
                  :color="{
                    checked: '#36d5d8',
                    unchecked: '#e52f2e'
                  }"
                  :labels="{
                    checked: 'Yes',
                    unchecked: 'No'
                  }"
                  :width="72"
                  :height="42"
                  :font-size="12"
                  @change="changeUserCreationPermission"
                  sync
                />
              </label>
            </div>
            <div class="field">
              <button type="submit" class="primary">Add New User</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "SettingsPage",
  data() {
    return {
      newUser: {
        fullName: "",
        email: "",
        mobilePhoneNumber: "",
        password: "",
        allowAddingNewUsers: false
      }
    };
  },
  methods: {
    addNewUser() {
      const vm = this;
      const user = new AV.User();
      user
        .set("fullName", vm.newUser.fullName)
        .setEmail(vm.newUser.email)
        .setUsername(vm.newUser.email)
        .setMobilePhoneNumber(
          !vm.newUser.mobilePhoneNumber.startsWith("+")
            ? `+1${vm.newUser.mobilePhoneNumber}`
            : vm.newUser.mobilePhoneNumber
        )
        .setPassword(vm.newUser.password)
        .set("allowAddingNewUsers", vm.newUser.allowAddingNewUsers)
        .save()
        .then(() => {
          alert(`User Created with email address: ${vm.newUser.email}.`);
          vm.newUser = {
            fullName: "",
            email: "",
            mobilePhoneNumber: "",
            password: "",
            allowAddingNewUsers: false
          };
        })
        .catch(error => {
          if (error.code === 125) {
            alert(
              "The email address you entered is not a valid one. Please check your input."
            );
          } else if (error.code === 127) {
            alert(
              "The phone number you entered is not a valid one (non-US number should start with a plus sign). Please check your input."
            );
          } else if (error.code === 202 || error.code === 203) {
            alert(
              "The email address you entered is already used for another account."
            );
          } else if (error.code === 214) {
            alert(
              "The phone number you entered is already used for another account."
            );
          } else {
            alert(error);
          }
        });
    },
    changeUserCreationPermission(e) {
      const vm = this;
      vm.newUser.allowAddingNewUsers = e.value;
    }
  }
};
</script>

<style scoped></style>
