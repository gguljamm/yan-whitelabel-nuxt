<template>
  <div class="completeReserve">
    <div class="pageTitle">예약 완료</div>
    <div class="productInfo">
      <div class="titleWrap">
        <div
          class="mainImg"
          :style="{
                  backgroundImage: representationImage ? `url(${representationImage.bpUrl})` : '',
                }"
        ></div>
        <div class="info">
          <div class="category">{{ categoryNameMap[objComplete.result.placeInfo.category.toLowerCase()] }}</div>
          <div class="name">{{ objComplete.result.placeInfo.placeName }}</div>
        </div>
      </div>
      <div class="infoListWrapper">
        <ul>
          <li class="infoList">
            <span>객실</span>
            <span v-html="objComplete.result.reservationInfo.roomLevel"></span>
          </li>
          <li>
            <span>날짜</span>
            <span>{{
                dateFormat(objComplete.result.reservationInfo.checkIn.split(' ')[0])
              }} - {{
                objComplete.result.reservationInfo.checkIn.split('-')[0] !== objComplete.result.reservationInfo.checkOut.split('-')[0] ? `${objComplete.result.reservationInfo.checkOut.split('-')[0]}. ` : ''
              }}{{
                $format.formatDate(objComplete.result.reservationInfo.checkOut, 'zerodot') }}{{
                `(${$format.formatDate(objComplete.result.reservationInfo.checkIn.split(' ')[0], 'dow')})`
              }} {{
              `${$format.getBetweenDay(objComplete.result.reservationInfo.checkIn.split(' ')[0], objComplete.result.reservationInfo.checkOut.split(' ')[0])}박`
              }}</span>
          </li>
          <li>
            <span>예약 번호</span>
            <span>{{ objComplete.result.reservationInfo.yanReservationNo }}</span>
          </li>
          <li>
            <span>예약 일시</span>
            <span>{{ reserveDate }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="priceInfoWrap">
      <div class="title">결제 정보</div>
      <ul>
        <li>
          <span>예약 금액</span>
          <span>{{
              $format.numberFormat(objComplete.result.reservationInfo.roomPrice)
            }}원</span>
        </li>
        <li>
          <span
            v-if="objComplete.result.reservationInfo.placeChannelDiscounts && objComplete.result.reservationInfo.placeChannelDiscounts.length > 0"
          >{{ objComplete.result.reservationInfo.placeChannelDiscounts.reduce((arr, v) => arr.concat(v.policyName), []).join('+') }} 금액</span>
          <span v-else>할인 금액</span>
          <span>(-) {{
              $format.numberFormat(objComplete.result.reservationInfo.placeChannelDiscounts.reduce((tot, v) => tot + v.discountAmount, 0))
            }}원</span>
        </li>
        <li
          v-if="objComplete.result.reservationInfo.welfarePoint"
        >
          <span>기타 결제 금액</span>
          <span>{{ $format.numberFormat(objComplete.result.reservationInfo.welfarePoint) }}원</span>
        </li>
        <li>
          <span>최종 결제 금액</span>
          <span><strong>{{ $format.numberFormat(objComplete.result.reservationInfo.paymentPrice) }}</strong>원</span>
        </li>
      </ul>
    </div>
    <global-button
      :text="'확인'"
      @submit="submit"
    ></global-button>
  </div>
</template>

<script>
export default {
  props: {
    objComplete: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      categoryNameMap: {
        pension: '펜션',
        motel: '중저가 숙소',
        hotel: '호텔',
        guesthouse: '게스트하우스',
      },
    };
  },
  computed: {
    reserveDate() {
      const d = this.objComplete.result.reservationInfo.reservationDate;
      if (!d) {
        return '';
      }
      return d.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(d.split(' ')[0], 'dow')}) `);
    },
    representationImage() {
      return this.objComplete.result.placeInfo.images ? this.objComplete.result.placeInfo.images.find((v) => v.categoryType === 'REPRESENTATION') || this.objComplete.result.placeInfo.images[0] : '';
    },
    getMinimumCoupon() {
      let maxCoupon = null;
      if (!this.objPlace.coupon) {
        return maxCoupon;
      }
      const type = this.$format.getBetweenDay(this.params.checkin, this.params.checkout) === 1 ? 'OVERNIGHT' : 'MULTIPLE_NIGHTS';
      this.objPlace.coupon.forEach((v) => {
        const info = v.info[type];
        const actualPrice = this.room.discountPrice;
        if (info && actualPrice > info.minActualPayment) {
          const maxSale = info.amount;
          const percentSale = actualPrice * (info.percent / 100);
          let couponPrice = 0;
          if (maxSale < percentSale) {
            couponPrice = maxSale;
          } else {
            couponPrice = percentSale;
          }
          if (!maxCoupon || maxCoupon.couponPrice < couponPrice) {
            maxCoupon = {
              category: v.category,
              couponId: v.couponId,
              couponPrice,
            };
          }
        }
      });
      return maxCoupon && maxCoupon.couponPrice ? maxCoupon : null;
    },
    lastPrice() {
      const price = this.room.discountPrice || this.room.price || 0;
      const couponPrice = price - (this.getMinimumCoupon ? this.getMinimumCoupon.couponPrice : 0);
      return this.$format.numberFormat(couponPrice < 0 ? 0 : couponPrice);
    },
  },
  methods: {
    dateFormat(str) {
      return `${str.replace(/-/g, '.')}(${this.$format.formatDate(str, 'dow')})`;
    },
    submit() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/');
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>

<style lang="scss">
.completeReserve{
  background-color: #FFF;
  min-height: calc(100vh - #{$header * 1px});
  .pageTitle{
    padding: 20px $sidePadding * 1px;
    line-height: 34px;
    font-size: 24px;
    font-weight: bold;
  }
  .productInfo {
    background-color: #fff;
    border-bottom: 10px solid #f8f9fb;
    padding: 0 $sidePadding * 1px;
    .titleWrap {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #ebecf1;

      .mainImg {
        flex-shrink: 0;
        width: 46px;
        height: 46px;
        border-radius: 23px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #ebecf1;
      }

      .info {
        margin-left: 14px;

        .category {
          color: #939499;
          font-size: 13px;
          font-weight: bold;
          line-height: 18px;
          margin-bottom: 2px;
        }

        .name {
          width: 100%;
          font-weight: bold;
          font-size: 16px;
          line-height: 22px;
        }
      }
    }
    .infoListWrapper{
      margin-top: 20px;
      padding-bottom: 20px;
      ul{
        li{
          width: 100%;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
          font-size: 16px;
          padding: 10px 0;
          line-height: 22px;
          span:nth-child(1) {
            display: inline-block;
            width: 35%;
            color: #939499;
            flex-shrink: 0;
          }
          span:nth-child(2) {
            display: inline-block;
            width: 65%;
            color: #000;
            text-align: right;
          }
        }
      }
    }
  }
  .priceInfoWrap{
    padding: 20px $sidePadding * 1px 30px;
    background-color: #fff;
    .title{
      font-size: 13px;
      color: #000;
      font-weight: bold;
      line-height: 20px;
      padding: 10px 0;
    }
    ul{
      li{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        padding: 10px 0;
        line-height: 20px;
        span{
          font-size: 16px;
          display: inline-block;
          &:nth-child(1) {
            color: #939499;
          }
          &:nth-child(2) {
            color: #000;
          }
        }
        &:last-of-type{
          margin-top: 10px;
          padding-top: 20px;
          border-top: 1px solid #ebecf1;
          span:nth-child(2) {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
