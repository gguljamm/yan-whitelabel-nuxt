import bodyParser from 'body-parser';
import session from 'express-session'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  env: {
    isDev: (process.env.NODE_ENV !== 'production'),
  },
  head: {
    title: '야놀자 | 제휴채널 초특가도 야놀자',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: '야놀자 제휴채널' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '//yaimg.yanolja.com/joy/sunny/static/images/favicon/favicon_16x16.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/normalize.css',
    'swiper/css/swiper.css',
    '~/assets/css/animation.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/catchRouting.js', ssr: false },
    '~/plugins/polyfill.js',
    '~/plugins/utils.js',
    '~/plugins/vue-cookies.js',
    '~/plugins/globalComponents.js',
    { src: '~/plugins/smooth-scroll.js', ssr: false },
    { src:'~/plugins/change-route.js', ssr: false },
    { src:'~/plugins/vue-awesome-swiper.js', ssr: false },
    { src:'~/plugins/clipboard.js', ssr: false },
    { src:'~/plugins/google-map.js', ssr: false },
    { src:'~/plugins/vue-slider.js', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/style-resources'],
    '@nuxtjs/device',
  ],
  styleResources: {
    scss: [
      '~/assets/css/variable.scss',
      '~/assets/css/icon.scss',
    ],
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  buildDir: 'build',
  build: {
    /*
    ** You can extend webpack config here
    */
    babel: {
      presets: ['@nuxt/babel-preset-app'],
      plugins: process.env.NODE_ENV === 'production' ? [['transform-remove-console', { "exclude": [ "error", "warn"] }]] : [],
    },
    vendor: [
      'babel-polyfill',
      'es6-promise/auto',
      'eventsource-polyfill',
    ],
    extend (config, ctx) {
    }
  },
  serverMiddleware: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    session({
      secret: 'super-secret-key',
      resave: false,
      saveUninitialized: true,
    }),
  ],
}
