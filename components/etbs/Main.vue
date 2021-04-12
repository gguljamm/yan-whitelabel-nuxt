<template>
  <div class="etbsWrapper fixWidth">
    <div class="mainBack"><div class="fixWidth">
      <div>
        <img src="https://wht-img.yanolja.com/channel/etbs.jpg">
      </div>
    </div></div>
    <div class="mainContent">
      <div class="tabs">
        <button
          v-for="(productKey, index) in $store.state.channelInfo.products"
          :key="index"
          @click="changeTab(`/${productKey === 'leisure' ? 'leisure' : ''}`)"
          :class="{
            selected: productKey === 'place',
          }"
        >{{ productNameMap[productKey] }}</button>
      </div>
      <div class="wrap">
        <p>국내 숙소를<br>찾으시나요?</p>
        <div class="mainBtn">
          <div>
            <button @click="submit('/place')">지역 또는 숙소 이름으로 검색하세요.</button>
          </div>
          <div class="swiper" v-swiper:swiper1="swiperOption">
            <ul class="swiper-wrapper">
              <li class="swiper-slide" v-for="x in Object.keys(categoryMap)" :key="x">
                <button :class="x" @click="submit('/place', { category: x })">
                  <div v-html="categoryMap[x]"></div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="wrap reserve">
        <button @click="clickMain()">
          <span>숙소 예약 확인</span>
          리뉴얼 오픈으로 주문 확인 페이지가 변경되었습니다.<br>주문 일자에 따른 주문 내역 조회 방법을 확인하세요.
        </button>
      </div>
      <Exhibition
        :objContents="objContents"
      ></Exhibition>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import VueModel from '~/components/MVP/Main.js';
import Exhibition from '~/components/MVP/Exhibition/Exhibition.vue';

