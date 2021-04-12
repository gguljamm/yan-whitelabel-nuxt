<template>
  <div class="MVP_main">
    <div class="globalSearch">
      <div class="fixWidth">
        <div
          :style="{ backgroundImage: `url(${getLogo()}` }"
        ></div>
        <button @click="submit('/place')">어디로 놀러갈까요?</button>
      </div>
    </div>
    <div class="categoryWrap">
      <ul class="fixWidth">
        <li>
          <button class="motel" @click="submit('/place', { category: 'motel' })">중저가 숙소</button>
        </li>
        <li>
          <button class="hotel" @click="submit('/place', { category: 'hotel' })">호텔</button>
        </li>
        <li>
          <button class="premiumhotel" @click="submit('/place', { category: 'premiumhotel' })">프리미엄호텔</button>
        </li>
        <li>
          <button class="resort" @click="submit('/place', { category: 'resort' })">리조트/콘도</button>
        </li>
        <li>
          <button class="pension" @click="submit('/place', { category: 'pension' })">펜션/풀빌라</button>
        </li>
        <li>
          <button class="glamping" @click="submit('/place', { category: 'camping' })">글램핑/카라반</button>
        </li>
        <li>
          <button class="guesthouse" @click="submit('/place', { category: 'guesthouse' })">게스트하우스</button>
        </li>
        <li
          v-if="$store.state.channelInfo.products.indexOf('leisure') !== -1"
        >
          <button class="leisure" @click="changeTab('/leisure')">레저/티켓</button>
        </li>
      </ul>
    </div>
    <div class="reserve fixWidth">
      <button @click="submit('/reserve')">
        <span>숙소 예약 확인</span>
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
  components: {
    Exhibition,
  },
  methods: {
    getLogo() {
      try {
        return require(`~/assets/img/${this.$store.state.channelInfo.channelName.replace('dev_', '')}/logo.jpeg`); // eslint-disable-line
      } catch (e) {
        return require('~/assets/img/MVP/logo.jpeg'); // eslint-disable-line
      }
    },
  },
};
</script>

<style lang="scss">
.MVP_main{
  font-size: 14px;
  .globalSearch{
    background-color: #FFF;
    overflow: hidden;
    height: 70px;
    padding: 14px 0;
    > div{
      padding: 0 $sidePadding * 1px;
      > div:first-of-type{
        float: left;
        width: 90px;
        height: 42px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }
      > button{
        margin-left: 20px;
        float: left;
        width: calc(100% - 110px);
        height: 42px;
        border-radius: .4rem;
        border: 1px solid #e6e6e6;
        background-color: #f8f8f8;
        color: #919191;
        text-align: left;
        padding-left: 16px;
        position: relative;
        &:after{
          content: '';
          width: 20px;
          height: 20px;
          top: 10px;
          right: 10px;
          background: url(~assets/img/icon-search-black.svg) center center no-repeat;
          background-size: 20px;
          position: absolute;
        }
      }
    }
  }
  .categoryWrap{
    background-color: #FFF;
    padding: 0 $sidePadding * 1px 26px;
    > ul{
      overflow: hidden;
      font-weight: 700;
      font-size: 11px;
      > li{
        padding-top: 12px;
        width: 20%;
        float: left;
        > button{
          height: 58px;
          width: 100%;
          font-weight: bold;
          line-height: 16px;
          &:before{
            content: '';
            display: block;
            margin: 0 auto;
            width: 38px;
            height: 38px;
            background-size: 38px;
            background-position: center center;
            background-repeat: no-repeat;
          }
          &.motel:before{
            background-image: url(~assets/img/MVP/icon-quick-motel.svg);
          }
          &.hotel:before{
            background-image: url(~assets/img/MVP/icon-quick-hotel.svg);
          }
          &.glamping:before{
            background-image: url(~assets/img/MVP/icon-quick-glamping.svg);
          }
          &.pension:before{
            background-image: url(~assets/img/MVP/icon-quick-pension.svg);
          }
          &.guesthouse:before{
            background-image: url(~assets/img/MVP/icon-quick-guest-house.svg);
          }
          &.resort:before{
            background-image: url(~assets/img/MVP/icon-quick-resort.svg);
          }
          &.leisure:before{
            background-image: url(~assets/img/MVP/icon-quick-leisure.svg);
          }
          &.premiumhotel:before{
            background-image: url(~assets/img/MVP/premiumhotel.svg);
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
        background: url(~assets/img/samsungcard/place.png) center center no-repeat;
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

@media screen and (max-width: 320px){
  .MVP_main{
    .categoryWrap{
      > ul > li > button{
        white-space: nowrap;
        font-size: 10px;
        letter-spacing: -0.5px;
      }
    }
  }
}
</style>
