<template>
  <div class="leisureCancelRefundPolicy">
    <div class="fixWidth">
      <div class="pageTitle">취소 및 환불 정책</div>
      <div class="policy">
        <div
          v-for="(key, index) in Object.keys(cancelPolicy)"
          :key="index"
          class="infoWrap"
        >
          <div class="title">{{ cancelPolicy[key].title }}</div>
          <div class="info" v-html="replaceNewLineChar(cancelPolicy[key].content)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import policy from '~/utils/static.json';

export default {
  props: {
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const {
      common,
      cancellableInfo,
      refund,
      overTime,
      etc,
    } = policy.leisure.cancelPolicy;
    return {
      cancelPolicy: [common, cancellableInfo, refund, overTime, etc],
    };
  },
  methods: {
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.leisureCancelRefundPolicy{
  font-size: 14px;
  min-height: calc(100vh - #{$header * 1px});
  padding: 0 0 80px;
  .pageTitle{
    font-weight: bold;
    font-size: 23px;
    line-height: 30px;
    padding: 20px $sidePadding * 1px;
  }
  .policy{
    .infoWrap{
      margin-top: 20px;
      .title{
        font-weight: bold;
        color: #000;
        font-size: 13px;
        line-height: 20px;
        padding: 10px $sidePadding * 1px;
      }
      .info{
        color: #939499;
        line-height: 20px;
        padding: 0 $sidePadding * 1px;
      }
    }
  }
}
</style>
