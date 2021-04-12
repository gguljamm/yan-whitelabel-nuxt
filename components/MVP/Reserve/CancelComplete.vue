<template>
  <div class="cancelCompleteWrapper">
    <div class="cancelComplete fixWidth">
      <Header :arrClass="['popBack', 'home']" @close="$emit('close')"></Header>
      <div class="title">취소요청이<br>성공하었습니다.</div>
      <global-button
        :text="'확인'"
        @submit="$emit('close')"
      ></global-button>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss">
.cancelCompleteWrapper{
  width: 100%;
  padding: $sidePadding * 1px;
  background-color: #fff;
  z-index: 11;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .cancelComplete{
    position: relative;
    width: 100%;
    height: 100%;
    .title{
      font-weight: bold;
      font-size: 24px;
      line-height: 34px;
    }
  }
}
</style>
