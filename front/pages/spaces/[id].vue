<template>
  <div class="coworking-page">
    <div class="box-covork">
      <h1 class="coworking-space-name-text desktop">{{ item.name }}</h1>
      <div class="star-rating">
        <v-rating
          half-increments
          hover
          readonly
          :length="5"
          :size="44"
          :model-value="4"
          color="#AF3800"
          active-color="#AF3800"
        />
      </div>
      <div>
        <img
          class="photo-dekstop"
          :src="`${item.photo}`"
          alt="coworking photo"
        />
      </div>
      <div class="map">
        <a href="">
          <img
            class="location-img"
            src="./../../assets/icon_location.png"
            alt="local"
          />
        </a>
        <a class="map-text" href="">{{ item.address }}</a>
      </div>
    </div>
    <div class="information-coworking desktop">
      <h2 class="coworking-text-title">Про нас</h2>
      <p class="coworking-text">{{ item.description }}</p>
    </div>
    <div class="desktop-seating-arrangement">
      <h2 class="seating-arrangement">Розташування місць</h2>
      <div class="icons-container-places-desktop">
        <div
          class="icons-container-places"
          v-for="seatingArrangement in selectedseatingArrangement(
            item.seatingArrangements
          )"
          :key="seatingArrangement.name"
        >
          <img
            class="icons-places"
            :src="seatingArrangement.icon"
            :alt="seatingArrangement.name"
          />
        </div>
      </div>
      <div class="telephone-emil-desktop">
        <h2 class="telephone-img-coworcing-mobile-off">
          <a :href="'tel:' + item.phoneNumber.replace(/\D/g, '')">
            <img src="./../../public/telephone_coworking_desktop.svg" />
            {{ item.phoneNumber }}
          </a>
        </h2>
        <h2 class="telephone-img-coworcing-mobile-off">
          <a v-if="item.email" :href="'mailto:' + item.email" target="_blank">
            <img src="./../../public/email.svg" />{{ item.email }}
          </a>
        </h2>
      </div>
      <div class="social-icon">
        <div v-for="socialItem in item.social" :key="socialItem.name">
          <a :href="socialItem.link" target="_blank">
            <img :src="'../' + socialItem.icon" :alt="socialItem.name" />
          </a>
        </div>
      </div>
      <div class="about-space-desktop">
        <div class="desktop-clock">
          <img class="desktop-clock-icon" src="~/public/clock.svg" />
          <p class="text-icon-desktop">
            Пн-Пт {{ item.businessDayStart }}-{{ item.businessDayEnd }}
          </p>
          <p class="text-icon-desktop">
            Cб-Нд {{ item.dayOffStart }}-{{ item.dayOffEnd }}
          </p>
        </div>
        <div class="desktop-people-people">
          <img class="people-people" src="~/public/people.svg" />
          <p class="text-icon-desktop">Робочих місць {{ item.amount }}</p>
        </div>
        <div class="currency-dollar-desktop">
          <img
            class="desktop-currency-dollar-icon"
            src="./../../assets/spaces_images/money.svg"
          />
          <p class="text-icon-desktop">Від {{ item.firstPrice }}</p>
          <p class="text-icon-desktop">До {{ item.lastPrice }}</p>
        </div>
      </div>
      <div class="about-space-mobile">
        <div class="mobile-people-people">
          <img class="people-people" src="~/public/people.svg" />
          <p class="text-icon-desktop">Робочих місць {{ item.amount }}</p>
        </div>
        <div class="mobile-clock">
          <img class="desktop-clock-icon" src="~/public/clock.svg" />
          <div class="box-days">
            <p class="text-icon-desktop">
              Пн-Пт {{ item.businessDayStart }}-{{ item.businessDayEnd }}
            </p>
            <p class="text-icon-desktop">
              Cб-Нд {{ item.dayOffStart }}-{{ item.dayOffEnd }}
            </p>
          </div>
        </div>
        <div class="currency-dollar-mobile">
          <img
            class="desktop-currency-dollar-icon"
            src="./../../assets/spaces_images/money.svg"
          />
          <div class="box-price">
            <p class="text-icon-desktop">Від {{ item.firstPrice }}</p>
            <p class="text-icon-desktop">До {{ item.lastPrice }}</p>
          </div>
        </div>
      </div>
      <div class="box-book-button">
        <v-btn
          class="book-button"
          @click="openBookModal"
          v-if="item.name == 'EduHUB'"
          >Забронювати</v-btn
        >
        <ModalComponents @closeModal="closeModal" />
      </div>
    </div>
    <div class="line"></div>
    <div class="free-services">
      <h2 class="coworking-text-title">
        Безкоштовні послуги (включені у вартість)
      </h2>
    </div>
    <div class="icons-container down">
      <div
        class="icons-container-text"
        v-for="advantage in selectedAdvantages(item.advantages)"
        :key="advantage.name"
      >
        <img :src="advantage.icon" :alt="advantage.name" />
        <p>{{ advantage.name }}</p>
      </div>
    </div>
    <div class="free-services">
      <h2 class="coworking-text-title">Простори</h2>
    </div>
    <div class="">
      <div
        class="spaces-desktop"
        v-for="space in item.spaces"
        :key="space.name"
      >
        <div class="spaces-desktop-text">
          <p>{{ space.name }}</p>
          <p>{{ space.amount }}</p>
        </div>
        <img class="space-img" :src="space.photo" :alt="space.name" />
        <div class="box-space-button">
          <v-btn class="book-button" 
          @click="openBookModal"
          v-if="item.name == 'EduHUB'" >Забронювати</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import spacesData from "./../../mixins/spacesData";
