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
      <div>
        <router-link :to="`/company/${company.id}`">
          {{ company.get("name") }}
        </router-link>
      </div>
      <div>
        <a
          class="social"
          v-if="company.get('linkedin')"
          :href="company.get('linkedin')"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>
        <a
          class="social"
          v-if="company.get('facebook')"
          :href="company.get('facebook')"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'facebook-square']" />
        </a>
        <a
          class="social"
          v-if="company.get('instagram')"
          :href="company.get('instagram')"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'instagram-square']" />
        </a>
      </div>
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
.social {
  margin-right: 4px;
  opacity: 0.6;
}
.social:hover {
  opacity: 1;
}
</style>
