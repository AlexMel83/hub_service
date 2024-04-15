<template>
    <div class="other-page">
      <TheHeaderMainManager></TheHeaderMainManager>
      
      <NuxtPage></NuxtPage>
  
      <TheFooterMain ref="footerRef" />
  
      <button id="scrollToTop" :class="{ 'in-footer': isScrollToTopInFooter, 'show': showScrollToTop  }" @click="scrollToTop">
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          
        >
          <rect x="0.5" y="0.5" width="49" height="49" rx="24.5" :stroke="isScrollToTopInFooter ? 'var(--white-color)' : 'var(--footer-bg)'" />
          <rect
            x="3.5"
            y="3.5"
            width="43"
            height="43"
            rx="21.5"
            :stroke="isScrollToTopInFooter ? 'var(--white-color)' : 'var(--footer-bg)'"
          />
          <path
            d="M26.0607 18.9596C25.4749 18.3738 24.5251 18.3738 23.9393 18.9596L14.3934 28.5055C13.8076 29.0913 13.8076 30.0411 14.3934 30.6269C14.9792 31.2127 15.9289 31.2127 16.5147 30.6269L25 22.1416L33.4853 30.6269C34.0711 31.2127 35.0208 31.2127 35.6066 30.6269C36.1924 30.0411 36.1924 29.0913 35.6066 28.5055L26.0607 18.9596ZM26.5 21.0203L26.5 20.0203L23.5 20.0203L23.5 21.0203L26.5 21.0203Z"
            :fill="isScrollToTopInFooter ? 'var(--white-color)' : 'var(--footer-bg)'"
          />
        </svg>
      </button>
    </div>
  </template>
  
  <script>
  import TheFooterMain from "../components/TheFooterMain.vue";
  import TheHeaderMainManager from "../components/TheHeaderMainManager.vue";
  
  export default {
    components: {
      TheFooterMain,
      TheHeaderMainManager,
    },
    data() {
      return {
        isScrollToTopInFooter: false,
        showScrollToTop: false,
      };
    },
    // beforeCreate() {
    // // Пример: установка Bearer токена, если пользователь авторизован
    //     const token = this.$store.getters['auth/getToken'];
    //     if (token) {
    //     this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //     }
    // },
    
    methods: {
      scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      handleScroll() {
        const footer = this.$refs.footerRef;
  
        if (footer && footer.$el) {
          const footerRect = footer.$el.getBoundingClientRect();
          const isInFooter =
            footerRect.top <= window.innerHeight && footerRect.bottom >= 0;
  
          this.isScrollToTopInFooter = isInFooter;
  
          const scrollPosition = window.scrollY;
          const screenHeight = window.innerHeight;
          this.showScrollToTop = scrollPosition > screenHeight;
        }
      },
    },
    mounted() {
      window.addEventListener("scroll", this.handleScroll);
    },
    destroyed() {
      window.removeEventListener("scroll", this.handleScroll);
    },
  };
  </script>
  
  <style>
  .other-page {
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
  }
  
  .grecaptcha-badge {
    display: none !important;
  }
  
  #scrollToTop {
    position: fixed;
    bottom: 65px;
    right: 16px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    background-color: var(--space-bg);
    z-index: 4;
  }
  
  #scrollToTop.in-footer {
    background-color: transparent;
    color: var(--white-color);
  }
  
  #scrollToTop.show {
    opacity: 0.8;
    visibility: visible;
  }
  
  @media (min-width: 768px) {
    #scrollToTop {
      bottom: 24px;
      right: 24px;
    }
  
    #scrollToTop:hover {
      background-color: var(--btn-border);
    }
  
    #scrollToTop:active {
      background-color: transparent;
    }
  
   #scrollToTop:hover rect {
      stroke: var(--white-color);
    }
  
    #scrollToTop:active rect {
      stroke: var(--btn-border);
    }
  
    #scrollToTop:hover path {
      fill: var(--white-color);
    }
  
    #scrollToTop:active path {
      fill: var(--btn-border);
    }
  
  }
  
  @media (min-width: 1440px) {
    #scrollToTop {
      background-color: transparent;
    }
  }
  </style>