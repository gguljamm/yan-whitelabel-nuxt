<template>
  <div class="leisureResultWrapper">
    <div
      v-if="!$route.params.popup"
    >
      <Header></Header>
      <LeisureList
        :params="params"
        :isKeywordSearch="isKeywordSearch"
        :arrRegion="arrRegion"
        :arrCategory="arrCategory"
        :objLeisure="objLeisure"
        @addLeisureList="addLeisureList"
        @openPopup="openPopup"
        @openDetail="openDetail"
      ></LeisureList>
    </div>
    <nuxt-child
      v-if="$route.params.popup && objLeisure.status === 'loaded'"
      :objLocation="$store.state.map.objMapMarker"
      :arrCategory="arrCategory"
      :arrRegion="arrRegion"
      @popSubmit="popSubmit"
      @locationSearch="locationSearch"
      @submit="openDetail"
    ></nuxt-child>
  </div>
</template>

<script>
import LeisureList from '@/components/MVP/Leisure/List/LeisureList.vue';

export default {
  components: {
    LeisureList,
  },
  beforeCreate() {
    const popupName = this.$route.params.popup;
    if ((popupName === 'category' || popupName === 'region')) {
      this.$router.replace({
        path: `/${this.$route.path.split('/')[1]}/leisure/results`,
        query: this.$route.query,
      });
    }
  },
  data() {
    const {
      area,
      keyword,
      category,
    } = this.$route.query;
    const objLeisure = {
      status: 'loading',
      page: 0,
      size: 25,
      list: [],
      timestamp: '',
    };
    const storeSearchOption = this.$store.state.leisure.objSearchOption;
    return {
      isKeywordSearch: !!keyword,
      objLeisure,
      arrCategory: storeSearchOption.category,
      arrRegion: storeSearchOption.region,
      params: {
        area,
        keyword,
        category,
      },
    };
  },
  computed: {
    objRecentSearch() {
      return this.$store.state.leisure.objRecentSearch;
    },
  },
  methods: {
    saveScrollTop() {
      this.$store.commit('leisure/setPageStatus', {
        key: 'list',
        value: {
          scrollTop: document.documentElement.scrollTop,
        },
      });
    },
    clearMapMarker() {
      this.$store.commit('map/clearActiveMarker');
    },
    locationSearch(location) {
      const params = {
        ...location,
        distanceKm: 20,
      };
      this.$store.commit('map/setMarkerStatus', 'loading');
      this.$apis.getLeisureAsLocation(params).then((resp) => {
        const arrList = resp.data.result.contents.map((objList) => ({
          ...objList,
          categoryName: objList.type && objList.type.length > 0 ? objList.type.map((obj) => obj.name)[0] : '',
          minPrice: objList.options && objList.options.length > 0 ? objList.options.reduce((min, x) => ((min.gajagoSalePrice || min.coverPrice) < (x.gajagoSalePrice || x.coverPrice) ? min : x)) : { coverPrice: 0, gajagoSalePrice: 0, status: 'SOLDOUT' },
        }));
        this.$store.commit('map/setMarkerList', { type: 'leisure', list: arrList });
        this.$store.commit('map/setMarkerStatus', 'loaded');
      }).catch((err) => {
        console.log(err);
        this.$store.commit('map/setMarkerStatus', 'loaded');
      });
    },
    openDetail(id) {
      this.$store.commit('leisure/setPageStatus', {
        key: 'detail',
        value: {
          tab: 0,
          scrollTop: 0,
        },
      });
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/leisure/result/${id}`);
    },
    popSubmit(objParams) {
      window.scrollTo(0, 0);
      this.$store.commit('leisure/setPageStatus', { key: 'list', value: { scrollTop: 0 } });
      this.$store.commit('history/popHistory');
      this.$router.back();
      if (this.$route.query && Object.keys(objParams).every((key) => objParams[key] !== this.$route.query[key] * 1)) {
        this.params = {
          ...this.params,
          ...objParams,
        };
        setTimeout(() => {
          this.$router.replace({
            query: {
              ...this.$route.query,
              ...objParams,
            },
          });
        }, 10);
        this.objLeisure.list = [];
        this.objLeisure.page = 0;
        this.reloadLeisureList();
      }
    },
    openPopup(flag) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      if (flag === 'map') {
        this.clearMapMarker();
        this.$store.commit('map/setMarkerList', { type: 'leisure', list: this.objLeisure.list.slice(0, 25) });
      }
      this.$router.push({
        path: `${this.$route.path}/${flag}`,
        query: this.$route.query,
      });
    },
    addLeisureList() {
      if (this.objLeisure.page < this.objLeisure.totalPages - 1) {
        this.objLeisure.page += 1;
        this.getLeisureList();
      }
    },
    reloadLeisureList() {
      const { area, keyword, category } = this.params;
      const storeKey = [area, keyword, category].filter((v) => v).join('|') || 'all';
      if (this.objRecentSearch[storeKey] && ((new Date().getTime() - this.objRecentSearch[storeKey].timestamp) / 1000) < 600) {
        const {
          list,
          page,
          totalPages,
          totalCount,
          timestamp,
        } = JSON.parse(JSON.stringify(this.objRecentSearch[storeKey]));
        this.objLeisure = {
          list,
          page,
          totalPages,
          totalCount,
          timestamp,
          status: 'loaded',
        };
        this.$store.commit('map/setMarkerStatus', 'loaded');
      } else {
        this.getLeisureList();
      }
    },
    getLeisureList() {
      this.objLeisure.status = 'loading';
      this.$store.commit('map/setMarkerStatus', 'loading');
      const objRequestQuery = {
        size: this.objLeisure.size,
        page: this.objLeisure.page,
      };
      Object.keys(this.params).forEach((key) => {
        if (this.params[key]) {
          objRequestQuery[key] = this.params[key];
        }
      });
      let isSearchOption = false;
      if ((this.arrCategory && this.arrCategory.length <= 0) || (this.arrRegion && this.arrRegion.length <= 0)) {
        isSearchOption = true;
      }
      this.$apis.getLeisureList({ ...objRequestQuery }).then((resp) => {
        this.objLeisure.status = 'loaded';
        if (isSearchOption) {
          this.$apis.getLeisureRegionCategory().then((regionCategory) => {
            this.arrRegion = regionCategory[0].data.region.result.categories;
            this.arrCategory = regionCategory[1].data.category.result.categories;
            this.$store.commit('leisure/setSearchOption', {
              region: [...this.arrRegion],
              category: [...this.arrCategory],
            });
          }).catch((err) => {
            console.log(err);
          });
        }
        const objDealResponseData = Array.isArray(resp) ? resp[0].data.deal.result : resp.data.deal.result;
        const respList = [...objDealResponseData.contents.map((objList) => ({
          ...objList,
          categoryName: objList.type && objList.type.length > 0 ? objList.type.map((obj) => obj.name)[0] : '',
          minPrice: objList.options && objList.options.length > 0 ? objList.options.reduce((min, x) => ((min.gajagoSalePrice || min.coverPrice) < (x.gajagoSalePrice || x.coverPrice) ? min : x)) : { coverPrice: 0, gajagoSalePrice: 0, status: 'SOLDOUT' },
        }))];
        this.objLeisure.list.push(...respList);
        this.objLeisure.totalPages = Array.isArray(resp) ? resp[0].data.deal.result.totalPages : resp.data.deal.result.totalPages;
        this.objLeisure.totalCount = objDealResponseData.totalCount;
        this.objLeisure.timestamp = new Date().getTime();
        const { area, keyword, category } = this.params;
        const commitKey = [area, keyword, category].filter((v) => v).join('|') || 'all';
        if (this.objLeisure.page === 0) {
          this.$store.commit('map/setMarkerStatus', 'loaded');
          this.$store.commit('map/setMarkerList', { type: 'leisure', list: this.objLeisure.list });
        }
        if (commitKey) {
          const {
            page,
            totalPages,
            totalCount,
            timestamp,
          } = this.objLeisure;
          this.$store.commit('leisure/setRecentSearch',
            {
              key: commitKey,
              result: {
                list: respList,
                page,
                totalPages,
                totalCount,
                timestamp,
              },
            });
        }
      }).catch((err) => {
        if (err.response) {
          this.$store.commit('openNotice', {
            text: '상품을 불러오는데 실패했습니다.',
          });
        }
        this.$store.commit('map/setMarkerStatus', 'loaded');
        this.objLeisure.status = 'loaded';
      });
    },
  },
  mounted() {
    if (this.$route.params.popup === 'map' && this.$store.state.env.isLowVersion) {
      this.$router.replace({
        path: `/${this.$route.path.split('/')[1]}/leisure/results`,
        query: this.$route.query,
      });
    }
    this.reloadLeisureList();
  },
};
</script>

<style scoped>
</style>
