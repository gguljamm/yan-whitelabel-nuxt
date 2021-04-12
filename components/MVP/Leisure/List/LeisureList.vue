<template>
  <div class="leisureListWrapper">
    <TopInfo
      :isKeywordSearch="isKeywordSearch"
      :params="params"
      :objLeisure="objLeisure"
      :arrCategory="arrCategory"
      :arrRegion="arrRegion"
      @openPop="openPopup"
      @submitSearch="submitSearch"
      @submitGlobalSearch="submitGlobalSearch"
    ></TopInfo>
    <div class="leisureListSection fixWidth">
      <div
        class="leisureListWrap"
        :class="{
          categorySearch: !isKeywordSearch,
        }"
      >
        <div class="totalCount" v-if="objLeisure.totalCount > 0 && objLeisure.status === 'loaded'">
          <span>총 {{ $format.numberFormat(objLeisure.totalCount) }}개</span>
        </div>
        <div class="listItemWrap">
          <LeisureListItem
            v-for="(objItem, index) in objLeisure.list"
            :key="index"
            :objItem="objItem"
            class="listItem"
            @click.native="$emit('openDetail', objItem.id)"
          ></LeisureListItem>
        </div>
      </div>
      <div
        v-if="objLeisure.status === 'loaded' && objLeisure.list && objLeisure.list.length === 0"
        class="noResult"
        :style="{
          marginTop: isKeywordSearch ? '152px' : '96px',
        }"
      >
        <div>검색된 상품이 없습니다.</div>
        <div>검색어나 검색 조건을 변경하세요.</div>
      </div>
    </div>
    <div
      v-if="objLeisure.status === 'loading' && objLeisure.list.length <= 0"
      class="spinnerLoading"
    ><div></div></div>
    <div v-if="objLeisure.list && objLeisure.list.length > 0" class="btnMap">
      <button
        v-if="!$store.state.env.isLowVersion"
        @click="openPopup('map')"
      >지도로 찾기</button>
    </div>
  </div>
</template>

<script>
import LeisureListItem from './LeisureListItem.vue';
import TopInfo from './TopInfo.vue';

export default {
  props: {
    isKeywordSearch: {
      type: Boolean,
      default: true,
    },
    params: {
      type: Object,
      default: () => {
      },
    },
    arrRegion: {
      type: Array,
      default: () => [],
    },
    arrCategory: {
      type: Array,
      default: () => [],
    },
    objLeisure: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    LeisureListItem,
    TopInfo,
  },
  data() {
    return {
      scrollTop: this.$store.state.leisure.pageStatus.list.scrollTop || 0,
      popupType: '',
    };
  },
  methods: {
    openPopup(popType) {
      this.$emit('openPopup', popType);
    },
    submitSearch() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: '/leisure/search',
        query: {
          ...this.$route.query,
        },
      });
    },
    submitGlobalSearch() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: '/leisure/search',
      });
    },
    scrollEvent() {
      const scrollTop = (window.pageYOffset || document.documentElement.scrollTop);
      this.scrollTop = scrollTop;
      if (this.objLeisure.status !== 'loading' && (document.body.scrollHeight <= (scrollTop + window.innerHeight) + 20)) {
        this.$emit('addLeisureList');
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.scrollEvent);
    const inter = setInterval(() => {
      const scrollTop = (window.pageYOffset || document.documentElement.scrollTop);
      if (this.$store.state.leisure.pageStatus.list.scrollTop >= scrollTop) {
        clearInterval(inter);
        setTimeout(() => {
          window.scrollTo(0, this.$store.state.leisure.pageStatus.list.scrollTop);
        }, 1);
      }
    }, 100);
  },
  beforeDestroy() {
    this.$store.commit('leisure/setPageStatus', { key: 'list', value: { scrollTop: this.scrollTop } });
    window.removeEventListener('scroll', this.scrollEvent);
  },
};
</script>

<style lang="scss">
  .leisureListWrapper {
    padding-bottom: 80px;
    .leisureListSection{
      .leisureListWrap{
        &.categorySearch{
          margin-top: 59px;
        }
        .totalCount{
          height: 32px;
          line-height: 32px;
          padding: 0 $sidePadding * 1px;
          font-size: 11px;
          color: #939499;
        }
        .listItemWrap{
          .leisureList{
            margin-top: 10px;
            &:first-of-type{
              margin-top: 0;
            }
          }
        }
      }
      .noResult{
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
    .spinnerLoading{
      padding-top: 32px;
      > div{
        margin: 0 auto;
        width: 24px;
        background: url(~assets/img/loading.svg) center center no-repeat;
        background-size: 24px;
        height: 24px;
        animation: rotate 2s linear infinite;
      }
    }
    .btnMap{
      position: fixed;
      bottom: 20px;
      width: 100%;
      left: 0;
      > button{
        padding: 0 16px 0 38px;
        height: 42px;
        border-radius: 21px;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
        background-color: #000;
        font-size: 14px;
        position: relative;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        color: #FFF;
        &:before{
          position: absolute;
          content: '';
          width: 20px;
          height: 20px;
          background: url(~assets/img/icon-map-white.svg) center center no-repeat;
          background-size: 20px;
          top: 11px;
          left: 14px;
        }
      }
    }
  }
</style>
