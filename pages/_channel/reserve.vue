<template>
  <div>
    <div v-show="!$route.params.detail">
      <Header></Header>
      <div class="reserveWrapper fixWidth">
        <div class="identityVerificationWrapper"
          v-if="!isCertification"
        >
          <div>숙소 예약 확인</div>
          <div>본인 인증 후 예약 내역 확인이 가능합니다.</div>
          <IdentityVerification
            :objReserveInfo="objReserveInfo"
            @certification="certification"
            @openPopup="openPopup"
          ></IdentityVerification>
        </div>
        <ReserveWrapper
          v-else
          :objReserveList="objReserveList"
          @deleteReserve="deleteReserve"
          @openDetail="openDetail"
          @getList="getReserveList"
        ></ReserveWrapper>
      </div>
    </div>
    <CompleteCancel
      v-if="cancelStatus === 'success'"
      @close="cancelStatus = 'init'"
    ></CompleteCancel>
    <FullLoading
      v-if="cancelStatus === 'loading'"
    ></FullLoading>
    <nuxt-child
      v-if="isCertification && $route.params.detail && Object.keys(objReserveList.place).length > 0"
      :objSelectedReserveInfo="objReserveList.place.find((obj) => obj.reservationInfo.yanReservationNo === ($route.params.detail * 1))"
      @cancelReservation="cancelReservation"
    ></nuxt-child>
    <nuxt-child
      v-if="!$route.params.detail && $route.path.indexOf('popup') >= 0"
      :type="'place'"
    ></nuxt-child>
  </div>
</template>

<script>
import IdentityVerification from '@/components/MVP/Common/IdentityVerification.vue';
import ReserveWrapper from '@/components/MVP/Reserve/Place/PlaceReserveWrapper.vue';
import CompleteCancel from '@/components/MVP/Reserve/CancelComplete.vue';
import FullLoading from '@/components/MVP/Common/Loading.vue';

const getPayment = (channelName) => import(`~/components/${channelName}/payment.js`).catch(() => import('~/components/MVP/payment.js'));

