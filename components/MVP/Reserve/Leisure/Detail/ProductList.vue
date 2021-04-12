<template>
  <div class="leisureReserveDetailOption" :class="{ unavailable: !stateMap[objOption.status] }">
    <div class="itemWrap">
      <div class="codeWrap">
        <div
          class="code"
        >주문 번호: {{ objOption.orderOptionId }}</div>
        <span
          class="state"
          :class="{ unavailable: !stateMap[objOption.status] }"
        >{{ stateMap[objOption.status] ? stateMap[objOption.status] : '사용불가' }}</span>
      </div>
      <div class="codeWrap" v-if="objOption.orderedOptionItem.find((v) => v.pinCode)">
        <div
          class="code"
          :class="{ unavailable: !stateMap[objOption.status] }"
        >핀번호: {{ objOption.orderedOptionItem.find((v) => v.pinCode).pinCode }}</div>
      </div>
      <div class="name">{{ objOption.optionName }}</div>
    </div>
    <div class="expirationDate">사용 가능 기간 ~{{ dateFormatDot(objOption.expiredType === 'ON_PERIOD' ? endDateFormat(objOption.period.endDateTime) : (objOption.expirationDate)) }}</div>
    <div class="price" v-if="objOption.channelDiscounts && objOption.channelDiscounts.length > 0">
      <span>{{ $format.numberFormat(objOption.salePrice || 0) }}</span>
      {{ $format.numberFormat((objOption.salePrice || 0) - (objOption.channelDiscounts.reduce((total, v) => total + v.discountAmount, 0))) }}원 / 1개
    </div>
    <div class="price" v-else>
      {{ $format.numberFormat(objOption.salePrice || 0) }}원 / 1개
    </div>
    <div
      v-if="stateMessageMap[objOption.status]"
      class="stateMessage"
      :class="{ error: objOption.status.indexOf('CANCEL') !== -1 }"
    >{{ stateMessageMap[objOption.status] }}</div>
  </div>
</template>

<script>
export default {
  props: {
    objOption: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      stateMap: {
        RESERVATION_SUCCEEDED: '사용가능',
        CONSUMED: '사용완료',
        NOT_USED: '사용가능',
      },
      stateMessageMap: {
        RESERVATION_REQUESTED: '예약 진행중입니다.',
        CANCELED: '취소된 상품입니다.',
        EXPIRATION: '기간만료된 상품입니다.',
        CANCEL_REQUESTING: '예약 취소 진행중입니다.',
        CANCEL_REQUEST_FAILED: '예약 취소 실패했습니다.',
        CANCEL_REQUESTED: '취소된 상품입니다.',
        CANCEL_FAILED: '취소실패한 상품입니다.',
        FORCED_CANCELE: '강제취소된 상품입니다.',
        CONSUMED: '사용됨',
      },
    };
  },
  methods: {
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
  },
};
</script>

<style lang="scss">
.leisureReserveDetailOption {
  padding: 14px 14px 16px;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  margin-top: 10px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
  &.unavailable{
    padding: 14px 14px 0;
    box-shadow: none;
  }
  &:first-of-type {
    margin-top: 0;
  }

  .itemWrap {
    .codeWrap {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;

      .code {
        font-weight: bold;
        font-size: 13px;
        line-height: 20px;
        color: #000;

        &.unavailable {
          text-decoration: line-through;
        }
      }

      .state {
        display: inline-block;
        padding: 4px 6px;
        background-color: #000;
        color: #fff;
        border-radius: 11.5px;
        font-size: 10px;

        &.unavailable {
          background-color: #cccdd1;
        }
      }
    }

    .name {
      font-size: 13px;
      color: #000;
      line-height: 18px;
    }
  }

  .expirationDate {
    margin-top: 4px;
    color: #939499;
    line-height: 18px;
    font-size: 11px;
  }

  .price {
    font-size: 16px;
    font-weight: bold;
    line-height: 14px;
    color: #000;
    text-align: right;
    margin-top: 12px;
    padding-bottom: 10px;
    > span{
      color: #939499;
      font-weight: normal;
      text-decoration: line-through;
    }
  }

  .stateMessage {
    font-size: 11px;
    line-height: 18px;
    padding: 10px 0;
    border-top: 1px solid #ebecf1;

    &.error {
      color: #d31111;
    }
  }
}
</style>
