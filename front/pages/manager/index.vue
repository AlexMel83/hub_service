<template>
  <div class="manager-main">
    <div class="manager-menu">
      <managerMenu coworkingActive="true" />
    </div>
    <div class="about-coworking">
      <coworking />
    </div>
  </div>
</template>

<script setup>
import managerMenu from "~/pages/manager/managerMenu.vue";
import coworking from "~/pages/manager/coworking.vue";

definePageMeta({
  layout: "manager",
});
</script>

<style>
.manager-menu {
  display: none;
}
.about-coworking {
  padding: 0px 16px;
}

@media (min-width: 768px) {
  .manager-main {
    display: flex;
    flex-direction: row;
    padding: 50px 10px;
  }

  .manager-main .manager-menu {
    display: block;
    padding: 40px 0;
  }

  .about-coworking {
    border: 1px solid var(--text-color);
    width: 100%;
    height: 100%;
    padding: 0px 24px;
  }
}

@media (min-width: 1024px) {
  .manager-main {
    padding: 50px 6.46%;
  }

  .manager-main .manager-menu {
    padding: 40px 0 40px 2.78%;
  }
}
</style>
