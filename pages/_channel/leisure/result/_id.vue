<template>
  <div v-if="!$route.params.popup" class="leisureDetailWrapper">
    <Header
      v-show="!$route.params.popup"
      :arrClass="isUnderSwiperImage ? ['invisible', 'fade'] : ['invisible']"
      ref="header"
    ></Header>
    <tabMenu
      v-if="isUnderSwiperImage"
      :arrMenu="['상품 정보', '상품 옵션']"
      :selectedTabIndex="selectedTabIndex"
      :isFixed="true"
      @setSelectedTab="setSelectedTab"
    ></tabMenu>
    <div v-if="objLeisure.status === 'loaded' && Object.keys(objLeisure.leisure).length > 0" class="detailWrapper">
      <swiperImage
        :arrImages="objLeisure.leisure.images"
        :swiperImageHeight="swiperImageHeight"
        :style="{
          height: `${swiperImageHeight - 10}px`
        }"
      ></swiperImage>
      <div class="detailContent fixWidth" ref="detailContent">
        <div class="contentTabMenu">
          <tabMenu
            v-if="!isUnderSwiperImage"
            :arrMenu="['상품 정보', '상품 옵션']"
            :selectedTabIndex="selectedTabIndex"
            :isFixed="false"
            @setSelectedTab="setSelectedTab"
          ></tabMenu>
        </div>
        <HomeTab
          v-if="selectedTabIndex === 0"
          :objLeisure="objLeisure"
          :objSelectedOptions="objSelectedOptions"
          @setSelectedTab="setSelectedTab"
          @changeOption="changeOption"
          @openPopup="openPopup"
        ></HomeTab>
        <productTab
          v-else
          :objLeisure="objLeisure"
          :objSelectedOptions="objSelectedOptions"
          :arrOption="objLeisure.leisure.options"
          :arrOptionGroups="objLeisure.leisure.dealPriceGroups"
          @changeOption="changeOption"
        ></productTab>
      </div>
      <global-button
        :disabled="selectedTabIndex === 1 && (!selectedTotalPrice || selectedTotalPrice < 1000)"
        :text="selectedTotalPrice || selectedTabIndex === 1 ? '결제하기' : '상품 선택'"
        :subText="selectedTotalPrice || selectedTabIndex === 1 ? {
          text: '결제 금액',
          price: selectedTotalPrice ? `<strong>${ $format.numberFormat(selectedTotalPrice) }</strong>원` : '상품을 선택해주세요.',
        } : null"
        @submit="selectedTotalPrice ? submit() : setSelectedTab(1)"
      ></global-button>
    </div>
    <div v-else-if="objLeisure.status === 'loading'" class="spinnerLoading fixWidth">
      <div></div>
    </div>
    <div v-else class="noResult fixWidth">
      <div>현재 판매 중인 상품이 아닙니다.</div>
      <div>검색 조건을 변경하여 다시 시도해주세요.</div>
    </div>
  </div>
  <nuxt-child
    v-else
    :objLeisure="objLeisure.leisure"
  ></nuxt-child>
</template>

<script>
import HomeTab from '@/components/MVP/Leisure/Detail/Home.vue';
import productTab from '@/components/MVP/Leisure/Detail/Product.vue';
import swiperImage from '@/components/MVP/Common/Swiper.vue';
import tabMenu from '@/components/MVP/Common/TabMenu.vue';

import objScss from '@/assets/css/variable.scss';

