<template>
  <div class="detailPlacePopupWrapper">
    <Header
      :arrClass="['home']"
    ></Header>
    <div class="fixWidth">
      <component
        :is="popupInstance"
        :key="popupName"
        :objSelectedReserveInfo="objSelectedReserveInfo"
        :isCancelable="isCancelable"
        :objReservationCancellationFee="objReservationCancellationFee"
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
    objReservationCancellationFee: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
    };
  },
  computed: {
    isCancelable() {
      const { reservationStatus, checkOut } = this.objSelectedReserveInfo.reservationInfo;
      return reservationStatus === 'RESERVED' && new Date() < new Date(checkOut.replace(' ', 'T'));
    },
    popupInstance() {
      const instance = import(`@/components/MVP/Reserve/Place/Detail/Popup/${this.popupName}.vue`);
      return () => instance;
    },
  },
  methods: {
    openPop(popupName) {
      this.$emit('popup', popupName);
    },
    cancelReservation(reservationNo) {
      this.$emit('cancelReservation', reservationNo);
    },
  },
};
</script>

<style lang="scss" scoped>
  .detailPlacePopupWrapper{
    > .fixWidth{
      background-color: #FFF;
    }
  }
</style>
