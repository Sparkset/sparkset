<template>
  <section class="fields">
    <h1>Adding Event</h1>
    <form @submit.prevent="go">
      <div class="field field--half">
        <label>
          <span>Event Name</span>
          <input v-model="eventName" type="text" />
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Last Updated</span>
          <input v-model="lastUpdated" type="date" />
        </label>
      </div>
    </form>
    <div class="field">
      <button class="primary">Add</button>
    </div>
  </section>
</template>
