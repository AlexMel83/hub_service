// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  plugins: ["~/plugins/axios", "~/plugins/vuetify"],

  devtools: { enabled: true },
  css: [
    "@mdi/font/css/materialdesignicons.min.css",
    "vuetify/lib/styles/main.sass",
    "~/assets/src/developers.css",
    "~/assets/src/styles.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  app: {
    head: {
      title: "EduHUB",
      meta: [
        {
          name: "discription",
          content:
            "EduHUB- обирай коворкінг для ефективного навчання та роботи.",
        },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui",
        },
      ],
    },
  },
});
