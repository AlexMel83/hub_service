// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
require("dotenv").config();

export default defineNuxtConfig({
  plugins: [
    "~/plugins/axios",
    "~/plugins/vuetify",
    { src: "~/plugins/leaflet.client.js", mode: "client" },
  ],
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
          content: "HUB- обирай коворкінг для ефективного навчання та роботи.",
        },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
          integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
          crossorigin: "",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiKeyMapbox: process.env.APIKEY_MAPBOX,
    },
    private: {
      // Значения здесь доступны только на стороне сервера
    },
  },
});
