<template>
  <div class="reviewWrapper popupBack fixWidth">
    <review-content
      :objPlace="objPlace"
      :type="'main'"
    ></review-content>
  </div>
</template>

<script>
import ReviewContent from '../ReviewContent.vue';

export default {
  components: {
    ReviewContent,
  },
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
  },
};
</script>

<style lang="scss">
//.sellerWrapper{
//  ul{
//    li{
//      width: 100%;
//      display: table;
//      border-bottom: 1px solid #ebecf1;
//      > div{
//        font-size: 14px;
//        display: table-cell;
//        height: 40px;
//        line-height: 40px;
//        width: 70%;
//        text-align: center;
//        &:first-of-type{
//          width: 30%;
//          color: #939499;
//          font-weight: bold;
//        }
//        a{
//          color: #000;
//          text-decoration: underline;
//        }
//      }
//    }
//  }
//}
.reviewWrapper{
  padding: 0 $sidePadding * 1px;
}
</style>
