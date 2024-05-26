<template>
  <div v-if="!isLoading()" style="min-height: 100vh">
    <Loader />
  </div>
  <div v-else class="about-coworking test">
    <h1>СТОРІНКА ВІДГУКІВ ЗНАХОДІТЬСЯ У РОЗРОБЦІ</h1>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
const store = useStore();

definePageMeta({
  layout: "layout-auth-users",
});
const isLoading = () => store.state.isLoading;
function setManagerData() {
  if (localStorage.getItem("managerData")) {
    store.commit(
      "setManagerData",
      JSON.parse(localStorage.getItem("managerData")),
    );
  }
  store.state.activeTabAuthUserMenu = "reviewsActive";
  store.state.isLoading = true;
}

onMounted(() => {
  setManagerData();
});
</script>

<style>
.test {
  height: 100vh;
}
</style>
