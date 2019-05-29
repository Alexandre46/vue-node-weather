import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  'en': {welcomeMsg: 'Welcome to Your Vue.js App'},
  'es': {welcomeMsg: 'Bienvenido a tu aplicación Vue.js'}
};


const i18n = new VueI18n({locale: 'en', // set locale    fallbackLocale: 'es', // set fallback locale    messages, // set locale messages});
