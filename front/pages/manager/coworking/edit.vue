<template>
  <form class="wrapper-manager-coworking edit-coworking" @submit="onSubmit">
    <div class="basic-information">
      <h2 class="indent-mng-bnt">Основна інформація</h2>
      <div class="info-wrapper">
        <div class="property">Назва коворкінгу</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            @input="onInput"
            :class="{ 'input-error': errors.nameCoworkingValidation }"
            placeholder="Назва коворкінгу"
            v-bind="nameCoworkingValidation"
            maxlength="30"
          />
          <div class="error-text">
            {{ errors.nameCoworkingValidation }}
          </div>
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">E-mail</div>
        <div class="value">
          <input
            class="basic-inp"
            type="email"
            :class="{ 'input-error': errors.emailValidation }"
            v-bind="emailValidation"
            placeholder="Ваш e-mail"
          />
          <div class="error-text">
            {{ errors.emailValidation }}
          </div>
        </div>
      </div>
      <!-- <div class="info-wrapper">
        <div class="property">Пароль</div>
        <div class="value">
          <input class="basic-inp" type="password" v-model="manager.password" />
        </div>
      </div> -->
      <div class="info-wrapper">
        <div class="property">Контактний телефон</div>
        <div class="value">
          <input
            class="basic-inp"
            type="text"
            :class="{ 'input-error': errors.phoneValidation }"
            @input="onInputPhone"
            v-bind="phoneValidation"
            placeholder="+38"
          />
          <div class="error-text">
            {{ errors.phoneValidation }}
          </div>
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Адреса</div>
        <div class="value">
          <input class="basic-inp" type="text" v-model="address" />
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Розклад роботи</div>
        <div class="value" style="height: 100%">
          <div class="time-wrapper t-wr-indent">
            <div>пн-пт</div>
            <span>з</span>
            <input v-model="workdayStart" type="time" />
            <span>до</span>
            <input v-model="workdayEnd" type="time" />
          </div>
          <div class="time-wrapper">
            <div>сб-нд</div>
            <span>з</span>
            <input v-model="dayoffStart" type="time" />
            <span>до</span>
            <input v-model="dayoffEnd" type="time" />
          </div>
        </div>
      </div>
      <div class="social-network">
        <div class="property">Соціальні мережі</div>
        <div class="network-wrapper">
          <div class="network" v-for="net in social" :key="net.id">
            <input
              class="checkbox-net"
              type="checkbox"
              name="network"
              v-model="net.showValue"
              @input="net.showValue ? (net.link = net.link) : (net.link = '')"
            />
            <div class="network-img">
              <img :src="'../' + net.src" :alt="net.title" />
            </div>
            <input
              v-model="net.link"
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
          <div class="show-edit-foto">
            <img v-if="showFoto" :src="linkFoto()" alt="foto" />
          </div>
          <label v-if="!showFoto" for="cowFoto" class="mng-cow-inp brd-none">
            Завантажити фото
          </label>
          <label v-else for="cowFoto" class="mng-cow-inp brd-none">
            Змінити фото
          </label>
          <input
            id="cowFoto"
            style="display: none"
            class="button mng-cow-inp brd-none"
            type="file"
            ref="cowFoto"
            @change="showFileName"
          />{{ fileName }}
        </div>
      </div>
      <div class="info-wrapper">
        <div class="property">Про коворкінг</div>
        <div class="value" style="height: 140px">
          <textarea
            class="mng-cow-inp"
            v-model="cowDescription"
            id="review"
            name="review"
            rows="7"
          ></textarea>
        </div>
      </div>
      <!-- <div class="info-wrapper-seats">
        <div class="property">Робочих місць</div>
        <div class="value-wokr-seat">
          <input v-model="manager.workPlaces" type="text" />
        </div>
      </div> -->
      <!-- <div class="location-seats">
        <span>Розташування місць</span>
        <div class="seats-wrapper">
          <div v-for="seat in possibleLocationSeats" :key="seat.id">
            <div class="seats">
              <input type="checkbox" name="places_p" v-model="seat.value" />
              <img :src="seat.src" :alt="seat.title" />
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div v-if="advantages.length > 0" class="free-services">
      <h2>Безкоштовні послуги (включені у вартість)</h2>
      <div class="services-container">
        <div v-for="service in advantages" :key="service.id">
          <div class="services-wrapper">
            <input
              type="checkbox"
              name="generator"
              v-model="service.showValue"
            />
            <img :src="setLink(service.icon)" :alt="service.name" />
            <span>{{ service.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="publish">
      <input type="checkbox" v-model="publish" />
      <span>Опублікувати</span>
    </div>
    <div class="edit-button">
      <button class="btn edit" type="submit">Зберегти</button>
      <button type="button" class="btn edit" @click="removeCoworking">
        Видалити коворкінг
      </button>
    </div>
  </form>
</template>

<script setup>
definePageMeta({
  layout: "layout-auth-users",
});
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as yup from "yup";
import { useForm } from "vee-validate";
const router = useRouter();
const store = useStore();
const manager = () => {
  return store.state.manager;
};

const fileName = ref("");

function showFileName(event) {
  const file = event.target.files[0];
  fileName.value = file ? file.name : "";
}

const { defineInputBinds, errors, handleSubmit, setFieldValue } = useForm({
  validationSchema: yup.object({
    nameCoworkingValidation: yup
      .string()
      .required("Це поле є обов’язковим для заповнення")
      .matches(
        /^[a-zA-Zа-яА-ЯїЇєЄіІґҐ' -\d]{2,}$/,
        "Поле заповнено некоректно",
      ),
    emailValidation: yup
      .string()
      .email("Поле заповнено некоректно")
      .required("Це поле є обов’язковим для заповнення")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Поле заповнено невірно",
      ),
    phoneValidation: yup
      .string()
      .required("Це поле є обов’язковим для заповнення")
      .matches(/^380\d{9}$/, "Поле заповнено некоректно"),
  }),
});

const nameCoworkingValidation = defineInputBinds("nameCoworkingValidation");
const emailValidation = defineInputBinds("emailValidation");
const phoneValidation = defineInputBinds("phoneValidation");
let coworkingId = "";
let address = "";
const cowFoto = ref(null);
let cowDescription = "";
let workdayStart = "";
let workdayEnd = "";
let dayoffStart = "";
let dayoffEnd = "";
let showFoto = "";
let social = [];
let advantages = [];
let publish = false;
watchEffect(() => {
  if (manager()) {
    setFieldValue("nameCoworkingValidation", manager().coworking_name);
    setFieldValue("emailValidation", manager().email);
    setFieldValue("phoneValidation", manager().phone);
    coworkingId = manager().id;
    address = manager().address;
    workdayStart = manager().workday_start;
    workdayEnd = manager().workday_end;
    dayoffStart = manager().dayoff_start;
    dayoffEnd = manager().dayoff_end;
    cowDescription = manager().description;
    showFoto = manager().coworking_photo;
    advantages = manager().advantages;
    publish = manager().published;
  }
});

const onSubmit = handleSubmit(async (values) => {
  const newSocial = [];
  social.forEach((elem) => {
    if (elem.showValue && elem.link) {
      newSocial.push({
        id: elem.id,
        title: elem.title,
        src: elem.src,
        link: elem.link,
      });
    } else {
      elem.link = "";
    }
  });
  const currentAdvantages = [];
  advantages.forEach((elem) => {
    elem.showValue ? currentAdvantages.push(elem.id) : elem;
  });
  try {
    const { $api } = useNuxtApp();
    let formData = new FormData();
    formData.append("id", coworkingId);
    formData.append("coworking_name", values.nameCoworkingValidation);
    formData.append("email", values.emailValidation);
    formData.append("phone", values.phoneValidation);
    formData.append("address", address);
    formData.append("work_day_start", workdayStart);
    formData.append("work_day_end", workdayEnd);
    formData.append("dayoff_start", dayoffStart);
    formData.append("dayoff_end", dayoffEnd);
    cowFoto.value.files[0]
      ? formData.append("coworking_photo", cowFoto.value.files[0])
      : null;
    formData.append("description", cowDescription);
    formData.append("social", JSON.stringify(newSocial));
    formData.append("advantages", JSON.stringify(currentAdvantages));
    formData.append("published", publish);

    $api.put("/coworkings", formData).then((response) => {
      if (response) {
        router.push("/manager/coworking");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

function setLink(link) {
  const { $api } = useNuxtApp();
  const baseURL = $api.defaults.baseURL;
  return `${baseURL}/${link}`;
}

function onInput(event) {
  event.target.value = event.target.value.replace(
    /[^a-zA-Zа-яА-ЯїЇєЄіІґҐ' - \d]/g,
    "",
  );
}

function onInputPhone(event) {
  event.target.value = event.target.value
    .replace("38", "")
    .replace(/\D/g, "")
    .slice(0, 10);
  const phoneRegex = /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/;

  event.target.value = event.target.value.replace(
    phoneRegex,
    (_match, p1, p2, p3, p4) => {
      const formattedNumber = [];
      if (p1) {
        formattedNumber.push(`38${p1}`);
      }
      if (p2) {
        formattedNumber.push(`${p2}`);
      }
      if (p3) {
        formattedNumber.push(`${p3}`);
      }
      if (p4) {
        formattedNumber.push(`${p4}`);
      }

      return formattedNumber.join("");
    },
  );
  phoneValidation = event.target.value;
}

function linkFoto() {
  const { $api } = useNuxtApp();
  const baseURL = $api.defaults.baseURL;
  if (manager()) {
    return `${baseURL}/${manager().coworking_photo}`;
  }
}

function removeCoworking() {
  const { $api } = useNuxtApp();
  try {
    $api.delete(`/coworkings?id=${manager().id}`).then((response) => {
      if (response) {
        router.push("/manager/coworking");
        store.commit("setManagerData", null);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function setManagerData() {
  if (localStorage.getItem("managerData")) {
    store.commit(
      "setManagerData",
      JSON.parse(localStorage.getItem("managerData")),
    );
  }
  setCurrentSocial();
  store.state.activeTabAuthUserMenu = "coworkingActive";
}
function setCurrentSocial() {
  social = store.state.social;
  let current = JSON.parse(store.state.manager.social);
  current.forEach((elem) => {
    social[elem.id - 1].link = elem.link;
  });
  social.forEach((elem) => {
    elem.link ? (elem.showValue = true) : (elem.showValue = false);
  });
}

function setAdvantages() {
  if (localStorage.getItem("allAdvantages")) {
    store.commit(
      "getAllAdvantages",
      JSON.parse(localStorage.getItem("allAdvantages")),
    );
  }
  let currentAdvantages = store.state.manager.advantages;
  store.state.manager.advantages = store.state.allAdvantages;
  store.state.manager.advantages.forEach((elem) => {
    currentAdvantages.forEach((item) => {
      item.advantage_id == elem.id ? (elem.showValue = true) : item;
    });
  });
}

onMounted(() => {
  setManagerData();
  setAdvantages();
});
</script>

<style>
.value-manager label {
  cursor: pointer;
  color: var(--text-color);
  padding: 5px 10px;
  border-radius: 6px;
}

.value-manager label:hover {
  background-color: #1a679a;
  color: white;
}
.edit-coworking {
  position: relative;
}
.edit-coworking .input-error {
  border: 1px solid red;
}

.edit-coworking textarea,
.edit-coworking input {
  border: 1px solid #a9a9a9;
  border-radius: 6px;
  padding: 5px;
}

.edit-coworking .about-manager-coworking .brd-none,
.edit-coworking .basic-information .basic-foto {
  border: none;
}
.edit-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.btn.edit {
  width: 200px;
  height: 46px;
  margin: 20px;
  color: var(--text-color);
  border-radius: 6px;
}
.show-edit-foto {
  text-align: center;
  margin-bottom: 10px;
}
</style>
