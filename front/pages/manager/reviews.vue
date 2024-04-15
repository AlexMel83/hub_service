<template>
  <div class="about-coworking test">
    <h1>СТОРІНКА ВІДГУКІВ ЗНАХОДІТЬСЯ У РОЗРОБЦІ</h1>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
const store = useStore();

definePageMeta({
  layout: "layout-auth-users",
});

function setManagerData() {
  if (localStorage.getItem("managerData")) {
    store.commit(
      "setManagerData",
      JSON.parse(localStorage.getItem("managerData")),
    );
  }
  store.state.activeTabAuthUserMenu = "reviewsActive";
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
