<template>
  <div class="reservePlaceListWrapper">
    <div v-if="arrFilteredList.length > 0" class="listWrapper">
      <div
        v-for="(objReserveListInfo, index) in arrFilteredList"
        :key="index"
        class="list"
      >
        <div
          class="image"
          :class="state === 'passed' || state === 'CANCELED' ? 'passed' : ''"
          :style="objReserveListInfo.placeInfo && objReserveListInfo.placeInfo.images ? { backgroundImage: `url(${objReserveListInfo.placeInfo.images[0].bpUrl})` } : {}"
        ></div>
        <div class="info">
          <div class="title">{{ objReserveListInfo.placeInfo.placeName }}</div>
          <div class="time">
            {{ placeListDateFormat(objReserveListInfo.reservationInfo.checkIn) }} - {{ placeListDateFormat(objReserveListInfo.reservationInfo.checkOut) }}, {{ $format.getBetweenDay(objReserveListInfo.reservationInfo.checkIn, objReserveListInfo.reservationInfo.checkOut) }}박
          </div>
        </div>
        <div class="bottomInfo">
          <div class="btnWrap">
            <button
              class="passed"
              @click="(new Date(`${objReserveListInfo.reservationInfo.reservationDate.split(' ')[0]}`) > new Date(`${objReserveListInfo.reservationInfo.checkIn.split(' ')[0]}`)) || (state === 'passed' || state === 'CANCELED') ? deleteReserve(objReserveListInfo) : openDetail(objReserveListInfo, true)"
            >{{ (new Date(`${objReserveListInfo.reservationInfo.reservationDate.split(' ')[0]}`) > new Date(`${objReserveListInfo.reservationInfo.checkIn.split(' ')[0]}`)) || (state === 'passed' || state === 'CANCELED') ? '예약 내역 삭제' : '예약 취소' }}
            </button>
            <button class="check" @click="openDetail(objReserveListInfo)">예약 내역 상세</button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="noResult fixWidth"
    >
      <div>예약 내역이 없습니다.</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrReserveList: {
      type: Array,
      default: () => [],
    },
    state: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    placeListDateFormat(str) {
      return str.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(str.split(' ')[0], 'dow')}) `);
    },
    deleteReserve(objReserveListInfo) {
      this.$store.commit('openAlert', {
        text: '이용내역을 삭제하시겠습니까?',
        arrBtn: [
          { text: '취소', event: () => {} },
          { text: '확인', event: () => { this.$emit('deleteReserve', objReserveListInfo.reservationInfo.bpReservationNo); } },
        ],
      });
    },
    openDetail(objReserveListInfo, isCancel) {
      this.$emit('openDetail', { objReserveListInfo, isCancel });
    },
  },
  computed: {
    arrFilteredList() {
      let filteredList = [];
      const formatTime = (time) => {
        let temp = time.replace(' ', 'T');
        if (temp.split('T')[1].split(':').length === 2) {
          temp = `${temp}:00`;
        }
        return temp;
      };
      if (this.state === 'passed' || this.state === 'RESERVED') {
        filteredList = this.arrReserveList.filter((obj) => {
          const isYanoljaTime = new Date(obj.reservationInfo.reservationDate.split(' ')[0]) > new Date(obj.reservationInfo.checkIn.split(' ')[0]);
          let isPassedYanoljaTime = false;
          let normal = false;
          const checkout = formatTime(obj.reservationInfo.checkOut);
          if (this.state === 'passed') {
            normal = new Date() > new Date(checkout) && obj.reservationInfo.reservationStatus !== 'CANCELED';
            isPassedYanoljaTime = new Date() > new Date(obj.reservationInfo.checkOut.replace(' ', 'T'));
          }
          if (this.state === 'RESERVED') {
            normal = new Date() <= new Date(checkout) && obj.reservationInfo.reservationStatus === this.state;
            isPassedYanoljaTime = new Date() < new Date(checkout);
          }
          return normal || (isYanoljaTime && isPassedYanoljaTime);
        });
      }
      if (this.state === 'CANCELED') {
        filteredList = this.arrReserveList.filter((obj) => obj.reservationInfo.reservationStatus === this.state);
      }
      return filteredList.sort((a, b) => new Date(formatTime(a.reservationInfo.checkIn)) - new Date(formatTime(b.reservationInfo.checkIn)));
    },
  },
};
</script>

<style lang="scss" scoped>
.reservePlaceListWrapper{
  .listWrapper{
    margin-top: 20px;
    padding: 0 $sidePadding * 1px 100px;
    .list {
      display: block;
      background-color: #fff;
      margin-top: 10px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
      overflow: hidden;
      border-radius: 4px;
      &:first-of-type {
        margin-top: 0;
      }
      .image {
        width: 100%;
        padding-bottom: 42.66%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        &.passed{
          opacity: .5;
        }
      }

      .info {
        padding: 10px 14px;

        .time {
          line-height: 18px;
          font-size: 13px;
          color: #939499;
        }

        .title {
          line-height: 22px;
          font-size: 16px;
          color: #000;
          font-weight: bold;
        }
      }

      .bottomInfo {
        .btnWrap {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          padding: 0 14px 14px;
          button {
            font-size: 13px;
            color: #000;
            width: 50%;
            height: 43px;
            border-radius: 4px;
            border: 1px solid #000;
            &.check{
              color: #ff3478;
              border: 1px solid #ff3478;
              margin-left: 7px;
            }
          }
        }
      }
    }
  }

  .noResult {
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
</style>
