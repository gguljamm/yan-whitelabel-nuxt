export default {
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
    const arrRecentSearch = localStorage.getItem('search-history-leisure');
    const arrRecentGoods = localStorage.getItem('recent-view-leisure');
    const { keyword, category, area } = this.$route.query;
    const arrPopularKeyWord = [
      {
        recommendKeyword: '스키 시즌권',
      },
      {
        recommendKeyword: '테마파크',
      },
      {
        recommendKeyword: '아쿠아리움',
      },
      {
        recommendKeyword: '방탈출',
      },
    ];
    const tab = !keyword && category || area ? 'category' : 'search';
    return {
      category: category * 1,
      tab,
      inputStr: '',
      arrPopularKeyWord,
      arrRecentSearch: arrRecentSearch ? JSON.parse(arrRecentSearch).reverse() : [],
      arrRecentGoods: arrRecentGoods ? JSON.parse(arrRecentGoods).reverse() : [],
      subCategory: '',
      objAutoComplete: {
        status: 'init',
        list: [],
      },
      timeout: '',
      arrPopularLoading: true,
    };
  },
  methods: {
    submitAutoComplete(objAutocompleteData) {
      const { name, dealId, type } = objAutocompleteData;
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      if (type === 'DEAL_NAME') {
        this.$router.push(`/leisure/result/${dealId}`);
      } else {
        this.$router.push(`/leisure/results?keyword=${name}`);
      }
    },
    getRecommendKeyword() {
      this.arrPopularLoading = true;
      this.$apis.leisureRecommendKeyword({ channel: this.$store.state.channelInfo.channelName }).then((resp) => {
        this.arrPopularLoading = false;
        // console.log(resp.data.result && resp.data.result.length > 0);
        this.arrPopularKeyWord = resp.data.result && resp.data.result.length > 0 ? [...resp.data.result] : this.arrPopularKeyWord;
      }).catch((e) => {
        console.log({ ...e });
        this.arrPopularLoading = false;
      });
    },
    receiveInputStr(inputStr) {
      this.inputStr = inputStr;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (this.inputStr && this.inputStr.trim()) {
        this.timeout = setTimeout(() => {
          this.objAutoComplete.status = 'loading';
          this.$apis.leisureAutoComplete({
            input: encodeURIComponent(this.inputStr),
          }).then((resp) => {
            if (this.objAutoComplete.status === 'loading') {
              this.objAutoComplete.status = 'loaded';
              if (resp.data.code === 200) {
                this.objAutoComplete.list = resp.data.result;
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
    submitRegionCategory(objRegionCategory) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: '/leisure/results',
        query: {
          ...objRegionCategory,
        },
      });
    },
    removeAllRecentSearchHistory() {
      this.arrRecentSearch = [];
      this.localStorage.removeItem('search-history-leisure');
    },
    removeRecentItem(index) {
      this.arrRecentSearch.splice(index, 1);
      const arr = [].concat(this.arrRecentSearch);
      this.localStorage.setItem('search-history-leisure', JSON.stringify(arr.reverse()));
    },
    removeAllRecentGoods() {
      this.arrRecentGoods = [];
      this.localStorage.removeItem('recent-view-leisure');
    },
    submitRecentGoods(index) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/leisure/result/${this.arrRecentGoods[index].id}`);
    },
    submitRecent(index) {
      this.receiveInputStr(this.arrRecentSearch[index].keyword);
      this.submit();
    },
    submitKeyword(strKeyword) {
      this.receiveInputStr(strKeyword);
      this.saveRecentSearch(strKeyword);
      this.submit();
    },
    submitEnter() {
      this.saveRecentSearch(this.inputStr);
      this.submit();
    },
    saveRecentSearch(keyword) {
      let arrRecentSearch = [...this.arrRecentSearch].reverse();
      if (arrRecentSearch && arrRecentSearch.length > 0) {
        arrRecentSearch = arrRecentSearch.filter((obj) => obj.keyword !== keyword);
      }
      arrRecentSearch.push({ keyword, date: this.$format.ymdDate(new Date()) });
      if (arrRecentSearch.length > 3) {
        arrRecentSearch.shift();
      }
      this.localStorage.setItem('search-history-leisure', JSON.stringify(arrRecentSearch));
    },
    submit() {
      if (this.inputStr && this.inputStr.trim()) {
        this.$store.commit('leisure/setPageStatus', { key: 'list', value: { scrollTop: 0 } });
        this.$store.commit('history/pushHistory', this.$route.fullPath);
        this.$router.push(`results?keyword=${encodeURIComponent(this.inputStr)}`);
      }
    },
  },
  mounted() {
    this.getRecommendKeyword();
  },
};
