import { VueReCaptcha } from "vue-recaptcha-v3";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: "6LcwRRUaAAAAADavxcmw5ShOEUt1xMBmRAcPf6QP",
    loaderOptions: {
      autoHideBadge: false,
      explicitRenderParameters: {
        badge: "bottomleft",
      },
    },
  });
});