export default {
  components: {
    HomeTab,
    productTab,
    swiperImage,
    tabMenu,
  },
  beforeCreate() {
    if (this.$route.params.popup) {
      this.$router.replace(`/${this.$route.path.split('/')[1]}/leisure/result/${this.$route.params.id}`);
    }
  },
  data() {
    return {
      init: false,
      selectedTabIndex: 0,
      swiperImageHeight: 0,
      scrollTop: 0,
      objSelectedOptions: {},
      selectedTotalPrice: 0,
      objLeisure: {
        leisure: {},
        status: 'loading',
      },
      objScss,
      headerHeight: this.$store.state.channelInfo.header ? objScss.header * 1 : 0,
    };
  },
  computed: {
    isUnderSwiperImage() {
      return this.init && (this.scrollTop + this.headerHeight + 1) >= this.swiperImageHeight;
    },
    objDetailStore() {
      return this.$store.state.leisure.objDetail;
    },
  },
  methods: {
    discountPrice(price) {
      const temp = this.$format.optimizedDiscountPrice(price, this.$store.state.channelInfo.discount.leisure);
      return temp ? temp.appliedPrice : 0;
    },
    openPopup(flag) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `${this.$route.path}/${flag}`,
        query: this.$route.query,
      });
    },
    changeOption(objOption) {
      if (objOption.value) {
        this.objSelectedOptions[objOption.key] = objOption.value;
      } else {
        delete this.objSelectedOptions[objOption.key];
      }
      const arrSelectedOption = Object.keys(this.objSelectedOptions).map((selectedId) => this.objLeisure.leisure.options.find((optionObj) => `${optionObj.id}` === selectedId));
      this.selectedTotalPrice = arrSelectedOption.reduce((total, obj) => total + ((obj.gajagoSalePrice || obj.coverPrice) * this.objSelectedOptions[obj.id]) - (this.discountPrice(obj.gajagoSalePrice || obj.coverPrice) * this.objSelectedOptions[obj.id]), 0);
    },
    setSelectedTab(tabIndex) {
      if (tabIndex !== this.selectedTabIndex) {
        this.selectedTabIndex = tabIndex;
        let scrollTop = 0;
        if (tabIndex === 1) {
          scrollTop = this.swiperImageHeight - this.headerHeight;
        }
        window.scrollTo(0, scrollTop);
      }
    },
    scrollEvent() {
      this.scrollTop = (window.pageYOffset || document.documentElement.scrollTop);
    },
    getLeisure() {
      const dealId = this.$route.params.id;
      this.$apis.getLeisure({ dealId }).then((resp) => {
        this.objLeisure.leisure = {
          ...resp.data.result,
          images: [...resp.data.result.images].map((img) => ({ bpUrl: img })),
        };
        this.objLeisure.status = 'loaded';
        this.setRecentSearch();
      }).catch(() => {
        this.objLeisure.status = 'loaded';
      });
    },
    setRecentSearch() {
      const arrRecentSearch = window.localStorage.getItem('recent-view-leisure');
      const recentSearch = arrRecentSearch ? JSON.parse(arrRecentSearch) : [];
      if (recentSearch.every((v) => v.id !== this.objLeisure.leisure.id)) {
        recentSearch.push({
          id: this.objLeisure.leisure.id,
          url: this.objLeisure.leisure.images && this.objLeisure.leisure.images.length > 0 && this.objLeisure.leisure.images[0].bpUrl,
          name: this.objLeisure.leisure.name,
        });
      }
      if (recentSearch.length > 10) {
        recentSearch.shift();
      }
      window.localStorage.setItem('recent-view-leisure', JSON.stringify(recentSearch));
    },
    submit() {
      if (this.selectedTotalPrice >= 1000) {
        this.$store.commit('history/pushHistory', this.$route.fullPath);
        this.$router.push({
          path: '/payment/leisure',
          query: {
            dealId: this.objLeisure.leisure.id,
            optionsId: Object.keys(this.objSelectedOptions),
            count: Object.values(this.objSelectedOptions),
          },
        });
      } else {
        this.$store.commit('openNotice', { text: '최소 결제 금액은 1,000원입니다.' });
      }
    },
    setImageHeight() {
      window.removeEventListener('focus', this.setImageHeight);
      const setImage = () => {
        const maxWidth = window.outerWidth > 768 ? 768 : window.outerWidth;
        this.swiperImageHeight = Math.floor((maxWidth * 277) / 375);
      };
      if (window.outerWidth) {
        setImage();
      } else {
        window.addEventListener('focus', this.setImageHeight);
      }
    },
  },
  mounted() {
    this.getLeisure();
    this.setImageHeight();
    window.addEventListener('scroll', this.scrollEvent);
    this.init = true;
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent);
  },
};
</script>

<style lang="scss">
  .leisureDetailWrapper{
    .detailWrapper {
      .detailContent {
        position: relative;
        width: 100%;
        padding-top: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        z-index: 1;
        background-color: #fff;
        .contentTabMenu{
          height: 44px;
        }
      }
    }
    .spinnerLoading{
      height: 100vh;
      padding-top: 100px;
      background-color: #fff;
      > div{
        margin: 0 auto;
        width: 24px;
        background: url(~assets/img/loading.svg) center center no-repeat;
        background-size: 24px;
        height: 24px;
        animation: rotate 2s linear infinite;
      }
    }
    .noResult{
      height: 100vh;
      padding-top: 100px;
      background-color: #fff;
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