export default {
  mixins: [VueModel],
  components: {
    Exhibition,
  },
  data() {
    return {
      productNameMap: {
        place: '숙소',
        leisure: '레저',
      },
      categoryMap: {
        hotel: '호텔',
        premiumhotel: '프리미엄<br>호텔',
        motel: '중저가숙소',
        guesthouse: '게스트<br>하우스',
        pension: '펜션/<br>풀빌라',
        resort: '리조트/<br>콘도',
        camping: '글램핑/<br>카라반',
      },
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
      },
      swiperOption2: {
        slidesPerView: 'auto',
        spaceBetween: 8,
        freeMode: true,
      },
    };
  },
  methods: {
    clickMain() {
      this.$store.commit('setLayerPopup', 'etbs');
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.etbsWrapper{
  .mainBack{
    position: sticky;
    z-index: -1;
    top: 0;
    width: 100%;
    left: 0;
    background-color: rgb(185, 212, 231);
    > div{
      //height: 432px;
      //color: #FFF;
      //text-align: center;
      //background: url(https://wht-img.yanolja.com/channel/etbs.jpg) center center no-repeat;
      //background-size: cover;
      //padding-top: 106px;
      //position: relative;
      //> div{
      //  right: 20px;
      //  position: absolute;
      //  bottom: 40px;
      //  left: 20px;
      //}
      //.title{
      //  font-weight: bold;
      //  font-size: 26px;
      //  line-height: 28px;
      //  margin-bottom: 20px;
      //}
      //.image{
      //  background: url(~assets/img/etbs/yanolja-logo.svg) center center no-repeat;
      //  background-size: cover;
      //  width: 126px;
      //  height: 36px;
      //  margin: 0 auto 20px;
      //}
      //.subTitle{
      //  //padding: 0 20px;
      //  font-weight: bold;
      //  font-size: 15px;
      //  line-height: 22px;
      //  > span{
      //    white-space: nowrap;
      //  }
      //}
      img {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        display: block;
      }
    }
  }
  .mainContent{
    margin-top: -20px;
    padding-top: 40px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-color: #FFF;
    .tabs{
      padding-left: $sidePadding * 1px;
      height: 20px;
      button{
        float: left;
        line-height: 20px;
        font-size: 14px;
        color: #cccdd1;
        font-weight: bold;
        &.selected{
          color: #000;
        }
        &:first-of-type{
          margin-right: 14px;
        }
      }
    }
    p{
      line-height: 20px;
      font-size: 17px;
      font-weight: bold;
    }
    .wrap.padding{
      padding: 0 $sidePadding * 1px;
    }
    .wrap:not(.padding){
      > p{
        padding: 40px $sidePadding * 1px 0;
      }
    }
    .mainBtn{
      padding-top: 16px;
      > div:not(.swiper){
        height: 48px;
        position: relative;
        margin: 0 auto;
        width: calc(100% - (#{$sidePadding * 2} * 1px));
        > button {
          display: block;
          line-height: 48px;
          width: 100%;
          height: 48px;
          border-radius: 4px;
          box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
          border: solid 1px #f8f9fb;
          font-size: 14px;
          color: #cccdd1;
          padding-left: 20px;
          text-align: left;
        }
        &:after{
          pointer-events: none;
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          width: 48px;
          height: 48px;
          border-radius: 4px;
          box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
          background-color: #ff3478;
          background-image: url(~assets/img/icon-search-white.svg);
          background-size: 22px;
          background-position: center center;
          background-repeat: no-repeat;
        }
      }
      .swiper > ul{
        padding: 16px 0;
        > li{
          width: 66px;
          height: 78px;
          &:first-of-type{
            padding-left: $sidePadding * 1px;
            width: (64 + $sidePadding) * 1px;
          }
          &:last-of-type{
            padding-right: $sidePadding * 1px;
            width: (64 + $sidePadding) * 1px;
          }
          > button{
            box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            width: 66px;
            height: 78px;
            background-color: #FFF;
            font-size: 11px;
            position: relative;
            &:before{
              top: 8px;
              left: 16px;
              position: absolute;
              background-repeat: no-repeat;
              background-size: 34px;
              background-position: center center;
              content: '';
              width: 34px;
              height: 34px;
              display: block;
              margin: 0 auto 1px;
            }
            > div{
              position: absolute;
              top: 44px;
              left: 0;
              right: 0;
            }
            &.motel:before{
              background-image: url(~assets/img/MVP/icon-quick-motel.svg);
            }
            &.hotel:before{
              background-image: url(~assets/img/MVP/icon-quick-hotel.svg);
            }
            &.guesthouse:before{
              background-image: url(~assets/img/MVP/icon-quick-guest-house.svg);
            }
            &.pension:before{
              background-image: url(~assets/img/MVP/icon-quick-pension.svg);
            }
            &.resort:before{
              background-image: url(~assets/img/MVP/icon-quick-resort.svg);
            }
            &.camping:before{
              background-image: url(~assets/img/MVP/icon-quick-glamping.svg);
            }
            &.premiumhotel:before{
              background-image: url(~assets/img/MVP/premiumhotel.svg);
            }
          }
          &:last-of-type{
            margin-right: 0;
          }
        }
      }
    }
    .wrap.reserve{
      > p{
        padding-top: 24px;
      }
      > button{
        padding: 10px 0;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        background-image: linear-gradient(to bottom, #bcd3f8, #878bdd);
        margin-top: 20px;
        margin-left: $sidePadding * 1px;
        width: calc(100% - #{$sidePadding * 1px});
        font-size: 12px;
        color: #FFF;
        line-height: 17px;
        text-align: left;
        padding-left: 54px;
        position: relative;
        > span{
          display: block;
          font-weight: bold;
          color: #3b30cf;
          padding-bottom: 4px;
          font-size: 14px;
        }
        &:before{
          content: '';
          height: 24px;
          width: 24px;
          background: url(~assets/img/place.png) center center no-repeat;
          background-size: 24px;
          position: absolute;
          top: 20px;
          left: 18px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px){
  .etbsWrapper {
    .mainBack {
      > div {
        text-align: center;
        .image{
          margin: 0 auto 20px;
        }
      }
    }
  }
}
</style>
