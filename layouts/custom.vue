<template>
  <div class="home-page">
    <TheHeader />

    <NuxtPage></NuxtPage>

    <TheFooter />
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import TheFooter from "../components/TheFooter.vue";
export default {
  components: {
    TheHeader,
    TheFooter,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style>
.home-page {
  width: 100%;
  margin: 0 auto;
  background-image: url("~/assets/main_background.jpg");
  background-size: cover;
}
</style>