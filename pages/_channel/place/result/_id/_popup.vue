<template>
  <div>
    <transition name="rise">
      <div class="detailPopupWrapper" v-show="init">
        <Header
          :arrClass="$route.params.popup === 'detailMap' ? ['onlyBtn'] : ['home', 'popup']"
        ></Header>
        <component
          v-if="init"
          :is="$route.params.popup"
          :objPlace="objPlace"
          :imgHeight="imgHeight"
          :objLocation="{ latitude: objPlace.place.latitude, longitude: objPlace.place.longitude }"
          :params="params"
        ></component>
      </div>
    </transition>
  </div>
</template>

<script>
import cancel from '@/components/MVP/Place/Detail/Popup/Cancel.vue';
import detailMap from '@/components/MVP/Common/DetailMap.vue';
import photo from '@/components/MVP/Place/Detail/Popup/Photo.vue';
import seller from '@/components/MVP/Place/Detail/Popup/Seller.vue';
import event from '@/components/MVP/Place/Detail/Popup/Event.vue';
import review from '@/components/MVP/Place/Detail/Popup/Review.vue';

export default {
  props: ['objPlace', 'imgHeight', 'params'],
  components: {
    cancel,
    detailMap,
    photo,
    seller,
    event,
    review,
  },
  data() {
    return {
      init: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
    });
  },
  beforeDestroy() {
    this.$emit('closePopup');
  },
};
</script>

<style lang="scss">
  .detailPopupWrapper{
    .popupBack{
      background-color: #FFF;
      min-height: calc(100vh - #{$header * 1px});
    }
  }
</style>
