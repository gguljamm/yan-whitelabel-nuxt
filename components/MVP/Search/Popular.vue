<template>
  <div class="popularKeyword">
    <div class="title">인기 키워드</div>
    <div class="buttonWrap">
      <button
        v-for="(item, index) in arrPopularKeyWord"
        :key="index"
        @click="$emit('submitKeyword', item.recommendKeyword)"
      >{{ item.recommendKeyword }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrPopularKeyWord: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
.popularKeyword{
  margin-top: 30px;
  color: #000;
  .title{
    padding: 0 $sidePadding * 1px;
    font-size: 13px;
    font-weight: bold;
    line-height: 18px;
  }
  .buttonWrap{
    padding: 0 $sidePadding * 1px;
    white-space: nowrap;
    overflow-x: auto;
    font-size: 0;
    margin-top: 10px;
    button{
      display: inline-block;
      padding: 8px 14px;
      height: 36px;
      border-radius: 4px;
      border: solid 1px #f1f1f1;
      margin-left: 10px;
      font-size: 13px;
      &:first-of-type{
        margin-left: 0;
      }
    }
  }
}
</style>
