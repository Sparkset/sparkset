<template>
  <div>
    <div class="column column--right">
      <div class="card card--center">
        <section class="fields">
          <div class="field">
            <div
              id="image"
              tabindex="0"
              @click="$refs.picturesInput.click()"
              @keypress.enter="$refs.picturesInput.click()"
            >
              <img
                :src="
                  client.get('picture')
                    ? client.get('picture').url()
                    : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                "
                alt="The picture of the client."
              />
              <span>Edit</span>
            </div>
            <input type="file" @change="uploadPicture" ref="picturesInput" />
          </div>
          <div class="field">
            <p>
              Since
              {{
                client.createdAt
                  ? client.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                  : undefined
              }}
            </p>
          </div>
        </section>
      </div>
    </div>
    <div class="column column--left">
      <div class="card">
        <section>
          <ul class="tabs">
            <li>
              <router-link :to="`/client/${$route.params.id}`">
                <span>Profile</span>
              </router-link>
            </li>
            <li>
              <router-link :to="`/client/${$route.params.id}/events`">
                <span>Events</span>
              </router-link>
            </li>
            <li>
              <router-link :to="`/client/${$route.params.id}/preferences`">
                <span>Preferences</span>
              </router-link>
            </li>
            <li>
              <router-link :to="`/client/${$route.params.id}/files`">
                <span>Files</span>
              </router-link>
            </li>
            <li>
              <router-link :to="`/client/${$route.params.id}/clientNotes`">
                <span>Client Notes</span>
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
import AV from "leancloud-storage";
export default {
  name: "ClientPage",
  data() {
    return {
      client: new AV.Object("Client").set("company", new AV.Object("Company"))
    };
  },
  created() {
    const vm = this;
    const clientQuery = new AV.Query("Client");
    clientQuery
      .include("company")
      .get(vm.$route.params.id)
      .then(client => {
        vm.client = client;
      })
      .catch(error => {
        alert(error);
      });
  },
  methods: {
    uploadPicture() {
      const vm = this;
      if (vm.$refs.picturesInput.files.length) {
        const picture = vm.$refs.picturesInput.files[0];
        const file = new AV.File(picture.name, picture);
        vm.client.set("picture", file);
      }
      vm.client
        .save()
        .then(client => {
          vm.client = client;
          vm.$refs.picturesInput.value = "";
        })
        .catch(error => {
          alert(error);
        });
		}
  }
};
</script>

<style scoped>
#image {
  position: relative;
  display: inline-block;
  margin: 16px auto 0 auto;
  width: 128px;
  height: 128px;
  border-radius: 64px;
  overflow: hidden;
  cursor: pointer;
}
#image > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
#image > span {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 32px;
  background-color: #00000099;
  color: #fff;
  line-height: 28px;
  text-align: center;
}
#image:focus > span,
#image:hover > span {
  background-color: #000000cc;
}
#image + input[type="file"] {
  display: none;
}
</style>
