<template>
  <div class="booking-wrapper" style="min-height: 100vh">
    <h2 v-if="isLoad()">Історія бронювань</h2>
    <Loader v-if="isLoading" />
    <v-table class="booking-table" v-if="bookings.length > 0 && !isLoading">
      <thead>
        <tr>
          <th>Простір</th>
          <th>Коворкінг</th>
          <th>Адреса</th>
          <th @click="sortByDate" class="date">
            Дата
            <v-icon
              :class="
                sortByDateDirection === 'asc'
                  ? 'mdi mdi-sort-calendar-descending'
                  : 'mdi mdi-sort-calendar-ascending'
              "
            ></v-icon>
          </th>
          <th>Час з</th>
          <th>Час по</th>
          <th>Місць</th>
          <th>Сума</th>
          <th>Оплата</th>
          <th>Видалити</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id">
          <td>
            <a :href="`/coworking/${booking.coworking_id}`" target="_blank">{{
              booking.space_name
            }}</a>
          </td>
          <td>
            <a :href="`/coworking/${booking.coworking_id}`" target="_blank">{{
              booking.coworking_name
            }}</a>
          </td>
          <td>
            <a
              :href="`https://maps.google.com/?q=${booking.address}`"
              target="_blank"
              >{{ booking.address }}</a
            >
          </td>
          <td>{{ formatDate(booking.start_time) }}</td>
          <td>{{ formatTime(booking.start_time) }}</td>
          <td>{{ formatTime(booking.end_time) }}</td>
          <td>{{ booking.seats }}</td>
          <td>{{ booking.total_price }} грн</td>
          <td>{{ booking.is_paid ? "так" : "ні" }}</td>
          <td>
            <v-btn @click="deleteBooking(booking.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import Loader from "~/components/Loader.vue";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";

const store = useStore();
const bookings = ref([]);
const sortByDateDirection = ref("desc");
const isLoading = ref(false);
const isLoad = () => store.state.isLoading;
definePageMeta({
  layout: "layout-auth-users",
});

function setUserData() {
  if (localStorage.getItem("userData")) {
    store.commit("setUserData", JSON.parse(localStorage.getItem("userData")));
  }
  store.state.activeTabAuthUserMenu = "historyActive";
}

async function getBookingsData() {
  isLoading.value = true;
  try {
    const { $api } = useNuxtApp();
    const response = await $api.get(
      `/bookings?userId=${store.state.authUser.id}`,
    );
    if (response.data) {
      const bookingsWithDetails = response.data.map((booking) => {
        return {
          ...booking,
          space_name: booking.space_name || "Unknown Space",
          coworking_name: booking.coworking_name || "Unknown Coworking",
          address: booking.coworking_address || "Unknown Address",
        };
      });
      bookings.value = sortBookingsByDate(
        bookingsWithDetails,
        sortByDateDirection.value,
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    store.state.isLoading = true;
    isLoading.value = false;
  }
}

function sortBookingsByDate(bookingsList, direction) {
  return bookingsList.sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    if (direction === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA");
}

function formatTime(timeString) {
  const time = timeString.slice(11, 16);
  return time;
}

async function deleteBooking(id) {
  try {
    const { $api } = useNuxtApp();
    await $api.delete(`/bookings?id=${id}`);
    getBookingsData();
  } catch (error) {
    console.error(error);
  }
}

const sortedBookings = computed(() => {
  return sortBookingsByDate(bookings.value, sortByDateDirection.value);
});

function sortByDate() {
  sortByDateDirection.value =
    sortByDateDirection.value === "asc" ? "desc" : "asc";
  bookings.value = sortBookingsByDate(
    bookings.value,
    sortByDateDirection.value,
  );
}

onMounted(() => {
  setUserData();
  getBookingsData();
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
  text-align: left;
}

.booking-table th {
  background-color: var(--book-form);
  color: var(--white-color);
}

.v-table > .v-table__wrapper > table > tbody > tr > td {
  padding: 8px;
}

.booking-table a:hover {
  text-decoration: underline;
}

.booking-table th.date {
  position: relative;
  cursor: pointer;
}

.booking-table th .mdi {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
}
</style>
