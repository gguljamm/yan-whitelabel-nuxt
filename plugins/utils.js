import Vue from 'vue';
import api from '~/utils/api';
import format from '~/utils/format';

const x = api;
// eslint-disable-next-line func-names
x.install = function () {
  Vue.prototype.$apis = this;
};

Vue.use(x);

const y = format;
// eslint-disable-next-line func-names
y.install = function () {
  Vue.prototype.$format = this;
};

Vue.use(y);
