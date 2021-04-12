<template>
  <div class="completeReserve">
    <div class="pageTitle">예약 완료</div>
    <div class="productInfo">
      <div class="titleWrap">
        <div
          class="mainImg"
          :style="{
              backgroundImage: objComplete.result.image ? `url(${objComplete.result.image})` : '',
            }"
        ></div>
        <div class="info">
          <div class="category">{{ objComplete.result.category }}</div>
          <div class="name">{{ objComplete.result.dealName }}</div>
        </div>
      </div>
      <div class="infoListWrapper">
        <ul>
          <li>
            <span>예약 번호</span>
            <span>{{ objComplete.result.orderId }}</span>
          </li>
          <li>
            <span>예약 일시</span>
            <span>{{ reserveDate }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="optionInfo">
      <div class="infoListWrapper">
        <ul
          v-for="(arrGroup, groupKey, index) of objComplete.result.orderOption.reduce(
            (result, obj) => ({
            ...result, [`${obj.optionId}-${obj.status}`]: (result[`${obj.optionId}-${obj.status}`] || []).concat(obj),
            }), {})"
          :key="groupKey"
        >
          <li>
            <span>선택 {{ index + 1 }}</span>
            <span>{{ arrGroup[0].optionName }} {{ arrGroup.length }}개</span>
          </li>
          <li>
            <span>사용 가능 기간</span>
            <span>~{{ dateFormatDot(`${arrGroup[0].expiredType === 'ON_PERIOD' ? endDateTimeFormat(arrGroup[0].period.startDateTime) : arrGroup[0].expirationDate}`) }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="priceInfoWrap">
      <div class="title">결제 정보</div>
      <ul>
        <li>
          <span>예약 금액</span>
          <span>{{ $format.numberFormat(objComplete.result.salePrice) }}원</span>
        </li>
        <li>
          <span>{{ discountName }} 금액</span>
          <span>(-) {{ $format.numberFormat(discountPrice) }}원</span>
        </li>
        <li>
          <span>최종 결제 금액</span>
          <span>{{ $format.numberFormat(objComplete.result.salePrice - discountPrice) }}원</span>
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
    // objLeisure: {
    //   type: Object,
    //   default: () => {},
    // },
    // params: {
    //   type: Object,
    //   default: () => {},
    // },
  },
  data() {
    return {
    };
  },
  computed: {
    discountPrice() {
      return this.objComplete.result.orderOption.reduce((total, v) => total + (v.channelDiscounts && v.channelDiscounts.length > 0 ? v.channelDiscounts.reduce((disTot, v2) => disTot + v2.discountAmount, 0) : 0), 0);
    },
    discountName() {
      const arr = [];
      this.objComplete.result.orderOption.forEach((v) => {
        if (v.channelDiscounts) {
          v.channelDiscounts.forEach((v2) => {
            if (arr.indexOf(v2.policyName) < 0) {
              arr.push(v2.policyName);
            }
          });
        }
      });
      return arr.length > 0 ? arr.join('+') : '할인';
    },
    reserveDate() {
      const d = this.objComplete.result.createdDate;
      if (!d) {
        return '';
      }
      return d.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(d.split(' ')[0], 'dow')}) `);
    },
  },
  methods: {
    endDateTimeFormat(str) {
      let date = new Date(`${str.replace(' ', 'T')}.000+09:00`);
      const time = str.split(' ')[1];
      if (time === '00:00:00') {
        date = this.$format.ymdDate(new Date(date - 1));
      } else {
        date = `${this.$format.ymdDate(date)}${time ? ` ${time}` : ''}`;
      }
      return date;
    },
    dateFormatDot(str) {
      return `${str.replace(/-/g, '.')}(${this.$format.formatDate(str.split(' ')[0], 'dow')})`;
    },
    submit() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/leisure');
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
  .productInfo, .optionInfo{
    border-bottom: 10px solid #f8f9fb;
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
          line-height: 22px;
          padding: 10px 0;
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

  .pageTitle {
    line-height: 34px;
    font-size: 24px;
    font-weight: bold;
    padding: 20px $sidePadding * 1px;
  }
  .productInfo {
    background-color: #fff;
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
  }
  .optionInfo{
    padding: 0 $sidePadding * 1px;
    .infoListWrapper{
      ul {
        padding: 10px 0;
        border-top: 1px solid #ebecf1;
        &:first-of-type{
          border: none;
          padding: 0 0 10px;
        }
        &:last-of-type{
          padding: 10px 0 0;
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
            font-weight: bold;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
