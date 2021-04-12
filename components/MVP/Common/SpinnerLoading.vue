<template>
  <div class="spinnerLoading"><div></div></div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
.spinnerLoading{
  height: calc(100vh - #{$header * 1px});
  padding-top: 100px;
  background-color: #FFF;
  > div{
    margin: 0 auto;
    width: 24px;
    background: url(~assets/img/loading.svg) center center no-repeat;
    background-size: 24px;
    height: 24px;
    animation: rotate 2s linear infinite;
  }
}
</style>
