<template>
  <div class="channelNoticeWrapper">
    <div class="fixWidth" :class="{ rounded }">
      <div><strong>숙소 환불 위약금 확인</strong></div>
      <div><strong>숙소 환불 위약금은 철도 이용 위약금과 별개의 정책으로 적용됩니다.</strong> 상세 환불 위약금은 각 숙소 별 정책에서 참고하실 수 있습니다.</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rounded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const d = new Date();
    const today = this.$format.formatDate(this.$format.ymdDate(d), 'md');
    return {
      today,
      isBottom: false,
    };
  },
};
</script>

<style lang="scss">
.channelNoticeWrapper{
  background-image: linear-gradient(255deg, rgb(80,57,146), rgb(41,50,135));
  > div{
    position: relative;
    width: 100%;
    color: #FFF;
    padding: 12px $sidePadding * 1px;
    font-size: 13px;
    &.rounded{
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    &.popup{
      border-radius: 4px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    }
    &:before{
      content: '';
      position: absolute;
      top: 12px;
      left: $sidePadding * 1px;
      width: 18px;
      height: 18px;
      background: url(~assets/img/praying-hand.png) center center no-repeat;
      background-size: 18px 18px;
    }
    > div:nth-of-type(1){
      font-weight: bold;
      line-height: 20px;
      padding-left: 22px;
    }
    > div:nth-of-type(2){
      margin-top: 4px;
      line-height: 17px;
    }
  }
}
</style>
