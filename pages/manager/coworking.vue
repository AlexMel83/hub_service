<template>
  <div class="wrapper-manager-coworking">
    <button class="btn-edit" @click="navigateTo('/manager/edit')">
      <img src="~assets/icon_edit.png" alt="edit" />
    </button>
    <div class="basic-information">
      <h2 class="indent-mng-bnt">Основна інформація</h2>
      <div class="info-wrapper">
        <div class="property">Назва коворкінгу</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            v-model="manager.nameСoworking"
            readonly
          />
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">E-mail</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            v-model="manager.email"
            readonly
          />
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Пароль</div>
        <div class="value">
          <input
            class="basic-inp"
            type="password"
            v-model="manager.password"
            readonly
          />
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Контактний телефон</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            v-model="manager.phone"
            readonly
          />
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Адреса</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            v-model="manager.address"
            readonly
          />
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Розклад роботи</div>
        <div class="value">
          <div class="time-wrapper t-wr-indent">
            <div>пн-пт</div>
            <span>з</span>
            <input v-model="manager.businessDayStart" type="time" readonly />
            <span>до</span>
            <input v-model="manager.businessDayEnd" type="time" readonly />
          </div>
          <div class="time-wrapper">
            <div>сб-нд</div>
            <span>з</span>
            <input v-model="manager.dayOffStart" type="time" readonly />
            <span>до</span>
            <input v-model="manager.dayOffEnd" type="time" readonly />
          </div>
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Менеджер</div>
        <div class="value-manager">
          <div class="manager-name">
            <input type="text" readonly placeholder="Прізвище" />
            <input type="text" readonly placeholder="Ім’я" />
          </div>
          <input class="button basic-foto" type="file" disabled />
        </div>
      </div>
      <div class="social-network">
        <div class="property">Соціальні мережі</div>
        <div class="network-wrapper">
          <div class="network" v-for="net in manager.network" :key="net.id">
            <input
              class="checkbox-net"
              type="checkbox"
              name="network"
              checked
              disabled
            />
            <div class="network-img">
              <img :src="net.src" :alt="net.title" />
            </div>
            <input
              class="network-inp"
              :value="net.value"
              type="text"
              readonly
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
          <input class="button mng-cow-inp" type="file" disabled />
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
            readonly
            rows="7"
          ></textarea>
        </div>
      </div>
      <div class="info-wrapper-seats">
        <div class="property">Робочих місць</div>
        <div class="value-wokr-seat">
          <input v-model="manager.workPlaces" type="text" readonly />
        </div>
      </div>
      <div class="location-seats">
        <span>Розташування місць</span>
        <div class="seats-wrapper">
          <div v-for="seat in manager.locationSeats" :key="seat.id">
            <div class="seats">
              <input type="checkbox" name="places_p" checked disabled />
              <img :src="seat.src" :alt="seat.title" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="free-services">
      <h2>Безкоштовні послуги (включені у вартість)</h2>
      <div v-for="service in manager.services" :key="service.id">
        <div class="services-wrapper">
          <input type="checkbox" name="generator" disabled checked />
          <img :src="service.src" alt="generator" />
          <span>{{ service.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import managerMenu from "~/pages/manager/managerMenu.vue";

export default {
  components: {
    managerMenu,
  },
  data() {
    return {
      manager: {},
    };
  },
  mounted() {
    this.getManagerInfo();
  },

  methods: {
    getManagerInfo() {
      axios
        .get("/manager.json")
        .then((response) => {
          this.manager = response.data;
          this.manager.email = localStorage.getItem("email");
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
  },
};
</script>



<style>
.indent-mng-bnt {
  text-align: left;
}

textarea:focus,
input:focus {
  outline: none;
}

.btn-edit {
  position: absolute;
  background-color: #09273b;
  top: 16px;
  right: 0px;
  width: 46px;
  height: 46px;
  border-radius: 6px;
}

.wrapper-manager-coworking {
  display: flex;
  flex-direction: column;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  position: relative;
  padding-bottom: 140px;
  color: var(--black-color);
}

.wrapper-manager-coworking h2 {
  margin: 24px;
  padding: 0;
  font-size: 20px;
  font-weight: 900;
}

.wrapper-manager-coworking .free-services,
.wrapper-manager-coworking .about-manager-coworking,
.wrapper-manager-coworking .basic-information {
  border-bottom: 2px solid var(--text-color);
}

/* .wrapper-manager-coworking .basic-information */
.basic-information {
  padding-bottom: 12px;
}
.about-manager-coworking .info-wrapper,
.basic-information .info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 24px;
}

.about-manager-coworking .info-wrapper .property,
.basic-information .info-wrapper .property {
  width: 100%;
  margin-right: 10px;
  margin-bottom: 12px;
}
.basic-information .basic-foto,
.basic-information .basic-inp {
  width: 95%;
}

.basic-information .time-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 95%;
}

.about-manager-coworking .location-seats span,
.basic-information .time-wrapper.t-wr-indent {
  margin-bottom: 12px;
}

.basic-information .value-manager {
  width: 95%;
  display: flex;
  flex-direction: column;
}
.basic-information .value-manager .manager-name {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
}
.basic-information .value-manager .manager-name input {
  width: 45%;
}

/* wrapper-manager-coworking .about-manager-coworking */
.wrapper-manager-coworking .free-services,
.about-manager-coworking {
  padding-bottom: 8px;
}

.about-manager-coworking .info-wrapper-seats {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 24px;
}

.about-manager-coworking .info-wrapper-seats .property {
  width: 200px;
  margin-right: 10px;
}

.about-manager-coworking .mng-cow-inp {
  width: 95%;
}
.about-manager-coworking .value-wokr-seat input {
  width: 100px;
}

.about-manager-coworking .location-seats {
  display: flex;
  flex-direction: column;
}

.about-manager-coworking .location-seats .seats-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.about-manager-coworking .location-seats img {
  margin: 0 24px;
}

.free-services .services-wrapper,
.about-manager-coworking .location-seats .seats {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
}

.social-network .network-wrapper .checkbox-net,
.free-services .services-wrapper input,
.about-manager-coworking .location-seats .seats input {
  width: 28px;
  height: 28px;
}

/* .wrapper-manager-coworking .free-services */

.free-services .services-wrapper img {
  margin: 0 12px;
}

/* .basic-information .social-network */

.social-network {
  display: flex;
  flex-direction: column;
}

.social-network .property {
  width: 100%;
  margin-right: 10px;
  margin-bottom: 12px;
}

.basic-information .social-network .network-wrapper {
  display: flex;
  flex-direction: column;
}
.network-img {
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 12px;
}
.social-network .network-wrapper img {
  width: 40px;
  height: 40px;
}

.social-network .network-wrapper .network {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
}

.network-wrapper .network .network-inp {
  width: 64%;
}

@media (min-width: 375px) {
  .indent-mng-bnt {
    text-align: center;
  }

  .network-wrapper .network .network-inp {
    width: 240px;
  }

  .about-manager-coworking .mng-cow-inp,
  .basic-information .basic-foto,
  .basic-information .value-manager,
  .basic-information .time-wrapper,
  .basic-information .basic-inp {
    width: 343px;
  }
}

@media (min-width: 768px) {
  .btn-edit {
    top: 24px;
    right: 0px;
  }

  .wrapper-manager-coworking {
    padding-bottom: 110px;
  }

  .wrapper-manager-coworking h2 {
    margin: 32px;
    font-size: 24px;
  }

  /* .wrapper-manager-coworking .basic-information */
  .basic-information {
    padding-bottom: 20px;
  }
  .basic-information .info-wrapper {
    flex-direction: row;
    justify-content: flex-start;
  }

  .basic-information .info-wrapper .property {
    width: 35%;
    margin-bottom: 0px;
  }
  .about-manager-coworking .value-wokr-seat input,
  .about-manager-coworking .mng-cow-inp,
  .basic-information .basic-foto,
  .basic-information .value-manager,
  .basic-information .time-wrapper,
  .basic-information .basic-inp {
    width: 300px;
  }

  .network-wrapper .network .network-inp {
    width: 197px;
  }

  /* wrapper-manager-coworking .about-manager-coworking */
  .about-manager-coworking .info-wrapper {
    flex-direction: row;
    justify-content: flex-start;
  }
  .about-manager-coworking .info-wrapper-seats .property,
  .about-manager-coworking .info-wrapper .property {
    width: 35%;
    margin-bottom: 0px;
  }

  .free-services .services-wrapper,
  .about-manager-coworking .location-seats .seats {
    margin-bottom: 24px;
  }

  /* .basic-information .social-network */

  .social-network {
    flex-direction: row;
    height: 100%;
  }

  .social-network .property {
    width: 35%;
    margin-bottom: 0px;
  }
}

@media (min-width: 900px) {
  .about-manager-coworking .mng-cow-inp,
  .basic-information .basic-foto,
  .basic-information .value-manager,
  .basic-information .time-wrapper,
  .basic-information .basic-inp {
    width: 400px;
  }
  .network-wrapper .network .network-inp {
    width: 297px;
  }
}
</style>
