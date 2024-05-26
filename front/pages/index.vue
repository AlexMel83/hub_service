<template>
  <section class="search">
    <v-row class="mb-4 search-wrapper">
      <v-col cols="12">
        <v-text-field
          v-model="searchTerm"
          label="Пошук по назві коворкінга"
          outlined
          dense
          bg-color="white"
          prepend-inner-icon="mdi-magnify"
          class="custom-search-input"
          variant="solo"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
  </section>
  <section class="coworkings-list" :class="{ blurred: isMenuOpen }">
    <div class="spaces-wrapper">
      <v-row>
        <v-col
          v-for="space in filteredSpaces"
          :key="space.id"
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="spaces-col"
        >
          <nuxt-link class="container" :to="'/coworking/' + space.id">
            <div class="photo">
              <img
                v-if="space.coworking_photo"
                :src="`${baseURL}/${space.coworking_photo}`"
              />
              <img v-else src="./../public/default-coworking.png" />
              <div class="rating">
                <v-rating
                  readonly
                  :length="5"
                  size="x-small"
                  density="comfortable"
                  :model-value="4"
                  color="#AF3800"
                  background-color="white"
                  active-color="#AF3800"
                  class="custom-rating"
                />
              </div>
              <div class="title">
                <h2 class="space-title">{{ space.coworking_name }}</h2>
              </div>
            </div>
            <div class="info-card">
              <div class="icons-container down">
                <img
                  v-for="advantage in space.advantages.slice(0, 7)"
                  :key="advantage.name"
                  :title="advantage.description"
                  :src="`${baseURL}/${advantage.icon}`"
                />
                <v-icon
                  v-if="space.advantages.length > 7"
                  color="var(--header-bg)"
                  class="dots-icon"
                  >mdi-dots-horizontal</v-icon
                >
              </div>
              <div class="map" @click.stop v-if="space.address">
                <a
                  :href="
                    'https://maps.google.com/?q=' +
                    encodeURIComponent(space.address)
                  "
                  target="_blank"
                >
                  <img
                    src="~assets/spaces_images/location-marker.png"
                    alt="local"
                  />
                  <span>{{ space.address }}</span>
                </a>
              </div>
              <div class="icons-container up">
                <div
                  class="time"
                  v-if="space.workday_start && space.workday_end"
                >
                  <img src="~assets/spaces_images/time.svg" alt="time icon" />

                  {{ space.workday_start }} - {{ space.workday_end }}
                </div>
                <!-- <div class="money">
                  <img src="~assets/spaces_images/money.svg" alt="money icon" />

                  {{ space.first_price }} грн / {{ space.last_price }} грн
                </div> -->
              </div>
              <nuxt-link
                :to="'/coworking/' + space.id"
                class="btn"
                :class="{ visible: isHovered }"
              >
                Переглянути
              </nuxt-link>
            </div>
          </nuxt-link>
        </v-col>
      </v-row>
      <v-pagination
        v-model="page"
        :length="Math.ceil(spacesDataApi.length / perPage)"
        rounded="0"
        color="#1A679A"
        class="custom-pagination"
      ></v-pagination>
      <Map :coworkings="spacesDataApi || []" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";

const { $api } = useNuxtApp();
const isHovered = ref(false);
const spacesDataApi = ref([]);
const store = useStore();
const baseURL = $api.defaults.baseURL;
const searchTerm = ref("");
const page = ref(1);
const perPage = 12;

onMounted(async () => {
  await fetchCoworkings();
  await getAllAdvantages();
});

watch(searchTerm, async (newValue) => {
  await fetchCoworkings(newValue);
});

const fetchCoworkings = async (searchQuery = null) => {
  try {
    let url = "/coworkings";
    if (searchQuery) {
      url += `?name=${searchQuery}`;
    }
    const response = await $api.get(url);
    spacesDataApi.value = response.data.filter(
      (space) => space.published === true,
    );
  } catch (error) {
    console.error("Error fetching coworkings data:", error);
  }
};

