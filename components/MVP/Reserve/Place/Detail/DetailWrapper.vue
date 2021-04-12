<template>
  <div class="reserveDetailPlaceWrapper">
    <Header></Header>
    <div class="detailWrapper fixWidth">
      <div class="pageTitle">예약 내역 상세</div>
      <div class="detailContent">
        <div class="contentInfo">
          <div class="productInfo">
            <div @click="openProductDetail" class="titleWrapper">
              <div>
                <div
                  class="thumbnail"
                  :style="{
                    backgroundImage: representationImage ? `url(${representationImage.bpUrl})` : '',
                  }"
                ></div>
                <div class="info">
                  <div class="category">{{ categoryNameMap[objSelectedReserveInfo.placeInfo.category.toLowerCase()] }}</div>
                  <div class="name">{{ objSelectedReserveInfo.placeInfo.placeName }}</div>
                </div>
              </div>
            </div>
            <div class="infoListWrapper">
              <div class="list">
                <div class="name">예약 번호</div>
                <div class="val" v-if="objSelectedReserveInfo.reservationInfo.reservationStatus !== 'CANCELED'">{{ objSelectedReserveInfo.reservationInfo.yanReservationNo }}</div>
                <div class="val cancel" v-else><span>{{ objSelectedReserveInfo.reservationInfo.yanReservationNo }}</span> 취소 완료</div>
              </div>
              <div class="list">
                <div class="name">구매 일시</div>
                <div class="val">{{ placeListDateFormat(objSelectedReserveInfo.reservationInfo.reservationDate) }}</div>
              </div>
              <div class="list" v-if="objSelectedReserveInfo.reservationInfo.reservationStatus === 'CANCELED'">
                <div class="name">취소 일시</div>
                <div class="val">{{ placeListDateFormat(objSelectedReserveInfo.reservationInfo.canceledDate) }}</div>
              </div>
            </div>
            <button class="largeFillButton" @click="$emit('popup', 'Voucher')">예약 확인서</button>
          </div>
          <div class="reserveInfo">
            <div class="usageTime">
              <div class="check in">
                <div class="name">체크인</div>
                <div class="date">{{ placeListDateFormat(objSelectedReserveInfo.reservationInfo.checkIn) }}</div>
              </div>
              <div class="check out">
                <div class="name">체크아웃</div>
                <div class="date">{{ placeListDateFormat(objSelectedReserveInfo.reservationInfo.checkOut) }}</div>
              </div>
            </div>
            <button v-if="isCancelable" class="largeFillButton" @click="$emit('popup', 'Cancel')">예약 취소</button>
          </div>
          <div class="popupList">
            <div class="list" @click="$emit('popup', 'CancelPolicy')">
              <span>취소 및 환불 정책</span>
              <div class="icon"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="helpArticle fixWidth">
      <div>고객센터</div>
      <div>1644-1346</div>
      <div>연중무휴 09:00~익일 03:00</div>
      <a href="http://plus.kakao.com/home/@야놀자고객센터" target="_blank">1:1 채팅상담</a>
    </div>
  </div>
</template>

<script>

import objScss from '~/assets/css/variable.scss';

