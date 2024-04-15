<template>
  <div class="manager-main">
    <div class="manager-menu">
      <managerMenu coworkingActive="true" />
    </div>
    <div class="about-coworking">
      <div class="wrapper-manager-coworking edit-coworking">
        <div class="basic-information">
          <h2 class="indent-mng-bnt">Основна інформація</h2>
          <div class="info-wrapper">
            <div class="property">Назва коворкінгу</div>
            <div class="value">
              <input
                class="basic-inp"
                type="text"
                v-model="manager.nameСoworking"
              />
            </div>
          </div>
          <div class="info-wrapper">
            <div class="property">E-mail</div>
            <div class="value">
              <input class="basic-inp" type="text" v-model="manager.email" />
            </div>
          </div>
          <div class="info-wrapper">
            <div class="property">Пароль</div>
            <div class="value">
              <input
                class="basic-inp"
                type="password"
                v-model="manager.password"
              />
            </div>
          </div>
          <div class="info-wrapper">
            <div class="property">Контактний телефон</div>
            <div class="value">
              <input class="basic-inp" type="text" v-model="manager.phone" />
            </div>
          </div>
          <div class="info-wrapper">
            <div class="property">Адреса</div>
            <div class="value">
              <input class="basic-inp" type="text" v-model="manager.address" />
            </div>
          </div>
          <div class="info-wrapper">
            <div class="property">Розклад роботи</div>
            <div class="value">
              <div class="time-wrapper t-wr-indent">
                <div>пн-пт</div>
                <span>з</span>
                <input v-model="manager.businessDayStart" type="time" />
                <span>до</span>
                <input v-model="manager.businessDayEnd" type="time" />
              </div>
              <div class="time-wrapper">
                <div>сб-нд</div>
                <span>з</span>
                <input v-model="manager.dayOffStart" type="time" />
                <span>до</span>
                <input v-model="manager.dayOffEnd" type="time" />
              </div>
            </div>
          </div>
          <div class="info-wrapper">
            <div class="property">Менеджер</div>
            <div class="value-manager">
              <div class="manager-name">
                <input type="text" placeholder="Прізвище" />
                <input type="text" placeholder="Ім’я" />
              </div>
              <input class="button basic-foto" type="file" />
            </div>
          </div>
          <div class="social-network">
            <div class="property">Соціальні мережі</div>
            <div class="network-wrapper">
              <div class="network" v-for="net in network" :key="net.id">
                <input
                  class="checkbox-net"
                  type="checkbox"
                  name="network"
                  v-model="net.showValue"
                />
                <div class="network-img">
                  <img :src="net.src" :alt="net.title" />
                </div>
                <input
                  v-model="net.value"
                  class="network-inp"
                  type="text"
                  v-if="net.showValue"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="about-manager-coworking">
          <h2>Опис коворкінгу</h2>
          <div class="info-wrapper">
            <div class="property">Головне фото</div>
            <div class="value-manager">
              <input class="button mng-cow-inp brd-none" type="file" />
            </div>
          </div>
          <div class="info-wrapper">
            <div class="property">Про коворкінг</div>
            <div class="value">
              <textarea
                class="mng-cow-inp"
                v-model="manager.coworkingDescription"
                id="review"
                name="review"
                rows="7"
              ></textarea>
            </div>
          </div>
          <div class="info-wrapper-seats">
            <div class="property">Робочих місць</div>
            <div class="value-wokr-seat">
              <input v-model="manager.workPlaces" type="text" />
            </div>
          </div>
          <div class="location-seats">
            <span>Розташування місць</span>
            <div class="seats-wrapper">
              <div v-for="seat in possibleLocationSeats" :key="seat.id">
                <div class="seats">
                  <input type="checkbox" name="places_p" v-model="seat.value" />
                  <img :src="seat.src" :alt="seat.title" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="free-services">
          <h2>Безкоштовні послуги (включені у вартість)</h2>
          <div v-for="service in coworkingServices" :key="service.id">
            <div class="services-wrapper">
              <input type="checkbox" name="generator" v-model="service.value" />
              <img :src="service.src" alt="generator" />
              <span>{{ service.title }}</span>
            </div>
          </div>
        </div>
        <button class="btn save" @click="navigateTo('/manager')">
          Зберегти
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import managerMenu from "~/pages/manager/managerMenu.vue";

definePageMeta({
  layout: "manager",
});

export default {
  data() {
    return {
      coworkingServices: [],
      possibleLocationSeats: [],
      manager: {},
      network: [],
    };
  },
  components: {
    managerMenu,
  },
  mounted() {
    this.getManagerInfo();
  },
  created() {
    this.getAllServices();
    this.getAllLocationSeats();
    this.getAllNetwork();
  },
  methods: {
    getAllServices() {
      axios
        .get("/possibleServices.json")
        .then((response) => {
          this.coworkingServices = response.data;
          this.coworkingServices.forEach((elem) => (elem.value = false));
          this.coworkingServices.forEach((elem) => {
            elem.src = "../../" + elem.src;
          });
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
    getAllLocationSeats() {
      axios
        .get("/locationSeats.json")
        .then((response) => {
          this.possibleLocationSeats = response.data;
          this.possibleLocationSeats.forEach((elem) => (elem.value = false));
          this.possibleLocationSeats.forEach((elem) => {
            elem.src = "../../" + elem.src;
          });
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
    getManagerInfo() {
      axios
        .get("/manager.json")
        .then((response) => {
          this.manager = response.data;
          this.manager.email = localStorage.getItem("email");
          this.coworkingServices.forEach((elem) => {
            this.manager.services.forEach((item) => {
              if (item.id == elem.id) {
                elem.value = true;
              }
            });
          });
          this.possibleLocationSeats.forEach((elem) => {
            this.manager.locationSeats.forEach((item) => {
              if (item.id == elem.id) {
                elem.value = true;
              }
            });
          });
          this.network.forEach((elem) => {
            this.manager.network.forEach((item) => {
              if (item.value && item.id == elem.id) {
                elem.showValue = true;
                elem.value = item.value;
              }
            });
          });
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
    getAllNetwork() {
      axios
        .get("/network.json")
        .then((response) => {
          this.network = response.data;
          this.network.forEach((elem) => {
            elem.src = "../../" + elem.src;
            elem.showValue = false;
          });
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
  },
};
</script>

<style>
.edit-coworking {
  position: relative;
}

.edit-coworking textarea,
.edit-coworking input {
  border: 1px solid #a9a9a9;
  border-radius: 6px;
}

.edit-coworking .about-manager-coworking .brd-none,
.edit-coworking .basic-information .basic-foto {
  border: none;
}

.btn.save {
  position: absolute;
  right: 23px;
  bottom: 32px;
  width: 179px;
  height: 46px;
  background-color: #09273b;
  color: azure;
}
</style>
