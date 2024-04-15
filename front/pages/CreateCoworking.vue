<template>
  <div class="wrapper-manager-page">
    <div class="manager-function">
      <button class="btn">Коворкінг</button>
    </div>
    <div class="coworking-form">
      <button class="btn-edit" @click="allowEditing" v-if="!isEdit">
        <img src="~assets/icon_edit.png" alt="edit" />
      </button>
      <div class="basic-information">
        <h2>Основна інформація</h2>
        <div class="info-wrapper">
          <div class="property">Назва коворкінгу</div>
          <div class="value">
            <input type="text" v-model="manager.nameСoworking" readonly />
          </div>
        </div>
        <div class="info-wrapper">
          <div class="property">E-mail</div>
          <div class="value">
            <input type="text" v-model="manager.email" readonly />
          </div>
        </div>
        <div class="info-wrapper">
          <div class="property">Пароль</div>
          <div class="value">
            <input type="password" v-model="manager.password" readonly />
          </div>
        </div>
        <div class="info-wrapper">
          <div class="property">Контактний телефон</div>
          <div class="value">
            <input
              type="text"
              v-model="manager.phone"
              :readonly="!isEdit"
              :class="['input', { 'edit-border': isEdit }]"
            />
          </div>
        </div>
        <div class="info-wrapper">
          <div class="property">Адреса</div>
          <div class="value">
            <input
              type="text"
              v-model="manager.address"
              :readonly="!isEdit"
              :class="['input', { 'edit-border': isEdit }]"
            />
          </div>
        </div>
        <div class="info-wrapper">
          <div class="property">Розклад роботи</div>
          <div class="value">
            <div class="time-wrapper indent">
              <span>пн-пт</span>
              <span>з</span>
              <input
                type="time"
                v-model="manager.businessDayStart"
                :readonly="!isEdit"
              />
              <span>до</span>
              <input
                type="time"
                v-model="manager.businessDayEnd"
                :readonly="!isEdit"
              />
            </div>
            <div class="time-wrapper">
              <span>сб-нд</span>
              <span>з</span>
              <input
                v-model="manager.dayOffStart"
                type="time"
                :readonly="!isEdit"
              />
              <span>до</span>
              <input
                v-model="manager.dayOffEnd"
                type="time"
                :readonly="!isEdit"
              />
            </div>
          </div>
        </div>
        <div class="info-wrapper">
          <div class="property">Менеджер</div>
          <div class="value-manager">
            <input
              type="text"
              :readonly="!isEdit"
              :placeholder="isEdit ? 'Прізвище' : ''"
              :class="['input', { 'edit-border': isEdit }]"
            />
            <input
              type="text"
              :readonly="!isEdit"
              :placeholder="isEdit ? 'Ім’я' : ''"
              :class="['input', { 'edit-border': isEdit }]"
            />
          </div>
        </div>
      </div>
      <div class="about-coworking">
        <h2>Опис коворкінгу</h2>
        <div class="info-wrapper">
          <div class="property">Головне фото</div>
          <div class="value-manager">
            <input
              class="button"
              type="file"
              :placeholder="isEdit ? 'Прізвище' : ''"
              :disabled="!isEdit"
            />
          </div>
        </div>
        <div class="info-wrapper">
          <div class="property">Про коворкінг</div>
          <div class="value">
            <textarea
              v-model="manager.coworkingDescription"
              :class="['textarea', { 'edit-border': isEdit }]"
              id="review"
              name="review"
              :readonly="!isEdit"
              rows="7"
            ></textarea>
          </div>
        </div>
        <div class="info-wrapper">
          <div class="property">Робочих місць</div>
          <div class="value">
            <input
              v-model="manager.workPlaces"
              type="text"
              :class="['input', { 'edit-border': isEdit }]"
              :readonly="!isEdit"
            />
          </div>
        </div>
        <div class="location-seats">
          <span>Розташування місць</span>
          <div class="seats-wrapper">
            <div v-for="seat in possibleLocationSeats" :key="seat.id">
              <div class="seats" v-if="isEdit || seat.value">
                <input
                  type="checkbox"
                  name="places_p"
                  v-model="seat.value"
                  :disabled="!isEdit"
                />
                <img :src="seat.src" :alt="seat.title" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="free-services">
        <h2>Послуги</h2>
        <div v-for="service in coworkingServices" :key="service.id">
          <div class="services-wrapper" v-if="isEdit || service.value">
            <input
              type="checkbox"
              name="generator"
              v-model="service.value"
              :disabled="!isEdit"
            />
            <img :src="service.src" alt="generator" />
            <span>{{ service.title }}</span>
          </div>
        </div>
      </div>
      <button @click="allowEditing" class="btn" v-if="isEdit">Зберегти</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      isEdit: false,
      coworkingServices: [],
      possibleLocationSeats: [],
      manager: {},
    };
  },
  mounted() {
    this.getManagerInfo();
  },
  created() {
    this.getAllServices();
    this.getAllLocationSeats();
  },
  methods: {
    allowEditing() {
      this.isEdit = !this.isEdit;
    },
    getAllServices() {
      axios
        .get("/possibleServices.json")
        .then((response) => {
          this.coworkingServices = response.data;
          this.coworkingServices.forEach((elem) => (elem.value = false));
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
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
  },
};
</script>


<style>
.wrapper-manager-page {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 50px 93px;
  font-family: Inter;
  font-style: normal;
  font-size: 18px;
  line-height: normal;
  color: var(--black-color);
}

.wrapper-manager-page h2 {
  font-size: 24px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 32px;
}

.wrapper-manager-page button {
  color: var(--white-color);
  background-color: var(--text-color);
}

.wrapper-manager-page .btn-edit {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 46px;
  height: 46px;
  border-radius: 6px;
}

.wrapper-manager-page .edit-border {
  border-radius: 6px;
  border: 1px solid #a9a9a9;
  padding: 8px 24px;
}

.wrapper-manager-page .btn {
  width: 260px;
  height: 48px;
  border: 1px solid var(--text-color);
  border-radius: 6px;
}

.wrapper-manager-page input {
  background-color: transparent;
}

.wrapper-manager-page textarea,
.wrapper-manager-page input:focus {
  outline: none;
}

.wrapper-manager-page .manager-function {
  padding: 40px 0 0 40px;
  display: flex;
  flex-direction: column;
}

.wrapper-manager-page .manager-function button {
  border-radius: 6px 0 0 6px;
}

.wrapper-manager-page .coworking-form {
  position: relative;
  width: 100%;
  padding: 0 24px;
  border: 1px solid var(--text-color);
}

.wrapper-manager-page .free-services,
.wrapper-manager-page .about-coworking,
.wrapper-manager-page .basic-information {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 32px 0;
  border-bottom: 2px solid var(--text-color);
}

.wrapper-manager-page .info-wrapper {
  display: flex;
  flex-basis: row;
  width: 100%;
  margin-bottom: 24px;
}

.wrapper-manager-page .property {
  width: 40%;
}

.wrapper-manager-page .value {
  width: 60%;
  display: flex;
  flex-direction: column;
}
.wrapper-manager-page .value-manager {
  width: 60%;
  display: flex;
  flex-direction: row;
}

.wrapper-manager-page .indent {
  margin-bottom: 24px;
}

.wrapper-manager-page .time-wrapper {
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.wrapper-manager-page .time-wrapper img {
  width: 40px;
}

.wrapper-manager-page .time-wrapper input[type="checkbox"] {
  width: 28px;
}

#review {
  height: 100%;
  width: 100%;
}

.wrapper-manager-page .location-seats {
  display: flex;
  flex-direction: column;
}

.wrapper-manager-page .seats-wrapper {
  padding: 24px 0 0 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
}

.wrapper-manager-page .seats {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
}

.wrapper-manager-page .seats input {
  width: 28px;
  height: 28px;
}

.wrapper-manager-page .seats img {
  margin: 0 24px;
}

.wrapper-manager-page .services-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
}

.wrapper-manager-page .services-wrapper input {
  width: 28px;
  height: 28px;
}

.wrapper-manager-page .services-wrapper img {
  margin: 0 12px;
}

.grecaptcha-badge {
  display: none !important;
}
</style>