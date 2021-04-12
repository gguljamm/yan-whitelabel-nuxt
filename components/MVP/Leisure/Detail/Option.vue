<template>
  <div class="productOption">
    <div class="optionInfo">
      <div class="title">{{ objOption.name }}</div>
    </div>
    <div v-if="objOption.canExpiredRefund" class="tagWrap">
      <span class="tag">미사용 환불 가능</span>
    </div>
    <div
      class="buttonWrap"
      :class="{ justifyEnd: status === 'SOLDOUT' }"
    >
      <div v-if="status !== 'SOLDOUT'" class="price">
        <div class="originVal" v-if="objOption.coverPrice && objOption.gajagoSalePrice && objOption.coverPrice !== objOption.gajagoSalePrice">{{ $format.numberFormat(objOption.coverPrice) }}원</div>
        <div class="showPrice">
          <div class="discountRate" v-if="(objOption.coverPrice && objOption.gajagoSalePrice && objOption.coverPrice !== objOption.gajagoSalePrice) && !discountPriceFormat(objOption.gajagoSalePrice)">
            {{ Math.ceil((objOption.coverPrice - objOption.gajagoSalePrice) / objOption.coverPrice * 100) }}<span class="percent" v-if="objOption.coverPrice && objOption.gajagoSalePrice && objOption.coverPrice !== objOption.gajagoSalePrice">%</span>
          </div>
          <span class="salePrice"><strong>{{ $format.numberFormat(objOption.gajagoSalePrice || objOption.coverPrice, 10) }}</strong>원</span>
        </div>
        <div
          v-if="discountPriceFormat(objOption.gajagoSalePrice)"
          class="coupon">
          <div>
            <div>{{ $format.optimizedDiscountPrice(objOption.coverPrice || objOption.gajagoSalePrice, $store.state.channelInfo.discount.leisure).discountName || '선착순' }}</div>
            <div>{{ discountPriceFormat(objOption.coverPrice || objOption.gajagoSalePrice) }}</div>
          </div>
          <div>
            <div>선착순 할인 적용 시{{ $format.optimizedDiscountPrice(objOption.coverPrice || objOption.gajagoSalePrice, $store.state.channelInfo.discount.leisure).maxPriceText ? ` (최대 ${$format.optimizedDiscountPrice(objOption.coverPrice || objOption.gajagoSalePrice, $store.state.channelInfo.discount.leisure).maxPriceText})` : '' }}</div>
            <span>{{ Math.ceil(((objOption.coverPrice || objOption.gajagoSalePrice) - getDiscountPrice(objOption.gajagoSalePrice)) / (objOption.coverPrice || objOption.gajagoSalePrice) * 100) }}<span>%</span></span>
            <span><strong>{{ $format.numberFormat(getDiscountPrice(objOption.gajagoSalePrice || objOption.coverPrice)) }}</strong>원</span>
          </div>
        </div>
      </div>
      <div v-if="objOption.items.every(({ stockCount }) => stockCount === 0) || availablePurchaseMaxCount" class="container">
        <button @click="count > 0 ? changeVal(objOption.id, -1) : ''" :class="count === 0 ? 'disable' : ''"></button>
        <div class="val">{{ count }}</div>
        <button
          @click="objOption.items.every(({ stockCount }) => stockCount === 0) || (!!availablePurchaseMaxCount && availablePurchaseMaxCount > count) ? changeVal(objOption.id, +1) : ''"
          :class="{
            disable: !(objOption.items.every(({ stockCount }) => stockCount === 0) || (!!availablePurchaseMaxCount && availablePurchaseMaxCount > count))
          }"
        ></button>
      </div>
      <div v-else class="soldout">SOLD OUT</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: '',
    },
    objOption: {
      type: Object,
      default: () => {},
    },
    selectedValue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const availablePurchaseMaxCount = Math.min(...this.objOption.items.map(({ pqlat, pqlpp, stockCount }) => Math.min(...[pqlat, pqlpp, (stockCount > 0 ? stockCount : null)].filter((v) => v !== null && v !== undefined))));
    return {
      availablePurchaseMaxCount,
      count: this.selectedValue,
    };
  },
  methods: {
    discountPriceFormat(price) {
      const discount = this.$format.optimizedDiscountPrice(price, this.$store.state.channelInfo.discount.leisure);
      let temp = '';
      if (discount && discount.discountAmount) {
        temp = `${this.formatPrice(discount.discountAmount)}`;
      } else if (discount && discount.discountPercent) {
        temp = `${discount.discountPercent}%`;
      }
      return temp;
    },
    canDiscount(price) {
      const discount = this.$format.optimizedDiscountPrice(price, this.$store.state.channelInfo.discount.leisure);
      return !!discount;
    },
    getDiscountPrice(price) {
      const discount = this.$format.optimizedDiscountPrice(price, this.$store.state.channelInfo.discount.leisure);
      return price - (discount ? discount.appliedPrice : 0);
    },
    changeVal(id, count) {
      this.count += count;
      this.$emit('changeOption', { key: id, value: this.count });
    },
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
  .productOption{
    margin-top: 10px;
    padding: 14px 16px;
    background-color: #fff;
    border: 1px solid #ebecf1;
    border-radius: 4px;
    &:first-of-type{
      margin-top: 0;
    }
    .optionInfo{
      line-height: 18px;
      .title{
        font-size: 13px;
        color: #000;
      }
      .type{
        margin-top: 4px;
        font-size: 11px;
        color: #939499;
      }
    }
    .tagWrap{
      margin-top: 10px;
      .tag{
        font-size: 11px;
        border-radius: 2px;
        line-height: 18px;
        background-color: #f8f9fb;
        padding: 2px 6px;
        color: #939499;
        border: 1px solid #cccdd1;
      }
    }
    .buttonWrap{
      width: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: end;
      -ms-flex-align: end;
      align-items: flex-end;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      margin-top: 20px;
      &.justifyEnd{
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;
      }
      .price{
        flex-shrink: 0;
        .showPrice{
          height: 22px;
          line-height: 22px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          .discountRate{
            color: #d31111;
            .percent{
              color: #d31111;
              font-size: 12px;
              margin-right: 4px;
            }
          }
          .salePrice{
            &.soldOut{
              color: #cccdd1;
              font-weight: bold;
            }
          }
        }
        .coupon{
          padding-top: 4px;
          text-align: left;
          font-size: 0;
          > div:first-child{
            font-size: 10px;
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
          > div:nth-of-type(2){
            padding-top: 8px;
            font-size: 0;
            > div{
              color: #d0021b;
              font-size: 10px;
              padding-bottom: 4px;
            }
            > span:nth-of-type(1){
              color: #d0021b;
              margin-right: 4px;
              font-size: 16px;
              > span{
                font-size: 12px;
              }
            }
            > span:nth-of-type(2){
              font-size: 16px;
              &.soldOut{
                font-weight: bold;
                color: #cccdd1;
              }
            }
          }
        }
        .originVal {
          font-size: 10px;
          color: #868686;
          text-decoration: line-through;
          text-align: left;
        }
      }
      .container{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        button{
          width: 28px;
          height: 28px;
          background-color: #fff;
          border-radius: 14px;
          position: relative;
          transition: opacity .3s ease;
          border: 1px solid #000;
          &.disable{
            opacity: .1;
          }
          &:before{
            width: 12px;
            height: 2px;
            background-color: #000000;
            content: '';
            display: block;
            margin: 0 auto;
          }
          &:nth-of-type(2){
            &:after{
              content: '';
              position: absolute;
              width: 12px;
              height: 2px;
              background-color: #000000;
              display: block;
              transform: rotate(90deg);
              top: 50%;
              left: 50%;
              margin-left: -6px;
              margin-top: -1px;
            }
          }
        }
        .val{
          text-align: center;
          width: 48px;
          font-size: 16px;
          line-height: 22px;
          color: #000;
          font-weight: bold;
        }
      }
      .soldout{
        //width: 100%;
        text-align: right;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        color: #cccdd1;
      }
    }
  }
</style>
