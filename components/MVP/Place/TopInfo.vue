<template>
  <div class="topWrapper" :class="{ noCategoryTab: $route.query.type === 'category' || ['camping', 'resort'].indexOf($route.query.category) >= 0 }">
    <div>
      <div class="search fixWidth" v-show="!isOpenSearch">
        <div class="btnWrap">
          <button
            @click="clickSearchOpen()"
          >
            <div>{{ params.keyword }}</div>
            <div>, {{ $format.formatDate(params.checkin, 'dot') }} - {{ $format.formatDate(params.checkout, 'dot') }}, 성인 {{ params.adults }}명{{ params.children > 0 ? `, 아동 ${params.children}명` : '' }}</div>
          </button>
          <button @click="clickGlobalSearch()"></button>
        </div>
        <div class="tabWrapper" v-swiper="options" ref="freeSwiper" v-if="$route.query.type !== 'category' && ['camping', 'resort'].indexOf($route.query.category) < 0">
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
      <transition name="fromTop">
        <result-search
          v-if="isOpenSearch"
          :params="params"
          @close="clickSearchOpen"
        ></result-search>
      </transition>
    </div>
  </div>
</template>

<script>
import ResultSearch from './Search.vue';

export default {
  components: {
    ResultSearch,
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
      isOpenSearch: false,
      options: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 18,
      },
    };
  },
  methods: {
    clickSearchOpen() {
      this.isOpenSearch = !this.isOpenSearch;
    },
    clickGlobalSearch() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/place');
    },
    changeTab(tab) {
      this.$emit('changeTab', tab);
    },
    scrollEvent() {
      if (this.isOpenSearch) {
        this.isOpenSearch = false;
      }
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
.noHeader .topWrapper{
  height: 45px + ($header * 1px);
  background-color: #fff;
  &.noCategoryTab{
    height: $header * 1px;
    > div{
      height: $header * 1px;
    }
  }
  > div {
    top: 0;
    height: 45px + ($header * 1px);
    .search .btnWrap{
      position: relative;
      right: 0;
      left: 0;
      width: 100%;
      margin-top: 0;
      padding: 0 ($sidePadding + 32 * 1px) 0 $sidePadding * 1px;
      margin-bottom: 12px;
      > button:nth-of-type(2){
        right: $sidePadding * 1px;
        top: -12px;
      }
    }
  }
}
.topWrapper{
  background-color: #FFF;
  height: 45px;
  &.noCategoryTab{
    height: 0;
  }
  > div{
    position: fixed;
    width: 100%;
    top: $header * 1px;
    left: 0;
    z-index: 11;
    background-color: #FFF;
    border-bottom: 1px solid #ebecf1;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.05);
    .search{
      position: relative;
      .btnWrap{
        left: 46px;
        right: 53px;
        position: absolute;
        margin-top: $header * -1px;
        padding-right: 32px;
        > button:nth-of-type(1){
          margin-top: 12px;
          border-radius: 4px;
          border: solid 1px #ebecf1;
          background-color: #f8f9fb;
          width: 100%;
          height: 34px;
          font-size: 13px;
          text-align: left;
          padding: 0 12px;
          position: relative;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          > div{
            white-space: nowrap;
            &:first-of-type{
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
        > button:nth-of-type(2){
          position: absolute;
          right: 0;
          top: 0;
          width: 24px;
          height: $header * 1px;
          background: url(~assets/img/icon-search-black.svg) center center no-repeat;
          background-size: 20px;
        }
      }
    }
    .tabWrapper{
      height: 44px;
      padding: 0 $sidePadding * 1px;
      &:before{
        content: '';
        width: 44px;
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
        width: 44px;
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
}
</style>
