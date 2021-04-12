<template>
  <div class="noticeWrapper">
    <transition-group name="toast" tag="ul" :style="{ transform: `translateY(${-$store.state.noticeInfo.bottom}px)` }">
      <li v-show="init" class="fixWidth" v-for="x in $store.state.noticeInfo.list" :key="x.key">
        <div v-html="x.text"></div>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      init: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
    });
  },
  beforeDestroy() {
  },
};
</script>

<style lang="scss">
.noticeWrapper{
  position: fixed;
  bottom: 0;
  top: 0;
  pointer-events: none;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: 100;
  > ul{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    > li{
      margin-top: 6px;
      padding: 0 $sidePadding * 1px;
      > div{
        padding: 16px 20px;
        color: #FFF;
        font-size: 13px;
        line-height: 16px;
        border-radius: 4px;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
        background-color: #2a2a2a;
        > strong{
          line-height: 24px;
        }
      }
    }
  }
}
</style>