import CoworkingImg from "./../../components/spacesComponents/Coworking.vue";
import ModalComponents from "./../../components/modal/ModalComponents.vue";
export default {
  components: {
    CoworkingImg,
    ModalComponents,
  },
  mixins: [spacesData],
  data() {
    return {
      datePickerVisible: false,
      selectedItemCity: null,
      itemsFromServerCity: [
        "Вінниця",
        "Київ",
        "Запоріжжя",
        "Бердичів",
        "Харків",
        "Тернопіль",
      ],
      dynamicLabelCity: "Місто",
      selectedItemNumberOfPeople: null,
      itemsFromServerNumberOfPeople: ["1", "2", "3", "4", "5", "6"],
      dynamicLabelNumberOfPeople: "Kількість осіб",
      selectedItemSpace: null,
      itemsFromServerSpace: ["Робоче місце", "Переговорна кімната", "Офіс"],
      dynamicLabelSpace: "Простір",
      item: {},
    };
  },
  created() {
    const spaceId = this.$route.params.id;
    this.item = this.spacesData.find((space) => space.id == spaceId) || {};
  },
  methods: {
    openDatePicker() {
      this.datePickerVisible = true;
    },
    selectedAdvantages(advantages) {
      if (advantages) {
        return advantages.filter((advantage) => advantage.selected);
      } else {
        return [];
      }
    },
    selectedseatingArrangement(seatingArrangements) {
      if (seatingArrangements) {
        return seatingArrangements.filter(
          (seatingArrangement) => seatingArrangement.selected
        );
      } else {
        return [];
      }
    },
    openBookModal() {
      document.body.style.position = "fixed";
      this.$bus.$emit("Modal", {
        showBook: true,
        openModal: true,
      });
    },
    closeModal() {
      document.body.style.position = "";
    },
  },
};
</script>

<style scoped>
.box {
  background-color: var(--1, #09273b);
}

section {
  min-height: 100%;
  padding: 4% 4% 4% 4%;
}
.box-covork {
  background-color: var(--footer-bg);
  flex-direction: column;
}
.v-autocomplete {
  background: rgb(255, 255, 255);
  height: 56px;
  border-radius: 5px;
  margin: 23px 0 0 0px;
}

.v-btn {
  height: 55px;
  width: 100%;
  margin: 20px 0 0 0;
  text-transform: capitalize;
  letter-spacing: normal;
  font-size: 18px;
}

.coworking-space-name-text {
  text-align: center;
  color: var(--white-color);
}

.map-text {
  color: var(--white-color);
  margin-left: 7px;
  text-decoration: none;
}

.location-img {
  color: var(--white-color);
}

.information-coworking {
  padding: 10px 10px 10px 10px;
}

.coworking-text {
  margin-bottom: 10px;
}

.coworking-text-title {
  font-size: 32px;
  font-weight: 400;
  margin-top: 16px;
  margin-bottom: 16px;
}

.map {
  text-align: justify;
  padding: 0 0 0 14px;
}
.number-seats {
  display: flex;
  justify-content: space-between;
  padding: 30px 0 30px 0;
}

.coworking-price {
  display: flex;
  justify-content: space-between;
}

.seating-arrangement {
  text-align: center;
  font-size: 32px;
  font-weight: 400;
}

.icons-container.up {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
  color: var(--white-color);
}

.money {
  display: flex;
  align-items: center;
}

.icons-container.down {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
  flex-direction: column;
  gap: 30px;
  padding: 10px 10px 40px 10px;
}

.icons-container img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 2px;
}

