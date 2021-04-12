<template>
  <div class="priceWrapper">
    <div class="price">
      <div
        v-if="!(priceInfo.status === 'SOLDOUT' || (priceInfo.discountPrice <= 0 && priceInfo.coverPrice <= 0)) && (discount.discountAmount || discount.discountPercent)"
        class="coupon">
        <div>
          <div>{{ discount.discountName || '선착순' }}</div>
          <div>{{ discount.discountAmount ? formatPrice(discount.discountAmount) : `${discount.discountPercent}%` }}</div>
        </div>
      </div>
      <div
        class="discountPrice"
        v-show="priceInfo.coverPrice && priceInfo.discountPrice && priceInfo.coverPrice !== priceInfo.discountPrice"
      >{{ $format.numberFormat(priceInfo.coverPrice) }}원</div>
      <div class="showPrice">
        <div
          class="discountRate"
          v-show="priceInfo.coverPrice && priceInfo.discountPrice && priceInfo.coverPrice !== priceInfo.discountPrice"
        >{{ Math.ceil((priceInfo.coverPrice - priceInfo.discountPrice) / priceInfo.coverPrice * 100) }}</div>
        <div class="percent"
             v-show="priceInfo.coverPrice && priceInfo.discountPrice && priceInfo.coverPrice !== priceInfo.discountPrice"
        >%</div>
        <div class="salePrice soldOut" v-if="priceInfo.status === 'SOLDOUT' || (priceInfo.discountPrice <= 0 && priceInfo.coverPrice <= 0)">
          SOLD OUT
        </div>
        <div class="salePrice" v-else>
          <strong>{{ $format.numberFormat(priceInfo.discountPrice || priceInfo.coverPrice) }}</strong>원
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    discount: {
      type: Object,
      default: () => {},
    },
    priceInfo: { // coverPrice, discountPrice, status
      type: Object,
      default: () => {},
    },
  },
  methods: {
    formatPrice(price) {
      let numPrice = parseInt(price, 10);
      let cond = parseInt(numPrice / 10000, 10);
      let text = '';
      if (cond === 1) {
        text = '만';
      } else if (cond >= 1) {
        text = `${parseInt(cond, 10)}만`;
      }
      numPrice -= parseInt(numPrice / 10000, 10) * 10000;
      cond = parseInt(numPrice / 1000, 10);
      if (cond === 1) {
        text = '천';
      } else if (cond >= 1) {
        text += `${parseInt(cond, 10)}천`;
      }
      numPrice -= parseInt(numPrice / 1000, 10) * 1000;
      cond = parseInt(numPrice / 100, 10);
      if (cond === 1) {
        text = '백';
      } else if (cond >= 1) {
        text += `${parseInt(cond, 10)}백`;
      }
      numPrice -= parseInt(numPrice / 100, 10) * 100;
      if (numPrice) {
        text += numPrice;
      }
      if (!text) {
        text = `${this.$format.numberFormat(parseInt(price, 10))}`;
      }
      return `${text}원`;
    },
  },
};
</script>

<style lang="scss">
.priceWrapper{
  font-size: 16px;
  &:after{
    display: block;
    clear: both;
    content: '';
  }
  .price {
    float: right;
    .coupon{
      padding-bottom: 8px;
      text-align: right;
      font-size: 10px;
      height: 26px;
      > div{
        display: inline-block;
        height: 18px;
        border-radius: 9px;
        background-color: #ebecf1;
        > div{
          float: left;
          line-height: 18px;
          padding: 0 6px;
          &:nth-of-type(1){
            background-color: #de2e5f;
            color: #FFF;
            border-radius: 9px;
          }
        }
      }
    }
    > div{
      line-height: 13px;
      height: 13px;
      &.discountPrice{
        font-size: 10px;
        color: #868686;
        text-decoration: line-through;
        text-align: right;
      }
      &.showPrice{
        height: auto;
        line-height: 22px;
        float: right;
        .discountRate{
          float: left;
          color: #d31111;
        }
        .percent{
          color: #d31111;
          font-size: 12px;
          float: left;
          margin-right: 4px;
        }
        .salePrice{
          float: right;
          &.soldOut{
            color: #cccdd1;
            font-weight: bold;
          }
        }
        &:after{
          content: '';
          clear: both;
          display: block;
        }
      }
    }
  }
}
</style>
