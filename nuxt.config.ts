// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/google-fonts", "@nuxt/eslint"],

  googleFonts: {
    families: {
      Urbanist: true
    }
  },

  ui: {
    icons: ['ph']
  },

  colorMode: {
    preference: 'dark'
  },

  compatibilityDate: "2024-07-11"
})