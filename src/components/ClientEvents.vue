<template>
  <section class="fields">
    <h1>Client Milestones</h1>
    <div>
      <div class="columns">
        <div class="column">

          <div class="field">
            <button class="primary" @click="$router.push('/events/add')">
              Add Event
            </button>
          </div>

          <div class="card">
            <div class="fields">
              <h1> Welcome Email with steps </h1> <!-- Event name -->
              <div class="field">
                <p> Last updated on: </p>
                <input v-model="lastUpdated" type="date" style= "width:40%" />
                <button class="primary" style="margin-left:5px"> Save </button>
              </div>
              <div>
                <label> Status: </label>
                <select v-model="selected" style= "width:40%">
                  <option>Done</option>
                  <option> In Progress </option>
                  <option>Not Done</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="fields">
              <h1> Welcome package </h1>
              <div class="field">
                <p> Last updated on: </p>
                <input v-model="lastUpdated" type="date" style= "width:40%" />
                <button class="primary" style="margin-left:5px"> Save </button>
              </div>
              <div>
                <label> Status: </label>
                <select v-model="selected" style= "width:40%">
                  <option>Done</option>
                  <option> In Progress </option>
                  <option>Not Done</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="fields">
              <h1> Kickoff meeting </h1>
              <div class="field">
                <p> Last updated on: </p>
                <input v-model="lastUpdated" type="date" style= "width:40%" />
                <button class="primary" style="margin-left:5px"> Save </button>
              </div>
              <div>
                <label> Status: </label>
                <select v-model="selected" style= "width:40%">
                  <option>Done</option>
                  <option> In Progress </option>
                  <option>Not Done</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="fields">
              <h1> Monthly status, Report and Budget reports </h1>
              <div class="field">
                <p> Last updated on: </p>
                <input v-model="lastUpdated" type="date" style= "width:40%" />
                <button class="primary" style="margin-left:5px"> Save </button>
              </div>
              <div>
                <label> Status: </label>
                <select v-model="selected" style= "width:40%">
                  <option>Done</option>
                  <option> In Progress </option>
                  <option>Not Done</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="fields">
              <h1> Account health check </h1>
              <div class="field">
                <p> Last updated on: </p>
                <input v-model="lastUpdated" type="date" style= "width:40%" />
                <button class="primary" style="margin-left:5px"> Save </button>
              </div>
              <div>
                <label> Status: </label>
                <select v-model="selected" style= "width:40%">
                  <option>Done</option>
                  <option> In Progress </option>
                  <option>Not Done</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ClientEvents"
};
</script>

<style scoped></style>
