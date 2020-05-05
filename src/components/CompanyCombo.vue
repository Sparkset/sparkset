<template>
  <span class="combo">
    <img
      :src="
        company.get('picture')
          ? company.get('picture').url()
          : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
      "
    />
    <span>
      <span>
        <router-link :to="`/company/${company.id}`">
          {{ company.get("name") }}
        </router-link>
        <a
          v-if="company.get('linkedin')"
          :href="`https://www.linkedin.com/company/${company.get('linkedin')}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>
      </span>
    </span>
  </span>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "CompanyCombo",
  props: {
    company: AV.Object
  }
};
</script>

<style scoped>
.combo {
  display: flex;
  align-items: center;
}
.combo > img {
  margin: 0 1rem 0 0;
  border-radius: 50%;
  width: 30pt;
  height: 30pt;
  object-fit: cover;
}
</style>
