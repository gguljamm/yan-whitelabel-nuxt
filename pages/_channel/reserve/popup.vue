<template>
  <div class="reservePopupWrapper">
    <div class="fixWidth">
      <PInfoCollectionTable
        :popKey="'PInfoCollectionAndUtilization'"
        :type="type"
      ></PInfoCollectionTable>
    </div>
  </div>
</template>

<script>
import PInfoCollectionTable from '~/components/MVP/Payment/Common/Popup/PInfoCollectionTable.vue';

export default {
  props: ['type'],
  components: {
    PInfoCollectionTable,
  },
};
</script>

<style lang="scss">
.reservePopupWrapper{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
