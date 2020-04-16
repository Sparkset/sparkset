<template>
  <section class="fields">
    <h1>Client Milestones</h1>
    <div>
      <div class="columns">
        <div class="column">
          <div class="field">
            <button class="primary" @click="$router.push('events/add')">
              Add Event
            </button>
          </div>

          <div class="card">
            <section class="fields">
              <form @submit.prevent="go">
                <h1>Welcome Email with steps</h1>
                <div class="field">
                  <label>Last updated on: </label>
                  <input v-model="lastUpdated" type="date" style="width:70%" />
                </div>
                <div class="field">
                  <label> Status: </label>
                  <select v-model="status" style="width:80%">
                    <option value="done" selected>Done</option>
                    <option value="inprogress"> In Progress </option>
                    <option value="notdone">Not Done</option>
                  </select>
                </div>
                <div v-if="editing" class="field">
                  <button type="submit" class="primary">Save</button>
                </div>
              </form>
              <div v-if="!editing" class="field">
                <button @click="editing = true">Edit</button>
              </div>
            </section>
          </div>

          <div class="card">
            <div class="fields">
              <h1>Welcome package</h1>
              <div class="field">
                <label>Last updated on: </label>
                <input v-model="lastUpdated" type="date" style="width:70%" />
              </div>
              <div class="field">
                <label> Status: </label>
                <select v-model="selected" style="width:80%">
                  <option value="done" selected>Done</option>
                  <option value="inprogress"> In Progress </option>
                  <option value="notdone">Not Done</option>
                </select>
              </div>
              <div v-if="editing" class="field">
                <button class="primary">Save</button>
              </div>
              <div v-if="!editing" class="field">
                <button @click="editing = true">Edit</button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="fields">
              <h1>Kickoff meeting</h1>
              <div class="field">
                <label>Last updated on: </label>
                <input v-model="lastUpdated" type="date" style="width:70%" />
              </div>
              <div class="field">
                <label> Status: </label>
                <select v-model="selected" style="width:80%">
                  <option value="done" selected>Done</option>
                  <option value="inprogress"> In Progress </option>
                  <option value="notdone">Not Done</option>
                </select>
              </div>
              <div v-if="editing" class="field">
                <button class="primary">Save</button>
              </div>
              <div v-if="!editing" class="field">
                <button @click="editing = true">Edit</button>
              </div>
            </div>
          </div>

          <!-- <div class="card">
            <div class="fields">
              <h1>Monthly status, Report and Budget reports</h1>
              <div class="field">
                <p>Last updated on:</p>
                <input v-model="lastUpdated" type="date" style="width:80%" />
                <button class="primary" style="margin-left:5px">Save</button>
              </div>
              <div>
                <label> Status: </label>
                <select v-model="selected" style="width:80%">
                  <option>Done</option>
                  <option> In Progress </option>
                  <option selected>Not Done</option>
                </select>
              </div>
            </div>
          </div> -->

          <!-- <div class="card">
            <div class="fields">
              <h1>Account health check</h1>
              <div class="field">
                <p>Last updated on:</p>
                <input v-model="lastUpdated" type="date" style="width:80%" />
                <button class="primary" style="margin-left:5px">Save</button>
              </div>
              <div>
                <label> Status: </label>
                <select v-model="selected" style="width:80%">
                  <option>Done</option>
                  <option> In Progress </option>
                  <option selected>Not Done</option>
                </select>
              </div>
            </div>
          </div> -->

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientEvents",
  props: {
    client: AV.Object,
    isNew: Boolean,
    callback: Function
  },
  data() {
    return {
      editing: false,
      lastUpdated: "",
      status: ""
    };
  },
  methods: {
    go() {
      const vm= this;
      vm.client
        .set("lastUpdated", vm.lastUpdated)
        .set("status", vm.status)
        .save()
        .then(() => {
          vm.callback();
          vm.editing = false;
        })
        .catch(error => {
          alert(error);
        });
    },
    created() {
      const vm = this;
      vm.editing= vm.isNew;
      vm.lastUpdated = vm.client.get("lastUpdated");
      vm.status = vm.client.get("status");

    }
  }
};
</script>

<style scoped></style>
