export default {
  payment: async ({ $store }, obj, reservationNo, discountPrice, service) => {
    alert('이제너두 결제');
  },
  cancel: async (_this, bpReservationNo, objCancelParams) => {
    _this.cancelSuccess();
  },
  cancelLeisure: async (_this, objCancelData) => {
    _this.$store.commit('history/pushHistory', _this.$route.fullPath);
    _this.$router.push('/leisure/reserve');
    _this.cancelStatus = 'success';
    _this.getReserveList();
  },
};
