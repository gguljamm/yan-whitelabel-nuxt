<template>
  <div class="popupBack fixWidth popupSwiperWrapper">
    <p>숙소 사진</p>
    <div>
      <p>
        <strong>Exterior</strong>
      </p>
      <swiper-image
        :arrImages="place.images"
      ></swiper-image>
    </div>
    <template
      v-for="(x, index) in place.rooms"
    >
      <div
        v-if="x.images && x.images.length > 0"
        :key="index"
      >
        <p>
          <strong>Room</strong>
          <span>{{ x.name.find((v) => v.language === 'ko').name }}</span>
        </p>
        <swiper-image
          :arrImages="x.images"
        ></swiper-image>
      </div>
    </template>
  </div>
</template>

<script>
import SwiperImage from '@/components/MVP/Common/SwiperImageCenter.vue';

export default {
  components: {
    SwiperImage,
  },
  props: {
    objPlace: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    place() {
      return this.objPlace.place;
    },
  },
};
</script>

<style lang="scss">
.detailPopupWrapper .popupBack.popupSwiperWrapper{
  padding: 0 0 80px;
  > p{
    padding: 0 $sidePadding * 1px;
    line-height: 70px;
    font-size: 23px;
    font-weight: bold;
  }
  > div{
    padding-bottom: 30px;
    > p{
      padding: 23px $sidePadding * 1px;
      > strong{
        font-size: 16px;
        display: block;
      }
      > span{
        margin-top: 1px;
        font-size: 13px;
        font-weight: normal;
      }
    }
    &:first-of-type{
      > p{
        padding-top: 18px;
        padding-bottom: 18px;
      }
    }
    &:last-of-type{
      padding-bottom: 0;
    }
  }
}
</style>
