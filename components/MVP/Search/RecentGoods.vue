<template>
  <div class="recentWrap">
    <div class="fixWidth">
      <div class="topInfo">
        <span class="title">{{ title }}</span>
        <span class="removeAll" @click="$emit('removeAll')">전체 삭제</span>
      </div>
      <div class="swiper" v-swiper:recentPlaceSwiper="swiperOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(x, index) in arrRecent" :key="index">
            <div @click="submit(index)">
              <div :style="{ backgroundImage: `url(${ decodeURIComponent(x.url) })` }"></div>
              <div>{{ x.name }}</div>
              <div v-if="x.checkin && x.checkout">
                <span>{{ $format.formatDate(x.checkin, 'md') }}({{ $format.formatDate(x.checkin, 'dow') }})</span>
                <span>- {{ $format.formatDate(x.checkout, 'md') }}({{ $format.formatDate(x.checkout, 'dow') }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '최근 검색',
    },
    arrRecent: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
    };
  },
  methods: {
    submit(index) {
      this.$emit('submit', index);
    },
  },
};
</script>

<style lang="scss">
.recentWrap{
  > div{
    padding: 40px 0 20px;
    background-color: #FFF;
    .topInfo{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      padding: 0 $sidePadding * 1px;
      .title{
        font-size: 13px;
        font-weight: bold;
        color: #000000;
      }
      .removeAll{
        cursor: pointer;
        font-size: 13px;
        color: #939499;
      }
    }
    .swiper{
      margin-top: 10px;
      .swiper-slide{
        width: 212px;
        &:first-of-type{
          width: 212px + $sidePadding * 1px;
          padding-left: $sidePadding * 1px;
        }
        &:last-of-type{
          width: 212px + $sidePadding * 1px;
          padding-right: $sidePadding * 1px;
        }
        > div{
          cursor: pointer;
          > div:nth-of-type(1){
            width: 212px;
            padding-bottom: 56.6%;
            border-radius: 4px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
            background-color: #ebecf1;
          }
          > div:nth-of-type(2){
            font-size: 16px;
            line-height: 22px;
            margin-top: 8px;
          }
          > div:nth-of-type(3){
            font-size: 13px;
            line-height: 20px;
            color: #939499;
          }
        }
      }
    }
  }
}
</style>
