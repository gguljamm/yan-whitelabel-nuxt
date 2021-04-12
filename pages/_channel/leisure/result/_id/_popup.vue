<template>
  <div>
    <transition name="rise">
      <div v-show="init" class="leisureDetailPopup">
        <Header
          :arrClass="$route.params.popup === 'Map' ? ['onlyBtn'] : ['home']"
        ></Header>
        <component
          v-if="popupInstance"
          :is="popupInstance"
          :title="title"
          :objLeisure="objLeisure"
          :popupParam="popupParam"
          :objLocation="{ latitude: objLeisure.lat, longitude: objLeisure.lon }"
        ></component>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    objLeisure: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const popupParam = this.$route.params.popup;
    return {
      popupParam,
      init: false,
    };
  },
  computed: {
    title() {
      let title = '';
      switch (this.popupParam) {
        case 'noticeInfo':
          title = '필수사항';
          break;
        case 'refundInfo':
          title = '환불규정';
          break;
        case 'storeInfo':
          title = '판매자 정보';
          break;
        default:
          title = '';
          break;
      }
      return title;
    },
    popupInstance() {
      let path = '';
      if (this.popupParam === 'Map') {
        path = 'MVP/Common/DetailMap';
      }
      if (this.popupParam === 'storeInfo') {
        path = 'MVP/Leisure/Detail/Popup/Seller';
      }
      return () => import(`~/components/${path}.vue`);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
    });
  },
};
</script>

<style lang="scss">
  .leisureDetailPopup{
    .popupBack{
      background-color: #FFF;
      min-height: calc(100vh - #{$header * 1px});
    }
  }
</style>
