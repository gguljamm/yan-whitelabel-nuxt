<template>
  <transition name="rise">
    <div class="PInfoColTable" v-show="init">
      <Header
        :arrClass="['popup']"
      ></Header>
      <div class="pageTitle">{{ title }}</div>
      <table class="policyTable">
        <tr
          v-for="(obj, index) in arrTableData"
          :key="index"
        >
          <th width="30%">{{ obj.title }}</th>
          <td
            width="70%"
            v-html="replaceNewLineChar(obj.content)"
          ></td>
        </tr>
      </table>
      <div class="noti">※ 위 개인정보 수집 · 이용에 대한 동의를 거부할 수 있으며, 거부할 경우 서비스 이용이 제한됩니다.</div>
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
  },
  data() {
    const {
      classification,
      purpose,
      category,
      usePeriod,
    } = policy[this.type].PInfoCollectionAndUtilization;
    return {
      title: policy[this.type].PInfoCollectionAndUtilization.pageTitle,
      arrTableData: [
        classification,
        purpose,
        category,
        usePeriod,
      ],
      init: false,
    };
  },
  methods: {
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
  .PInfoColTable {
    width: 100%;
    background-color: #fff;
    padding: 0 $sidePadding * 1px 80px;
    min-height: 100vh;
    .pageTitle {
      line-height: 30px;
      font-size: 23px;
      font-weight: bold;
      padding: 20px 0;
    }
    .policyTable{
      width: 100%;
      border-spacing: 0;
      background-color: #f8f9fb;
      border-collapse: collapse;
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
        font-size: 14px;
        padding: 10px;
        border: 1px solid #000;
      }
    }
    .noti{
      font-size: 14px;
      margin-top: 10px;
    }
  }
</style>
