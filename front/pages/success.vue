<template>
  <div class="success">
    <Loader v-if="isLoading" />
    <div class="container" v-if="booking">
      <h1>
        {{ booking.user_name ? booking.user_name : booking.guest_first_name }},
        дякуємо за Ваше бронювання!
      </h1>
      <p class="thank-you .text-green">
        Простір <strong>"{{ booking.space_name }}"</strong> у коворкінгу
        <strong>"{{ booking.coworking_name }}"</strong> успішно заброньовано.
      </p>
      <div class="booking-info">
        <ul>
          <li><strong>Дата:</strong> {{ formatDate(booking.start_time) }}</li>
          <li>
            <strong>Тривалість:</strong> {{ formatTime(booking.start_time) }} -
            {{ formatTime(booking.end_time) }}
          </li>
          <li><strong>Кількість місць:</strong> {{ booking.seats }}</li>
          <li><strong>Адреса:</strong> {{ booking.coworking_address }}</li>
          <li><strong>Ціна:</strong> {{ booking.total_price }} грн</li>
        </ul>
      </div>

      <p class="text-green">Оплата успішно здійснена через LiqPay</p>
      <p v-if="authUser().role === 'user'" class="details">
        Деталі бронювання ви можете переглянути <br /><nuxt-link
          to="/user/history"
          class="contact"
          >в особистому кабінеті</nuxt-link
        >
      </p>
      <p>
        Якщо у вас є будь-які питання, будь ласка, зв'яжіться з нами за адресою
        електронної пошти:
        <a class="contact" href="mailto:{{ booking.coworking_email }}">{{
          booking.coworking_email
        }}</a
        ><br />
        або за телефоном
        <a class="contact" href="tel:{{ booking.coworking_phone }}">{{
          booking.coworking_phone
        }}</a
        >.
      </p>
      <nuxt-link to="/" class="btn">на головну</nuxt-link>
    </div>
  </div>
</template>

<script setup>
import Loader from "~/components/Loader.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const { $api } = useNuxtApp();
const store = useStore();
const authUser = () => {
  return store.state.authUser;
};

const route = useRoute();
const payment = ref(null);
const booking = ref(null);

const isLoading = ref(false);

const paymentId = computed(() => {
  return route.query.payment_id;
});

const fetchPayment = async () => {
  isLoading.value = true;
  try {
    const response = await $api.get(`/payments?id=${paymentId.value}`);
    if (Array.isArray(response.data)) {
      payment.value = response.data[0];
    } else {
      payment.value = response.data;
    }
    const bookingId = payment.value.booking_id;
    await fetchBooking(bookingId);
  } catch (error) {
    console.error("Failed to fetch payment:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchBooking = async (bookingId) => {
  try {
    const response = await $api.get(`/bookings?id=${bookingId}`);
    booking.value = response.data[0];
  } catch (error) {
    console.error("Failed to fetch booking:", error);
  }
};

onMounted(async () => {
  await fetchPayment();
});
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA");
};

const formatTime = (timeString) => {
  const time = timeString.slice(11, 16);
  return time;
};
</script>

<style scoped>
.success {
  background-color: var(--space-bg-mob);
  min-height: calc(100vh - 303px);
  display: flex;
  align-items: center;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
}

p {
  color: #555;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.booking-info {
  text-align: left;
  margin-bottom: 20px;
}

.booking-info li {
  margin-bottom: 10px;
  font-size: 16px;
  color: #444;
}

.thank-you {
  font-size: 24px;
  margin-bottom: 20px;
}

.text-green {
  color: #28a745;
  font-weight: 600;
}

.contact {
  color: var(--btn-border);
  text-decoration: none;
  font-weight: bold;
}

.contact:hover {
  text-decoration: underline;
}

.success .btn {
  background-color: var(--header-bg);
  color: white;
  padding: 12px 24px;
  border-radius: 5px;
  text-transform: uppercase;
  margin: 0 auto;
  display: block;
  width: fit-content;
}

.success .btn:hover {
  background-color: var(--btn-border);
}
</style>
