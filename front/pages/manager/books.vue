<template>
  <div class="test">
    <h1>СТОРІНКА БРОНЮВАННЯ ЗНАХОДІТЬСЯ У РОЗРОБЦІ</h1>
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
  store.state.activeTabAuthUserMenu = "booksActive";
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
