<template>
  <div class="swiperImageCenter" v-swiper:swiper1="swiperOption">
    <ul class="swiper-wrapper">
      <li class="swiper-slide" v-for="(x, index) in arrImages" :key="index">
        <div :style="{ backgroundImage: `url(${x.bpUrl})`, height: `${swiperImageHeight}px` }"></div>
      </li>
    </ul>
    <div v-if="!$device.isMobile" class="swiper-button-prev-img" slot="button-prev"></div>
    <div v-if="!$device.isMobile" class="swiper-button-next-img" slot="button-next"></div>
  </div>
</template>

<script>
import objScss from 'assets/css/variable.scss';

export default {
  props: {
    arrImages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const swiperImageHeight = (((window.outerWidth > 768 ? 768 : window.outerWidth) - (objScss.sidePadding * 2)) * 9) / 16;
    return {
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 10,
        lazy: {
          loadPrevNext: true,
        },
        navigation: {
          nextEl: '.swiper-button-next-img',
          prevEl: '.swiper-button-prev-img',
        },
      },
      swiperImageHeight,
    };
  },
};
</script>

<style lang="scss">
.swiperImageCenter{
  .swiper-slide{
    width: calc(100vw - #{$sidePadding * 2px});
    max-width: calc(768px - #{$sidePadding * 2px});
    > div{
      cursor: pointer;
      border-radius: 6px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      position: relative;
      overflow: hidden;
      text-align: center;
      padding-top: 40px;
      > div{
        position: relative;
        z-index: 1;
      }
      > div:nth-of-type(1){
        > div{
          display: inline-block;
          background-color: #FFF;
          height: 16px;
          line-height: 16px;
          padding: 0 8px;
          border-radius: 8px;
          font-size: 11px;
        }
      }
      > div:nth-of-type(2){
        padding-top: 13px;
        font-size: 16px;
        color: #FFF;
        line-height: 19px;
      }
      > div:nth-of-type(3){
        color: #FFF;
        font-size: 16px;
        font-weight: bold;
        line-height: 19px;
      }
      > div:nth-of-type(4){
        padding-top: 11px;
        color: #fff;
        opacity: 0.47;
        font-size: 11px;
      }
    }
  }
  .swiper-button-next-img, .swiper-button-prev-img{
    width: 40px;
    height: 80px;
    background-color: #FFF;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 40px;
    &.swiper-button-disabled{
      pointer-events: none;
      opacity: .3;
    }
  }
  .swiper-button-next-img{
    right: 4px;
    background-image: url(~assets/img/icon-chevron-right-wht.svg);
  }
  .swiper-button-prev-img{
    left: 4px;
    background-image: url(~assets/img/icon-chevron-left-wht.svg);
  }
}
</style>
