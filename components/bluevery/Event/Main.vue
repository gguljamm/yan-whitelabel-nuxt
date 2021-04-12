<template>
  <div class="eventWrapper">
    <Header></Header>
    <div class="mainBack">
      <div class="fixWidth">
        <div>
          <div>RAUM O</div>
          <div>라움 O</div>
          <div>프리미엄 카드 회원만을 위한<br>THE BENEFIT</div>
          <img :src="require('~/assets/img/samsungcard/card.png')">
        </div>
      </div>
    </div>
    <div class="mainContent fixWidth">
      <div>라움O는 국내 특 1급 호텔 객실, F&B(식음료)할인, 발렛파킹 무료 및 프리미엄 우대 혜택을 제공합니다.<br>바쁜 일상에서 여유롭고 풍요로운 삶을 누려보시기 바랍니다. </div>
      <div>
        <ul>
          <li>
            <div>Shilla Hotel</div>
            <div>신라호텔</div>
            <img :src="require('~/assets/img/samsungcard/event1.jpg')">
            <button @click="submit()">Shilla Hotel</button>
          </li>
          <li>
            <div>Lotte Hotel in Sogong</div>
            <div>롯데호텔서울 소공점</div>
            <img :src="require('~/assets/img/samsungcard/event2.jpg')">
            <button @click="submit()">Lotte Hotel</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    submit() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/place/result/1000091779');
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo&display=swap');

.eventWrapper{
  .mainBack{
    position: fixed;
    z-index: -1;
    top: $header * 1px;
    width: 100%;
    left: 0;
    > div{
      background: url(~assets/img/samsungcard/event_back.jpg) center center no-repeat;
      background-size: cover;
      height: 462px;
      color: #FFF;
      position: relative;
      &:before{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.4;
        background-image: linear-gradient(to bottom, #000, rgba(0, 0, 0, 0) 132%);
      }
      > div{
        position: relative;
        height: 100%;
        width: 100%;
        z-index: 1;
        > div:nth-of-type(1){
          opacity: 0.7;
          font-size: 14px;
          padding-top: 50px;
          line-height: 17px;
          padding-left: $sidePadding * 1px;
        }
        > div:nth-of-type(2){
          margin-top: 2px;
          font-size: 32px;
          font-weight: bold;
          line-height: 39px;
          padding-left: $sidePadding * 1px;
        }
        > div:nth-of-type(3){
          margin-top: 20px;
          color: #fff;
          line-height: 17px;
          padding-left: $sidePadding * 1px;
        }
        > img{
          width: 254px;
          position: absolute;
          bottom: 37px;
          left: 4px;
        }
      }
    }
  }
  .mainContent{
    padding-top: 462px;
    font-size: 14px;
    > div{
      padding: 0 $sidePadding * 1px;
      background-color: #FFF;
    }
    > div:nth-of-type(1){
      padding-top: 24px;
    }
    > div:nth-of-type(2){
      padding-top: 64px;
      > ul {
        > li{
          padding-top: 10px;
          padding-bottom: 80px;
          border-top: 2px solid #38332f;
          font-size: 0;
          > div:nth-of-type(1){
            font-size: 22px;
            line-height: 26px;
            margin-bottom: 4px;
            font-family: 'Nanum Myeongjo', serif;
          }
          > div:nth-of-type(2){
            font-size: 14px;
            line-height: 17px;
          }
          > img{
            width: 100%;
            margin-top: 24px;
          }
          > button{
            margin-top: 16px;
            float: right;
            width: 185px;
            height: 47px;
            border: 1px solid #696969;
            text-align: left;
            padding-left: 18px;
            font-family: 'Nanum Myeongjo', serif;
            background-color: #FFF;
            font-size: 14px;
            position: relative;
            &:after{
              content: '';
              width: 23px;
              height: 4px;
              position: absolute;
              top: 20px;
              right: 14px;
              background: url(~assets/img/samsungcard/path-4-copy.svg) center center no-repeat;
              background-size: 23px 4px;
            }
          }
          &:after{
            content: '';
            display: block;
            clear: both;
          }
        }
      }
    }
  }
}
</style>
