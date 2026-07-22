// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts'
  },
  nitro: {
    experimental: {
      websocket: true
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'page', mode: 'out-in' }
  },
  tailwindcss: {
    viewer: false
  }
})
