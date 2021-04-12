<template>
  <div class="leisureCancelAction fixWidth">
    <div class="pageTitle">예약 취소</div>
    <div class="cancelInfo">
      <div class="optionWrapper">
        <div
          @click="setAllSelectedOptionId"
          :class="{ active: isAllOption }"
          class="option all"
        >
          <div class="titleWrap">
            <div class="title">전체 선택</div>
          </div>
        </div>
        <div
          v-for="(objOption, optionIndex) in arrCancelableOption"
          :key="optionIndex"
          class="option"
          :class="{ active: arrSelectedOptionIndex.indexOf(optionIndex) !== -1 }"
          @click="setSelectedOptionId(optionIndex)"
        >
          <div class="titleWrap">
            <div class="title">주문 번호 {{ objOption.orderOptionId }}</div>
          </div>
          <div class="info">
            <div class="pin" v-if="objOption.orderedOptionItem.find((v) => v.pinCode)">
              핀번호 {{ objOption.orderedOptionItem.find((v) => v.pinCode).pinCode }}
            </div>
            <div class="name">{{ objOption.optionName }}</div>
            <div class="expirationDate">사용 가능 기간 ~{{ dateFormatDot(objOption.expiredType === 'ON_PERIOD' ? endDateFormat(objOption.period.endDateTime) : (objOption.expirationDate)) }}</div>
            <div class="price" v-if="objOption.channelDiscounts && objOption.channelDiscounts.length > 0">
              <span>{{ $format.numberFormat(objOption.salePrice || 0) }}</span>
              {{ $format.numberFormat((objOption.salePrice || 0) - (objOption.channelDiscounts.reduce((total, v) => total + v.discountAmount, 0))) }}원 / 1개
            </div>
            <div class="price" v-else>
              {{ $format.numberFormat(objOption.salePrice || 0) }}원 / 1개
            </div>
          </div>
        </div>
      </div>
      <div class="paymentInfoListWrapper">
        <div
          v-for="(list, index2) in arrPaymentInfo"
          :key="index2"
          class="listWrap"
          :class="list.class"
        >
          <div class="name">{{ list.name }}</div>
          <div class="value">{{ list.value }}</div>
        </div>
      </div>
    </div>
    <div class="policy">
      <div class="title">취소 및 환불 정책</div>
      <div v-if="objSelectedReserveInfo.refundInfo" class="infoWrap api" v-html="replaceNewLineChar(objSelectedReserveInfo.refundInfo)"></div>
      <div
        v-for="(obj, index) in cancelPolicy"
        :key="index"
        class="infoWrap"
      >
        <div class="title">{{ obj.title }}</div>
        <div class="info" v-html="replaceNewLineChar(obj.content)"></div>
      </div>
      <div class="checkBoxWrap">
        <label class="checkBox" :class="{ active: activePolicy }"><input v-model="activePolicy" type="checkbox">위 내용을 모두 확인하였습니다.</label>
      </div>
    </div>
    <global-button
      :disabled="!isSubmitActive"
      :text="'예약 취소'"
      @submit="isSubmitActive ? cancelReservation() : notification()"
    ></global-button>
  </div>
</template>

<script>
import policy from '~/utils/static.json';

