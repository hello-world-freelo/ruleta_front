export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  router: {
    base: '/sorteos/'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'app-sorteos',
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,600;0,700;0,800;1,700&display=swap' }
    ]
  },

  env: {
    HOST_PUBLIC: process.env.HOST_PUBLIC,
    API_URL_SPA: process.env.API_URL_SPA,
    API_URL_SSR: process.env.API_URL_SSR
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css', // Path to your CSS file
    '@/assets/fonts/fontawesome/css/all.min.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/axios.js', ssr: false },
    { src: '@/plugins/store.js', ssr: false },
    { src: '@/plugins/vuelidate.js', ssr: false },
    { src: '@/plugins/vuesax.js', ssr: false },
    {src: '@/plugins/detectMobile.js', ssr: false},
    {src: '@/plugins/sweetalert2.js', ssr: false},
    {src: '@/plugins/injectFn.js', ssr: false}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