.icons-container-text {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.icons-container-places {
  display: inline-block;
}

.icons-places {
  height: 60px;
  margin: 20px 15px 0 15px;
}

.about-space-desktop {
  display: none;
  padding: 20px 0 20px 30px;
  flex-direction: column;
}

.book-button {
  width: 360px;
  background-color: var(--1, #09273b);
  color: aliceblue;
  height: 40px;
  margin: 0;
}

.box-book-button {
  display: flex;
  justify-content: center;
  padding: 0px 0px 20px 0px;
}

.star-rating{
  display: flex;
  justify-content: center;
}

.photo-dekstop{
  width: 350px;
  margin: 0 0 0 13px;
  border: 1px solid #FFF;
}

.telephone-img-coworcing-mobile-off {
  display: flex;
  justify-content: flex-start;
  padding: 23px 0 0 30px;
  color: var(--5, #000);
  gap: 6px;
  font-size: 5.3vw;
  font-weight: 400;
  line-height: normal;
  }

  .telephone-emil-desktop a {
    text-decoration: none;
    color: var(--black-color);
    display: flex;
    align-items: center;
  }

  .telephone-emil-desktop img{
    margin-right: 7px;
    height: 26px;
  }

  .social-icon{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 20px 0px 0 0px;
  }

  .desktop-clock{
    display: flex;
  }

  .space-img{
    height: 40vw;
  }

  .spaces-desktop{
    display: flex;
    flex-direction: column;
    padding: 0 10px 15px 10px;
  }

  .box-space-button{
    display: flex;
    justify-content: flex-end;
    padding: 10px 0px 0px 0px;
  }

  .about-space-mobile{
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 20px 0 20px 0;
  }

  .mobile-people-people{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 25px;
    gap: 20px;
  }

  .mobile-clock{
    display: flex;
    align-items: center;
    padding: 0 0 0 25px;
    gap: 19px;
  }

  .box-days{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .currency-dollar-mobile{
    display: flex;
    flex-direction: row;
    padding: 0 0 0 25px;
    gap: 25px;
  }

  .box-price{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

@media (min-width: 768px) {
  .desktop {
    width: 55%;
  }

  .desktop-seating-arrangement {
    position: fixed;
    margin: 60px 2% 0 0;
    display: flex;
    padding: 2% 3% 2% 3%;
    z-index: 2;
    width: 43%;
    height: 42vw;
    gap: 1.5vw;
    right: 0;
    top: 69px;
    border: thick solid #9ba5b7;
    background-color: rgb(255, 255, 255);
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .icons-places[data-v-38cd972c] {
    height: 5vw;
  }

  .telephone-img-coworcing-desktop-off {
    display: none;
  }

  .telephone-img-coworcing-mobile-off {
    display: flex;
    justify-content: flex-start;
    padding: 23px 0 0 0;
    color: var(--5, #000);
    gap: 6px;
    font-size: 1.3vw;
    font-weight: 400;
    line-height: normal;
  }

  .desktop-people-people {
    display: flex;
    flex-direction: column;
  }

  .about-space-desktop {
    display: flex;
    justify-content: center;
    gap: 27px;
    display: flex;
    padding: 0;
    flex-direction: row;
  }
  .photo-dekstop {
    width: 53%;
    padding: 4px 0 20px 40px;
  }

  .seating-arrangement {
    color: var(--wirefram-05, #000);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .icons-places {
    height: 5vw;
  }

  .telephone-emil-desktop {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }

  .telephone-emil-desktop img {
    margin-right: 7px;
    height: 26px;
  }

  .telephone-emil-desktop a {
    text-decoration: none;
    color: var(--black-color);
    display: flex;
    align-items: center;
  }
  .icons-container-places-desktop {
    display: flex;
    justify-content: center;
  }

  .people-people {
    height: 30px;
    margin-bottom: 10px;
  }

  .desktop-clock {
    display: flex;
    flex-direction: column;
  }

  .desktop-clock-icon {
    height: 30px;
    margin-bottom: 10px;
  }

  .text-icon-desktop {
    font-size: 1.3vw;
  }

  .currency-dollar-desktop {
    display: flex;
    flex-direction: column;
  }

  .desktop-currency-dollar-icon {
    height: 30px;
    margin-bottom: 10px;
  }

  .box-covork {
    display: flex;
  }
  .star-rating {
    width: 54%;
    text-align: center;
  }

  .map {
    width: 23%;
    text-align: center;
    padding: 0 0 12px 0px;
  }

  .coworking-text-title {
    height: 50%;
    padding: 0 0 0px 40px;
    

  }

  .free-services {
    width: 55%;
  }

  .icons-container.down {
    gap: 23px;
    display: flex;
    padding: 10px 0px 40px 45px;
    width: 46%;
    backdrop-filter: none;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .icons-container-text {
    width: 180px;
  }

  .line {
    border-bottom: 2px solid #545f71;
    width: 55%;
  }

  .spaces-desktop {
    padding: 0 0px 25px 35px;
    margin: 0 0 50px 0;
  }

  .spaces-desktop-text {
    display: flex;
    justify-content: space-between;
    width: 49%;
    padding: 0 0 15px 0px;
    font-size: 24px;
  }

  .space-img {
    width: 48vw;
    border-radius: 20px;
  }

  .box-space-button {
    display: flex;
    width: 49%;
    justify-content: flex-end;
    padding: 10px 0px 0px 0px;
  }
  .social-icon{
    display: flex;
    justify-content: center;
    gap: 30px;
    align-items: center;
  }

  .photo-dekstop{
  height: 50%;
  margin: 0;
  border: none;
}

.spaces-desktop{
    height: 380px;
  }

  .space-img{
    height: 90%;
  }

  .coworking-text {
    padding: 0px 0px 25px 40px 
  }

  .book-button {
    width: 200px;
  }

  .about-space-mobile{
    display: none;
  }

}
</style>