<template>
  <div class="fixedImageWrap">
    <div class="fixWidth">
      <div
        ref="detailSwiper"
        v-swiper:detailSwiper="swiperOptions"
        class="detailSwiperWrap"
        @slideChange="swiperChange"
      >
        <div class="swiper-wrapper" @click="swiperClick">
          <div
            v-for="(objImage, index) in arrImages"
            :key="index"
            class="swiper-slide"
          >
            <div
              :data-background="objImage.bpUrl"
              class="img swiper-lazy"
              :style="{
                height: `${swiperImageHeight}px`
              }"
            ></div>
            <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
          </div>
        </div>
        <div v-if="!$device.isMobile" class="swiper-button-prev-img" slot="button-prev"></div>
        <div v-if="!$device.isMobile" class="swiper-button-next-img" slot="button-next"></div>
        <div v-if="categoryType" class="infoBox categoryType">{{ objMapPictureCategory[categoryType] || '기타사진' }}</div>
        <div class="infoBox imgCount">{{ `${swiperIndex + 1}/${arrImages.length}` }}</div>
        <div class="pageBlock">
          <div
            v-for="x in arrImages.length"
            :key="x"
            :class="{ active: swiperIndex + 1 === x }"
            :style="{ width: `${100 / arrImages.length}%` }">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrImages: {
      type: Array,
      default: () => [],
    },
    swiperImageHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      swiperIndex: 0,
      swiperOptions: {
        lazy: {
          loadPrevNext: true,
        },
        navigation: {
          nextEl: '.swiper-button-next-img',
          prevEl: '.swiper-button-prev-img',
        },
      },
      objMapPictureCategory: {
        REPRESENTATION: '대표 사진',
        EXTERIOR: '외관',
        INTERIOR: '내부',
        FACILITY: '시설',
        AMENITY_AND_ETC: '편의시설 및 기타',
      },
    };
  },
  computed: {
    categoryType() {
      return this.arrImages[this.swiperIndex] && this.arrImages[this.swiperIndex].categoryType;
    },
  },
  methods: {
    swiperClick() {
      this.$emit('clickSwiper');
    },
    swiperChange() {
      this.swiperIndex = this.$refs.detailSwiper.swiper.activeIndex;
    },
  },
};
</script>

<style lang="scss">
  .fixedImageWrap {
    position: sticky;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    .detailSwiperWrap {
      width: 100%;
      .infoBox {
        pointer-events: none;
        display: inline-block;
        font-size: 13px;
        color: #fff;
        padding: 3px 8px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        position: absolute;
        bottom: 30px;
        z-index: 2;
        line-height: 18px;
        &.categoryType {
          left: 50%;
          transform: translateX(-50%);
        }
        &.imgCount {
          right: 24px;
        }
      }
      &::after {
        pointer-events: none;
        content: '';
        bottom: 0;
        position: absolute;
        width: 100%;
        height: 109px;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));
        z-index: 1;
      }
      .swiper-wrapper {
        .swiper-slide {
          .img {
            width: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
        }
      }
      .pageBlock{
        position: absolute;
        left: $sidePadding * 1px;
        right: $sidePadding * 1px;
        bottom: 20px;
        z-index: 2;
        height: 1px;
        border-radius: 0.5px;
        background-color: rgba(255, 255, 255, .5);
        > div{
          float: left;
          height: 1px;
          transition: background-color .3s ease;
          &.active{
            border-radius: 0.5px;
            background-color: #FFF;
          }
        }
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
</style>
