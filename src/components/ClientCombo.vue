<template>
  <span class="combo">
    <img
      :src="
        client.get('picture')
          ? client.get('picture').url()
          : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
      "
    />
    <span>
      <span>
        <router-link :to="`/client/${client.id}`">
          {{ client.get("fullName") }}
        </router-link>
        <br>
        <a
          class="social"
          v-if="client.get('linkedin')"
          :href="`https://www.linkedin.com/in/${client.get('linkedin')}`"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>
      </span>
      <br />
      <span class="nickname">
        {{ client.get("nickname") }}
      </span>
    </span>
  </span>
</template>

<script>
import AV from "leancloud-storage";
export default {
  name: "ClientCombo",
  props: {
    client: AV.Object
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
}
.nickname {
  font-size: 9pt;
  opacity: 0.6;
}
</style>
