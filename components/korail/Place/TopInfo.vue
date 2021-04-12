<template>
  <div class="korailTopWrapper" :class="{ noCategoryTab: $route.query.type === 'category' || ['camping', 'resort'].indexOf($route.query.category) >= 0 }">
    <channel-notice></channel-notice>
    <div class="search">
      <div class="fixWidth">
        <div class="location">
          <div>지역 선택</div>
          <div class="btnFlex">
            <button @click="clickBtn('keyword')"><span>도착역</span>{{ params.keyword }}<br></button>
          </div>
        </div>
        <div class="date">
          <div>기간 선택</div>
          <div class="btnFlex">
            <button @click="clickBtn('date')"><span>체크인 일정</span>{{ params.checkin }}<br></button>
            <button @click="clickBtn('date')"><span>체크아웃 일정</span>{{ params.checkout }}<br></button>
          </div>
        </div>
        <div class="option">
          <button @click="clickBtn('guest')">성인 {{ params.adults }}명{{ params.children > 0 ? `, 아동 ${params.children}명` : '' }}</button>
        </div>
      </div>
    </div>
    <div class="tabWrapper">
      <div class="fixWidth" v-swiper="options" ref="freeSwiper" v-if="$route.query.type !== 'category' && ['camping', 'resort'].indexOf($route.query.category) < 0">
        <div class="swiper-wrapper">
          <button
            class="swiper-slide"
            v-for="x in Object.keys(categoryMap)"
            :key="x"
            :class="{ active: params.category === x }"
            @click="changeTab(x)">
            <div>{{ categoryMap[x] }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChannelNotice from '~/components/korail/ChannelNotice.vue';

export default {
  components: {
    ChannelNotice,
  },
  props: {
    params: {
      type: Object,
      default: () => {},
    },
    categoryMap: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      options: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 12,
      },
    };
  },
  methods: {
    clickGlobalSearch() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/place');
    },
    changeTab(tab) {
      this.$emit('changeTab', tab);
    },
    clickBtn(flag) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: flag === 'keyword' ? '/place' : `/place/${flag}`,
        query: flag === 'keyword' ? {
          category: this.$route.query.category,
          checkin: this.params.checkin,
          checkout: this.params.checkout,
          adults: this.params.adults === 2 ? undefined : this.params.adults,
          children: this.params.children === 0 ? undefined : this.params.children,
          type: this.$route.query.type || 'search',
        } : this.$route.query,
      });
    },
  },
  mounted() {
    if (this.$refs.freeSwiper) {
      const i = Object.keys(this.categoryMap).indexOf(this.params.category);
      this.$refs.freeSwiper.swiper.slideTo(i);
    }
    window.addEventListener('scroll', this.scrollEvent);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent);
  },
};
</script>

<style lang="scss">
.korailTopWrapper{
  background-color: #FFF;
  display: unset;
  &.noCategoryTab{
    height: 0;
  }
  .search{
    background-color: #FFF;
    > div{
      padding: 0 $sidePadding * 1px 10px;
    }
    .btnFlex{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      justify-content: space-between;
      > button{
        > span{
          display: block;
          color: #939499;
          font-size: 11px;
          margin-bottom: 4px;
        }
        border-radius: 4px;
        font-size: 16px;
        padding: 10px 0;
        border: 2px solid #568bc2;
        &:after{
          margin-top: 4px;
          content: '선택';
          padding: 4px 8px;
          background-color: #568bc2;
          color: #FFF;
          font-size: 10px;
          display: inline-block;
          border-radius: 20px;
        }
      }
    }
    .location, .date{
      > div:first-of-type{
        padding: 20px 0 10px;
        font-weight: bold;
      }
    }
    .location{
      button {
        width: 100%;
      }
    }
    .date{
      button {
        width: calc(50% - 5px);
      }
    }
    .option{
      text-align: right;
      > button{
        padding: 4px 8px;
        font-size: 13px;
        margin-top: 10px;
        text-decoration: underline;
      }
    }
  }
  .tabWrapper{
    position: sticky;
    top: 0;
    background-color: #FFF;
    border-bottom: 1px solid #ebecf1;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .05);
    height: 45px;
    > div{
      padding: 0 $sidePadding * 1px;
    }
    &:before{
      content: '';
      width: 24px;
      height: 44px;
      background-image: linear-gradient(to left, rgba(255, 255, 255, 0), #FFF);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 5;
      pointer-events: none;
    }
    &:after{
      content: '';
      width: 24px;
      height: 44px;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #FFF);
      position: absolute;
      right: 0;
      top: 0;
      z-index: 5;
      pointer-events: none;
    }
    .swiper-slide{
      width: auto;
      min-width: 57px;
      > div{
        height: 44px;
        border-top: 2px solid transparent;
        border-bottom: 2px solid transparent;
        line-height: 40px;
        font-size: 13px;
        padding: 0 6px;
        color: #939499;
      }
      &.active > div{
        border-bottom-color: #3d3d3d;
        color: #000;
        font-weight: bold;
      }
    }
  }
}
</style>
