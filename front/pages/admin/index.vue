<template>
  <!-- <adminCoworking v-if="admin" /> -->
  <div class="test">
    <h1>Сторінка адміна</h1>
  </div>
  <v-data-table :headers="headers" :items="desserts" class="elevation-1">
    <template v-slot:no-data>
      <v-alert :value="true" color="error" icon="warning">
        Sorry, nothing to display here :(
      </v-alert>
    </template>
  </v-data-table>
</template>

<script setup>
definePageMeta({
  layout: "layout-auth-users",
});
</script>
<style>
.test {
  height: 100vh;
}
</style>