const filteredSpaces = computed(() => {
  const lowerCaseSearchTerm = searchTerm.value
    ? searchTerm.value.toLowerCase()
    : "";
  const startIndex = (page.value - 1) * perPage;
  const endIndex = startIndex + perPage;
  return spacesDataApi.value
    .filter((space) =>
      space.coworking_name.toLowerCase().includes(lowerCaseSearchTerm),
    )
    .slice(startIndex, endIndex);
});

const roleManager = computed(() => store.state.roleManager);

const isMenuOpen = computed(() => store.state.isMenuOpen);

const getAllAdvantages = async () => {
  try {
    const response = await $api.get("/advantages");
    store.commit("setAllAdvantages", response.data);
  } catch (error) {
    console.error("An error occurred while fetching advantages:", error);
  }
};
</script>

<style scoped>
@import "../assets/src/styles.css";

.blurred {
  filter: blur(5px);
  pointer-events: none;
}

.search {
  background-color: var(--header-bg);
  display: flex;
  justify-content: center;
  align-items: center;
}

.coworkings-list {
  background-color: var(--space-bg-mob);
}

.spaces-wrapper {
  margin: 0 auto;
  min-height: 100vh;
  padding: 24px 0px;
}

.search-wrapper {
  padding: 0 16px;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 20px;
  background: var(--white-color);
  width: 92%;
  margin: 0 auto;
  margin-bottom: 50px;
}

.photo {
  width: 100%;
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rating {
  position: absolute;
  right: 0px;
  top: 20px;
  display: flex;
  padding: 4px 8px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 20px 0px 0px 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
}

.grecaptcha-badge {
  display: none !important;
}

.space-title {
  text-align: center;
  padding: 5px;
  font-size: 20px;
}

.title {
  display: flex;
  width: 92%;
  max-width: 316px;
  padding: 4px 24px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 0px 20px 20px 0px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  position: absolute;
  left: -1px;
  bottom: 20px;
}

.info-card {
  padding: 16px 3px 30px 3px;
  position: relative;
}

.icons-container.up {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
  color: var(--black-color);
}

.icons-container.up img {
  margin-right: 7px;
}

.time,
.money {
  display: flex;
  align-items: center;
}

.icons-container.down {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
  margin-bottom: 16px;
  padding: 4px 0;
  min-height: 32px;
}

.icons-container.down img {
  width: 27px;
  height: 26px;
  margin-right: 10px;
  border-radius: 4px;
  background-color: var(--header-bg);
}

.map {
  display: flex;
  margin-bottom: 10px;
}

.map img {
  width: 25px;
  height: 25px;
}

.map a {
  display: flex;
  align-items: center;
  column-gap: 7px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
}

.btn {
  text-transform: capitalize;
  font-size: 18px;
  line-height: normal;
  border-radius: 4px;
  background-color: var(--header-bg);
  color: var(--white-color);
  display: flex;
  width: 182px;
  padding: 6px 14px;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translate(-50%, 0%);
}

.btn:active {
  border: 2px solid var(--icons-contact-bg);
  background-color: var(--header-bg);
}

a {
  text-decoration: none;
  color: var(--text-color);
}

.custom-search-input {
  margin-top: 40px;
}

.icons-container .down {
  position: relative;
}

.dots-icon::before {
  position: absolute;
  bottom: -30%;
  left: 50%;
  transform: translateX(-50%);
}

@media (min-width: 768px) {
  .blurred {
    filter: none;
    pointer-events: auto;
  }
}

@media (min-width: 1024px) {
  .spaces-wrapper {
    padding: 40px;
  }

  .search {
    padding: 0 40px;
  }

  .search-wrapper {
    padding: 0 8px;
  }

  .spaces-col {
    padding: 0;
    margin: 0;
  }

  .title {
    width: 75%;
  }

  .btn {
    opacity: 0;
  }

  .photo {
    height: 274px;
  }

  .btn:hover {
    background-color: var(--btn-border);
  }

  .container {
    margin-bottom: 40px;
    width: 95%;
  }

  .container:hover .btn {
    opacity: 1;
  }

  .info-card {
    padding: 24px 24px 32px;
    min-height: 174px;
  }

  .icons-container.down img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }
}

@media (min-width: 1440px) {
  .spaces-wrapper {
    padding: 40px 65px;
  }

  .search {
    padding: 0 65px;
  }
}
</style>
