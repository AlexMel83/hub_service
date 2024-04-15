<template>
  <div class="user-test" style="min-height: 100vh">
    <h1>User History</h1>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
const store = useStore();

definePageMeta({
  layout: "layout-auth-users",
});

function setUserData() {
  if (localStorage.getItem("userData")) {
    store.commit("setUserData", JSON.parse(localStorage.getItem("userData")));
  }
  store.state.activeTabAuthUserMenu = "historyActive";
}

onMounted(() => {
  setUserData();
});
</script>
