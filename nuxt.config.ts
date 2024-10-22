// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  head: {
    title: "PDDV",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "Proyecto Decodificador De Voz",
        name: "Proyecto Decodificador De Voz",
        content: "Proyecto Decodificador De Voz",
      },
    ],
  },

  modules: [
    "nuxt-primevue",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt", // needed
    "@pinia-plugin-persistedstate/nuxt",
  ],

  runtimeConfig: {
    public: {
      pddvAPI: process.env.PDDV_API,
    },
    private: {},
  },

  css: [
    "primevue/resources/themes/aura-light-green/theme.css",
    "primevue/resources/primevue.min.css",
    "primeicons/primeicons.css",
    "@/assets/css/main.css",
  ],

  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },

  primevue: {
    usePrimeVue: true,
  },

  compatibilityDate: "2024-07-24",
});
