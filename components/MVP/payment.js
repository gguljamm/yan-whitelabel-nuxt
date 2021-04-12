export default {
  payment: async ({ $store, $device }, obj, reservationNo, discountPrice, service) => {
    alert('PG 연결');
  },
  cancel: async (_this, bpReservationNo, objCancelParams) => {
    _this.$apis.cancelPlaceReserve(objCancelParams).then(() => {
      _this.cancelSuccess();
    }).catch((e) => {
      const text = e && e.response && e.response.data && e.response.data.code !== 500 && e.response.data.detail ? e.response.data.detail : '예약 취소 요청을 실패했습니다. 잠시 후 다시 시도해주세요.';
      _this.$store.commit('openAlert', {
        text,
        arrBtn: [
          { text: '확인', event: () => {} },
        ],
      });
      _this.cancelStatus = 'init';
    });
  },
  cancelLeisure: async (_this, objCancelData) => {
    _this.$apis.cancelLeisureReserve({ ...objCancelData, phone: _this.objReserveInfo.phone.replace(/-/g, ''), browserId: _this.$store.state.sessionId }).then(() => {
      _this.$store.commit('history/pushHistory', _this.$route.fullPath);
      _this.$router.push('/leisure/reserve');
      _this.cancelStatus = 'success';
      _this.getReserveList();
    }).catch((e) => {
      const text = e && e.response && e.response.data && e.response.data.code !== 500 && e.response.data.detail ? e.response.data.detail : '예약 취소 요청을 실패했습니다. 잠시 후 다시 시도해주세요.';
      _this.cancelStatus = 'init';
      _this.$store.commit('openAlert', {
        text,
        arrBtn: [
          { text: '확인', event: () => {} },
        ],
      });
    });
  },
};
