<template>
  <div class="footer">
    <div class="contacts">
      <div class="location">
        <a
          href="https://www.google.com/maps/search/%D0%BC.+%D0%92%D1%96%D0%BD%D0%BD%D0%B8%D1%86%D1%8F,+%D0%B2%D1%83%D0%BB.+%D0%93%D0%B5%D1%80%D0%BE%D1%97%D0%B2+%D0%BF%D0%BE%D0%BB%D1%96%D1%86%D1%96%D1%97,+28/@49.2347047,28.3872331,12z/data=!3m1!4b1?authuser=0&entry=ttu"
          class="sharing-item"
          target="_blank"
          ><img src="~assets/icon_location.png" alt="icon"
        /></a>
        <a
          href="https://www.google.com/maps/search/%D0%BC.+%D0%92%D1%96%D0%BD%D0%BD%D0%B8%D1%86%D1%8F,+%D0%B2%D1%83%D0%BB.+%D0%93%D0%B5%D1%80%D0%BE%D1%97%D0%B2+%D0%BF%D0%BE%D0%BB%D1%96%D1%86%D1%96%D1%97,+28/@49.2347047,28.3872331,12z/data=!3m1!4b1?authuser=0&entry=ttu"
          target="_blank"
          >м. Вінниця, вул. Героїв поліції, 28</a
        >
      </div>
      <div class="phone-number">
        <a href="tel:+380674317424" class="sharing-item">
          <img src="~assets/icon_phone.png" alt="icon" />
        </a>
        <a href="tel:+380674317424">+38 067 431 74 24</a>
      </div>
    </div>
    <div class="sharing">
      <a
        href="https://t.me/IT_Academy_Vinnytsia"
        target="_blank"
        class="sharing-item"
      >
        <img src="~assets/icon_telega.png" alt="telegram" />
      </a>
      <a
        href="https://www.facebook.com/EduHubVinnytsia"
        target="_blank"
        class="sharing-item"
      >
        <img src="~assets/icon_face.png" alt="facebook" />
      </a>
      <a
        href="viber://chat?number=+380674317424"
        class="sharing-item"
        target="_blank"
      >
        <img src="~assets/icon_twit.png" alt="viber" />
      </a>
      <a
        href="https://www.instagram.com/ita.in.ua/"
        class="sharing-item instagram"
        target="_blank"
      >
        <img src="~assets/instagram.png" alt="instagram" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.footer {
  padding: 24px 16px 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #09273b;
}

.footer .contacts {
  display: flex;
  flex-direction: column;
}

.sharing {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 24px 36px 0px 36px;
}

.footer .contacts a {
  color: #fff;
  font-family: Verdana;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 10px;
  text-decoration: none;
}

.footer .contacts .sharing-item {
  margin-right: 13px;
}

.footer .contacts .phone-number {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.footer .contacts .location {
  display: flex;
  flex-direction: row;
  margin-right: 16px;
  align-items: center;
  margin-bottom: 16px;
}

.sharing-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30.23px;
  height: 30.23px;
  border-radius: 50%;
  background-color: #f95c65;
}

.sharing-item:hover {
  background-color: #fa414c;
}

.sharing-item:active {
  background-color: #fe303c;
}
.sharing-item.instagram img {
  width: 25px;
}

@media (min-width: 375px) {
  .footer .contacts a {
    font-size: 16px;
  }
}

@media (min-width: 768px) {
  .footer {
    flex-direction: row;
    justify-content: center;
    padding: 12px 0 12px 5px;
  }

  .sharing {
    width: 124px;
    height: 124px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 0 0 175px;
  }
  .sharing-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 5px;
    background-color: #f95c65;
  }
}
</style>
