<template>
  <div class="placeCancelRefundPolicy">
    <div class="fixWidth">
      <div class="pageTitle">취소 및 환불 정책</div>
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
      </div>
    </div>
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
  },
  data() {
    const {
      common,
      nonCancellableInfo,
      exceptionInfo,
      etc,
    } = policy.place.cancelPolicy;
    return {
      cancelPolicy: [common, nonCancellableInfo, exceptionInfo, etc],
    };
  },
  methods: {
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
  },
};
</script>

<style lang="scss" scoped>
  .placeCancelRefundPolicy{
    font-size: 14px;
    min-height: calc(100vh - #{$header * 1px});
    padding: 0 0 80px;
    .pageTitle{
      font-weight: bold;
      font-size: 23px;
      line-height: 30px;
      padding: 20px $sidePadding * 1px;
    }
    .policy{
      .infoWrap{
        margin-top: 16px;
        &:first-of-type{
          margin-top: 0;
        }
        .cancelPolicyTable{
          width: 100%;
          border-spacing: 0;
          background-color: #f8f9fb;
          padding: 0 $sidePadding * 1px;
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
          line-height: 20px;
          padding: 10px $sidePadding * 1px;
        }
        .info{
          color: #939499;
          line-height: 20px;
          padding: 0 $sidePadding * 1px;
        }
      }
    }
  }
</style>
