<template>
  <div class="fullLoading">
    <div class="spinnerLoading"><div></div></div>
  </div>
</template>

<style lang="scss">
.fullLoading{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(255, 255, 255, .5);
  .spinnerLoading{
    > div{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      width: 24px;
      background: url(~assets/img/loading.svg) center center no-repeat;
      background-size: 24px;
      height: 24px;
      animation: rotate 2s linear infinite;
    }
  }
}
</style>
