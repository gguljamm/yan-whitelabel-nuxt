
import Vue from 'vue';
import 'babel-polyfill';
import 'es6-promise/auto';
import * as VueGoogleMaps from 'vue2-google-maps';

require('es6-promise').polyfill();

Vue.use(VueGoogleMaps, {
  load: {
    key: 'test',
    libraries: 'places',
  },
});
