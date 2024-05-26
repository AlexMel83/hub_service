<template>
  <div
    class="coworking-page animate-slide-from-header"
    :class="{ blurred: isMenuOpen }"
  >
    <div class="main">
      <div class="main-wrapper block">
        <div class="mob-main">
          <h1>{{ item.coworking_name }}</h1>
          <div class="main-photo-mob">
            <img
              v-if="item.coworking_photo"
              :src="`${baseURL}/${item.coworking_photo}`"
              class="photo"
              alt="coworking photo"
            />
            <img
              v-else
              src="./../../public/default-coworking.png"
              alt="coworking photo"
              class="photo"
            />
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
          </div>
        </div>
        <div class="desktop-main">
          <div class="main-box flex">
            <div class="left">
              <h1>{{ item.coworking_name }}</h1>
              <div class="main-photo">
                <img
                  v-if="item.coworking_photo"
                  :src="`${baseURL}/${item.coworking_photo}`"
                  class="photo"
                  alt="coworking photo"
                />
                <img
                  v-else
                  src="./../../public/default-coworking.png"
                  alt="coworking photo"
                  class="photo"
                />
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
              </div>
            </div>
            <div class="right">
              <div
                class="time flex"
                v-if="
                  item.workday_start &&
                  item.workday_end &&
                  item.dayoff_start &&
                  item.dayoff_end
                "
              >
                <div>
                  <img src="~assets/spaces_images/clock-white.svg" alt="time" />
                </div>
                <div class="time-info">
                  <p class="weekday">
                    Пн-Пт
                    <span class="big"
                      >{{ item.workday_start }} - {{ item.workday_end }}</span
                    >
                  </p>
                  <p class="weekend">
                    Сб-Нд
                    <span class="big"
                      >{{ item.dayoff_start }} - {{ item.dayoff_end }}</span
                    >
                  </p>
                </div>
              </div>
              <div class="contacts-box">
                <div class="tel" v-if="item.phone">
                  <a :href="'tel:' + item.phone" class="contact">
                    <img src="~assets/spaces_images/phone-white.svg" />
                    {{ item.phone }}
                  </a>
                </div>

                <div class="email" v-if="item.email">
                  <a
                    :href="'mailto:' + item.email"
                    target="_blank"
                    class="contact"
                  >
                    <img src="~assets/spaces_images/email-white.svg" />
                    {{ item.email }}
                  </a>
                </div>

                <div class="map" v-if="item.address">
                  <a
                    :href="
                      'https://maps.google.com/?q=' +
                      encodeURIComponent(item.address)
                    "
                    target="_blank"
                    class="contact"
                  >
                    <img
                      class="location-img"
                      src="~assets/spaces_images/location-white.svg"
                      alt="local"
                    />
                    <span class="address">{{ item.address }}</span>
                  </a>
                </div>
                <div class="social">
                  <div v-for="socialItem in item.social" :key="socialItem.name">
                    <a :href="socialItem.link" target="_blank">
                      <img
                        :src="'../' + socialItem.src"
                        :alt="socialItem.name"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="coworking-wrapper">
      <div class="info block">
        <div
          class="time flex"
          v-if="
            item.workday_start &&
            item.workday_end &&
            item.dayoff_start &&
            item.dayoff_end
          "
        >
          <div>
            <img src="~assets/spaces_images/clock-black.svg" alt="time" />
          </div>
          <div class="time-info">
            <p class="weekday">
              Пн-Пт {{ item.workday_start }} - {{ item.workday_end }}
            </p>
            <p class="weekend">
              Сб-Нд {{ item.dayoff_start }} - {{ item.dayoff_end }}
            </p>
          </div>
        </div>
        <div class="tel" v-if="item.phone">
          <a :href="'tel:' + item.phone" class="flex">
            <img src="~assets/spaces_images/phone-black.svg" />
            {{ item.phone }}
          </a>
        </div>
        <div class="email" v-if="item.email">
          <a :href="'mailto:' + item.email" target="_blank" class="flex">
            <img src="~assets/spaces_images/email-black.svg" />
            {{ item.email }}
          </a>
        </div>
        <div class="map" v-if="item.address">
          <a
            :href="
              'https://maps.google.com/?q=' + encodeURIComponent(item.address)
            "
            target="_blank"
            class="flex"
          >
            <img
              class="location-img"
              src="~assets/spaces_images/location-black.svg"
              alt="local"
            />
            {{ item.address }}
          </a>
        </div>
        <div class="social">
          <div v-for="socialItem in item.social" :key="socialItem.name">
            <a :href="socialItem.link" target="_blank">
              <img :src="'../' + socialItem.src" :alt="socialItem.name" />
            </a>
          </div>
        </div>
      </div>
      <div class="about" v-if="item.description">
        <div class="block">
          <h2 class="title">Про нас</h2>
          <p class="description">{{ item.description }}</p>
        </div>
      </div>
      <div
        class="services block"
        v-if="item && item.advantages && item.advantages.length > 0"
      >
        <h2 class="title">
          Безкоштовні послуги<br />
          (включені у вартість)
        </h2>
        <h2 class="title-desk">Безкоштовні послуги (включені у вартість)</h2>
        <div
          class="services-wrapper"
          :class="{
            'two-rows': item.advantages.length > 4,
          }"
        >
          <div
            class="services-box flex"
            v-for="advantage in item.advantages"
            :key="advantage.name"
          >
            <img
              :src="`${baseURL}/${advantage.icon}`"
              :alt="advantage.name"
              :title="advantage.description"
            />
            <p>{{ advantage.name }}</p>
          </div>
        </div>
      </div>
      <div class="spaces block" v-if="item.spaces && item.spaces.length > 0">
        <h2 class="title">Простори</h2>
        <v-row class="spaces-row">
          <v-col
            v-for="space in item.spaces"
            :key="space.space_name"
            cols="12"
            sm="12"
            md="6"
            lg="4"
            xl="4"
            class="spaces-col"
          >
            <div class="card spaces-box">
              <div class="photo">
                <img
                  v-if="space.space_photo"
                  :src="`${baseURL}/${space.space_photo}`"
                  class="space-img"
                  :alt="space.space_name"
                />
                <img
                  v-else
                  src="./../../public/default-space.jpg"
                  alt="space photo"
                />
                <div class="places" v-if="space.amount">
                  {{ formatSeats(space.amount) }}
                </div>

                <div class="favorite" v-if="authUser().role === 'user'">
                  <v-tooltip
                    :text="
                      space.isFavorite
                        ? 'Видалити зі збереженого'
                        : 'Додати в збережені'
                    "
                  >
                    <template v-slot:activator="{ props }">
                      <v-btn @click="toggleFavorite(space)" v-bind="props">
                        <v-icon :color="space.isFavorite ? '#AF3800' : ''"
                          >mdi-heart</v-icon
                        >
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </div>
              <div class="space-info">
                <p class="space-name">{{ space.space_name }}</p>
                <p
                  class="space-description"
                  :class="{ expanded: space.showFullDescription }"
                >
                  {{
                    space.showFullDescription
                      ? space.description
                      : space.description &&
                          space.description.length > maxLength
                        ? space.description.substring(0, maxLength) + "..."
                        : space.description
                  }}
                  <span
                    v-if="
                      space.description &&
                      space.description.length > maxLength &&
                      !space.showFullDescription
                    "
                    class="read-more-link"
                    @click="toggleDescription(space)"
                    >Читати далі</span
                  >
                  <span
                    v-else-if="space.showFullDescription"
                    class="read-more-link"
                    @click="toggleDescription(space)"
                    >Згорнути</span
                  >
                </p>
                <p class="space-price" v-if="space.first_price">
                  Ціна за 1 год <span>{{ space.first_price }}</span> грн
                </p>
                <p class="space-price" v-else>Ціна не вказана</p>
                <div class="box-book-button">
                  <v-btn
                    class="book-button"
                    @click="openBookModal"
                    v-if="item.coworking_name == 'EduHUB'"
                    >Забронювати</v-btn
                  >
                  <v-btn
                    class="book-button"
                    v-else
                    @click="
                      openBookSpace(space.id, space.first_price, space.amount)
                    "
                    >Забронювати</v-btn
                  >
                  <ModalComponents @closeModal="closeModal" />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <Review />
  </div>
