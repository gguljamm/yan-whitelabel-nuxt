<template>
  <div>
    <div v-show="!$route.params.detail">
      <Header></Header>
      <div class="reserveWrapper fixWidth">
        <div
          v-if="!isCertification"
          class="identityVerificationWrapper"
        >
          <div>레저 예약 확인</div>
          <div>본인 인증 후 예약 내역 확인이 가능합니다.</div>
          <IdentityVerification
            :objReserveInfo="objReserveInfo"
            @certification="certification"
            @openPopup="openPopup"
          ></IdentityVerification>
        </div>
        <ReserveListWrapper
          v-else
          :objReserveList="objReserveList"
          @openDetail="openDetail"
          @getList="getReserveList"
        ></ReserveListWrapper>
      </div>
      <CompleteCancel
        v-if="cancelStatus === 'success'"
        @close="cancelStatus = 'init'"
      ></CompleteCancel>
    </div>
    <FullLoading
      v-if="cancelStatus === 'loading'"
    ></FullLoading>
    <nuxt-child
      v-if="isCertification && $route.params.detail"
      :objSelectedReserveInfo="objReserveList.leisure.find((obj) => obj.orderId === ($route.params.detail * 1))"
      @cancelReservation="cancelReservation"
    ></nuxt-child>
    <nuxt-child
      v-if="!$route.params.detail && $route.path.indexOf('popup') >= 0"
      :type="'leisure'"
    ></nuxt-child>
  </div>
</template>

<script>
import IdentityVerification from '@/components/MVP/Common/IdentityVerification.vue';
import ReserveListWrapper from '@/components/MVP/Reserve/Leisure/LeisureReserveWrapper.vue';
import CompleteCancel from '@/components/MVP/Reserve/CancelComplete.vue';
import FullLoading from '@/components/MVP/Common/Loading.vue';

const getPayment = (channelName) => import(`~/components/${channelName}/payment.js`).catch(() => import('~/components/MVP/payment.js'));

export default {
  components: {
    IdentityVerification,
    ReserveListWrapper,
    CompleteCancel,
    FullLoading,
  },
  beforeCreate() {
    if (this.$route.params.detail) {
      this.$router.replace(`/${this.$route.path.split('/')[1]}/leisure/reserve`);
    }
  },
  data() {
    return {
      type: 'leisure',
      cancelStatus: 'init',
      objReserveList: {
        status: 'loading',
        leisure: [],
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
      this.$router.push('/leisure/reserve/popup');
    },
    async cancelReservation(objCancelData) {
      const reserve = this.objReserveList.leisure.find((obj) => obj.orderId === objCancelData.orderId);
      const refund = objCancelData.orderedOptionIds.reduce((tot, v) => {
        const temp = reserve.orderOption.find((v2) => v2.orderOptionId === v);
        const dis = temp.channelDiscounts.reduce((totDis, it) => totDis + it.discountAmount, 0);
        return tot + temp.salePrice - dis;
      }, 0);
      this.$store.commit('openAlert', {
        text: `환불금액은 ${this.$format.numberFormat(refund)}원입니다. 예약을 취소하시겠습니까?`,
        arrBtn: [
          { text: '아니오', event: () => {} },
          {
            text: '예',
            event: async () => {
              this.cancelStatus = 'loading';
              const payment = await getPayment(this.$store.state.channelInfo.compId);
              payment.default.cancelLeisure(this, objCancelData);
            },
          },
        ],
      });
    },
    certification(objReserveInfo) {
      this.objReserveInfo = objReserveInfo;
    },
    openDetail(objDetail) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/leisure/reserve/${objDetail.objDeal.orderId}${objDetail.isCancel ? '/Cancel' : ''}`);
    },
    getReserveList() {
      const params = {
        name: this.objReserveInfo.name,
        phone: this.objReserveInfo.phone.replace(/-/g, ''),
        browserId: this.$store.state.sessionId,
      };
      this.objReserveList.status = 'loading';
      this.$apis.getReserveLeisureList(params).then((resp) => {
        // resp orderedOption에 expirationDate는 백에서 구매일 + expiredAt한 날짜
        if (resp.status === 200) {
          const arrList = resp.data.result.map((objList) => ({ ...objList, orderOption: objList.orderOption.reduce((acc, objOption) => (acc.concat([{ ...objOption, status: objOption.status === 'RESTORED' ? 'NOT_USED' : objOption.status }])), []) }));
          const reservationData = {
            type: 'leisure',
            list: arrList,
            customerInfo: params,
            timestamp: new Date().getTime(),
          };
          this.objReserveList.leisure = arrList;
          this.$store.commit('reservation/setReservationInfo', reservationData);
          this.objReserveList.status = 'loaded';
        } else if (resp.status === 204) {
          this.objReserveList.leisure = [];
          this.objReserveList.status = 'loaded';
        } else {
          this.objReserveList.status = 'fail';
        }
      }).catch((e) => {
        if (e.response.data.code === 13000) {
          this.$store.commit('openNotice', { text: '잘못된 접근입니다.' });
          this.$router.replace(`/${this.$store.state.channelInfo.compId}`);
        } else {
          this.objReserveList.status = 'fail';
        }
      });
    },
  },
  mounted() {
    if (this.$store.state.reservation.leisure && this.$store.state.reservation.leisure.timestamp && ((new Date().getTime() - this.$store.state.reservation.leisure.timestamp) / 1000) < 300) {
      this.objReserveList.leisure = this.$store.state.reservation.leisure.list;
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
