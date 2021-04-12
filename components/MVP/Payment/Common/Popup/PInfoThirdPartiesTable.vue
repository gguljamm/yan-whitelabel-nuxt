<template>
  <transition name="rise">
    <div class="PInfoThdPtyTable" v-show="init">
      <Header
        :arrClass="['popup']"
      ></Header>
      <div class="pageTitle">{{ objPolicyData.pageTitle }}</div>
      <table class="policyTable table1">
        <tr>
          <th><strong>{{ objPolicyData.receiver.title }}</strong></th>
          <td>
            <template
              v-if="objSellerInfo.status === 'loaded'"
            >
              <span
                v-if="objSellerInfo.sellerInfo"
                v-html="replaceBpReplaceValue(objPolicyData.receiver.content, objSellerInfo.sellerInfo.map((obj) => obj.companyName).join(','))"
              ></span>
              <strong
                v-else
                class="point"
              >시설사</strong>
            </template>
          </td>
        </tr>
        <tr
          v-for="(key, index) in ['supplyPurpose1', 'supplyCategory1', 'usePeriod1']"
          :key="index"
        >
          <th><strong>{{ objPolicyData[key].title }}</strong></th>
          <td v-html="replaceBpReplaceValue(objPolicyData[key].content)"></td>
        </tr>
      </table>
      <table class="policyTable table2">
  <!--      <tr>-->
  <!--        <th width="20%" rowspan="3"><strong>{{ objPolicyData.supplierReceiver.title }}</strong></th>-->
  <!--      </tr>-->
  <!--      <tr>-->
  <!--        <th width="20%"><strong>{{ objPolicyData.supplierReceiver.supplier.title }}</strong></th>-->
  <!--        <td v-html="replaceBpReplaceValue(objPolicyData.supplierReceiver.supplier.content)"></td>-->
  <!--      </tr>-->
  <!--      <tr>-->
  <!--        <th width="20%"><strong>{{ objPolicyData.supplierReceiver.receiver.title }}</strong></th>-->
  <!--        <td v-html="objPolicyData.supplierReceiver.receiver.content.replace('bpReplaceValue', $store.state.partnerInfo.name)"></td>-->
  <!--      </tr>-->
  <!--      <tr>-->
  <!--        <th width="20%" colspan="2"><strong>{{ objPolicyData.supplyPurpose2.title }}</strong></th>-->
  <!--        <td v-html="replaceBpReplaceValue(objPolicyData.supplyPurpose2.content)"></td>-->
  <!--      </tr>-->
  <!--      <tr>-->
  <!--        <th width="20%" colspan="2"><strong>{{ objPolicyData.supplyCategory2.title }}</strong></th>-->
  <!--        <td v-html="replaceBpReplaceValue(objPolicyData.supplyCategory2.content)"></td>-->
  <!--      </tr>-->
  <!--      <tr>-->
  <!--        <th width="20%" colspan="2"><strong>{{ objPolicyData.usePeriod2.title }}</strong></th>-->
  <!--        <td v-html="replaceBpReplaceValue(objPolicyData.usePeriod2.content)"></td>-->
  <!--      </tr>-->
        <tr>
          <th width="30%"><strong>{{ objPolicyData.supplierReceiver.receiver.title }}</strong></th>
          <td v-html="objPolicyData.supplierReceiver.receiver.content.replace('bpReplaceValue', $store.state.channelInfo.name)"></td>
        </tr>
        <tr>
          <th width="30%"><strong>{{ objPolicyData.supplyPurpose2.title }}</strong></th>
          <td v-html="replaceBpReplaceValue(objPolicyData.supplyPurpose2.content)"></td>
        </tr>
        <tr>
          <th width="30%"><strong>{{ objPolicyData.supplyCategory2.title }}</strong></th>
          <td v-html="replaceBpReplaceValue(objPolicyData.supplyCategory2.content)"></td>
        </tr>
        <tr>
          <th width="30%"><strong>{{ objPolicyData.usePeriod2.title }}</strong></th>
          <td v-html="replaceBpReplaceValue(objPolicyData.usePeriod2.content)"></td>
        </tr>
      </table>
      <div class="noti">※ 위 개인정보 제3자 제공 동의를 거부할 수 있으며, 거부할 경우 서비스 이용이 제한됩니다.</div>
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
    arrSellerInfos: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      objPolicyData: policy[this.type] && policy[this.type].PInfoInfoToThirdParties,
      objSellerInfo: {
        status: 'init',
        sellerInfo: null,
      },
      init: false,
    };
  },
  methods: {
    replaceBpReplaceValue(strPolicy, bpReplaceValue) {
      return strPolicy ? strPolicy.replace('bpReplaceValue', bpReplaceValue) : '';
    },
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
  },
  mounted() {
    if (this.type === 'place') {
      this.$apis.getSellerInfo({ placeNo: this.$route.query.placeNo }).then((resp) => {
        this.objSellerInfo.sellerInfo = resp.data.result;
        this.objSellerInfo.status = 'loaded';
      }).catch(() => {
        this.objSellerInfo.status = 'loaded';
      });
    } else {
      console.log(this.arrSellerInfos);
      this.objSellerInfo.sellerInfo = this.arrSellerInfos && this.arrSellerInfos.length > 0 ? this.arrSellerInfos : '';
      this.objSellerInfo.status = 'loaded';
    }
    this.init = true;
  },
};
</script>

<style lang="scss">
  .PInfoThdPtyTable{
    width: 100%;
    background-color: #fff;
    min-height: 100vh;
    padding: 0 $sidePadding * 1px 80px;
    .pageTitle {
      line-height: 30px;
      font-size: 23px;
      font-weight: bold;
      padding: 20px 0;
    }
    .policyTable{
      width: 100%;
      border-spacing: 0;
      border-collapse: collapse;
      background-color: #f8f9fb;
      margin-top: 20px;
      text-align: left;
      .point{
        font-size: 16.8px;
      }
      th{
        background-color: #ebecf1;
        text-align: left;
      }
      th, td{
        line-height: 20px;
        height: 38px;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #000;
      }
      &.table1{
        th{
          width: 30%;
        }
        td{
          width: 70%;
        }
      }
    }
    .noti{
      font-size: 14px;
      margin-top: 10px;
    }
  }
</style>
