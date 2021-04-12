<template>
  <transition name="fade">
    <div class="dawnWrapper fixWidth" :class="{ rounded, popup: type === 'calendar' }" v-show="!isBottom">
      <div>새벽체크인</div>
      <div v-if="type === 'calendar'">지금 당장! 밤 12:00~2:00 사이에는<br>지금 바로 입실가능한 숙소를 예약할 수 있습니다.</div>
      <div v-else>지금 보고있는 숙소는<br>{{ today }} 새벽 지금 바로 입실하는 숙소입니다.</div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    rounded: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: null,
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
  methods: {
    scroll() {
      this.isBottom = document.documentElement.scrollTop + window.innerHeight >= window.document.body.clientHeight;
    },
  },
  mounted() {
    if (this.type === 'calendar') {
      this.scroll();
      window.addEventListener('scroll', this.scroll);
    }
  },
  beforeDestroy() {
    if (this.type === 'calendar') {
      window.removeEventListener('scroll', this.scroll);
    }
  },
};
</script>

<style lang="scss">
.dawnWrapper{
  height: 82px;
  position: relative;
  background-image: linear-gradient(255deg, rgb(80,57,146), rgb(41,50,135));
  width: 100%;
  color: #FFF;
  padding: 12px 14px;
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
    left: 14px;
    width: 18px;
    height: 18px;
    background: url(~assets/img/halfmoon.png) center center no-repeat;
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
</style>
