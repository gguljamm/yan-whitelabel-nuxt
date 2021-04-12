<template>
  <div class="leisureReserveDetailWrapper">
    <template v-if="objSelectedReserveInfo">
      <DetailWrapper
        v-show="!$route.params.popup"
        :objSelectedReserveInfo="objSelectedReserveInfo"
        @popup="openPop"
      ></DetailWrapper>
      <nuxt-child
        v-if="$route.params.popup"
        :popupName="$route.params.popup"
        :objSelectedReserveInfo="objSelectedReserveInfo"
        @popup="openPop"
        @cancelReservation="cancelReservation"
      ></nuxt-child>
    </template>
    <div v-else class="noResult fixWidth">
      <div class="message">
        <div>결과를 불러오는데 실패하였습니다.</div>
        <div>잠시 후 다시 시도해주세요.</div>
      </div>
    </div>
  </div>
</template>

<script>
import DetailWrapper from '@/components/MVP/Reserve/Leisure/Detail/DetailWrapper.vue';

export default {
  props: {
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      popupName: '',
      lastScroll: 0,
    };
  },
  components: {
    DetailWrapper,
  },
  methods: {
    cancelReservation(objCancelData) {
      this.$emit('cancelReservation', objCancelData);
    },
    openPop(name) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.lastScroll = document.documentElement.scrollTop;
      this.popupName = name;
      this.$router.push(`/leisure/reserve/${this.$route.params.detail}/${name}`);
    },
  },
};

</script>

<style lang="scss">
.leisureReserveDetailWrapper{
  .noResult{
    height: 100vh;
    background-color: #fff;
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding-top: 15%;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    .message{
      > div:first-of-type{
        color: #000;
        font-size: 23px;
        line-height: 30px;
        font-weight: bold;
      }
      > div:nth-of-type(2){
        color: #939499;
        font-size: 13px;
        line-height: 20px;
        margin-top: 4px;
      }
    }
  }
}
</style>
