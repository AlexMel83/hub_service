<template>
  <div v-if="!isLoading" style="min-height: 100vh">
    <Loader />
  </div>

  <div v-else class="booking-wrapper" style="min-height: 100vh">
    <h2 v-if="store.state.manager">
      Бронювання коворкінгу {{ store.state.manager.coworking_name }}
    </h2>
    <div v-if="years.length > 0" class="wrapper-filter">
      <select id="years" @change="getYear">
        <option v-for="(year, index) in years" :key="index" :value="index">
          {{ year }}
        </option>
      </select>
      <select id="months" @change="getMonth">
        <option v-for="(month, index) in months" :key="index" :value="index">
          {{ month }}
        </option>
      </select>
      <select id="days" :disabled="!givenMonth" @change="getDay">
        <option v-for="(day, index) in days" :key="index" :value="index">
          {{ day }}
        </option>
      </select>
    </div>
    <v-table v-if="bookings.length > 0" class="booking-table">
      <thead>
        <tr>
          <th>Простір</th>
          <th>Ім'я</th>
          <th>Телефон</th>
          <th>Дата</th>
          <th>Час з</th>
          <th>Час по</th>
          <th>Місць</th>
          <th>Сума</th>
          <th>Оплата</th>
          <!-- <th>Видалити</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.phone">
          <td>{{ booking.space_name }}</td>
          <td>{{ booking.userName }}</td>
          <td>{{ booking.phone }}</td>
          <td>{{ booking.date }}</td>
          <td>{{ booking.start_time }}</td>
          <td>{{ booking.end_time }}</td>
          <td>{{ booking.seats }}</td>
          <td>{{ booking.total_price }} грн</td>
          <td>{{ booking.is_paid ? "так" : "ні" }}</td>
          <!-- <td>
            <v-btn @click="deleteBooking(booking.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td> -->
        </tr>
      </tbody>
    </v-table>
    <h3 v-if="bookings.length <= 0 && isLoading">Бронюваннь немає</h3>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import Loader from "~/components/Loader.vue";

const { $api } = useNuxtApp();
const store = useStore();
const bookings = ref([]);
definePageMeta({
  layout: "layout-auth-users",
});
const years = [];
const months = [
  "місяць",
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];
let days = ["день"];
let givenDay = ref("");
let givenYear = ref("");
let givenMonth = ref("");
const isLoading = ref(false);

function getDay(event) {
  givenDay.value = parseInt(event.target.value);
}

function getMonth(event) {
  givenMonth.value = parseInt(event.target.value);
}

function getYear(event) {
  const selectedYearIndex = parseInt(event.target.value);
  givenYear.value = years[selectedYearIndex];
}

function setManagerData() {
  if (localStorage.getItem("managerData")) {
    store.commit(
      "setManagerData",
      JSON.parse(localStorage.getItem("managerData")),
    );
  }
  store.state.activeTabAuthUserMenu = "booksActive";
}

const getManagerBooks = async () => {
  try {
    const response = await $api.get(
      `/bookings?coworkingId=${store.state.manager.id}`,
    );
    const bookingData = response.data;
    bookingData.forEach((elem) => {
      let currentBook = {
        id: elem.id,
        space_name: elem.space_name,
        total_price: elem.total_price,
        is_paid: elem.is_paid,
        date: elem.start_time.slice(0, 10),
        start_time: elem.start_time.slice(11, 16),
        end_time: elem.end_time.slice(11, 16),
        seats: elem.seats,
      };
      elem.user_id
        ? ((currentBook.userName = elem.user_name),
          (currentBook.phone = elem.user_phone))
        : null;
      elem.guest_id
        ? ((currentBook.userName = elem.guest_first_name),
          (currentBook.phone = elem.guest_phone))
        : null;
      bookings.value.push(currentBook);
      bookings.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    store.state.manager.bookings = bookings.value;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = true;
    store.state.isLoading = true;
  }
};
function getCurrentDate() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  return { day, month, year };
}

function setYear() {
  for (let i = getCurrentDate().year; i >= 2023; i--) {
    years.push(i);
  }
}

function setDays(year, month) {
  days = ["день"];
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + 1);
  date.setDate(date.getDate() - 1);
  for (let i = 1; i <= date.getDate(); i++) {
    days.push(i);
  }
}

watchEffect(async () => {
  if (givenYear.value) {
    if (!givenMonth.value) {
      bookings.value = store.state.manager.bookings.filter((elem) => {
        return elem.date.slice(0, 4) == givenYear.value;
      });
    } else {
      bookings.value = store.state.manager.bookings.filter((elem) => {
        return (
          elem.date.slice(0, 4) == givenYear.value &&
          parseInt(elem.date.slice(5, 7)) === givenMonth.value
        );
      });
    }
  }

  if (givenMonth.value) {
    !givenYear.value
      ? (givenYear.value = getCurrentDate().year)
      : givenYear.value;

    bookings.value = store.state.manager.bookings.filter((elem) => {
      return (
        parseInt(elem.date.slice(5, 7)) === givenMonth.value &&
        elem.date.slice(0, 4) == givenYear.value
      );
    });
    setDays(givenYear.value, givenMonth.value);
  }

  if (givenDay.value) {
    !givenYear.value
      ? (givenYear.value = getCurrentDate().year)
      : givenYear.value;
    bookings.value = store.state.manager.bookings.filter((elem) => {
      return (
        parseInt(elem.date.slice(5, 7)) === givenMonth.value &&
        elem.date.slice(0, 4) == givenYear.value &&
        parseInt(elem.date.slice(8, 10)) == givenDay.value
      );
    });
  }
});

onMounted(() => {
  setYear();
  setManagerData();
  getManagerBooks();
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

.wrapper-filter {
  display: flex;
  flex-direction: row;
}

#days,
#months,
#years {
  padding: 8px;
  font-size: 16px;
  border: 1px solid var(--text-color);
  border-radius: 5px;
  width: 100px;
  cursor: pointer;
  text-align: center;
  margin: 0 0 15px 15px;
}

#years option,
#months option,
#days option {
  padding: 8px;
  background-color: #fff;
}
.booking-wrapper h3 {
  text-align: center;
  margin-top: 50px;
}
</style>
