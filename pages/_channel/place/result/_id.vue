<template>
  <div>
    <Header
      v-show="!$route.params.popup"
      :arrClass="fade ? ['invisible', 'fade'] : ['invisible']"
      ref="header"
    ></Header>
    <div v-show="!$route.params.popup" class="detailWrap">
      <component
        :is="channelNotice"
      ></component>
      <div v-if="objPlace.status === 'loaded' && objPlace.place">
        <swiperImage
          :arrImages="objPlace.place.images"
          :swiperImageHeight="imgHeight"
          @clickSwiper="openPopup('photo')"
          :style="{
          height: `${imgHeight - 10}px`,
        }"
        ></swiperImage>
        <div class="contentWrap fixWidth"
          :class="{
            fade,
            isDawn,
          }"
          ref="contentWrap"
        >
          <DawnCheckIn v-if="isDawn"
            :rounded="true"
          ></DawnCheckIn>
          <div class="placeDetailTapWrapper"
            :style="{ top: `${ headerHeight }px` }"
          >
            <tabMenu
              :arrMenu="['숙소 정보', '객실 정보']"
              :selectedTabIndex="tab"
              :isFixed="false"
              @setSelectedTab="changeTab"
            ></tabMenu>
          </div>
          <tab-home
            v-show="tab === 0"
            :objPlace="objPlace"
            :params="params"
            :imgHeight="imgHeight"
            @submit="submit"
            @openPopup="openPopup"
            @openSearch="openSearch"
            @changeTab="changeTab"
          ></tab-home>
          <tab-room
            v-show="tab === 1"
            :objPlace="objPlace"
            :params="params"
            :imgHeight="imgHeight"
            @submit="submit"
            @openPopup="openPopup"
            @openSearch="openSearch"
          ></tab-room>
        </div>
      </div>
      <div v-else-if="objPlace.status === 'loading'" class="spinnerLoading fixWidth">
        <div></div>
      </div>
      <div v-else class="noResult fixWidth">
        <div>현재 판매 중인 숙소가 아닙니다.</div>
        <div>검색 조건을 변경하여 다시 시도해주세요.</div>
      </div>
    </div>
    <nuxt-child
      v-if="$route.params.popup && objPlace.place"
      :objPlace="objPlace"
      :params="params"
      :imgHeight="imgHeight"
      @closePopup="closePopup"
    ></nuxt-child>
  </div>
</template>

<script>
import TabHome from '@/components/MVP/Place/Detail/Home.vue';
import TabRoom from '@/components/MVP/Place/Detail/Room.vue';
import swiperImage from '@/components/MVP/Common/Swiper.vue';
import tabMenu from '@/components/MVP/Common/TabMenu.vue';
import DawnCheckIn from '@/components/MVP/Common/DawnCheckIn.vue';

import objScss from '@/assets/css/variable.scss';

const getChannelNoticeComp = (channelName) => import(`~/components/${channelName}/ChannelNotice.vue`).catch(() => import('~/components/MVP/ChannelNotice.vue'));