export default {
  props: {
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      categoryNameMap: {
        pension: '펜션',
        motel: '중저가 숙소',
        hotel: '호텔',
        guesthouse: '게스트하우스',
      },
      swiperImageHeight: 0,
      fade: false,
      headerHeight: this.$store.state.channelInfo.header ? objScss.header : 0,
    };
  },
  computed: {
    isCancelable() {
      return this.objSelectedReserveInfo.reservationInfo.reservationStatus === 'RESERVED' && new Date() < new Date(this.objSelectedReserveInfo.reservationInfo.checkIn);
    },
    representationImage() {
      return this.objSelectedReserveInfo.placeInfo && this.objSelectedReserveInfo.placeInfo.images ? this.objSelectedReserveInfo.placeInfo.images.find((v) => v.categoryType === 'REPRESENTATION') || this.objSelectedReserveInfo.placeInfo.images[0] : '';
    },
  },
  methods: {
    placeListDateFormat(str) {
      return str.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(str.split(' ')[0], 'dow')}) `);
    },
    openProductDetail() {
      const {
        state,
        reservationInfo,
        placeInfo,
      } = this.objSelectedReserveInfo;
      let url = `/place/result/${placeInfo.placeNo}`;
      if (state !== 'passed') {
        const { checkIn, checkOut } = reservationInfo;
        url += `?checkIn=${checkIn.split(' ')[0]}&checkOut=${checkOut.split(' ')[0]}`;
      }
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(url);
    },
    scrollEvent() {
      this.fade = document.documentElement.scrollTop >= (this.swiperImageHeight - this.headerHeight);
    },
  },
  mounted() {
    const maxWidth = window.outerWidth > 768 ? 768 : window.outerWidth;
    this.swiperImageHeight = Math.floor((maxWidth * 216) / 375);
    window.addEventListener('scroll', this.scrollEvent);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent);
  },
};
</script>

<style lang="scss">
.reserveDetailPlaceWrapper{
  width: 100%;
  .detailWrapper{
    min-height: calc(100vh - #{$header} * 1px - 193px);
    width: 100%;
    background-color: #f8f9fb;
    .pageTitle{
      font-weight: bold;
      font-size: 23px;
      line-height: 30px;
      padding: 20px $sidePadding * 1px;
      background-color: #FFF;
    }
    .detailContent {
      background-color: #FFF;
      position: relative;
      width: 100%;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      z-index: 1;
      .contentInfo{
        .largeFillButton{
          width: 100%;
          height: 46px;
          border-radius: 4px;
          border: 1px solid #000;
          font-size: 13px;
        }
        .productInfo{
          padding: 0 $sidePadding * 1px 20px;
          border-bottom: 10px solid #f8f9fb;
          .titleWrapper{
            cursor: pointer;
            > div{
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              padding: 20px 0;
              border-bottom: 1px solid #ebecf1;
            }
            .thumbnail{
              width: 46px;
              height: 46px;
              border-radius: 46px;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              background-color: #ebecf1;
            }
            .info{
              margin-left: 12px;
              .category{
                font-size: 13px;
                line-height: 18px;
                font-weight: bold;
                color: #939499;
              }
              .name{
                font-size: 16px;
                font-weight: bold;
                color: #000;
                line-height: 22px;
              }
            }
          }
          .infoListWrapper{
            margin-top: 10px;
            .list{
              padding: 10px 0;
              line-height: 22px;
              font-size: 16px;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-box-pack: justify;
              -ms-flex-pack: justify;
              justify-content: space-between;
              .name{
                color: #939499;
              }
              .val{
                color: #000;
                &.cancel{
                  > span{
                    text-decoration: line-through;
                    color: #000;
                  }
                  color: #d31111;
                }
              }
            }
          }

          .largeFillButton {
            margin-top: 30px;
          }
        }
        .reserveInfo{
          padding: 20px $sidePadding * 1px;
          border-bottom: 10px solid #f8f9fb;
          .usageTime{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            .check{
              &.out{
                text-align: right;
              }
              .name{
                font-size: 13px;
                line-height: 18px;
                color: #939499;
              }
              .date{
                font-size: 16px;
                font-weight: bold;
                line-height: 22px;
                color: #000;
                margin-top: 2px;
              }
            }
          }
          .largeFillButton{
            margin-top: 40px;
          }
        }
        .popupList{
          border-bottom: 10px solid #f8f9fb;
          .list{
            padding: $sidePadding * 1px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            cursor: pointer;
            border-top: 1px solid #ebecf1;
            &:first-of-type{
              border: none;
            }
            span{
              font-size: 16px;
              line-height: 22px;
              color: #000;
            }
            .icon{
              width: 22px;
              height: 22px;
              background-image: url(~assets/img/icon-chevron-right.svg);
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
          }
        }
      }
    }
  }
  .helpArticle{
    padding: 24px $sidePadding * 1px;
    background-color: #f8f9fb;
    > div:first-of-type{
      font-size: 14px;
      font-weight: bold;
      line-height: 17px;
      color: #585858;
    }
    > div:nth-of-type(2){
      font-size: 22px;
      font-weight: bold;
      color: #585858;
      line-height: 28px;
      margin: 10px 0;
    }
    > div:nth-of-type(3){
      line-height: 18px;
      font-size: 13px;
      color: #868686;
    }
    > a{
      width: 113px;
      height: 42px;
      border-radius: 21px;
      background-color: #fff;
      border: 1px solid #ebecf1;
      text-align: center;
      line-height: 40px;
      display: block;
      margin-top: 20px;
      text-decoration: none;
      font-size: 13px;
      font-weight: bold;
    }
  }
}
</style>
