<template>
  <div v-if="cancelStatus === 'init'">
    <detail-wrapper
      v-if="objSelectedReserveInfo"
      v-show="!$route.params.popup"
      :objSelectedReserveInfo="objSelectedReserveInfo"
      @popup="openPop"
    ></detail-wrapper>
    <nuxt-child
      v-if="$route.params.popup && objSelectedReserveInfo"
      :popupName="$route.params.popup"
      :objSelectedReserveInfo="objSelectedReserveInfo"
      :objReservationCancellationFee="objReservationCancellationFee"
      :objReserveInfo="objReserveInfo"
      @popup="openPop"
      @cancelReservation="cancelReservation"
      @changeReserveInfo="changeReserveInfo"
    ></nuxt-child>
  </div>
  <complete-cancel v-else-if="cancelStatus === 'success'"
    @close="cancelStatus = 'init'"
  ></complete-cancel>
  <full-loading v-else-if="cancelStatus === 'loading'"></full-loading>
</template>

<script>
import DetailWrapper from '@/components/MVP/Reserve/Place/Detail/DetailWrapper.vue';
import CompleteCancel from '@/components/MVP/Reserve/CancelComplete.vue';
import FullLoading from '@/components/MVP/Common/Loading.vue';

const getReserve = (channelName) => import(`~/components/${channelName}/reserve.js`).catch(() => {});
const getPayment = (channelName) => import(`~/components/${channelName}/payment.js`).catch(() => import('~/components/MVP/payment.js'));

export default {
  components: {
    DetailWrapper,
    CompleteCancel,
    FullLoading,
  },
  data() {
    return {
      cancelStatus: 'init',
      objSelectedReserveInfo: null,
      objReservationCancellationFee: {},
      objReserveInfo: {
        name: '',
        phone: '',
      },
    };
  },
  methods: {
    changeReserveInfo(obj) {
      this.objReserveInfo.name = obj.name;
      this.objReserveInfo.phone = obj.phone;
    },
    openPop(name) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/reserveDetail/${name}`);
    },
    async cancelReservation({ bpReservationNo, reservationCancellationFee }) {
      this.cancelStatus = 'loading';
      let objCancelParams = null;
      try {
        const resp = await this.$apis.getPlaceCancelFee({ reservationNo: bpReservationNo });
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
        const payment = await getPayment(this.$store.state.channelInfo.compId);
        payment.default.cancel(this, bpReservationNo, objCancelParams);
      }
    },
    getPenalty() {
      if (this.objSelectedReserveInfo.reservationInfo.reservationStatus !== 'CANCELED') {
        this.objReservationCancellationFee.status = 'loading';
        this.$apis.getPlaceCancelFee({ reservationNo: this.objSelectedReserveInfo.reservationInfo.bpReservationNo }).then((resp) => {
          this.objReservationCancellationFee.value = resp.data.result.reservationCancellationFee;
          this.objReservationCancellationFee.status = 'loaded';
        }).catch(() => {
          this.objReservationCancellationFee.status = 'loaded';
        });
      }
    },
    cancelSuccess() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/reserveDetail');
      this.getReserveList();
      this.cancelStatus = 'success';
    },
    async getReserveList() {
      const channelName = this.$store.state.channelInfo.compId;
      const temp = await getReserve(channelName);
      if (temp && temp.default) {
        temp.default(this);
        this.getPenalty();
      } else {
        this.$nuxt.error({ status: 404 });
      }
    },
  },
  mounted() {
    this.getReserveList();
  },
};
</script>
