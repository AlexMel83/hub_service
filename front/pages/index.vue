<template>
  <section class="coworkings-list">
    <div class="spaces-wrapper">
      <v-row>
        <v-col
          v-for="space in spacesDataApi"
          :key="space.id"
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="spaces-col"
        >
          <nuxt-link
            class="container"
            :to="'/coworking/' + space.id"
          >
            <div class="photo">
              <img :key="space.id" v-if="space.coworking_photo.includes(`../..`)" :src="`${space.coworking_photo}`" />
              <img v-else src="../assets/spaces_images/main-photo.jpg" />
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
                  v-for="advantage in selectedAdvantages(space.advantages)"
                  :key="advantage.name"
                  :src="advantage.icon"
                />
              </div>
              <div class="map">
                <a href="">
                  <img
                    src="./../assets/spaces_images/location-marker.png"
                    alt="local"
                  />
                </a>
                <a>{{ space.address }}</a>
              </div>
              <div class="icons-container up">
                <div class="time">
                  <img src="./../assets/spaces_images/time.svg" alt="time icon" />

                  {{ space.workday_start }} - {{ space.workday_end }}
                </div>
                <div class="money">
                  <img src="./../assets/spaces_images/money.svg" alt="money icon" />

                  {{ space.first_price }} грн / {{ space.last_price }} грн
                </div>
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
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const { $api } = useNuxtApp();
const isHovered = ref(false);
const spacesDataApi = ref([]);
const store = useStore();

const selectedAdvantages = (advantages) => {
  return advantages ? advantages.filter((advantage) => advantage.selected) : [];
};

onMounted(async () => {
  try {
    const response = await $api.get("/coworkings");
    spacesDataApi.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const roleManager = computed(() => store.state.roleManager);
</script>


<style scoped>
@import "./../assets/css/style.css";
.coworkings-list {
  background-color: var(--space-bg-mob);
}
.spaces-wrapper {
  margin: 0 auto;
  min-height: 100vh;
  padding: 24px 0;
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
  margin-top: 10px;
  border: 2px solid transparent;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
}

.btn:active {
  border: 2px solid var(--icons-contact-bg);
  background-color: var(--header-bg);
}

.v-btn {
  letter-spacing: normal;
}

a {
  text-decoration: none;
  color: var(--text-color);
}

@media (min-width: 1024px) {
  .spaces-wrapper {
    padding: 40px;
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
}
</style>
