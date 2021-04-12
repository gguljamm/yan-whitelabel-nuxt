<template>
  <component
    v-if="objComplete.result && objComplete.status === 'loaded'"
    :is="completeInstance"
    :key="productType"
    :objComplete="objComplete"
  ></component>
  <Fail
    v-else-if="!objComplete.result || objComplete.status === 'fail'"
    :message="objComplete.message"
    :type="productType"
  ></Fail>
</template>

<script>
import Fail from '@/components/MVP/Payment/Common/Fail.vue';

export default {
  components: {
    Fail,
  },
  props: {
    productType: {
      type: String,
      default: '',
    },
    objComplete: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      reservationNo: this.$route.query.reservationNo,
    };
  },
  computed: {
    completeInstance() {
      const type = this.productType === 'place' ? 'Place' : 'Leisure';
      return () => import(`~/components/MVP/Payment/${type}/Complete.vue`);
    },
  },
  methods: {
    reqReservedPlace() {
      return this.$apis.getReservePlaceById({ reservationNo: this.reservationNo, browserId: this.$store.state.sessionId });
    },
    reqReservedLeisure() {
      return this.$apis.getReserveLeisureById({ reservationNo: this.reservationNo, browserId: this.$store.state.sessionId });
    },
    backHandel() {
      window.history.go(1);
      this.$store.commit('openAlert', {
        text: '이미 주문이 완료 되었습니다.<br>홈으로 이동합니다.',
        arrBtn: [{
          text: '확인',
          event: () => {
            this.$router.replace(this.productType === 'leisure' ? '/leisure' : '/');
          },
        }],
      });
    },
  },
  mounted() {
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', this.backHandel);
    if (this.reservationNo) {
      const request = this.productType === 'place' ? this.reqReservedPlace() : this.reqReservedLeisure();
      request.then((resp) => {
        console.log(resp.data.result);
        const objResult = resp.data.result;
        this.$emit('setObjComplete', {
          result: objResult,
          status: 'loaded',
        });
        this.$emit('changeLoading', false);
      }).catch((e) => {
        console.log({ ...e });
        const status = e.response.data.code === 13001 ? 'SESSION_EXPIRED' : '';
        this.$emit('error', status);
        this.$emit('changeLoading', false);
      });
    } else {
      this.$emit('error', this.$route.query.status);
    }
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.backHandel);
  },
};
</script>

<style scoped>
</style>