export default {
  props: {
    arrPopupData: {
      type: Array,
      default: () => [],
    },
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const {
      common,
      cancellableInfo,
      refund,
      overTime,
      etc,
    } = policy.leisure.cancelPolicy;
    return {
      activePolicy: false,
      arrSelectedOptionIndex: [],
      cancelPolicy: [common, cancellableInfo, refund, overTime, etc],
      arrCancelableStatus: ['NOT_USED', 'CANCEL_REQUEST_FAILED', 'CANCEL_FAILED'],
    };
  },
  computed: {
    isAllOption() {
      return this.arrCancelableOption.length <= this.arrSelectedOptionIndex.length;
    },
    isSubmitActive() {
      return this.activePolicy && this.arrSelectedOptionIndex.length > 0;
    },
    arrCancelableOption() {
      return this.objSelectedReserveInfo.orderOption.filter((obj) => this.arrCancelableStatus.indexOf(obj.status) !== -1);
    },
    arrPaymentInfo() {
      const arr = [
        {
          name: '예약 번호',
          value: this.objSelectedReserveInfo.orderId,
        },
        {
          name: '구매 일시',
          value: this.objSelectedReserveInfo.createdDate.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(this.objSelectedReserveInfo.createdDate.split(' ')[0], 'dow')}) `),
        },
        {
          name: '예약 금액',
          value: `${this.$format.numberFormat(this.arrCancelableOption.reduce((tot, v) => tot + v.salePrice, 0))}원`,
        },
      ];
      const orderOption = this.arrCancelableOption;
      let totDiscount = 0;
      if (orderOption.some((v) => v.channelDiscounts && v.channelDiscounts.length > 0)) {
        totDiscount = orderOption.reduce((tot, v2) => tot + v2.channelDiscounts.reduce((total, v) => total + v.discountAmount, 0), 0);
        arr.push({
          name: '할인 금액',
          value: `(-) ${this.$format.numberFormat(totDiscount)}원`,
        });
      }
      arr.push(
        {
          name: '결제 금액',
          value: `${this.$format.numberFormat(this.arrCancelableOption.reduce((acc, objOption) => acc + (objOption.salePrice || 0), 0) - totDiscount)}원`,
        },
        {
          class: 'tr',
          name: '환불 방법',
          value: '원결제수단 취소',
        },
      );
      arr.push({
        name: '환불 금액',
        value: `${this.$format.numberFormat(this.arrSelectedOptionIndex.reduce((tot, v) => {
          const option = this.objSelectedReserveInfo.orderOption[v];
          const discount = option.channelDiscounts ? option.channelDiscounts.reduce((dis, v2) => dis + v2.discountAmount, 0) : 0;
          return tot + option.salePrice - discount;
        }, 0))}원`,
      });
      return arr;
    },
  },
  methods: {
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
    dateFormatDot(str) {
      return `${str.replace(/-/g, '.')}(${this.$format.formatDate(str.split(' ')[0], 'dow')})`;
    },
    endDateFormat(str) {
      let date = new Date(`${str.replace(' ', 'T')}.000+09:00`);
      const time = str.split(' ')[1];
      if (time === '00:00:00') {
        date = this.$format.ymdDate(new Date(date - 1));
      } else {
        date = `${this.$format.ymdDate(date)}${time ? ` ${time}` : ''}`;
      }
      return date;
    },
    setAllSelectedOptionId() {
      if (this.isAllOption) {
        this.arrSelectedOptionIndex = [];
      } else {
        this.arrSelectedOptionIndex = this.arrCancelableOption.map((_, index) => index);
      }
    },
    setSelectedOptionId(optionIndex) {
      const indexOf = this.arrSelectedOptionIndex.indexOf(optionIndex);
      if (indexOf === -1) {
        this.arrSelectedOptionIndex.push(optionIndex);
      } else {
        this.arrSelectedOptionIndex.splice(indexOf, 1);
      }
    },
    notification() {
      this.$store.commit('openNotice', {
        text: this.arrSelectedOptionIndex.length <= 0 ? '취소할 옵션을 선택해주세요.' : '예약 취소 정책에 동의해주세요.',
        bottom: 106,
      });
    },
    cancelReservation() {
      if (this.$store.state.channelInfo.channelName.replace('dev_', '') === 'etbs' && this.arrSelectedOptionIndex.length !== this.arrCancelableOption.length) {
        this.$store.commit('openNotice', {
          text: '제휴채널의 경우 전체 취소만 가능합니다.',
          bottom: 106,
        });
        return;
      }
      const objSubmit = {
        orderId: this.objSelectedReserveInfo.orderId,
        orderedOptionIds: this.arrSelectedOptionIndex.map((index) => this.arrCancelableOption[index].orderOptionId),
      };
      // console.log(objSubmit);
      this.$emit('cancelReservation', objSubmit);
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>

<style lang="scss">
  .leisureCancelAction{
    padding-bottom: 20px;
    .pageTitle{
      font-size: 23px;
      font-weight: bold;
      line-height: 30px;
      padding: 20px $sidePadding * 1px;
    }
    .cancelInfo {
      color: #000;
      .optionWrapper {
        margin-top: 20px;
        border-bottom: 10px solid #f8f9fb;
        padding: 0 $sidePadding * 1px 20px;
        .option{
          padding: 16px 14px;
          margin-top: 10px;
          border-radius: 4px;
          border: 1px solid #f1f1f1;
          &:first-of-type{
            margin-top: 0;
          }
          &.all{
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
          }
          &.active{
            .titleWrap {
              &:before {
                background-color: #000;
              }
            }
          }

          .titleWrap {
            width: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;

            &:before {
              flex-shrink: 0;
              content: '';
              border-radius: 10px;
              display: block;
              margin-right: 8px;
              width: 20px;
              height: 20px;
              background-image: url(~assets/img/icon-check-white.svg);
              background-position: center;
              background-repeat: no-repeat;
              background-color: rgb(197, 198, 203);
              background-size: 20px;
            }
            .title {
              width: 100%;
              font-size: 13px;
              color: #000;
              font-weight: bold;
            }
          }
          .info{
            width: 100%;
            padding-top: 10px;
            .pin{
              color: #000;
              font-size: 13px;
              line-height: 20px;
            }
            .name {
              color: #000;
              font-size: 13px;
              line-height: 20px;
            }
            .expirationDate{
              font-size: 11px;
              color: #939499;
              line-height: 18px;
              margin-top: 4px;
            }
            .price{
              font-weight: bold;
              color: #000;
              text-align: right;
              margin-top: 12px;
              line-height: 14px;
              font-size: 16px;
              > span{
                color: #939499;
                font-weight: normal;
                text-decoration: line-through;
              }
            }
          }
        }
      }
      .paymentInfoListWrapper{
        padding: 20px $sidePadding * 1px;
        border-bottom: 10px solid #f8f9fb;
        .listWrap{
          width: 100%;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
          font-size: 16px;
          line-height: 22px;
          padding: 10px 0;
          .name{
            color: #939499;
          }
          .value{
            color: #000;
          }
          &.tr{
            margin-top: 10px;
            padding-top: 20px;
            border-top: 1px solid #ebecf1;
          }
        }
      }
    }
    .policy{
      padding: 32px $sidePadding * 1px 0;
      .title{
        font-weight: bold;
        color: #000;
      }
      .infoWrap{
        margin-top: 16px;
        line-height: 20px;
        font-size: 13px;
        &:first-of-type{
          margin-top: 0;
        }
        &.api{
          border-radius: 4px;
          background-color: #fdf1f1;
          padding: 16px 12px;
          color: #000;
        }
        .title{
          font-weight: bold;
          color: #000;
          font-size: 13px;
          padding: 10px 0;
        }
        .info{
          color: #939499;
          line-height: 20px;
          font-size: 13px;
        }
      }
      .checkBoxWrap{
        margin-top: 30px;
        .checkBox{
          font-size: 14px;
          line-height: 20px;
          display: block;
          font-weight: bold;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          &.active{
            &:before {
              background-color: #000;
            }
          }
          &:before {
            content: '';
            border-radius: 10px;
            display: block;
            margin-right: 8px;
            width: 20px;
            height: 20px;
            background-image: url(~assets/img/icon-check-white.svg);
            background-position: center;
            background-repeat: no-repeat;
            background-color: rgb(197, 198, 203);
            background-size: 20px;
          }
          input{
            display: none;
          }
        }
      }
    }
  }
</style>
