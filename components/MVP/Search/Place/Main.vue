<template>
  <div class="placeSearchWrapper">
    <div class="searchWrapper fixWidth">
      <Header :arrClass="['search']"></Header>
      <div class="searchTabWrapper" v-if="tab === 'category'">
        <Region
          :arrRecommend="objRegion[mixCategory]"
          @submit="submitRegion"
        ></Region>
      </div>
      <div class="searchTabWrapper" v-else>
        <SearchInput
          :placeholder="`지역, ${categoryName || '숙소'} 이름으로 검색하세요.`"
          @enter="enterEvent"
          @receiveData="receiveInputStr"
        ></SearchInput>
        <List v-if="objAutoComplete.status !== 'init'"
          :objAutoComplete="objAutoComplete"
          @submit="submitAutoComplete"
        ></List>
        <template v-else>
          <Popular
            v-if="!arrPopularLoading"
            :arrPopularKeyWord="arrPopular"
            @submitKeyword="submitKeyword"
          ></Popular>
          <Recent
            v-if="arrRecentSearch.length > 0"
            :arrRecentSearch="arrRecentSearch"
            @submit="submitRecent"
            @removeAll="removeAll"
            @removeRecentItem="removeRecentItem"
          ></Recent>
          <recent-goods
            v-if="arrRecentGoods.length > 0"
            :title="'최근 본 숙소'"
            :arrRecent="arrRecentGoods"
            @submit="submitRecentGoods"
            @removeAll="removeAllGoods"
          ></recent-goods>
        </template>
      </div>
    </div>
    <div class="tabWrapper" v-if="category !== 'all'">
      <button
        v-show="tab === 'search'"
        @click="tab = 'category'"
      >지역별 목록</button>
      <button
        v-show="tab === 'category'"
        @click="tab = 'search'"
      >여행지 검색</button>
    </div>
  </div>
</template>

<script>
import SearchInput from '../Input.vue';
import Recent from '@/components/MVP/Search/RecentSearch.vue';
import Region from '@/components/MVP/Search/Region.vue';
import List from '@/components/MVP/Search/AutoCompleteList.vue';
import RecentGoods from '@/components/MVP/Search/RecentGoods.vue';
import Popular from '@/components/MVP/Search/Popular.vue';
import RegionList from '~/components/MVP/Search/Place/RegionList.js';

