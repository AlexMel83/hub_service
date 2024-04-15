<template>
  <div>
    <Current v-if="manager" />
    <Create v-else />
  </div>
</template>

<script>
import Current from "~/pages/manager/coworking/current.vue";
import Create from "~/pages/manager/coworking/create.vue";

definePageMeta({
  layout: "layout-auth-users",
});

export default {
  components: { Current, Create },
  data() {
    return {};
  },

  mounted() {
    this.getData();
  },
  computed: {
    manager() {
      return this.$store.state.manager;
    },
    authUser() {
      return this.$store.state.authUser;
    },
  },
  methods: {
    getData() {
      const { $api } = useNuxtApp();

      try {
        $api.get(`/coworkings?user_id=${this.authUser.id}`).then((response) => {
          this.$store.commit("getManagerData", response.data[0]);
          this.$store.state.activeTabAuthUserMenu = "coworkingActive";
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
