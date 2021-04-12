<template>
  <div class="cancelAction fixWidth">
    <div class="pageTitle">예약 취소</div>
    <div class="cancelInfo">
      <div
        v-for="(list, index) in arrPaymentInfo"
        :key="index"
        class="listWrap"
        :class="list.class"
      >
        <div class="name">{{ list.name }}</div>
        <div class="value">{{ list.value }}</div>
      </div>
    </div>
    <div class="policy">
      <div
        v-for="(obj, index) in cancelPolicy"
        :key="index"
        class="infoWrap"
      >
        <div class="title">{{ obj.title }}</div>
        <div class="info" v-html="replaceNewLineChar(obj.content)"></div>
      </div>
      <div class="infoWrap">
        <div class="title">취소수수료 계산 기준</div>
        <table class="cancelPolicyTable">
          <thead>
          <tr>
            <td>취소기준</td>
            <td>취소수수료</td>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(x, index) in objSelectedReserveInfo.placeInfo.cancelPolicies"
            :key="index"
          >
            <td>
              <template v-if="x.day === 0">당일 취소 및 No-Show,<br>입실시간 경과/실제 입실 후</template>
              <template v-else>입실 {{ x.day }}일 전 {{ x.hour }}시 전까지</template>
            </td>
            <td>
              <template v-if="x.cancelPenaltyPercent === 100">환불불가</template>
              <template v-else>{{ x.cancelPenaltyPercent }}%</template>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="checkBox" :class="{ active: activePolicy }">
        <label><div></div><input v-model="activePolicy" type="checkbox">위 내용을 모두 확인하였습니다.</label>
      </div>
    </div>
    <global-button
      :disabled="!(activePolicy && objReservationCancellationFee && objReservationCancellationFee.status === 'loaded' && objReservationCancellationFee.value >= 0)"
      :text="'예약 취소'"
      @submit="objReservationCancellationFee && objReservationCancellationFee.status === 'loaded' && objReservationCancellationFee.value >= 0 ? activePolicy ? cancelReservation() : notification('policy') : notification('cancelFee')"
    ></global-button>
  </div>
</template>

<script>
import policy from '~/utils/static.json';

export default {
  props: {
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
    objReservationCancellationFee: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const {
      common,
      nonCancellableInfo,
      exceptionInfo,
      etc,
    } = policy.place.cancelPolicy;
    return {
      activePolicy: false,
      cancelPolicy: [common, nonCancellableInfo, exceptionInfo, etc],
    };
  },
  computed: {
    arrPaymentInfo() {
      const { reservationInfo } = this.objSelectedReserveInfo;
      const map = {
        creditCardAmount: '카드 결제',
        account: '계좌 이체',
        welfarePoint: '기타 결제',
      };
      const arrResp = [
        {
          name: '결제일',
          value: this.placeListDateFormat(reservationInfo.reservationDate),
        },
        {
          name: '결제 수단',
          value: `${ Object.keys(map).filter((v) => reservationInfo[v]).map((v) => map[v]).join(' + ') }`,
        },
        {
          name: '예약 금액',
          value: `${this.$format.numberFormat(reservationInfo.roomPrice)}원`,
        },
        {
          name: '할인 금액',
          value: `${this.$format.numberFormat(reservationInfo.roomPrice - reservationInfo.paymentPrice)}원`,
        },
        {
          class: 'tr',
          name: '결제 금액',
          value: `${this.$format.numberFormat(reservationInfo.paymentPrice)}원`,
        },
        {
          name: '환불 방법',
          value: '원결제수단 취소',
        },
      ];
      let fee = 0;
      if (this.objReservationCancellationFee && this.objReservationCancellationFee.value > -1) {
        fee = this.objReservationCancellationFee.value;
        if (fee > reservationInfo.paymentPrice) {
          fee = reservationInfo.paymentPrice;
        }
        arrResp.push({
          name: '취소 수수료',
          value: `(-) ${this.$format.numberFormat(fee)}원`,
        });
      }
      const refundPrice = (reservationInfo.paymentPrice - fee);
      arrResp.push({
        name: '환불 금액',
        value: `${this.$format.numberFormat(refundPrice < 0 ? 0 : refundPrice)}원`,
      });
      return arrResp;
    },
  },
  methods: {
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
    placeListDateFormat(str) {
      return str.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(str.split(' ')[0], 'dow')}) `);
    },
    notification(type) {
      let message = '';
      switch (type) {
        case 'policy':
          message = '예약 취소 정책에 동의해주세요.';
          break;
        case 'cancelFee':
          message = '취소 수수료 조회를 실패 했습니다. 잠시 후 다시 시도해주세요.';
          break;
        default:
          message = '알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요';
          break;
      }
      this.$store.commit('openNotice', {
        text: message,
        bottom: 102,
      });
    },
    cancelReservation() {
      const { bpReservationNo } = this.objSelectedReserveInfo.reservationInfo;
      this.$emit('cancelReservation', { bpReservationNo, reservationCancellationFee: this.objReservationCancellationFee.value });
    },
  },
};
</script>

<style lang="scss">
  .cancelAction{
    padding-bottom: 20px;
    .pageTitle{
      font-weight: bold;
      font-size: 23px;
      line-height: 30px;
      padding: 20px $sidePadding * 1px;
    }
    .cancelInfo {
      color: #000;
      padding: 20px $sidePadding * 1px 40px;
      border-bottom: 10px solid #f8f9fb;
      .title {
        font-size: 23px;
        line-height: 30px;
        font-weight: bold;
        padding-bottom: 16px;
      }
      .listWrap{
        width: 100%;
        margin-bottom: 20px;
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
        .name{
          color: #939499;
        }
        .value{
          color: #000;
        }
        &:last-of-type{
          margin-bottom: 0;
        }
        &.tr{
          padding-bottom: 20px;
          border-bottom: 1px solid #ebecf1;
        }
      }
    }
    .policy{
      padding: 30px $sidePadding * 1px 0;
      .infoWrap{
        margin-top: 16px;
        .cancelPolicyTable{
          width: 100%;
          border-spacing: 0;
          background-color: #f8f9fb;
          thead{
            background-color: #ebecf1;
          }
          tbody{
            tr{
              td{
                border-bottom: 1px solid #fff;
              }
              &:last-of-type td{
                border-bottom: 0;
              }
            }
          }
          td{
            line-height: 15px;
            height: 38px;
            width: 50%;
            font-size: 12px;
            padding: 0 10px;
            &:first-of-type{
              border-right: 1px solid #fff;
            }
          }
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
          &.cancel{
            color: #000;
            background-color: #fdf1f1;
            padding: 16px 12px;
            border-radius: 4px;
          }
        }
        &:first-of-type{
          margin-top: 0;
        }
      }
      .checkBox{
        margin-top: 30px;
        font-size: 14px;
        &.active{
          > label > div{
            background-color: #000;
          }
        }
        > label{
          padding-left: 28px;
          position: relative;
          line-height: 20px;
          display: block;
          font-weight: bold;
          > div{
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            background-color: rgb(197, 198, 203);
            border-radius: 10px;
            &:before{
              display: block;
              content: '';
              width: 20px;
              height: 20px;
              background: url(~assets/img/icon-check-white.svg) center center no-repeat;
              background-size: 20px;
            }
          }
          input{
            display: none;
          }
        }
      }
    }
  }
</style>
