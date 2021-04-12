<template>
  <div class="detailLeisurePopupWrapper">
    <Header
      :arrClass="['home']"
    ></Header>
    <div class="fixWidth">
      <component
        :is="popupInstance"
        :key="popupName"
        :isCancelable="objSelectedReserveInfo.orderOption.some((obj) => obj.status === 'NOT_USED')"
        :objSelectedReserveInfo="objSelectedReserveInfo"
        @popup="openPop"
        @cancelReservation="cancelReservation"
      ></component>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    popupName: {
      type: String,
      default: () => 'error',
      // 오류 페이지 있으면 좋을듯
    },
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    popupInstance() {
      const instance = import(`@/components/MVP/Reserve/Leisure/Detail/Popup/${this.popupName}.vue`);
      return () => instance;
    },
  },
  methods: {
    openPop(popupName) {
      this.$emit('popup', popupName);
    },
    cancelReservation(objCancelData) {
      this.$emit('cancelReservation', objCancelData);
    },
  },
};
</script>

<style lang="scss" scoped>
  .detailLeisurePopupWrapper{
    > .fixWidth{
      background-color: #FFF;
    }
  }
</style>
