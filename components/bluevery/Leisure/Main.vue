<template>
  <div class="ssLeisureWrapper fixWidth">
    <div class="mainBack"><div class="fixWidth">
      <div class="notice">
        <div>블루베리몰 여행은 통신판매 중개자로서 상품 및 서비스의 이행은 <strong>(주)야놀자</strong>의 책임하에 운영되고 있으며, <strong>(주)야놀자</strong>의 약관을 따릅니다.</div>
      </div>
      <img src="https://wht-img.yanolja.com/channel/bluevery.jpg">
    </div></div>
    <div class="mainContent">
      <div class="tabs">
        <button
          v-for="(productKey, index) in $store.state.channelInfo.products"
          :key="index"
          @click="changeTab(`/${productKey === 'leisure' ? 'leisure' : ''}`)"
          :class="{
            selected: productKey === 'leisure',
          }"
        >{{ productNameMap[productKey] }}</button>
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
              <li class="swiper-slide" v-for="key in Object.keys(categoryMap).filter(v => arrExceptCategory.indexOf(categoryMap[v].id) < 0)" :key="key">
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
        <button @click="submit('/leisure/reserve')">
          <span>레저 예약 확인</span>
          본인 인증 후 예약 내역 확인이 가능합니다.
        </button>
      </div>
      <div class="wrap ssCardPromo" v-if="samsungcardEvent">
        <p>{{ samsungcardEvent.title.replace('[전용기획전]', '') }}</p>
        <div class="swiper" v-swiper:swiper2="swiperOption2">
          <ul class="swiper-wrapper">
            <li class="swiper-slide" v-for="(x, index) in samsungcardEvent.exhibitionContents" :key="index" @click="eventSubmit(x.productType, x.id)">
              <div>
                <div :style="{ background: arrContentColor[index] }">
                  <div v-html="replaceNewLineChar(x.thumbnailTitle)" :style="{ color: '#FFF' }"></div>
                  <div v-html="x.thumbnailExplanation.replace(/\\n/gi, '<br>')" :style="{ color: '#FFF' }"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Exhibition
        :objContents="objContents"
      ></Exhibition>
    </div>
    <div class="notice">
      <div>블루베리몰 여행은 통신판매 중개자로서 상품 및 서비스의 이행은 <strong>(주)야놀자</strong>의 책임하에 운영되고 있으며, <strong>(주)야놀자</strong>의 약관을 따릅니다.</div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import LocalVueModel from './Local.js';
import VueModel from '~/components/MVP/Leisure/Main.js';
import Exhibition from '~/components/MVP/Exhibition/Exhibition.vue';

export default {
  mixins: [VueModel, LocalVueModel],
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
      arrExceptCategory: [2266, 2270, 2315],
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
      arrContentColor: [
        'linear-gradient(to bottom, #ffb74f, #be8d13)',
        'linear-gradient(171deg, #2ee8f1 8%, #2480d2)',
        'linear-gradient(to bottom, #ff277a, #ff2676 0%, #ff1742)',
        'linear-gradient(to bottom, rgba(0, 176, 80, 0.7), #00b050)',
        'linear-gradient(to bottom, rgba(255, 88, 45, 0.7), #FF582D)',
        'linear-gradient(to bottom, rgba(82, 172, 170, 0.7), #52ACAA)',
        'linear-gradient(to bottom, rgba(234, 210, 149, 0.7), #EAD295)',
      ],
    };
  },
  methods: {
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
  },
  computed: {
    samsungcardEvent() {
      if (this.objContents && this.objContents.hotPickGroupList) {
        return this.objContents.hotPickGroupList.find((v) => v.title.indexOf('[전용기획전]') >= 0);
      }
      return null;
    },
  },
};
</script>

<style lang="scss">
.ssLeisureWrapper{
  .notice{
    color: black;
    padding: 8px $sidePadding * 1px;
    background-color: #f8f9fb;
    height: 44px;
    width: 100%;
    display: table;
    &.bottom{
      border-bottom: 1px solid #ebecf1;
      padding: 10px $sidePadding * 1px;
      height: 49px;
    }
    > div{
      display: table-cell;
      vertical-align: middle;
      font-size: 10px;
      line-height: 14px;
      text-align: left;
      > strong{
        color: #ff3478;
      }
    }
  }
  .mainBack{
    position: sticky;
    z-index: -1;
    top: 0;
    width: 100%;
    left: 0;
    > div{
      img{
        width: 100%;
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
    .ssCardPromo{
      padding-bottom: 30px;
      .swiper{
        padding-top: 16px;
        ul{
          li{
            width: 154px;
            height: 229px;
            &:first-of-type{
              padding-left: $sidePadding * 1px;
              width: (154 + $sidePadding) * 1px;
            }
            &:last-of-type{
              padding-right: $sidePadding * 1px;
              width: (154 + $sidePadding) * 1px;
            }
            > div{
              cursor: pointer;
              > div:first-of-type{
                width: 154px;
                height: 206px;
                border-radius: 6px;
                padding-left: 14px;
                padding-top: 34px;
                > div:nth-of-type(2){
                  padding-top: 34px;
                  font-size: 10px;
                  font-weight: bold;
                }
                > div:nth-of-type(1){
                  font-size: 16px;
                  font-weight: bold;
                }
              }
              > div:nth-of-type(2){
                font-size: 11px;
                line-height: 13px;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px){
  .ssLeisureWrapper .mainBack > div > .banner{
    width: 100%;
    text-align: center;
    padding-left: 0;
    > div:nth-of-type(1){
      display: block;
      padding-bottom: 10px;
      > div{
        background-position: center center;
      }
      > div:nth-of-type(1) {
        width: 100%;
        height: 24px;
      }
      > div:nth-of-type(2) {
        margin-left: 0;
        margin-top: 10px;
        width: 100%;
      }
    }
    > div:nth-of-type(2), > div:nth-of-type(3) {
      font-size: 24px;
      line-height: 30px;
    }
  }
}
</style>
