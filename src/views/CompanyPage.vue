<template>
  <div>
    <div class="column">
      <div class="card">
        <section>
          <ul class="tabs">
            <li>
              <router-link :to="`/company/${$route.params.id}`">
                <span>Profile</span>
              </router-link>
            </li>
            <li>
              <router-link :to="`/company/${$route.params.id}/clients`">
                <span>Clients</span>
              </router-link>
            </li>
            <li>
              <router-link :to="`/company/${$route.params.id}/events`">
                <span>Events</span>
              </router-link>
            </li>
          </ul>
        </section>
        <router-view :key="$route.path"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyPage"
};
</script>

<style scoped></style>
