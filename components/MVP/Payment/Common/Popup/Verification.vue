<template>
  <div>
    <transition name="rise">
      <div class="popupVerificationWrapper" v-show="init">
        <Header
          :arrClass="['popup']"
        ></Header>
        <div class="popupFilter fixWidth">
          <identity-verification
            :isPhoneConfirmed="isPhoneConfirmed"
            :objReserveInfo="objReserveInfo"
            @certification="certification"
            @openPopup="openPopup"
          ></identity-verification>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import IdentityVerification from '~/components/MVP/Common/IdentityVerification.vue';

export default {
  components: {
    IdentityVerification,
  },
  props: {
    isPhoneConfirmed: {
      type: Boolean,
      default: false,
    },
    objReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      init: false,
    };
  },
  methods: {
    openPopup(v) {
      this.$emit('openPopup', v);
    },
    certification(v) {
      this.$emit('certification', v);
    },
  },
  mounted() {
    this.init = true;
  },
};
</script>

<style lang="scss">
.popupVerificationWrapper{
  .popupFilter{
    background-color: #FFF;
    min-height: calc(100vh - #{$header} * 1px);
    padding: 0 $sidePadding * 1px;
  }
}
</style>