export default {
  components: {
    TabHome,
    TabRoom,
    swiperImage,
    tabMenu,
    DawnCheckIn,
  },
  data() {
    let {
      checkin, checkout, adults, children,
    } = this.$route.query;
    if (!checkin) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkin = this.$format.ymdDate(today);
      today.setDate(today.getDate() + 1);
      checkout = this.$format.ymdDate(today);
    }
    if (!adults) {
      adults = 2;
    }
    if (!children) {
      children = 0;
    }
    const params = {
      checkin,
      checkout,
      adults,
      children,
    };
    const today = new Date();
    const tmp = new Date();
    tmp.setDate(tmp.getDate() - 1);
    const yesterday = this.$format.ymdDate(tmp);
    const isDawn = today.getHours() >= 0 && today.getHours() < 2 && yesterday === this.$route.query.checkin;
    // console.log(isDawn);
    return {
      isDawn,
      objPlace: {
        place: null,
        review: null,
        status: 'loading',
      },
      swiperOptions: {},
      imgHeight: 0,
      init: false,
      imgIndex: 0,
      params,
      tab: 0,
      fade: false,
      objScss,
      offsetTop: 0,
      headerHeight: this.$store.state.channelInfo.header ? objScss.header * 1 : 0,
    };
  },
  computed: {
    swiper() {
      return this.init ? this.$refs.mySwiper.swiper : '';
    },
    arrImage() {
      return this.objPlace.place.images || [{ url: 'https://yadev.yanolja.com/v5/2019/08/23/14/5d5f77a06b3f47.68430823.png' }];
    },
    channelNotice() {
      const instance = getChannelNoticeComp(this.$store.state.channelInfo.channelName);
      return () => instance;
    },
  },
  methods: {
    changeTab(v) {
      this.tab = v;
      if (v === 1) {
        window.scrollTo(0, this.offsetTop - this.headerHeight + 1 + 10);
      } else {
        window.scrollTo(0, 0);
      }
    },
    submit(roomNo) {
      this.$store.commit('place/setPageStatus', {
        key: 'detail',
        value: {
          tab: this.tab,
          scrollTop: document.documentElement.scrollTop,
        },
      });
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: '/payment/place',
        query: {
          placeNo: this.objPlace.place.no,
          roomNo,
          checkin: this.params.checkin,
          checkout: this.params.checkout,
        },
      });
    },
    changeSwipe() {
      this.imgIndex = this.swiper.activeIndex;
    },
    openPopup(flag) {
      this.$store.commit('place/setPageStatus', {
        key: 'detail',
        value: {
          tab: this.tab,
          scrollTop: document.documentElement.scrollTop,
        },
      });
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `${this.$route.path}/${flag}`,
        query: this.$route.query,
      });
    },
    openSearch(flag) {
      this.$store.commit('place/setPageStatus', {
        key: 'detail',
        value: {
          tab: this.tab,
          scrollTop: document.documentElement.scrollTop,
        },
      });
      const query = { ...this.$route.query, keyword: this.objPlace.place.korName };
      query.callBack = this.$route.path;
      query.category = this.objPlace.place.category.toLowerCase();
      query.consecutive = this.objPlace.place.consecutiveNightPossibility === 'AVAILABLE' ? 't' : 'f';
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `/place/${flag}`,
        query,
      });
    },
    setImageHeight() {
      window.removeEventListener('focus', this.setImageHeight);
      const setImage = () => {
        const maxWidth = window.outerWidth > 768 ? 768 : window.outerWidth;
        this.imgHeight = Math.floor((maxWidth * 277) / 375);
      };
      if (window.outerWidth) {
        setImage();
      } else {
        window.addEventListener('focus', this.setImageHeight);
      }
    },
    closePopup() {
      this.$nextTick(() => {
        window.scrollTo(0, this.$store.state.place.pageStatus.detail.scrollTop);
      });
      this.fade = false;
    },
    setRecentPlace(data) {
      const cookie = window.localStorage.getItem('recent-view-place');
      const recentPlace = cookie ? JSON.parse(cookie) : [];
      const obj = {
        id: data.no,
        name: data.korName,
        checkin: this.params.checkin,
        checkout: this.params.checkout,
        url: this.arrImage[0] ? encodeURIComponent(this.arrImage[0].bpUrl) : '',
      };
      for (let x = 0; x < recentPlace.length; x += 1) {
        if (obj.id === recentPlace[x].id) {
          recentPlace.splice(x, 1);
          break;
        }
      }
      recentPlace.push(obj);
      if (recentPlace.length > 10) {
        recentPlace.shift();
      }
      window.localStorage.setItem('recent-view-place', JSON.stringify(recentPlace));
    },
    scrollEvent() {
      this.fade = document.documentElement.scrollTop >= this.offsetTop - this.headerHeight;
    },
    getPlaceInfo(query) {
      this.$apis.getPlace(query).then((resp) => {
        this.objPlace.status = 'loaded';
        if (resp.data.code === 200) {
          this.objPlace.place = resp.data.result;
          this.setRecentPlace(resp.data.result);
          this.init = true;
          this.$nextTick(() => {
            this.offsetTop = this.$refs.contentWrap.offsetTop;
            window.scrollTo(0, this.$store.state.place.pageStatus.detail.scrollTop);
          });
          this.getPlaceReviews(query);
          if (resp.data.result.category !== 'MOTEL' && resp.data.result.category !== 'HOTEL') {
            this.isDawn = false;
          }
        }
      }).catch(() => {
        this.objPlace.status = 'loaded';
      });
    },
    getPlaceReviews(query) {
      const params = {
        size: 500,
        page: 1,
      };
      this.$apis.getPlaceReviews({ ...params, placeId: query.placeId }).then((resp) => {
        if (resp.data.code === 200 && resp.data.result.reviews.length > 0) {
          this.objPlace.review = resp.data.result;
        }
      }).catch(() => {
        this.$apis.getPlaceReviewsBatch(query.placeId, params).then((resp) => {
          if (resp.data.code === 200 && resp.data.result.reviews.length > 0) {
            this.objPlace.review = resp.data.result;
          }
        });
      });
    },
  },
  created() {
    if (this.$route.params.popup && !this.objPlace.place) {
      this.$router.replace({
        path: `/${this.$route.path.split('/')[1]}/place/result/${this.$route.params.id}`,
        query: this.$route.query,
      });
    }
  },
  mounted() {
    const query = {
      checkInDate: this.params.checkin,
      checkOutDate: this.params.checkout,
      adultNum: this.params.adults,
      kidNum: this.params.children,
      placeId: this.$route.params.id,
    };
    this.tab = this.$store.state.place.pageStatus.detail.tab;
    this.getPlaceInfo(query);
    this.setImageHeight();
    window.addEventListener('scroll', this.scrollEvent);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent);
  },
};
</script>

<style lang="scss">
  .detailWrap{
    .contentWrap{
      background-color: #FFF;
      border-top: 10px solid #FFF;
      position: relative;
      z-index: 1;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      &.fade{
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
      .placeDetailTapWrapper{
        position: sticky;
        z-index: 5;
        top: 0;
      }
      &.isDawn{
        background-color: transparent;
        border-top: none;
      }
    }
    .dumpSpace{
      height: 44px;
    }
    .spinnerLoading{
      height: 100vh;
      padding-top: 100px;
      background-color: #FFF;
      > div{
        margin: 0 auto;
        width: 24px;
        background: url(~assets/img/loading.svg) center center no-repeat;
        background-size: 24px;
        height: 24px;
        animation: rotate 2s linear infinite;
      }
    }
    > .noResult{
      height: 100vh;
      padding-top: 100px;
      background-color: #FFF;
      text-align: center;
      > div:first-of-type{
        color: #000;
        font-size: 23px;
        line-height: 30px;
        font-weight: bold;
      }
      > div:nth-of-type(2){
        color: #939499;
        font-size: 13px;
        line-height: 20px;
        margin-top: 4px;
      }
    }
  }
</style>
