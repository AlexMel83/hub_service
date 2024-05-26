<template>
  <div v-if="!isLoading" style="min-height: 100vh">
    <Loader />
  </div>
  <div>
    <Current v-if="manager" />
    <Create v-else />
  </div>
</template>

<script>
import Current from "~/pages/manager/coworking/current.vue";
import Create from "~/pages/manager/coworking/create.vue";
import Loader from "~/components/Loader.vue";

definePageMeta({
  layout: "layout-auth-users",
});

export default {
  components: { Current, Create, Loader },
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
    isLoading() {
      return this.$store.state.isLoading;
    },
  },
  methods: {
    async getData() {
      const { $api } = useNuxtApp();

      try {
        const response = await $api.get(
          `/coworkings?user_id=${this.authUser.id}`,
        );
        this.$store.commit("getManagerData", response.data[0]);
        this.$store.state.activeTabAuthUserMenu = "coworkingActive";
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = true;
      }
    },
  },
};
</script>
