<template>
  <div class="MVP_leisureMain">
    <div class="globalSearch">
      <div class="fixWidth">
        <div><button @click="historyBack()"></button></div>
        <div>레저/티켓</div>
        <div><button @click="submit('/leisure/search')"></button></div>
      </div>
    </div>
    <div class="categoryWrap">
      <div class="fixWidth">
        <div>
          <div>인기 카테고리</div>
          <button @click="submit('/leisure/results')">상품 전체보기</button>
        </div>
      </div>
      <ul class="fixWidth">
        <li v-for="key in Object.keys(categoryMap)" :key="key">
          <button :class="key" @click="submit('/leisure/results', { category: categoryMap[key].id })">
            <div class="icon" :class="`leisure-icon-${categoryMap[key].id}`"></div>
            {{ categoryMap[key].name }}
          </button>
        </li>
        <li>
          <button class="all" @click="openCategoryPopup">
            <div class="icon leisure-icon-more"></div>
            더보기
          </button>
        </li>
      </ul>
    </div>
    <div class="reserve fixWidth">
      <button @click="submit('/leisure/reserve')">
        <span>레저 예약 확인</span>
        본인 인증 후 예약 내역 확인이 가능합니다.
      </button>
    </div>
    <div class="exhibition fixWidth">
      <Exhibition
        :objContents="objContents"
      ></Exhibition>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Exhibition from '~/components/MVP/Exhibition/Exhibition.vue';
import VueModel from './Main.js';

export default {
  mixins: [VueModel],
  methods: {
    historyBack() {
      this.$router.push('/');
    },
  },
  components: {
    Exhibition,
  },
  data() {
    return {
      openPopName: '',
      categoryMap: {
        themePark: {
          name: '테마파크',
          id: 2263,
        },
        waterPark: {
          name: '스파/워터파크',
          id: 2222,
        },
        extreme: {
          name: '익스트림',
          id: 2264,
        },
        watch: {
          name: '공연/전시/관람',
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
          name: '축제/캠핑/대여',
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
    };
  },
};
</script>

<style lang="scss">
.noHeader .MVP_leisureMain .globalSearch > div > div{
  &:first-of-type > button{
    display: none;
  }
  &:nth-of-type(2) {
    padding-left: 40px;
    width: calc(100% - 45px);
  }
  &:nth-of-type(3) > button{
    display: block;
  }
}
.MVP_leisureMain{
  font-size: 14px;
  .globalSearch{
    background-color: #FFF;
    > div{
      height: $header * 1px;
      line-height: $header * 1px;
      text-align: center;
      > div{
        float: left;
        font-size: 16px;
        font-weight: bold;
        &:first-of-type > button{
          height: $header * 1px;
          width: 40px;
          background-position: right center;
          background-size: 24px;
          background-repeat: no-repeat;
          background-image: url(~assets/img/icon-chevron-left.svg);
          float: left;
        }
        &:nth-of-type(2){
          width: calc(100% - 88px);
        }
        &:nth-of-type(3) > button{
          float: right;
          height: $header * 1px;
          width: 45px;
          background-position: left center;
          background-size: 24px;
          background-repeat: no-repeat;
          background-image: url(~assets/img/icon-search-black.svg);
        }
      }
      &:after{
        content: '';
        clear: both;
        display: block;
      }
    }
  }
  .categoryWrap{
    background-color: #FFF;
    padding-bottom: 26px;
    > div{
      padding: 0 $sidePadding * 1px;
      > div{
        height: 41px;
        line-height: 40px;
        border-bottom: 1px solid #000;
        > div{
          float: left;
          font-weight: bold;
          font-size: 16px;
        }
        > button{
          height: 40px;
          display: block;
          color: #ff3478;
          float: right;
          font-weight: bold;
        }
      }
    }
    > ul{
      overflow: hidden;
      font-weight: 700;
      font-size: 11px;
      padding: 0 $sidePadding * 1px;
      > li{
        padding-top: 12px;
        width: 20%;
        float: left;
        > button{
          height: 58px;
          width: 100%;
          font-weight: bold;
          line-height: 16px;
          .icon{
            margin: 0 auto;
            width: 38px;
            height: 38px;
            background-size: 38px;
            background-position: center center;
            background-repeat: no-repeat;
          }
        }
      }
    }
  }
  .reserve{
    margin-top: 6px;
    background-color: #FFF;
    padding-bottom: 20px;
    > p{
      padding-top: 24px;
      padding-left: $sidePadding * 1px;
      font-size: 17px;
      font-weight: bold;
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
  .exhibition{
    background-color: #FFF;
  }
}
</style>
