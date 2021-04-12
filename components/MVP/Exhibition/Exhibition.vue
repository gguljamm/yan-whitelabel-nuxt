<template>
  <div class="exhibitionWrap">
    <template v-if="objContents && objContents.hotPickGroupList && objContents.hotPickGroupList.length > 0">
      <div
        v-for="(objHotPickGroup, objHotPickGroupIndex) in objContents.hotPickGroupList.filter((v) => v.title.indexOf('[전용기획전]') < 0)"
        :key="`${objHotPickGroupIndex}-hotPick`"
        class="hotPickWrapper"
        :class="{
          mobile: !$device.isDesktop,
        }"
      >
        <div class="title">{{ objHotPickGroup.title }}</div>
        <div class="contentsWrapper">
          <template v-if="$device.isDesktop">
            <SwiperWrap
              @submit="submit"
              :arrGroup="objHotPickGroup.exhibitionContents.map((obj) => ({ ...obj, thumbnailTitle: replaceNewLineChar(obj.thumbnailTitle) }))"
              :swiperOption="{
                slidesPerView: 2,
                spaceBetween: 10,
                navigation: {
                  nextEl: `.swiper-button-next-cust-hotPick-${objHotPickGroupIndex}`,
                  prevEl: `.swiper-button-prev-cust-hotPick-${objHotPickGroupIndex}`,
                },
              }"
              :type="'hotPick'"
            ></SwiperWrap>
          </template>
          <template v-else>
            <div
              v-for="(objHotPick, objHotPickIndex) in objHotPickGroup.exhibitionContents"
              :key="objHotPickIndex"
              :style="{ backgroundImage: `url(${objHotPick.thumbnailImage})` }"
              class="list"
              @click="submit(`/exhibition/${objHotPick.productType === 'PLACE' ? '?productType=place' : '?productType=leisure'}&exhibitionId=${objHotPick.id}`)"
            >
              <div class="info">
                <div class="thumbnailExplanation">{{ objHotPick.thumbnailExplanation }}</div>
                <div class="thumbnailTitle" v-show="objHotPick.thumbnailTitle" v-html="replaceNewLineChar(objHotPick.thumbnailTitle)"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-if="objContents && objContents.bannerGroupList && objContents.bannerGroupList.length > 0">
      <div
        v-for="(objBannerGroup, objBannerGroupIndex) in objContents.bannerGroupList"
        :key="`${objBannerGroupIndex}-banner`"
        class="bannerWrapper"
        :class="{
          mobile: $device.isMobile,
        }"
      >
        <div class="title">{{ objBannerGroup.title }}</div>
        <div class="contentsWrapper">
          <SwiperWrap
            @submit="submit"
            :arrGroup="objBannerGroup.bannerContents.map((obj) => ({ ...obj, thumbnailTitle: replaceNewLineChar(obj.thumbnailTitle) }))"
            :swiperOption="$device.isMobile ? swiperOption : {
              slidesPerView: 2,
              spaceBetween: 10,
              navigation: {
                nextEl: `.swiper-button-next-cust-banner-${objBannerGroupIndex}`,
                prevEl: `.swiper-button-prev-cust-banner-${objBannerGroupIndex}`,
              },
            }"
            :type="'banner'"
          ></SwiperWrap>
        </div>
      </div>
    </template>
    <template v-if="objContents && objContents.exhibitionGroupList && objContents.exhibitionGroupList.length > 0">
      <div
        v-for="(objExhibitionGroup, objExhibitionGroupIndex) in objContents.exhibitionGroupList"
        :key="`${objExhibitionGroupIndex}-exhibition`"
        class="exhibitionListWrapper"
        :class="{
          mobile: $device.isMobile,
        }"
      >
        <div class="title">{{ objExhibitionGroup.title }}</div>
        <div class="contentsWrapper">
          <div
            v-for="(objExhibition, objExhibitionIndex) in objExhibitionGroup.exhibitionContents"
            :key="objExhibitionIndex"
            :style="{ backgroundImage: `url(${objExhibition.thumbnailImage})` }"
            class="list"
            @click="submit(`/exhibition/${objExhibition.productType === 'PLACE' ? '?productType=place' : '?productType=leisure'}&exhibitionId=${objExhibition.id}`)"
          >
            <div class="info">
              <div class="thumbnailCategory" v-show="objExhibition.thumbnailCategory">{{ objExhibition.thumbnailCategory }}</div>
              <div class="thumbnailTitle" v-show="objExhibition.thumbnailTitle" v-html="replaceNewLineChar(objExhibition.thumbnailTitle)"></div>
              <div class="thumbnailExplanation">{{ objExhibition.thumbnailExplanation }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SwiperWrap from './Swiper.vue';

export default {
  props: {
    objContents: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    SwiperWrap,
  },
  data() {
    return {
      init: false,
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 10,
      },
    };
  },
  methods: {
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
    submit(url) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(url);
    },
  },
};
</script>

