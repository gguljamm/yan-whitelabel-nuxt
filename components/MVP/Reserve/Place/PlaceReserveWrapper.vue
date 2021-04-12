<template>
  <div class="placeReservedWrapper">
    <TabMenu
      :arrMenu="arrMenu.map((obj) => obj.name)"
      :selectedTabIndex="selectedTabIndex"
      @setSelectedTab="setSelectedTab"
    ></TabMenu>
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
      <ListWrapper
        v-else
        :arrReserveList="objReserveList.place"
        :state="arrMenu[selectedTabIndex].key"
        @deleteReserve="deleteReserve"
        @openDetail="openDetail"
      ></ListWrapper>
    </template>
  </div>
</template>

<script>
import TabMenu from '@/components/MVP/Common/TabMenu.vue';
import ListWrapper from '@/components/MVP/Reserve/Place/PlaceListWrapper.vue';

export default {
  components: {
    TabMenu,
    ListWrapper,
  },
  props: {
    objReserveList: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      arrMenu: [
        {
          name: '예정된 예약',
          key: 'RESERVED',
        },
        {
          name: '지난 예약',
          key: 'passed',
        },
        {
          name: '취소된 예약',
          key: 'CANCELED',
        },
      ],
      selectedTabIndex: 0,
    };
  },
  methods: {
    openDetail(objReserveListInfo) {
      this.$emit('openDetail', objReserveListInfo);
    },
    setSelectedTab(selectedTabIndex) {
      this.selectedTabIndex = selectedTabIndex;
    },
    deleteReserve(reservationNo) {
      this.$emit('deleteReserve', reservationNo);
    },
  },
  mounted() {
    this.$emit('getList');
  },
};
</script>

<style lang="scss">
  .placeReservedWrapper{
    .fail{
      margin-top: 108px;
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
  }
</style>
