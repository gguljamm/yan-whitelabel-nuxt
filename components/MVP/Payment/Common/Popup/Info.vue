<template>
  <transition name="rise">
    <div class="agreementWrapper" v-show="init">
      <Header
        :arrClass="['popup']"
      ></Header>
      <div class="pageTitle">{{ pageTitle }}</div>
      <div class="policy">
        <table class="cancelPolicy" v-if="type === 'place' && popKey === 'cancelPolicy'">
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
        <div
          v-for="(objInfo, index) in arrPopInfo"
          :key="index"
          class="list"
        >
          <p class="title">{{ objInfo.title }}</p>
          <div class="content" v-html="replaceNewLineChar(objInfo.content)"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import policy from '~/utils/static.json';

export default {
  props: {
    popKey: {
      type: String,
      default: () => '',
    },
    type: {
      type: String,
      default: () => '',
    },
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
    const policyInfo = policy[this.type];
    let arrPopInfo = [];
    let title = '';
    if (this.popKey === 'cancelPolicy') {
      const { pageTitle } = policyInfo.cancelPolicy;
      title = pageTitle;
      let arrPolicyList = [];
      if (this.type === 'place') {
        const {
          common,
          nonCancellableInfo,
          exceptionInfo,
          etc,
        } = policyInfo.cancelPolicy;
        arrPolicyList = [common, nonCancellableInfo, exceptionInfo, etc];
      } else {
        const {
          common,
          cancellableInfo,
          refund,
          overTime,
          etc,
        } = policyInfo.cancelPolicy;
        arrPolicyList = [common, cancellableInfo, refund, overTime, etc];
      }
      arrPopInfo = arrPolicyList;
    } else {
      const { pageTitle } = policyInfo[this.popKey];
      title = pageTitle;
      arrPopInfo = [policyInfo[this.popKey]];
    }
    return {
      arrPopInfo,
      pageTitle: title,
      init: false,
    };
  },
  computed: {
    place() {
      return this.objPlace ? this.objPlace.place : {};
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
  mounted() {
    this.init = true;
  },
};
</script>

<style lang="scss">
.agreementWrapper{
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  .pageTitle{
    padding: 20px $sidePadding * 1px;
    line-height: 34px;
    font-size: 24px;
    font-weight: bold;
  }
  .policy{
    padding: 0 $sidePadding * 1px 80px;
    .cancelPolicy{
      margin-bottom: 20px;
      font-size: 12px;
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
        color: #939499;
        line-height: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>
