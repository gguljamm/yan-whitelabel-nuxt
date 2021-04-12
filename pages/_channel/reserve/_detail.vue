<template>
  <div>
    <DetailWrapper
      v-show="!$route.params.popup"
      :objSelectedReserveInfo="objSelectedReserveInfo"
      @popup="openPop"
    ></DetailWrapper>
    <nuxt-child
      v-if="$route.params.popup"
      :popupName="$route.params.popup"
      :objSelectedReserveInfo="objSelectedReserveInfo"
      :objReservationCancellationFee="objReservationCancellationFee"
      @popup="openPop"
      @cancelReservation="cancelReservation"
    ></nuxt-child>
  </div>
</template>

<script>
import DetailWrapper from '@/components/MVP/Reserve/Place/Detail/DetailWrapper.vue';

export default {
  props: {
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      objReservationCancellationFee: {
        status: 'init',
        value: -1,
      },
    };
  },
  components: {
    DetailWrapper,
  },
  methods: {
    cancelReservation(reservationNo) {
      this.$emit('cancelReservation', reservationNo);
    },
    openPop(name) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/reserve/${this.$route.params.detail}/${name}`);
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
  },
  mounted() {
    this.getPenalty();
  },
};

</script>

<style lang="scss">
</style>
