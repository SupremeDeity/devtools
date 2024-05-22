import { config } from "@tailwindcss/container-queries";

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
  }
})