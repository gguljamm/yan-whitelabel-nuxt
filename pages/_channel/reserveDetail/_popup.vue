<template>
  <div class="detailPlacePopupWrapper">
    <Header
      :arrClass="['home']"
    ></Header>
    <div class="fixWidth">
      <div v-if="popupName === 'Cancel' && !(objReserveInfo.name && objReserveInfo.phone)" class="reserveDetailCertification">
        <div>숙소 예약 취소</div>
        <div>본인 인증 후 예약 취소 가능합니다.</div>
        <IdentityVerification
          :objReserveInfo="objReserveInfo"
          :isPhoneConfirmed="isPhoneConfirmed"
          @certification="certification"
          @openPopup="openPop"
        ></IdentityVerification>
      </div>
      <component
        v-else
        :is="popupInstance"
        :key="popupName"
        :objSelectedReserveInfo="objSelectedReserveInfo"
        :isCancelable="isCancelable"
        :objReservationCancellationFee="objReservationCancellationFee"
        :popKey="popupName"
        :type="'place'"
        @popup="openPop"
        @cancelReservation="cancelReservation"
      ></component>
    </div>
  </div>
</template>

<script>
import IdentityVerification from '@/components/MVP/Common/IdentityVerification.vue';

export default {
  components: {
    IdentityVerification,
  },
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
    objReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isPhoneConfirmed: false,
    };
  },
  computed: {
    isCancelable() {
      const { reservationStatus, checkOut } = this.objSelectedReserveInfo.reservationInfo;
      return reservationStatus === 'RESERVED' && new Date() < new Date(checkOut.replace(' ', 'T'));
    },
    popupInstance() {
      let instance;
      if (this.popupName === 'PInfoCollectionAndUtilization') {
        instance = import('~/components/MVP/Payment/Common/Popup/PInfoCollectionTable.vue');
      } else {
        instance = import(`~/components/MVP/Reserve/Place/Detail/Popup/${this.popupName}.vue`);
      }
      return () => instance;
    },
  },
  methods: {
    certification(obj) {
      this.$emit('changeReserveInfo', obj);
    },
    openPop(popupName) {
      this.$emit('popup', popupName);
    },
    cancelReservation(reservationNo) {
      this.$emit('cancelReservation', reservationNo);
    },
  },
};
</script>

<style lang="scss">
.detailPlacePopupWrapper{
  > .fixWidth{
    background-color: #FFF;
    min-height: calc(100vh - (#{$header} * 1px));
  }
}
.reserveDetailCertification{
  padding: 0 24px;
  > div:first-of-type {
    padding-top: 10px;
    line-height: 22px;
    font-weight: bold;
    font-size: 16px;
  }
  > div:nth-of-type(2) {
    margin-top: 2px;
    line-height: 22px;
    font-size: 13px;
    padding-bottom: 24px;
  }
}
</style>
