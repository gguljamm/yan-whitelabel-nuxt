<template>
  <div>
    <verification
      v-show="$route.params.popup === 'verification'"
      :objReserveInfo="objReserveInfo"
      :isPhoneConfirmed="isPhoneConfirmed"
      @certification="certification"
      @openPopup="openPopup"
    ></verification>
    <component
      v-if="popKey && $route.params.popup === 'popup'"
      :is="popComponentInstance"
      :popKey="popKey"
      :arrSellerInfos="arrSellerInfos"
      :type="'leisure'"
    ></component>
  </div>
</template>

<script>
import verification from '@/components/MVP/Payment/Common/Popup/Verification.vue';

export default {
  props: {
    objReserveInfo: {
      type: Object,
      default: () => {},
    },
    isPhoneConfirmed: {
      type: Boolean,
      default: false,
    },
    arrSellerInfos: {
      type: Array,
      default: () => [],
    },
    popKey: {
      type: String,
      default: () => '',
    },
  },
  components: {
    verification,
  },
  data() {
    return {};
  },
  computed: {
    popComponentInstance() {
      let type = '';
      if (this.popKey === 'PInfoCollectionAndUtilization') {
        type = 'PInfoCollectionTable';
      } else if (this.popKey === 'PInfoInfoToThirdParties') {
        type = 'PInfoThirdPartiesTable';
      } else {
        type = 'Info';
      }
      return () => import(`~/components/MVP/Payment/Common/Popup/${type}.vue`);
    },
  },
  methods: {
    certification(v) {
      this.$emit('certification', v);
    },
    openPopup(v) {
      this.$emit('openPopup', v);
    },
  },
  mounted() {},
};
</script>
