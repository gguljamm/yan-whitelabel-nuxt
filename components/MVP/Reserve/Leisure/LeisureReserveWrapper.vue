<template>
  <div class="reservedWrapper">
    <div
      v-if="objReserveList.status === 'fail'"
      class="fail"
    >
      <div class="message">
        <div>예약 내역을 불러오는데<br>실패했습니다.</div>
        <div>다시 시도해주세요.</div>
      </div>
    </div>
    <template v-else>
      <SpinnerLoading
        v-if="objReserveList.status === 'loading'"
      ></SpinnerLoading>
      <div
        v-else
        class="reserveListWrapper"
      >
        <ListWrapper
          v-if="objReserveList.leisure && objReserveList.leisure.length > 0"
          :arrReserveList="objReserveList.leisure"
          @openDetail="openDetail"
        ></ListWrapper>
        <div
          v-else
          class="noResult fixWidth"
        >
          <div>예약내역이 없습니다.</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ListWrapper from '@/components/MVP/Reserve/Leisure/LeisureListWrapper.vue';

export default {
  components: {
    ListWrapper,
  },
  props: {
    objReserveList: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    openDetail(objReserveListInfo) {
      this.$emit('openDetail', objReserveListInfo);
    },
  },
  mounted() {
    this.$emit('getList');
  },
};
</script>

<style lang="scss">
  .reservedWrapper{
    .fail{
      padding-top: 108px;
      text-align: center;
      .message{
        div{
          &:nth-child(1) {
            font-weight: bold;
            font-size: 23px;
            line-height: 30px;
          }
          &:nth-child(2) {
            margin-top: 4px;
            font-size: 13px;
            line-height: 20px;
            color: #939499;
          }
        }
      }
    }
    .reserveListWrapper {
      .noResult{
        height: calc(100vh - #{$header * 1px});
        padding-top: 100px;
        background-color: #f8f9fb;
        text-align: center;
        > div:first-of-type{
          color: #000;
          font-size: 23px;
          line-height: 30px;
          font-weight: bold;
        }
        > div:nth-of-type(2){
          color: #939499;
          font-size: 13px;
          line-height: 20px;
          margin-top: 4px;
        }
      }
    }
  }
</style>
