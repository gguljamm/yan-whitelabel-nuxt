<template>
  <div class="leisureList">
    <div
      class="bgImgWrap"
    >
      <div :style="objItem.image ? { backgroundImage: `url(${objItem.image})` } : {}"></div>
    </div>
    <div class="info">
      <div class="top">
        <div class="type">
          <div class="category">{{ itemType }}</div>
        </div>
        <div class="title">{{ objItem.name }}</div>
        <div class="region">{{ locationName }}</div>
      </div>
      <div class="bottom">
        <Price
          :discount="$format.optimizedDiscountPrice(objItem.minPrice.gajagoSalePrice || objItem.minPrice.coverPrice, $store.state.channelInfo.discount.leisure) || {}"
          :priceInfo="{
            coverPrice: objItem.minPrice.coverPrice,
            discountPrice: objItem.minPrice.gajagoSalePrice,
            status: objItem.status,
          }"
        ></Price>
        <div
          v-if="objItem.dealPointDescription"
          class="filterTag"
        >{{ objItem.dealPointDescription }}</div>
        <div v-else class="filterDump"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Price from '~/components/MVP/Common/Price.vue';

export default {
  components: {
    Price,
  },
  props: {
    objItem: {
      type: Object,
      default: () => {
      },
    },
  },
  computed: {
    locationName() {
      const item = this.objItem.location;
      return this.objItem.location && this.objItem.location.length > 0 ? item[0].name : '';
    },
    itemType() {
      const arrType = this.objItem.type && this.objItem.type.map((obj) => obj.name);
      return arrType && arrType.length > 0 ? arrType[0] : '';
    },
  },
};
</script>

<style lang="scss">
  .leisureList{
    width: 100%;
    cursor: pointer;
    background-color: #fff;
    position: relative;
    &::after{
      content: '';
      display: block;
      clear: both;
    }
    display: flex;
    display: -webkit-box;
    display: -ms-flexbox;
    .bgImgWrap{
      width: 29.33%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      > div{
        background-color: #ebecf1;
        padding-bottom: 131.81%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;
      }
    }
    .info{
      width: calc(100% - 29.33%);
      padding: 12px $sidePadding * 1px 0 14px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top{
        padding-bottom: 10px;
        .type{
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
        }
        .type{
          .category{
            font-size: 11px;
            color: #939499;
            font-weight: bold;
          }
        }
        .title{
          font-size: 16px;
          line-height: 22px;
          color: #000;
          font-weight: bold;
          margin-top: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .region{
          font-size: 13px;
          color: #939499;
          line-height: 18px;
        }
      }
      .bottom{
        &:after{
          content: '';
          clear: both;
          display: block;
        }
        .filterTag {
          margin-top: 2px;
          width: 100%;
          border-top: 1px solid #ebecf1;
          padding: 8px 0;
          font-size: 11px;
          color: #585858;
          line-height: 18px;
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: normal;
        }
        .filterDump{
          height: 12px;
        }
      }
    }
  }
</style>