</template>

<script setup>
import Review from "~/components/Review.vue";
import ModalComponents from "~/components/modal/ModalComponents.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const { $api } = useNuxtApp();

const item = ref({});
const route = useRoute();
const router = useRouter();
const bus = useNuxtApp().$bus;
const baseURL = $api.defaults.baseURL;
const store = useStore();

const coworkingId = route.params.id;

const maxLength = 30;

const authUser = () => {
  return store.state.authUser;
};
onMounted(async () => {
  try {
    const response = await $api.get(`/coworkings?id=${coworkingId}`);
    const coworking = response.data;
    if (!coworking.published) {
      await router.push("/error");
      return;
    }
    item.value = coworking;
    item.value.social = JSON.parse(item.value.social);

    for (let space of item.value.spaces) {
      space.isFavorite =
        localStorage.getItem(`favorite_${space.id}`) === "true";
      space.color = localStorage.getItem(`favorite_color_${space.id}`) || "";
    }

    await getAndSaveFavoritesData(store.state.authUser.role);

    const userFavorites =
      JSON.parse(localStorage.getItem("userFavorites")) || [];
    for (let space of item.value.spaces) {
      const favorite = userFavorites.find(
        (favorite) => favorite.spaceId === space.id,
      );
      if (favorite) {
        space.isFavorite = favorite.isFavorite;
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const openBookModal = () => {
  document.body.style.position = "fixed";
  bus.$emit("Modal", {
    showBook: true,
    openModal: true,
  });
};

const openBookSpace = (id, price, amount) => {
  //   document.body.style.position = "fixed";
  store.state.currentBookSpace.id = id;
  store.state.currentBookSpace.price = price;
  store.state.currentBookSpace.amount = amount;
  bus.$emit("Modal", {
    showBookSpace: true,
    openModal: true,
  });
};
const closeModal = () => {
  document.body.style.position = "";
};

const isMenuOpen = computed(() => store.state.isMenuOpen);

const formatSeats = (count) => {
  if ((count % 100 >= 11 && count % 100 <= 19) || count % 10 === 0) {
    return `${count} місць`;
  } else if (count % 10 === 1) {
    return `${count} місце`;
  } else if (count % 10 >= 2 && count % 10 <= 4) {
    return `${count} місця`;
  } else {
    return `${count} місць`;
  }
};

const toggleDescription = (space) => {
  space.showFullDescription = !space.showFullDescription;
};

const toggleFavorite = async (space) => {
  try {
    if (!space.isFavorite) {
      await addToFavorites(space);
      space.isFavorite = true;
    } else {
      await removeFromFavorites(space);
      space.isFavorite = false;
    }
  } catch (error) {
    console.error("Помилка при перемиканні збереженого:", error);
  }
};

const addToFavorites = async (space) => {
  try {
    await $api.post(`/favorites?spaceId=${space.id}`);
    const updatedFavorites = [
      ...JSON.parse(localStorage.getItem("userFavorites")),
      { spaceId: space.id },
    ];
    saveFavoritesToLocalStorage(updatedFavorites);
  } catch (error) {
    console.error("Помилка при додаванні простору до збереженого:", error);
  }
};

const removeFromFavorites = async (space) => {
  try {
    await $api.delete(`/favorites?spaceId=${space.id}`);
    const updatedFavorites = JSON.parse(
      localStorage.getItem("userFavorites"),
    ).filter((fav) => fav.spaceId !== space.id);
    saveFavoritesToLocalStorage(updatedFavorites);
  } catch (error) {
    console.error("Помилка при видаленні простору зі збереженого:", error);
  }
};

const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem("userFavorites", JSON.stringify(favorites));
};

async function getAndSaveFavoritesData(userRole) {
  try {
    if (userRole === "user") {
      const { $api } = useNuxtApp();
      const response = await $api.get(
        `/favorites?userId=${store.state.authUser.id}`,
      );
      if (Array.isArray(response.data)) {
        const favoritesData = response.data.map((favorite) => ({
          spaceId: favorite.space_id,
          isFavorite: true,
        }));
        saveFavoritesToLocalStorage(favoritesData);
      } else {
        console.error("Response data is not an array:", response.data);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
@import "~/assets/src/styles.css";

.blurred {
  filter: blur(5px);
  pointer-events: none;
}

.modal-registration-wrapper {
  background-color: rgba(9, 39, 59, 0.2);
}

.coworking-page {
  background-color: var(--space-bg-mob);
  font-family: "Inter", sans-serif;
}

.coworking-wrapper {
  max-width: 500px;
  margin: 0 auto;
}

.main {
  background-color: var(--header-bg);
}

.main-wrapper {
  display: flex;
  flex-direction: column;
}

.block {
  padding: 24px 16px;
}

.desktop-main {
  display: none;
}

.main h1 {
  color: var(--white-color);
  text-align: center;
  font-size: 32px;
  margin-bottom: 24px;
  font-weight: 400;
}

.main-photo-mob {
  position: relative;
  max-width: 432px;
  margin: 0 auto;
}

.rating {
  position: absolute;
  left: 0px;
  top: 15px;
  display: flex;
  padding: 4px 8px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 0px 20px 20px 0px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
}

.main .photo {
  width: 100%;
  height: auto;
  aspect-ratio: 1.7 / 1;
  object-fit: cover;
  object-position: center;
  border-radius: 20px;
  border: 2px solid var(--line-color);
  overflow: hidden;
}

.info-box,
.contacts-box {
  display: none;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info p,
.info a {
  font-size: 18px;
  font-weight: 400;
}

.tel img,
.email img,
.map img {
  width: 40px;
}

.info a img {
  margin-right: 12px;
}

.social {
  display: flex;
  align-items: center;
  gap: 47px;
}

.social img {
  width: 40px;
}

.flex {
  display: flex;
  align-items: center;
}

.time img,
.price img,
.people img {
  margin-right: 12px;
}

.about img:not(:last-child) {
  margin-right: 24px;
}

.icons-container-places {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
}

.icon-wrapper {
  width: 96px;
  height: 79px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-right: 26px;
}

.title-seats {
  font-size: 24px;
  font-weight: 700;
}

.title {
  font-size: 24px;
  margin-bottom: 24px;
  font-weight: 400;
  text-align: start;
}

.about .title {
  margin-bottom: 12px;
}

.services .title {
  line-height: normal;
}

.title-desk {
  display: none;
}

.services-box:not(:last-child) {
  margin-bottom: 24px;
}

.services-box img {
  width: 32px;
  margin-right: 12px;
}

.services-box p {
  font-size: 18px;
  font-weight: 400;
}

.spaces.block {
  padding: 40px 16px;
}

.spaces .card {
  width: 98%;
  max-width: 432px;
  border-radius: 20px;
  background-color: var(--white-color);
  position: relative;
  margin: 0 auto;
}

.spaces .card:not(:last-child) {
  margin-bottom: 40px;
}

.spaces .space-info {
  padding: 16px 24px 32px;
}

.spaces .photo {
  max-width: 432px;
  height: 279px;
  overflow: hidden;
  border-radius: 20px;
}

.spaces .photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.space-name {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
}

.book-button {
  width: 234px;
  padding: 8px 12px;
  background-color: var(--header-bg);
  color: var(--white-color);
  letter-spacing: normal;
  text-transform: capitalize;
  font-size: 18px;
  font-weight: 400;
  height: 38px;
  border-radius: 4px;
}

.box-book-button {
  display: flex;
  justify-content: flex-end;
}

.places {
  position: absolute;
  right: 0px;
  top: 20px;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px 0px 0px 20px;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  width: max-content;
  height: 30px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
}

.favorite .v-btn {
  position: absolute;
  left: 0px;
  top: 20px;
  width: 30px;
  cursor: pointer;
  border-color: transparent;
  border-radius: 0px 20px 20px 0px;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}

.favorite .v-btn:hover .v-icon {
  color: #af3800;
  transform: scale(1.1);
}

.spaces-col {
  margin-bottom: 32px;
}

.space-description {
  min-height: 20px;
  transition: all 0.5 ease;
}

.read-more-link {
  color: var(--btn-border);
  cursor: pointer;
}

.expanded {
  max-height: none;
}

.space-price {
  margin-top: 16px;
  margin-bottom: 16px;
  color: var(--header-bg);
  font-size: 20px;
  font-weight: 600;
  text-align: end;
}

.space-price span {
  font-size: 24px;
  font-weight: 600;
}

.animate-slide-from-header {
  animation: slideFromHeader 0.6s ease-in-out;
}

@keyframes slideFromHeader {
  0% {
    transform: translateY(-120px);
    opacity: 0;
  }

  50% {
    transform: translateY(-60px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (min-width: 768px) {
  .blurred {
    filter: none;
    pointer-events: auto;
  }

  .coworking-wrapper {
    max-width: 1440px;
    margin: 0 auto;
  }

  .mob-main {
    display: none;
  }

  .desktop-main {
    display: block;
  }

  .block {
    max-width: 1440px;
    margin: 0 auto;
  }

  .block:not(:first-child) {
    border-top: 2px solid var(--line-color);
  }

  .info-box,
  .contacts-box {
    display: block;
    color: var(--white-color);
  }

  .main .contacts-box img {
    width: 20px;
  }

  .info {
    display: none;
  }

  .main-box {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
  }

  .main h1 {
    margin-bottom: 32px;
    text-align: start;
  }

  .main-box h1 {
    font-size: 40px;
  }

  .main .photo {
    max-width: 780px;
    max-height: 441px;
    display: inline;
    border-radius: 20px;
    border: 2px solid var(--line-color);
  }

  .main-photo {
    position: relative;
  }

  .rating {
    position: absolute;
    left: 0px;
    top: 15px;
    display: flex;
    padding: 4px 8px;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    border-radius: 0px 20px 20px 0px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);
  }

  .left {
    width: 60%;
  }

  .right {
    width: 36%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    color: var(--white-color);
    position: relative;
    margin-top: 70px;
  }

  .big {
    font-size: 20px;
  }

  .rating {
    padding: 8px 16px;
  }

  .social {
    gap: 40px;
    max-width: 300px;
  }

  .time img,
  .price img,
  .people img {
    width: 30px;
    height: 30px;
    display: block;
    margin-right: 12px;
  }

  .time,
  .price,
  .people {
    height: 54px;
  }

  .contacts-box {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .weekday,
  .from {
    margin-bottom: 6px;
  }

  .contacts-box a .address {
    white-space: normal;
  }

  .contacts-box .contact {
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-size: 18px;
  }

  .contacts-box .contact img {
    margin-right: 12px;
    width: 30px;
    height: 30px;
  }

  .contacts-box .social img {
    width: 36px;
  }

  .contacts-box .social img:hover {
    transform: scale(1.1);
  }

  .icon-wrapper {
    width: 113px;
    height: 79px;
    margin-right: 26px;
  }

  .about img:not(:last-child) {
    margin-right: 40px;
  }

  .description {
    font-size: 18px;
    font-weight: 400;
    line-height: 140%;
  }

  .services .title {
    display: none;
  }

  .services-box.flex {
    width: 250px;
    margin-bottom: 0;
  }

  .services-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    max-width: 1096px;
    justify-content: flex-start;
    margin: 0 auto;
    gap: 32px;
  }

  .services-wrapper.two-rows {
    flex-wrap: wrap;
  }

  .services-box {
    width: 48%;
    margin-bottom: 10px;
  }

  .title-desk,
  .title {
    display: block;
    font-size: 32px;
    margin-bottom: 32px;
  }

  .book-button:hover {
    background-color: var(--btn-border);
  }

  .spaces.block {
    padding: 24px 16px;
  }

  @media (min-width: 1024px) {
    .block {
      padding: 32px 64px;
    }

    .main-wrapper.block {
      padding: 12px 64px 32px;
    }

    .right {
      width: 33%;
    }

    .contacts-box .contact img {
      margin-right: 32px;
      width: 38px;
      height: 38px;
    }

    .time img,
    .price img,
    .people img {
      margin-right: 32px;
      width: 44px;
      height: 44px;
    }

    .spaces.block {
      padding: 40px 64px;
    }
  }

  @media (min-width: 1440px) {
    .right {
      margin-top: 70px;
    }

    .social {
      position: absolute;
      display: flex;
      flex-direction: column;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      gap: 26px;
    }

    .contacts-box .social img {
      width: 40px;
    }

    .contacts-box .social img:hover {
      transform: scale(1.1);
    }
  }
}
</style>
