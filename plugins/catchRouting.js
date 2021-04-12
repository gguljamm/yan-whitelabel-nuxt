import router from 'vue-router'

export default ({ app: { router }, store, error }) => {
  router.beforeEach((to, from, next) => {
    let path = to.fullPath;
    let flag = false;
    if (from.path.split('/')[1] === to.path.split('/')[1]) {
      // next();
    } else if (from.path !== '/') {
      flag = true;
      path = `/${from.path.split('/')[1]}${to.fullPath}`;
    } else {
      // next();
    }
    const isLeisurePath = (path.split('/')[2] === 'leisure');
    if (!isLeisurePath || (isLeisurePath && store.getters.getChannelInfo.products.indexOf('leisure') !== -1)) {
      if (flag) {
        next({ path });
      } else {
        next();
      }
    } else {
      error({ status: 404 });
    }
  });
}