<style lang="scss">
.exhibitionWrap{
  padding-top: 10px;
  > div{
    padding-bottom: 30px;
  }
  .title {
    font-size: 17px;
    line-height: 20px;
    font-weight: bold;
    padding: 20px $sidePadding * 1px;
  }
  .contentsWrapper{
    padding: 0 $sidePadding * 1px;
    .list{
      cursor: pointer;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }
  }
  .hotPickWrapper{
    .contentsWrapper{
      .list{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        border-radius: 4px;
        overflow: hidden;
        .info{
          text-align: center;
          z-index: 1;
          .thumbnailExplanation{
            font-size: 13px;
            color: #fff;
          }
          .thumbnailTitle{
            margin-top: 2px;
            color: #fff;
            font-size: 20px;
            font-weight: bold;
          }
        }
      }
    }
    &.mobile{
      padding-bottom: 20px;
      .contentsWrapper{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 $sidePadding * 1px;
        .list {
          display: block;
          width: calc(50% - 5px);
          height: 120px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 10px;
          &:before {
            content: '';
            background-color: #000;
            opacity: .3;
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          .info {
            position: relative;
            z-index: 1;
            padding: 22px 12px;
            text-align: left;
            > div:nth-of-type(1) {
              font-size: 11px;
            }
            > div:nth-of-type(2) {
              font-size: 16px;
              padding-top: 6px;
            }
          }
        }
      }
    }
  }
  .bannerWrapper{
    &.mobile .contentsWrapper{
      padding: 0;
    }
    .contentsWrapper{
      .list{
        display: none;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        border-radius: 4px;
        overflow: hidden;
        .info{
          z-index: 1;
          text-align: center;
          .thumbnailCategory{
            margin: 0 auto;
            display: inline-block;
            font-size: 11px;
            color: #000;
            background-color: #fff;
            padding: 2px 9px;
            border-radius: 8px;
          }
          .thumbnailTitle{
            margin-top: 8px;
            color: #fff;
            font-size: 20px;
            font-weight: bold;
          }
          .thumbnailExplanation{
            font-size: 13px;
            margin-top: 4px;
            color: #fff;
            opacity: 0.47;
          }
        }
      }
    }
  }
  .exhibitionListWrapper{
    .contentsWrapper{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .list{
        &:last-of-type{
          margin-bottom: 0;
        }
        width: calc(50% - 5px);
        height: 200px;
        margin-bottom: 10px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        &:before {
          content: '';
          background-color: #000;
          opacity: .3;
          position: absolute;
          z-index: 0;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .info{
          z-index: 1;
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 30px;
          .thumbnailCategory{
            line-height: 13px;
            display: inline-block;
            padding: 3px 8px;
            border-radius: 9.5px;
            color: #fff;
            text-align: center;
            font-size: 10px;
            background-image: linear-gradient(to right, #ff3344, #ff4128);
          }
          .thumbnailTitle{
            font-size: 20px;
            font-weight: bold;
            color: #fff;
            margin-top: 4px;
          }
          .thumbnailExplanation{
            font-size: 13px;
            color: #fff;
            margin-top: 2px;
          }
        }
      }
    }
    &.mobile{
      .contentsWrapper{
        padding: 0 $sidePadding * 1px;
        .list{
          width: 100%;
          height: 170px;
        }
      }
    }
  }
}
</style>
