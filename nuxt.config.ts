// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    plugins: [
        '~/plugins/axios',
        '~/plugins/vuetify',
    ],

  devtools: { enabled: true },
  css: [
    'vuetify/lib/styles/main.sass',
    '~/assets/css/developers.css',
    '~/assets/css/style.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
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
    head:{
      title: 'EduHUB',
      meta: [
        { name: 'discription', content: 'EduHUB- обирай коворкінг для ефективного навчання та роботи.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'
        }
      ]
    }
  },
})
