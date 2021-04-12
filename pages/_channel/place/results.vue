<template>
  <div>
    <div v-if="!$route.params.popup || $route.params.popup === 'sort'">
      <Header></Header>
      <place-list
        :params="params"
        :objPlace="objPlace"
        :sort="sort"
        :objFilter="objFilter"
        @submit="submit"
        @changeTab="changeTab"
        @openPopup="openPopup"
        @reSearch="reSearch"
      ></place-list>
    </div>
    <nuxt-child
      v-if="$route.params.popup && objPlace.status === 'loaded'"
      :objLocation="$store.state.map.objMapMarker"
      :params="params"
      :arrPlace="objPlace.list"
      :sort="sort"
      :objFilter="objFilter"
      @locationSearch="locationSearch"
      @submit="submit"
      @changeSort="changeSort"
      @changeFilter="changeFilter"
    ></nuxt-child>
  </div>
</template>

<script>
import PlaceList from '@/components/MVP/Place/PlaceList.vue';

export default {
  components: {
    PlaceList,
  },
  data() {
    let {
      checkin, checkout, keyword, category, adults, children,
    } = this.$route.query;
    const etcMap = {
      resort: '리조트/콘도',
      camping: '글램핑/카라반',
    };
    if (!checkin) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkin = this.$format.ymdDate(today);
      today.setDate(today.getDate() + 1);
      checkout = this.$format.ymdDate(today);
    }
    if (!category) {
      category = 'all';
    }
    if (!keyword) {
      keyword = etcMap[this.$route.query.category] || '서울';
    }
    if (!adults) {
      adults = 2;
    }
    if (!children) {
      children = 0;
    }
    return {
      sort: this.$route.query.sort || 'RECOMMENDATION',
      objPlace: {
        status: 'loading',
        paging: 0,
        list: [],
      },
      locationSearchLoading: false,
      params: {
        keyword,
        locationId: this.$route.query.locationId,
        regionId: this.$route.query.regionId,
        category,
        checkin,
        checkout,
        adults,
        children,
      },
      selectedNo: '',
      scrollTop: 0,
      init: false,
      objFilter: {
        amenities: this.$route.query.amenities ? this.$route.query.amenities.split(',') : [],
        priceFrom: this.$route.query.priceFrom,
        priceTo: this.$route.query.priceTo,
      },
    };
  },
  computed: {
  },
  methods: {
    changeFilter(cond) {
      const string = cond.amenities.sort().join(',');
      if (this.objFilter.amenities.join(',') === string
        && this.objFilter.priceFrom === cond.priceFrom
        && this.objFilter.priceTo === cond.priceTo) {
        this.$store.commit('history/popHistory');
        this.$router.back();
        return;
      }
      this.objFilter = cond;
      const query = { ...this.$route.query };
      query.amenities = string || undefined;
      query.priceFrom = cond.priceFrom;
      query.priceTo = cond.priceTo;
      this.$store.commit('history/popHistory');
      this.$router.back();
      window.setTimeout(() => {
        this.$router.replace({
          query,
        });
      }, 10);
      this.objPlace = {
        status: 'loading',
        paging: 0,
        list: [],
      };
      this.getPlaceList();
      window.scrollTo(0, 0);
    },
    changeSort(cond) {
      if (cond !== this.sort) {
        this.sort = cond;
        const query = { ...this.$route.query };
        query.sort = cond === 'RECOMMENDATION' ? undefined : cond;
        this.$store.commit('history/popHistory');
        this.$router.back();
        window.setTimeout(() => {
          this.$router.replace({
            query,
          });
        }, 10);
        this.objPlace = {
          status: 'loading',
          paging: 0,
          list: [],
        };
        this.getPlaceList();
        window.scrollTo(0, 0);
      }
    },
    saveScrollTop() {
      this.$store.commit('place/setPageStatus', {
        key: 'list',
        value: {
          scrollTop: document.documentElement.scrollTop,
        },
      });
    },
    changeTab(tab) {
      if (tab !== this.params.category) {
        this.params.category = tab;
        const query = { ...this.$route.query };
        query.category = tab === 'all' ? undefined : tab;
        this.$router.replace({
          query,
        });
        this.objPlace = {
          status: 'loading',
          paging: 0,
          list: [],
        };
        this.getPlaceList();
        window.scrollTo(0, 0);
      }
    },
    setMapMarkerActive(index) {
      this.$store.commit('map/setMarkerActive', index);
    },
    clearMapMarker() {
      this.$store.commit('map/clearMarker');
    },
    locationSearch(center) {
      this.$store.commit('map/setMarkerStatus', 'loading');
      const params = {
        latitude: center.latitude,
        longitude: center.longitude,
        'searchOption.checkIn': this.params.checkin,
        'searchOption.checkOut': this.params.checkout,
        'searchOption.adultNum': this.params.adults,
        'searchOption.kidNum': this.params.children,
        'searchOption.size': 20,
        'searchOption.distance': 20,
        'searchOption.searchSort': 'DISTANCE',
      };
      if (this.params.category === 'resort') {
        params['searchFilter.themes'] = 'RESORT,CONDO';
      } else if (this.params.category === 'camping') {
        params['searchFilter.themes'] = 'CAMPING,CARAVAN';
      } else {
        params['searchFilter.category'] = this.params.category === 'all' ? undefined : this.params.category.toUpperCase();
      }
      this.$apis.getPlaceListByLocation(params).then((resp) => {
        this.$store.commit('map/setMarkerStatus', 'loaded');
        if (resp.data.code === 200) {
          this.$store.commit('map/setMarkerList', { type: 'place', list: [...resp.data.result.data] });
        }
      }).catch(() => {
        this.$store.commit('map/setMarkerStatus', 'loaded');
      });
    },
    reSearch(params) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      Object.keys(params).forEach((v) => {
        this[v] = params[v];
      });
      this.$router.push({
        path: '/place/results',
        query: params,
      });
      this.objPlace = {
        status: 'loading',
        paging: 0,
        list: [],
      };
      this.getPlaceList();
      window.scrollTo(0, 0);
    },
    submit(id) {
      this.saveScrollTop();
      this.selectedNo = id;
      this.$store.commit('place/setPageStatus', {
        key: 'detail',
        value: {
          tab: 0,
          scrollTop: 0,
        },
      });
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `/place/result/${id}`,
        query: {
          checkin: this.$route.query.checkin,
          checkout: this.$route.query.checkout,
          adults: this.$route.query.adults,
          children: this.$route.query.children,
        },
      });
    },
    getPlaceList(isPaging) {
      this.objPlace.status = 'loading';
      const query = {
        'searchOption.checkIn': this.params.checkin,
        'searchOption.checkOut': this.params.checkout,
        'searchOption.adultNum': this.params.adults,
        'searchOption.kidNum': this.params.children,
        'searchFilter.searchSort': this.sort,
        'searchFilter.priceFrom': this.objFilter.priceFrom,
        'searchFilter.priceTo': this.objFilter.priceTo,
        'searchFilter.amenities': this.objFilter.amenities.length > 0 ? this.objFilter.amenities.join(',') : undefined,
      };
      if (this.params.category === 'resort') {
        query['searchFilter.themes'] = 'RESORT,CONDO';
        // query.keyword = undefined;
      } else if (this.params.category === 'camping') {
        query['searchFilter.themes'] = 'CAMPING,CARAVAN';
        // query.keyword = undefined;
      } else if (this.params.category === 'premiumhotel') {
        query['searchFilter.category'] = 'HOTEL';
        query['searchFilter.stars'] = [4, 5];
      } else {
        query['searchFilter.category'] = this.params.category === 'all' ? undefined : this.params.category.toUpperCase();
      }
      let api = this.$apis.getPlaceList;
      if (this.$route.query.lat && this.$route.query.lng) {
        query.latitude = this.$route.query.lat;
        query.longitude = this.$route.query.lng;
        api = this.$apis.getPlaceListByLocation;
      } else {
        query.placeId = this.params.locationId;
        query.regionId = this.params.regionId;
        query.keyword = this.params.keyword ? encodeURIComponent(this.params.keyword) : undefined;
      }
      const key = Object.values(query).join('|');
      const recent = this.$store.state.place.objRecentSearch[key];
      if (recent && !isPaging) {
        this.objPlace = { ...recent };
      } else {
        if (isPaging) {
          query['searchOption.page'] = this.objPlace.paging + 1;
          if (!this.objPlace.total || this.objPlace.list.length >= this.objPlace.total) {
            this.objPlace.status = 'loaded';
            return;
          }
        }
        api(query).then((resp) => {
          this.$store.commit('map/setMarkerStatus', 'loaded');
          if (resp.data.code === 200) {
            const list = this.objPlace.list.concat(resp.data.result.data);
            this.$store.commit('map/setMarkerList', { type: 'place', list: [...list] });
            this.objPlace = {
              status: 'loaded',
              paging: query['searchOption.page'] || 0,
              list,
              total: resp.data.result.total,
            };
            this.$store.commit('place/setRecentSearch', {
              key,
              result: {
                ...this.objPlace,
              },
            });
          } else {
            this.$store.commit('map/setMarkerStatus', 'loaded');
            this.objPlace = {
              status: 'loaded',
              paging: query['searchOption.page'] || 0,
            };
            if (!this.objPlace.list) {
              this.$store.commit('map/setMarkerList', { type: 'place', list: [] });
              this.objPlace.list = [];
            }
          }
        }).catch(() => {
          this.$store.commit('map/setMarkerStatus', 'loaded');
          this.objPlace = {
            status: 'loaded',
            paging: 0,
          };
          if (!this.objPlace.list) {
            this.$store.commit('map/setMarkerList', { type: 'place', list: [] });
            this.objPlace.list = [];
          }
        });
      }
    },
    openPopup(flag) {
      if (flag === 'map') {
        this.$store.commit('map/clearActiveMarker');
        this.$store.commit('map/setMarkerList', { type: 'place', list: this.objPlace.list });
      }
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `${this.$route.path}/${flag}`,
        query: this.$route.query,
      });
    },
    scroll() {
      if (!this.$route.params.popup && this.objPlace.status === 'loaded'
        && window.innerHeight + window.document.documentElement.scrollTop > window.document.body.clientHeight - 1) {
        this.getPlaceList(true);
      }
    },
  },
  created() {
    if (this.$route.params.popup && this.$route.params.popup !== 'map' && this.objPlace.list.length === 0) {
      this.$router.replace({
        path: `/${this.$route.path.split('/')[1]}/place/results`,
        query: this.$route.query,
      });
    }
  },
  mounted() {
    this.getPlaceList();
    const inter = setInterval(() => {
      const scrollTop = (window.pageYOffset || document.documentElement.scrollTop);
      // console.log(this.$store.state.place.pageStatus.list.scrollTop, scrollTop);
      if (this.$store.state.place.pageStatus.list.scrollTop >= scrollTop) {
        clearInterval(inter);
        window.scrollTo(0, this.$store.state.place.pageStatus.list.scrollTop);
      }
    }, 100);
    this.$nextTick(() => {
      // window.scrollTo(0, this.$store.state.place.pageStatus.list.scrollTop);
    });
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scroll);
  },
};
</script>

<style lang="scss">
</style>
