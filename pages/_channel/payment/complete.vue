<template>
  <div class="paymentCompleteWrapper">
    <Header></Header>
    <div>
      <nuxt-child
        v-if="$route.params.type"
        :productType="$route.params.type"
        :reservationNo="reservationNo"
        :objComplete="objComplete"
        @error="error"
        @setObjComplete="setObjComplete"
        @changeLoading="changeLoading"
      ></nuxt-child>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const { reservationNo, status } = this.$route.query;
    const productType = this.$route.params.type;
    return {
      productType,
      reservationNo,
      status,
      objComplete: {
        status: 'loading',
        result: null,
        message: '',
      },
    };
  },
  methods: {
    setObjComplete(obj) {
      this.objComplete = { ...this.objComplete, ...obj };
    },
    changeLoading(flag) {
      this.$emit('changeLoading', flag);
    },
    error(status) {
      switch (status) {
        case 'USER_CANCEL':
          this.objComplete.message = '결제를 <br> 취소했습니다.';
          break;
        case 'PG_ERROR':
          this.objComplete.message = '결제를 <br> 실패했습니다.';
          break;
        case 'BOOKING_ERROR':
          this.objComplete.message = '예약을 <br> 실패했습니다.';
          break;
        case 'SESSION_EXPIRED':
          this.objComplete.message = '세션이 <br> 만료되었습니다.';
          break;
        default:
          this.objComplete.message = '잘못된 <br> 접근입니다.';
          break;
      }
      this.objComplete.status = 'fail';
    },
  },
  mounted() {
    this.$emit('changeLoading', true);
    if (!this.reservationNo || !this.productType || !(this.productType && ['place', 'leisure'].some((type) => this.productType === type))) {
      if (this.$store.state.channelInfo.channelName.replace('dev_', '') === 'etbs') {
        const { paymentData } = this.$store.state;
        // paymentData.payYn && paymentData.예약번호면 결제결과 paymentData
        if (paymentData.pay_yn === 'OK' && paymentData.orderno) {
          this.objComplete.status = 'loaded';
          this.$store.commit('setSessionId', paymentData.USER_PARM_04);
          this.$router.replace(`/etbs/payment/complete/${paymentData.USER_PARM_03}?reservationNo=${paymentData.orderno}`);
        } else {
          const status = paymentData.pay_yn === 'Failed' ? 'PG_ERROR' : '';
          this.error(status);
          this.$emit('changeLoading', false);
        }
      } else {
        this.$emit('changeLoading', false);
        this.error(this.status);
      }
    }
  },
};
</script>

<style scoped>
</style>
