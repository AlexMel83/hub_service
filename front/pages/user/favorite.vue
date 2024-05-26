<template>
  <div class="booking-wrapper" style="min-height: 100vh">
    <h2 v-if="isLoad()">Збережені простори</h2>
    <Loader v-if="isLoading" />
    <v-table class="booking-table" v-if="favorites.length > 0">
      <thead>
        <tr>
          <th>Простір</th>
          <th>Коворкінг</th>
          <th>Адреса</th>
          <th>Забронювати</th>
          <th>Видалити</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="favorite in favorites" :key="favorite.id">
          <td>
            <a :href="`/coworking/${favorite.coworking_id}`" target="_blank">{{
              favorite.space_name
            }}</a>
          </td>
          <td>
            <a :href="`/coworking/${favorite.coworking_id}`" target="_blank">{{
              favorite.coworking_name
            }}</a>
          </td>
          <td>
            <a
              :href="`https://maps.google.com/?q=${favorite.address}`"
              target="_blank"
              >{{ favorite.address }}</a
            >
          </td>
          <td>
            <v-btn @click="openBookSpace(favorite.id, favorite.first_price)"
              >Забронювати</v-btn
            >
          </td>
          <td>
            <v-btn @click="deleteFavorite(favorite)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div v-if="favorites.length === 0 && !isLoading">
      <p v-if="isLoad()">Нажаль у Вас ще нема просторів у збереженому.</p>
    </div>
    <ModalComponents @closeModal="closeModal" />
  </div>
</template>

<script setup>
import Loader from "~/components/Loader.vue";
import ModalComponents from "~/components/modal/ModalComponents.vue";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";

const store = useStore();
const favorites = ref([]);
const bus = useNuxtApp().$bus;
const isLoading = ref(false);
const isLoad = () => store.state.isLoading;

definePageMeta({
  layout: "layout-auth-users",
});

async function setUserData() {
  if (localStorage.getItem("userData")) {
    store.commit("setUserData", JSON.parse(localStorage.getItem("userData")));
  }
  store.state.activeTabAuthUserMenu = "favoriteActive";
}

async function getFavoritesData() {
  isLoading.value = true;
  try {
    const { $api } = useNuxtApp();
    if (store.state.authUser && store.state.authUser.role === "user") {
      const response = await $api.get(
        `/favorites?userId=${store.state.authUser.id}`,
      );
      if (Array.isArray(response.data)) {
        const favoritePromises = response.data.map(async (favorite) => {
          favorite.space_name = favorite.space_name || "Unknown Space";
          favorite.coworking_name =
            favorite.coworking_name || "Unknown Coworking";
          favorite.address = favorite.coworking_address || "Unknown Address";
          return favorite;
        });

        favorites.value = await Promise.all(favoritePromises);
      } else {
        console.error("Response data is not an array:", response.data);
        favorites.value = [];
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    store.state.isLoading = true;
    isLoading.value = false;
  }
}

const deleteFavorite = async (favorite) => {
  try {
    const { $api } = useNuxtApp();
    await $api.delete(`/favorites?spaceId=${favorite.space_id}`);
    const userFavorites = JSON.parse(localStorage.getItem("userFavorites"));
    if (Array.isArray(userFavorites)) {
      const updatedFavorites = userFavorites.filter(
        (fav) => fav.spaceId !== favorite.space_id,
      );
      saveFavoritesToLocalStorage(updatedFavorites);
    }
    getFavoritesData();
  } catch (error) {
    console.error(error);
  }
};

const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem("userFavorites", JSON.stringify(favorites));
};

const openBookSpace = (id, price) => {
  store.state.currentBookSpace.id = id;
  store.state.currentBookSpace.price = price;
  bus.$emit("Modal", {
    showBookSpace: true,
    openModal: true,
  });
};

const closeModal = () => {
  document.body.style.position = "";
};

onMounted(() => {
  setUserData();
  getFavoritesData();
});
</script>

<style scoped>
.booking-wrapper h2 {
  margin: 32px;
  font-size: 24px;
  padding-top: 0;
  font-weight: 900;
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
}

.booking-table th,
.booking-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.booking-table th {
  background-color: var(--book-form);
  color: var(--white-color);
}

.booking-table a:hover {
  text-decoration: underline;
}
</style>
