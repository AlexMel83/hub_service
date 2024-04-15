<template>
    <div class="developers-page">
      <div
        class="offcanvas offcanvas-end"
        style="width: 60vw"
        tabindex="-1"
        id="offcanvasRight"
        ref="container"
        aria-labelledby="offcanvasRightLabel"
      >
        <div class="flex_en flex_en_two">
          <div class="translate">UA</div>
          <div class="br_header"></div>
          <a class="link_ln" href="developers-en.html">
            <div class="translate translate_one">EN</div>
          </a>
        </div>
        <img
          @click="brRemove()"
          class="cross"
          src="~assets/developers/closeBurgerMenu.png"
          alt="close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
        <ul class="burger_menu_top">
          <li class="item_burger">
            <a @click="brRemovee()" class="link_burger ln_height_br" href="/"
              >Головна</a
            >
          </li>
          <li class="item_burger">
            <a
              @click="brRemovee()"
              class="link_burger ln_height_br"
              href="#mentors_text"
              >Наставники</a
            >
          </li>
          <li class="item_burger">
            <a
              @click="brRemovee()"
              class="link_burger ln_height_br"
              href="#container_students"
              >Команда</a
            >
          </li>
          <li class="item_burger">
            <a
              class="link_burger ln_height_br"
              @click="brRemovee()"
              href="#text_technologi"
              >Технології проєкту</a
            >
          </li>
          <li class="item_burger_bt">
            <a
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfHnq7BpNh56usPNMw54poaw5nve-sEINkJo6DNdstXqQPwTw/viewform"
            >
              <button class="btn_progect_br">Замовити проєкт</button>
            </a>
          </li>
        </ul>
      </div>
      <div class="blur_container_br" ref="blur">
        <div class="header_container">
          <a
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfHnq7BpNh56usPNMw54poaw5nve-sEINkJo6DNdstXqQPwTw/viewform"
            class="btn-1 btn-white btn-animation-1"
            >Замовити проєкт</a
          >
          <img
            @click="brAdd()"
            class="open_btn btn-primary img_burger"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
            src="~assets/developers/burger.svg"
          />
        </div>
        <div
          @click="brRemove()"
          class="posterior_background_br"
          ref="posterior"
        ></div>
        <div class="container_header">
          <nav class="shift">
            <ul class="flex_list">
              <li><a href="/">Головна</a></li>
              <li><a href="#mentors_text">Наставники</a></li>
              <li><a href="#container_students">Команда</a></li>
              <li><a href="#text_technologi">Технології проєкту</a></li>
            </ul>
          </nav>
          <a
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfHnq7BpNh56usPNMw54poaw5nve-sEINkJo6DNdstXqQPwTw/viewform"
            class="btn-1 btn-white btn-animation-1"
            >Замовити проєкт</a
          >
          <div class="flex_en">
            <div class="translate">UA</div>
            <div class="br_header"></div>
            <a class="link_language" href="developers-en.html">
              <div class="translate translate_one">EN</div>
            </a>
          </div>
        </div>
        <div class="about_container">
          <div class="container_one">
            <div class="container_intita">
              <a
                class="link_intita"
                target="_blank"
                href="https://www.ita.in.ua/"
              >
                <img class="picture_intita" src="~assets/developers/ITA.png" />
              </a>
              <span class="text_intita">
                <a
                  class="link_intita"
                  target="_blank"
                  href="https://www.ita.in.ua/"
                >
                  Вінницька<br />
                  ІТ-Академія
                </a>
              </span>
            </div>
            <div class="text_one">Програмуй майбутнє!</div>
            <div class="text_two">
              Ти справді хочеш роботу в ІТ?<br />
              Тоді тобі до нас!
            </div>
          </div>
          <div>
            <div class="container_about_one">
              Ми займаємось підготовкою, супроводом та працевлаштуванням в ІТ
            </div>
            <div class="container_about_two">
              Тільки необхідні навички, викладачі-практики, реальні проєкти і
              мотивуюче середовище
            </div>
            <div class="container_about_three">
              Наша формула: 20% теорії та 80% практики
            </div>
            <div class="container_about_four">Інтенсивні програми навчання</div>
          </div>
        </div>
        <h2 id="mentors_text" class="mentors_text">Наші наставники</h2>
        <div class="swiper mySwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="mentors">
                <img
                  class="mentor_pictire"
                  src="~assets/developers/Marianna.png"
                />
                <div class="flex_mentors">
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/marianaderlitsa/"
                    ><img class="linkidin" src="~assets/developers/Linkedin.png"
                  /><p>Мар’яна<br />Дерлиця</p></a>                
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="mentors">
                <img class="mentor_pictire" src="~assets/developers/Oleksandr.png" />
                <div class="flex_mentors">
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/alexandr-panchenko-46b706107/"
                    ><img class="linkidin" src="~assets/developers/Linkedin.png"
                  /><p>Олександр<br />Панченко</p></a>                
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="mentors">
                <img class="mentor_pictire" src="~assets/developers/Toma.png" />
                <div class="flex_mentors">
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/tamara-panchenko-9041b8161/"
                    ><img
                      class="linkidin"
                      src="~assets/developers/Linkedin.png" /><p>Тамара<br />Панченко</p></a
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <div class="mentors_laptop">
          <a
            target="_blank"
            class="link_Linkedin"
            href="https://www.linkedin.com/in/marianaderlitsa/"
          >
            <div class="mentors">
              <img class="mentor_pictire" src="~assets/developers/Marianna.png" />
              <div class="flex_mentors">
                <img class="linkidin" src="~assets/developers/Linkedin.png" />
                Мар’яна<br />Дерлиця
              </div>
            </div>
          </a>
          <a
            target="_blank"
            class="link_Linkedin"
            href="https://www.linkedin.com/in/alexandr-panchenko-46b706107/"
          >
            <div class="mentors">
              <img class="mentor_pictire" src="~assets/developers/Oleksandr.png" />
              <div class="flex_mentors">
                <img class="linkidin" src="~assets/developers/Linkedin.png" />
                Олександр<br />Панченко
              </div>
            </div>
          </a>
          <a
            target="_blank"
            class="link_Linkedin"
            href="https://www.linkedin.com/in/tamara-panchenko-9041b8161/"
          >
            <div class="mentors width_container">
              <img class="mentor_pictire" src="~assets/developers/Toma.png" />
              <div class="flex_mentors">
                <img class="linkidin" src="~assets/developers/Linkedin.png" />
                Тамара<br />Панченко
              </div>
            </div>
          </a>
        </div>
      </div>
      <div id="container_students" class="container_students">
        <h2 class="text_team">Команда розробників</h2>
        <div class="container_students_laptop">
          <a
            class="link_Linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/iuliia-kernitska-145ba626a/"
          >
            <div class="container_student">
              <img
                class="picture_team"
                src="~assets/developers/UlyaKernitskaya.png"
              />
              <div class="container_student_text">
                <div class="name_student white">Юлія Керніцька</div>
                <span class="about_students white">Project Manager</span>
                <img
                  class="picture_linkedin"
                  src="~assets/developers/Linkedin.png"
                />
              </div>
            </div>
          </a>
          <a
            class="link_Linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/iruna-sapunova-3976b823b/"
          >
            <div class="container_student">
              <img class="picture_team" src="~assets/developers/Ira.png" />
              <div class="container_student_text">
                <div class="name_student white">Ірина Сапунова</div>
                <span class="about_students white">UI/UX Designer</span>
                <img
                  class="picture_linkedin"
                  src="~assets/developers/Linkedin.png"
                />
              </div>
            </div>
          </a>
          <a
            class="link_Linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/emiliia-bondarchuk-560350284/"
          >
            <div class="container_student">
              <img class="picture_team" src="~assets/developers/Emiliia.png" />
              <div class="container_student_text">
                <div class="name_student white">Емілія Бондарчук</div>
                <span class="about_students white">QA Engineer</span>
                <img
                  class="picture_linkedin"
                  src="~assets/developers/Linkedin.png"
                />
              </div>
            </div>
          </a>
          <a
            class="link_Linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/nataliia-ananina-a73543259/"
          >
            <div class="container_student">
              <img class="picture_team" src="~assets/developers/Natasha.png" />
              <div class="container_student_text">
                <div class="name_student white">Наталія Ананьїна</div>
                <span class="about_students white">QA Engineer </span>
                <img
                  class="picture_linkedin"
                  src="~assets/developers/Linkedin.png"
                />
              </div>
            </div>
          </a>
        </div>
        <div class="container_students_laptop">
          <a
            class="link_Linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/dariazhur/"
          >
            <div class="container_student">
              <img class="picture_team" src="~assets/developers/Daria.png" />
              <div class="container_student_text">
                <div class="name_student white-mob">Дар’я Журавльова</div>
                <span class="about_students white-mob">Developer</span>
                <img
                  class="picture_linkedin"
                  src="~assets/developers/Linkedin.png"
                />
              </div>
            </div>
          </a>
          <a
            class="link_Linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/dmytro-tuzkov-55104a27b/"
          >
            <div class="container_student">
              <img
                class="picture_team"
                src="~assets/developers/DmytroTuzkov.png"
              />
              <div class="container_student_text">
                <div class="name_student white-mob">Дмитро Тузков</div>
                <span class="about_students white-mob">Developer</span>
                <img
                  class="picture_linkedin"
                  src="~assets/developers/Linkedin.png"
                />
              </div>
            </div>
          </a>
          <a
            class="link_Linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/alexmel83/"
          >
            <div class="container_student">
              <img
                class="picture_team"
                src="~assets/developers/AlexMeleshko.png"
              />
              <div class="container_student_text">
                <div class="name_student">Олександр Мелешко</div>
                <span class="about_students">Developer</span>
                <img
                  class="picture_linkedin"
                  src="~assets/developers/Linkedin.png"
                />
              </div>
            </div>
          </a>
          <a
            class="link_Linkedin"
            target="_blank"
            href="https://www.linkedin.com/in/%D0%B0%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80-%D0%BC%D0%B8%D1%85%D0%B0%D0%BB%D0%B5%D0%B2%D0%B8%D1%87-84692620a/"
          >
            <div class="container_student">
              <img
                class="picture_team"
                src="~assets/developers/OleksandrMuxalevuch.png"
              />
              <div class="container_student_text">
                <div class="name_student">Олександр Михалевич</div>
                <span class="about_students">Developer </span>
                <img
                  class="picture_linkedin"
                  src="~assets/developers/Linkedin.png"
                />
              </div>
            </div>
          </a>
        </div>
      </div>
      <div id="text_technologi" class="text_technologi">Технології проєкту</div>
      <div class="container_Technologies">
        <div class="container_Technologi retreat">
          <img class="picture_technologies" src="~assets/developers/js.png" />
          <div class="text_technologies">JavaScript</div>
        </div>
        <div class="container_Technologi">
          <img class="picture_technologies" src="~assets/developers/html.png" />
          <div class="text_technologies">HTML</div>
        </div>
        <div class="container_Technologi">
          <img class="picture_technologies" src="~assets/developers/css.png" />
          <div class="text_technologies">CSS</div>
        </div>
        <div class="container_Technologi retreat_three">
          <img class="picture_technologies" src="~assets/developers/figma.png" />
          <div class="text_technologies">Figma</div>
        </div>
        <div class="container_Technologi retreat_two">
          <img class="picture_technologies" src="~assets/developers/jira.png" />
          <div class="text_technologies">Jira</div>
        </div>
        <div class="container_Technologi">
          <img class="picture_technologies" src="~assets/developers/tm.png" />
          <div class="text_technologies">TMetric</div>
        </div>
        <div class="container_Technologi">
          <img class="picture_technologies" src="~assets/developers/github.png" />
          <div class="text_technologies">Github</div>
        </div>
        <div class="container_Technologi retreat_three retreat_three_laptop">
          <img
            class="picture_technologies"
            src="~assets/developers/PixelPerfect.png"
          />
          <div class="text_technologies">
            Pixel Perfect<br />
            Tool
          </div>
        </div>
        <div class="container_Technologi retreat_three retreat_three_laptop">
          <img
            class="picture_technologies"
            src="~assets/developers/Google_doc.png"
          />
          <div class="text_technologies">
            Google<br />
            Docs
          </div>
        </div>
        <div class="container_Technologi retreat">
          <img
            class="picture_technologies"
            src="~assets/developers/postman.png"
          />
          <div class="text_technologies">Postman</div>
        </div>
        <div class="container_Technologi retreat">
          <img class="picture_technologies" src="~assets/developers/nuxt.png" />
          <div class="text_technologies">Nuxt JS</div>
        </div>
        <div class="container_Technologi retreat">
          <img
            class="picture_technologies"
            src="~assets/developers/vuetify.png"
          />
          <div class="text_technologies">Vuetify</div>
        </div>
        <div class="container_Technologi retreat">
          <img class="picture_technologies" src="~assets/developers/node.png" />
          <div class="text_technologies">
            Node<br />
            +Express
          </div>
        </div>
        <div class="container_Technologi retreat">
          <img class="picture_technologies" src="~assets/developers/knex.png" />
          <div class="text_technologies">Knex</div>
        </div>
        <div class="container_Technologi retreat">
          <img
            class="picture_technologies"
            src="~assets/developers/postgresql.png"
          />
          <div class="text_technologies">
            Postgre<br />
            SQL
          </div>
        </div>
      </div>
      <footer>
        <div class="foter_mobile">
          <div class="progect">
            Розробка унікального сайту різної складності. Складемо професійний
            проєкт Вашого веб-ресурсу, виконаємо дизайн та розробку з урахуванням
            усіх вимог.
          </div>
          <a
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSfHnq7BpNh56usPNMw54poaw5nve-sEINkJo6DNdstXqQPwTw/viewform"
            class="btn-1 btn-white btn-animation-1 btn_progect_footer"
            >Замовити проєкт</a
          >
        </div>
        <div class="dix_button">
          <svg
            id="topBtn"
            @click="topFunction"
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.6">
              <circle cx="25" cy="25" r="25" fill="var(--btn-hover)" />
              <path
                d="M10 31L25 19L40 31"
                stroke="white"
                stroke-width="5"
                stroke-linecap="round"
              />
            </g>
          </svg>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  import Swiper from "swiper/bundle";
  import "swiper/swiper-bundle.css";
  
  definePageMeta({
    layout: "dev",
  });
  
  export default {
    data() {
      return {
        swiper: null,
      };
    },
    mounted() {
      this.$nextTick(this.initializeSwiper);
      this.initSwiper();
      window.addEventListener("scroll", this.scrollFunction);
    },
    beforeDestroy() {
      window.removeEventListener("scroll", this.scrollFunction);
    },
    methods: {
      initSwiper() {
        this.swiper = new Swiper(".mySwiper", {
          effect: "coverflow",
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: "auto",
          initialSlide: 1,
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          },
          pagination: {
            el: ".swiper-pagination",
          },
        });
      },
      brAdd() {
        if (this.$refs.blur) {
          this.$refs.blur.classList.add("blur_br");
        }
  
        if (this.$refs.posterior) {
          this.$refs.posterior.classList.add("posterior_background");
        }
  
        if (this.$refs.container) {
          this.$refs.container.classList.add("show");
        }
  
        document.body.style.overflow = "hidden";
  
        if (this.$refs.container) {
          this.$refs.container.style.overflow = "auto";
          this.$refs.container.style.display = "block";
        }
      },
      brRemove() {
        document.body.style.overflow = "scroll";
        this.$refs.blur.classList.remove("blur_br");
        this.$refs.posterior.classList.remove("posterior_background");
        this.$refs.container.classList.remove("show");
        this.$refs.container.style.overflow = "";
        this.$refs.container.style.display = "none";
      },
      brRemovee() {
        if (this.$refs.blur) {
          this.$refs.blur.classList.remove("blur_br");
        }
  
        if (this.$refs.posterior) {
          this.$refs.posterior.classList.remove("posterior_background");
        }
  
        if (this.$refs.container) {
          this.$refs.container.classList.remove("show");
          this.$refs.container.style.display = "none";
        }
  
        document.body.style.overflow = "scroll";
      },
      scrollFunction() {
        const topBtn = this.$refs.topBtn;
  
        if (topBtn) {
          if (
            document.body.scrollTop > 20 ||
            document.documentElement.scrollTop > 20
          ) {
            topBtn.style.display = "block";
          } else {
            topBtn.style.display = "none";
          }
        }
      },
      topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
      },
    },
  };
  </script>
  
  <style scoped>
  @import "./../assets/css/developers.css";
  </style>
  