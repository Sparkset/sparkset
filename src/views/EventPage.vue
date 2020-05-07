<template>
  <div>
    <div class="column">
      <div class="card">
        <section>
          <h1>{{ event.get("name") }}</h1>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "EventPage",
  data() {
    return {
      event: null
    };
  },
  created() {
    const vm = this;
    const eventQuery = new AV.Query("Event");
    const eventId = vm.$route.params.id;
    eventQuery
      .get(eventId)
      .then(event => {
        vm.event = event;
      })
      .catch(error => {
        alert(error);
      });
  }
};
</script>

<style scoped></style>