export default {
  components: {
    SearchInput,
    Recent,
    Region,
    List,
    RecentGoods,
    Popular,
  },
  mixins: [RegionList],
  data() {
    const localStorage = window.localStorage || {
      getItem() {
        return null;
      },
      setItem() {
      },
      removeItem() {
      },
    };
    const arrRecentSearch = localStorage.getItem('search-history-place');
    const mapping = {
      all: '숙소',
      motel: '중저가 숙소',
      hotel: '호텔',
      guesthouse: '게스트하우스',
      pension: '펜션/풀빌라',
      resort: '리조트/콘도',
      camping: '글램핑/카라반',
    };
    const isFromMain = !(this.$route.query.checkin && this.$route.query.checkout);
    const arrRecentGoods = localStorage.getItem('recent-view-place');
    const tab = this.$route.query.type || (this.$route.query.category ? 'category' : 'search');
    const category = tab === 'search' ? 'all' : this.$route.query.category;
    return {
      localStorage,
      tab,
      category,
      isFromMain,
      categoryName: mapping[category],
      selectedRecommend: 0,
      arrRecentSearch: arrRecentSearch ? JSON.parse(arrRecentSearch).reverse() : [],
      arrRecentGoods: arrRecentGoods ? JSON.parse(arrRecentGoods).reverse() : [],
      timeout: null,
      objAutoComplete: {
        status: 'init',
        list: [],
      },
      inputText: '',
      arrPopular: [
        {
          recommendKeyword: '풀빌라',
        },
        {
          recommendKeyword: '가평 펜션',
        },
        {
          recommendKeyword: '강원 캠핑장',
        },
        {
          recommendKeyword: '제주 게스트하우스',
        },
        {
          recommendKeyword: '제주',
        },
        {
          recommendKeyword: '서귀포',
        },
      ],
      arrPopularLoading: true,
    };
  },
  computed: {
    mixCategory() {
      switch (this.category) {
        case 'resort': return 'hotel';
        case 'camping': return 'pension';
        case 'premiumhotel': return 'hotel';
        default: return this.category;
      }
    },
  },
  methods: {
    submit(objQuery) {
      const objTemp = objQuery ? { ...objQuery } : { keyword: this.inputText };
      let query = {};
      let path;
      if (!this.isFromMain) {
        path = '/place/results';
        query = {
          checkin: this.$route.query.checkin,
          checkout: this.$route.query.checkout,
        };
        if (objTemp.placeType === 'PLACE_NAME') {
          path = `/place/result/${objTemp.locationId}`;
        } else {
          query.keyword = objTemp.keyword;
          query.locationId = objTemp.locationId;
          query.adults = this.$route.query.adults;
          query.children = this.$route.query.children;
        }
      } else {
        path = 'place/date';
        query = { ...objTemp, city: undefined };
      }
      query.category = this.$route.query.category;
      query.type = this.$route.query.type || this.$route.query.category ? 'category' : 'search';
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      if (objTemp.placeType === 'STATION_NAME') {
        query.locationId = undefined;
      }
      this.$router.push({
        path,
        query,
      });
    },
    getRecommendKeyword() {
      this.$apis.placeRecommendKeyword({ channelName: this.$store.state.channelInfo.channelName }).then((resp) => {
        this.arrPopularLoading = false;
        this.arrPopular = resp.data.result && resp.data.result.length > 0 ? [...resp.data.result] : this.arrPopular;
      }).catch((e) => {
        this.arrPopularLoading = false;
        console.log({ ...e });
      });
    },
    receiveInputStr(inputStr) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.inputText = inputStr;
      if (inputStr && inputStr.trim()) {
        this.timeout = setTimeout(() => {
          this.objAutoComplete.status = 'loading';
          this.$apis.placeAutocomplete({
            input: encodeURIComponent(inputStr.replace(/ /g, '')),
          }).then((resp) => {
            if (this.objAutoComplete.status === 'loading') {
              this.objAutoComplete.status = 'loaded';
              if (resp.data.code === 200) {
                if (!process.env.isDev) {
                  const arrBlackList = [1000101616, 1000101617, 1000101627, 1000101622];
                  this.objAutoComplete.list = resp.data.result.filter((obj) => arrBlackList.indexOf(obj.placeId * 1) === -1);
                } else {
                  this.objAutoComplete.list = resp.data.result;
                }
              } else {
                this.objAutoComplete.list = [];
              }
            }
          }).catch((e) => {
            if (this.objAutoComplete.status === 'loading') {
              if (!e || e.message !== 'cancel') {
                this.objAutoComplete.status = 'loaded';
              }
              this.objAutoComplete.list = [];
            }
          });
        }, 300);
      } else {
        this.objAutoComplete.list = [];
        this.objAutoComplete.status = 'init';
      }
    },
    saveRecentSearch(objQuery) {
      const obj = {
        ...objQuery,
        date: this.$format.ymdDate(new Date()),
      };
      const arrRecentSearch = [].concat(this.arrRecentSearch).reverse();
      arrRecentSearch.find((v, index) => {
        if (v.keyword === obj.keyword) {
          arrRecentSearch.splice(index, 1);
          return true;
        }
        return false;
      });
      arrRecentSearch.push(obj);
      if (arrRecentSearch.length > 3) {
        arrRecentSearch.shift();
      }
      this.localStorage.setItem('search-history-place', JSON.stringify(arrRecentSearch));
    },
    submitAutoComplete(objLocation) {
      const obj = {
        placeType: objLocation.placeType,
        keyword: objLocation.text,
        city: objLocation.city,
        locationId: objLocation.placeId,
        lat: objLocation.latitude,
        lng: objLocation.longitude,
      };
      this.submit(obj);
      if (obj.placeType !== 'PLACE_NAME') {
        this.saveRecentSearch(obj);
      }
    },
    enterEvent() {
      if (!this.inputText.trim()) {
        this.$store.commit('openNotice', { text: '검색할 키워드를 입력해주세요.' });
        return;
      }
      this.saveRecentSearch({ keyword: this.inputText });
      this.submit();
    },
    submitRegion(regionStr) {
      this.submit({ keyword: regionStr.text, regionId: regionStr.id });
    },
    removeAll() {
      this.arrRecentSearch = [];
      this.localStorage.removeItem('search-history-place');
    },
    removeAllGoods() {
      this.arrRecentGoods = [];
      this.localStorage.removeItem('recent-view-place');
    },
    removeRecentItem(index) {
      this.arrRecentSearch.splice(index, 1);
      const arr = [].concat(this.arrRecentSearch);
      this.localStorage.setItem('search-history-place', JSON.stringify(arr.reverse()));
    },
    submitRecent(index) {
      const obj = {
        keyword: this.arrRecentSearch[index].keyword,
        city: this.arrRecentSearch[index].city,
        locationId: this.arrRecentSearch[index].locationId,
        placeType: this.arrRecentSearch[index].placeType,
        lat: this.arrRecentSearch[index].lat,
        lng: this.arrRecentSearch[index].lng,
      };
      this.submit(obj);
      this.saveRecentSearch(obj);
    },
    submitRecentGoods(index) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$store.commit('place/setPageStatus', {
        key: 'detail',
        value: {
          scrollTop: 0,
          tab: 0,
        },
      });
      let { checkin, checkout } = this.arrRecentGoods[index];
      if (new Date(this.$format.ymdDate(new Date())).getTime() > new Date(checkin)) {
        checkin = undefined;
        checkout = undefined;
      }
      this.$router.push({
        path: `/place/result/${this.arrRecentGoods[index].id}`,
        query: {
          checkin,
          checkout,
        },
      });
    },
    submitKeyword(strKeyword) {
      this.receiveInputStr(strKeyword);
      this.submit();
    },
  },
  mounted() {
    this.getRecommendKeyword();
  },
};
</script>

<style lang="scss">
.placeSearchWrapper{
  .gnbWrapper > div{
    background-color: #FFF;
  }
  .searchTabWrapper{
    min-height: calc(100vh - #{$header * 1px});
    background-color: #FFF;
    padding-bottom: 80px;
  }
  .tabWrapper{
    position: fixed;
    bottom: 20px;
    height: 42px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    > button{
      font-size: 13px;
      padding: 0 16px 0 36px;
      height: 42px;
      border-radius: 22px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
      background-color: #000000;
      color: #FFF;
      position: relative;
      &:before{
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        top: 11px;
        left: 14px;
      }
      &:first-of-type:before{
        background: url(~assets/img/icon-list-white.svg) center center no-repeat;
        background-size: 20px;
      }
      &:nth-of-type(2):before{
        background: url(~assets/img/icon-search-white.svg) center center no-repeat;
        background-size: 20px;
      }
    }
  }
}
</style>
