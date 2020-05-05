<template>
  <form @submit.prevent="createEvent">
    <h1>Create Custom Event</h1>
    <div class="field field--half">
      <label>
        <span>Name</span>
        <input type="text" v-model="newEvent.name" required />
      </label>
    </div>
    <div class="field field--half">
      <label>
        <span>Date</span>
        <input type="date" max="2099-12-31" v-model="newEvent.date" required />
      </label>
    </div>
    <div class="field field--half">
      <label>
        <span>Time</span>
        <input type="time" v-model="newEvent.time" required />
      </label>
    </div>
    <div class="field field--half">
      <label>
        <span>Recur</span>
        <toggle-button
          :value="newEvent.recurringEvent"
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
          @change="changeRecurringEvent"
          sync
        />
      </label>
    </div>
    <div v-if="newEvent.recurringEvent" class="field field--half">
      <label>
        <span>Days Between Events</span>
        <input
          type="number"
          min="1"
          step="1"
          v-model.number="newEvent.daysBetween"
          required
        />
      </label>
    </div>
    <div class="field">
      <button class="primary">
        Save
      </button>
    </div>
    <div class="field">
      <button @click="cancel">Cancel</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "AddEvent",
  data() {
    return {
      newEvent: {
        name: "",
        date: "",
        time: "",
        recurringEvent: false,
        daysBetween: 1
      }
    };
  },
  methods: {
    createEvent() {
      const vm = this;
      vm.$emit("create-event", vm.newEvent);
    },
    changeRecurringEvent(e) {
      const vm = this;
      vm.newEvent.recurringEvent = e.value;
    },
    cancel() {
      const vm = this;
      vm.$emit("cancel-event");
    }
  }
};
</script>

<style scoped></style>
