<template>
    <section class="fields">
    <h1> ADDING EVENT </h1>
    <form @submit.prevent="go">
      <div class="field field--half">
        <label>
          <span>Event Name</span>
          <input v-model="eventName" type="text" /> <!--required :disabled="!editing"-->
        </label>
      </div>
      <div class="field field--half">
        <label>
          <span>Last Updated</span>
          <input v-model="lastUpdated" type="date" /> <!-- :disabled="!editing" -->
        </label>
      </div>
    </form>
    <div class="field">
        <button class="primary"> Add </button>
    </div>
    <!-- <div v-if="!editing" class="field">
      <button @click="editing = true">
        Edit
      </button>
    </div> -->
  </section>
</template>