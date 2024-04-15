<template>
  <div class="footer-wrapper">
    <div class="footer">
      <div class="contacts-wrapper">
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
            <a href="tel:+380674317424">+38 067 431-74-24</a>
          </div>
        </div>
        <div class="sharing">
          <a
            href="https://www.facebook.com/EduHubVinnytsia"
            target="_blank"
            class="sharing-item social"
          >
            <img src="~assets/icons_footer_main/facebook.png" alt="facebook" />
          </a>
          <a
            href="https://t.me/IT_Academy_Vinnytsia"
            target="_blank"
            class="sharing-item social"
          >
            <img src="~assets/icons_footer_main/telegram.png" alt="telegram" />
          </a>
          <a
            href="viber://chat?number=+380674317424"
            class="sharing-item social"
            target="_blank"
          >
            <img src="~assets/icons_footer_main/viber.png" alt="viber" />
          </a>
          <a
            href="https://www.instagram.com/ita.in.ua/"
            class="sharing-item instagram social"
            target="_blank"
          >
            <img
              src="~assets/icons_footer_main/instagram.png"
              alt="instagram"
            />
          </a>
        </div>
      </div>
      <div class="developers">
        <nuxt-link to="/developers" class="developers-link">
          <img src="~assets/intita-logo.png" alt="INTITA logo" />
          <p>
            Розроблено студентами<br />
            Вінницької ІТ-Академії 2023
          </p>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script></script>
<style scoped>
.footer-wrapper {
  background-color: var(--footer-bg);
}
.footer {
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
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
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 10px;
  text-decoration: none;
}
.footer .contacts .sharing-item {
  margin-right: 13px;
  background-color: var(--icons-contact-bg);
}

.footer .contacts .phone-number {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.footer .contacts .location {
  display: flex;
  flex-direction: row;
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
}

.sharing-item.social img {
  border-radius: 50%;
  transition: transform 0.3s;
  width: 40px;
  height: 40px;
}

.sharing-item.social:hover img {
  transform: scale(1.1);
}

.sharing-item.social:active img {
  border: 2px solid var(--btn-border);
}

.developers-link {
  display: flex;
  margin-top: 40px;
}

.developers-link p {
  color: var(--white-color);
  margin-left: 33px;
  align-self: center;
  text-decoration: underline;
}

@media (min-width: 768px) {
  .footer {
    justify-content: center;
    padding: 24px;
  }

  .contacts-wrapper {
    display: flex;
    align-items: center;
  }

  .sharing {
    width: 115px;
    height: 124px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 0 0 200px;
  }

  a.sharing-item {
    width: 30px;
    height: 30px;
  }
  .sharing-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 5px;
  }

  .developers-link {
    margin-top: 24px;
  }
}

@media (min-width: 1440px) {
  .footer {
    padding: 24px 64px;
  }
  .footer .contacts {
    flex-direction: row;
    align-items: center;
  }

  .footer .contacts .location {
    margin: 0 16px;
  }
  .sharing {
    width: 300px;
    height: 60px;
    align-items: center;
  }
}
</style>
