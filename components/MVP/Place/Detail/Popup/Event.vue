<template>
  <div class="popEventWrapper popupBack fixWidth">
    <div class="pageTitle">이벤트</div>
    <ul>
      <li v-for="(x, index) in eventNotice" :key="index">
        <div>이벤트</div>
        <div>{{ x.title }}</div>
        <div>{{ x.contents }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    objPlace: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    place() {
      return this.objPlace.place;
    },
    eventNotice() {
      return this.place.notices ? this.place.notices.filter((v) => v.noticeType === 'EVENT') : [];
    },
  },
};
</script>

<style lang="scss">
  .popEventWrapper{
    padding: 0 $sidePadding * 1px;
    .pageTitle {
      line-height: 30px;
      font-size: 23px;
      font-weight: bold;
      padding: 20px 0;
    }
    ul{
      padding-bottom: 80px;
      li{
        padding: 10px 16px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: solid 1px #f1f1f1;
        > div:nth-of-type(1){
          font-size: 10px;
          color: #939499;
          border-radius: 2px;
          border: solid 1px #ebecf1;
          margin-bottom: 4px;
          display: inline-block;
          padding: 4px 8px;
        }
        > div:nth-of-type(2){
          font-size: 16px;
          font-weight: bold;
          line-height: 22px;
        }
        > div:nth-of-type(3){
          font-size: 13px;
          line-height: 20px;
          color: #939499;
        }
      }
    }
  }
</style>
