<template>
  <div class="tabCancel popupBack fixWidth">
    <div class="pageTitle">취소 및 환불정책</div>
    <table class="cancelPolicy">
      <thead>
      <tr>
        <td>취소기준</td>
        <td>취소수수료</td>
      </tr>
      </thead>
      <tbody>
      <template
        v-for="(x, index) in place.cancelPolicies"
      >
        <tr
          v-if="place.cancelPolicies.length >= 2 && index === place.cancelPolicies.length - 1
          && x.day === 0 && x.hour === 24"
          :key="`${index - 1}.5`">
          <td>
            {{ formatDate(place.cancelPolicies[index - 1].day) }} {{ place.cancelPolicies[index - 1].hour }}시 부터<br>
            {{ formatDate(x.day || 1) }} {{ x.hour }}시 전까지
          </td>
          <td>
            {{ x.cancelPenaltyPercent }}%<br>
            <template v-if="x.cancelPenaltyPercent === 100">(취소 및 환불 불가)</template>
          </td>
        </tr>
        <tr
          :key="index">
          <td>
            <template v-if="x.day === 0">당일 취소 및 No-Show,<br>입실 시간 경과/실제 입실 후</template>
            <template v-else>{{ formatDate(x.day) }} {{ x.hour }}시 전까지</template>
          </td>
          <td>
            <template v-if="x.cancelPenaltyPercent === 100">취소 및 환불 불가</template>
            <template v-else>{{ x.cancelPenaltyPercent }}%</template>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <div class="sub">※ 연박 (2일 이상의 숙박) 예약 시, 예약 하신 각 투숙일 별 취소 수수료율이 차등 적용됩니다.</div>
    <div class="policy">
      <div
        v-for="(objInfo, index) in [common, nonCancellableInfo, exceptionInfo, etc]"
        :key="index"
        class="list"
      >
        <p class="title">{{ objInfo.title }}</p>
        <div class="content" v-html="replaceNewLineChar(objInfo.content)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import cancelPolicy from '~/utils/static.json';

export default {
  props: {
    objPlace: {
      type: Object,
      default: () => {},
    },
    params: {
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
    } = cancelPolicy.place.cancelPolicy;
    return {
      common,
      nonCancellableInfo,
      exceptionInfo,
      etc,
    };
  },
  computed: {
    place() {
      return this.objPlace.place;
    },
  },
  methods: {
    formatDate(date) {
      const d = new Date(this.params.checkin);
      d.setDate(d.getDate() - date);
      return this.$format.ymdDate(d);
    },
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
  },
};
</script>

<style lang="scss">
  .tabCancel{
    padding: 0 $sidePadding * 1px 80px;
    font-size: 12px;
    background-color: #FFF;
    .pageTitle {
      line-height: 30px;
      font-size: 23px;
      font-weight: bold;
      padding: 20px 0;
    }
    .cancelPolicy{
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
        padding: 0 10px;
        &:first-of-type{
          border-right: 1px solid #fff;
        }
      }
    }
    .sub{
      margin-top: 10px;
      font-size: 14px;
      color: #939499;
    }
    .policy{
      margin-top: 20px;
      .list{
        margin-top: 20px;
        color: #000;
        &:first-of-type{
          margin-top: 0;
        }
        .title{
          padding: 10px 0;
          font-size: 13px;
          font-weight: bold;
          line-height: 20px;
        }
        .content{
          font-size: 16px;
          line-height: 22px;
        }
      }
    }
  }
</style>