export default {
  components: {
    IdentityVerification,
    ReserveWrapper,
    CompleteCancel,
    FullLoading,
  },
  async beforeCreate() {
    if (this.$route.params.detail) {
      await this.$router.replace(`/${this.$route.path.split('/')[1]}/reserve`);
    }
  },
  data() {
    return {
      cancelStatus: 'init',
      objReserveList: {
        status: 'loading',
        place: [],
      },
      objReserveInfo: {
        ...this.$store.state.reservation.customerInfo,
      },
    };
  },
  computed: {
    isCertification() {
      const { name, phone } = this.objReserveInfo;
      return name && phone;
    },
  },
  methods: {
    openPopup() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/reserve/popup');
    },
    async cancelReservation({ bpReservationNo, reservationCancellationFee }) {
      this.cancelStatus = 'loading';
      let objCancelParams = null;
      try {
        const resp = await this.$apis.getPlaceCancelFee({ reservationNo: bpReservationNo });
        this.cancelStatus = 'init';
        if (reservationCancellationFee === resp.data.result.reservationCancellationFee) {
          objCancelParams = {
            reservationNo: bpReservationNo,
            penaltyAmount: resp.data.result.reservationCancellationFee,
            browserId: this.$store.state.sessionId,
            phone: this.objReserveInfo.phone,
          };
        } else {
          this.$store.commit('openAlert', {
            text: '취소 수수료가 갱신되었습니다. 다시 시도해주세요.',
            arrBtn: [
              {
                text: '확인',
                event: () => {
                  this.getReserveList();
                },
              },
            ],
          });
        }
      } catch (e) {
        this.cancelStatus = 'init';
        this.$store.commit('openAlert', {
          text: '취소 수수료를 불러오는 실패했습니다. 잠시 후 다시 시도해주세요.',
          arrBtn: [
            { text: '확인', event: () => {} },
          ],
        });
      }
      if (objCancelParams) {
        const reserve = this.objReserveList.place.find((v) => v.reservationInfo.bpReservationNo === bpReservationNo);
        const refund = reserve.reservationInfo.paymentPrice - objCancelParams.penaltyAmount;
        this.$store.commit('openAlert', {
          text: `환불금액은 ${this.$format.numberFormat(refund < 0 ? 0 : refund)}원입니다. 예약을 취소하시겠습니까?`,
          arrBtn: [
            { text: '아니오', event: () => {} },
            {
              text: '예',
              event: async () => {
                this.cancelStatus = 'loading';
                const payment = await getPayment(this.$store.state.channelInfo.compId);
                payment.default.cancel(this, bpReservationNo, objCancelParams);
              },
            },
          ],
        });
      }
    },
    cancelSuccess() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/reserve');
      this.getReserveList();
      this.cancelStatus = 'success';
    },
    certification(objReserveInfo) {
      this.objReserveInfo = objReserveInfo;
    },
    openDetail(objDetail) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/reserve/${objDetail.objReserveListInfo.reservationInfo.yanReservationNo}${objDetail.isCancel ? '/Cancel' : ''}`);
    },
    getReserveList() {
      const params = {
        name: this.objReserveInfo.name,
        phone: this.objReserveInfo.phone.replace(/-/g, ''),
        browserId: this.$store.state.sessionId,
      };
      this.objReserveList.status = 'loading';
      this.$apis.getReservePlaceList(params).then((resp) => {
        if (resp.status === 200) {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          const today = this.$format.ymdDate(new Date());
          const tomorrow = this.$format.ymdDate(d);
          const list = resp.data.result.map((v) => ({ placeInfo: v.placeInfo, reservationInfo: { ...v.reservationInfo, checkIn: `${today} 17:00`, checkOut: `${tomorrow} 11:00` } }));
          const reservationData = {
            type: 'place',
            list,
            customerInfo: params,
            timestamp: new Date().getTime(),
          };
          this.objReserveList.place = list;
          this.$store.commit('reservation/setReservationInfo', reservationData);
          this.objReserveList.status = 'loaded';
        } else if (resp.status === 204) {
          this.objReserveList.status = 'loaded';
          this.objReserveList.place = [];
        } else {
          this.objReserveList.status = 'fail';
        }
      }).catch((e) => {
        console.log({ ...e });
        if (e.response.data.code === 13000) {
          this.$store.commit('openNotice', { text: '잘못된 접근입니다.' });
          this.$router.replace(`/${this.$store.state.channelInfo.compId}`);
        } else {
          this.objReserveList.status = 'fail';
        }
      });
    },
    deleteReserve(reservationNo) {
      const obj = {
        reservationNo,
        browserId: this.$store.state.sessionId,
        ...this.objReserveInfo,
      };
      this.$apis.deleteReserve(obj).then((resp) => {
        if (resp.data.result.result) {
          this.$store.commit('openNotice', { text: '삭제되었습니다.' });
          this.getReserveList();
        } else {
          this.$store.commit('openNotice', { text: '예약 내역 삭제를 실패하였습니다.' });
        }
      }).catch(() => {
        this.$store.commit('openNotice', { text: '예약 내역 삭제를 실패하였습니다.' });
      });
    },
    getReceipt(obj) {
      this.$apis.getReceipt(obj.bpReservationNo, {
        part: 'place',
        name: obj.customerName,
        phone: obj.customerPhone,
        browserId: this.$store.state.sessionId,
      });
    },
  },
  mounted() {
    const isNotOverStoreSaveTime = this.$store.state.reservation.place && this.$store.state.reservation.place.timestamp && ((new Date().getTime() - this.$store.state.reservation.place.timestamp) / 1000) < 300;
    if (isNotOverStoreSaveTime) {
      this.objReserveList.place = this.$store.state.reservation.place.list;
    }
  },
};
</script>

<style lang="scss">
.reserveWrapper{
  background-color: #fff;
  min-height: calc(100vh - #{$header * 1px});
  .identityVerificationWrapper{
    padding: 0 $sidePadding * 1px;
    > div:first-of-type{
      padding-top: 10px;
      line-height: 22px;
      font-weight: bold;
      font-size: 16px;
    }
    > div:nth-of-type(2){
      margin-top: 2px;
      line-height: 22px;
      font-size: 13px;
      padding-bottom: 24px;
    }
  }
}
</style>
