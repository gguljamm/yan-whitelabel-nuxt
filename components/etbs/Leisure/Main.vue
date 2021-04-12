<template>
  <div class="etbsLeisureWrapper fixWidth">
    <div class="mainBack"><div class="fixWidth">
      <div class="title">&nbsp;</div>
      <div class="subTitle">21년 새로워진 야놀자 국내 숙박 서비스를 <span>경험해 보세요.</span><br>
        소중한 당신이 편히 쉴 수 있도록 최고의 상품을 <span>야놀자가 제공하겠습니다.</span>
      </div>
    </div></div>
    <div class="mainContent">
      <div class="tabs">
        <button @click="changeTab('/')">숙소</button>
        <button class="selected">레저</button>
      </div>
      <div class="wrap">
        <p>국내 즐길거리를<br>찾아드려요</p>
        <div class="mainBtn">
          <div>
            <button @click="submit('/leisure/search')">지역 또는 레저 이름으로 검색하세요.</button>
          </div>
          <div class="swiper" v-swiper:swiper1="swiperOption">
            <ul class="swiper-wrapper">
              <li class="swiper-slide">
                <button @click="submit('/leisure/results')">
                  <div class="icon leisure-icon-categoryAll"></div>
                  <div class="name">상품<br>전체보기</div>
                </button>
              </li>
              <li class="swiper-slide" v-for="key in Object.keys(categoryMap)" :key="key">
                <button :class="key" @click="submit('/leisure/results', { category: categoryMap[key].id })">
                  <div class="icon" :class="`leisure-icon-${categoryMap[key].id}`"></div>
                  <div class="name" v-html="categoryMap[key].name"></div>
                </button>
              </li>
              <li class="swiper-slide">
                <button class="all" @click="openCategoryPopup">
                  <div class="icon leisure-icon-more"></div>
                  <div class="name">더보기</div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="wrap reserve">
<!--        <p>레저 예약확인</p>-->
        <button @click="submit('/leisure/reserve')">
          <span>레저 예약 확인</span>
          예약하신 내역을 확인하세요.
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
import VueModel from '~/components/MVP/Leisure/Main.js';
import Exhibition from '~/components/MVP/Exhibition/Exhibition.vue';

export default {
  mixins: [VueModel],
  components: {
    Exhibition,
  },
  data() {
    return {
      categoryMap: {
        themePark: {
          name: '테마파크',
          id: 2263,
        },
        waterPark: {
          name: '스파/<br>워터파크',
          id: 2222,
        },
        extreme: {
          name: '익스트림',
          id: 2264,
        },
        watch: {
          name: '공연/전시/<br>관람',
          id: 2267,
        },
        tour: {
          name: '투어/교통',
          id: 2266,
        },
        kids: {
          name: '키즈체험',
          id: 2268,
        },
        experience: {
          name: '체험',
          id: 2265,
        },
        class: {
          name: '클래스/모임',
          id: 2333,
        },
        festival: {
          name: '축제/캠핑/<br>대여',
          id: 2269,
        },
        waterLeisure: {
          name: '수상레저',
          id: 2260,
        },
        renterCar: {
          name: '렌터카',
          id: 2270,
        },
        fishing: {
          name: '낚시',
          id: 2315,
        },
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
};
</script>

<style lang="scss">
.etbsLeisureWrapper{
  .mainBack{
    position: fixed;
    z-index: -1;
    top: 0;
    width: 100%;
    left: 0;
    > div{
      height: 432px;
      color: #FFF;
      text-align: center;
      background: url(https://wht-img.yanolja.com/channel/etbs.jpg) center center no-repeat;
      background-size: cover;
      padding-top: 106px;
      .title{
        font-weight: bold;
        font-size: 26px;
        line-height: 28px;
        margin-bottom: 20px;
      }
      .image{
        background: url(~assets/img/etbs/yanolja-logo.svg) center center no-repeat;
        background-size: cover;
        width: 84px;
        height: 24px;
        margin: 0 auto 10px;
      }
      .subTitle{
        font-size: 15px;
        line-height: 22px;
        color: #fff;
      }
    }
  }
  .mainContent{
    padding-top: 40px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    margin-top: 412px;
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
          width: 64px;
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
            width: 64px;
            height: 78px;
            background-color: #FFF;
            word-break: keep-all;
            position: relative;
            .icon{
              margin: 0 auto;
              position: absolute;
              top: 6px;
              left: 0;
              right: 0;
              width: 34px;
              height: 34px;
              background-size: 34px;
              background-position: center center;
              background-repeat: no-repeat;
            }
            .name{
              position: absolute;
              top: 44px;
              left: 0;
              right: 0;
              font-size: 11px;
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
        height: 64px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        background-image: linear-gradient(to bottom, #bcd3f8, #878bdd);
        margin-top: 20px;
        margin-left: $sidePadding * 1px;
        width: calc(100% - #{$sidePadding * 1px});
        font-size: 14px;
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
        }
        &:before{
          content: '';
          height: 24px;
          width: 24px;
          background: url(~assets/img/leisure.png) center center no-repeat;
          background-size: 24px;
          position: absolute;
          top: 20px;
          left: 18px;
        }
      }
    }
  }
}
</style>
