export default {
  data() {
    return {
      objContents: {},
    };
  },
  methods: {
    openCategoryPopup() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/leisure/category');
    },
    getLeisureRegionCategory() {
      this.$apis.getLeisureRegionCategory().then((resp) => {
        const arrRegion = [...resp[0].data.region.result.categories];
        const arrCategory = [...resp[1].data.category.result.categories];
        this.$store.commit('leisure/setSearchOption', {
          region: [...arrRegion],
          category: [...arrCategory],
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    changeTab(path) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(path);
    },
    submit(path, query) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path,
        query,
      });
    },
    eventSubmit() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push('/event');
    },
    getLeisureContents() {
      this.$apis.getLeisureContents({ channelName: this.$store.state.channelInfo.channelName }).then((resp) => {
        this.objContents = resp.data.result;
        this.$store.commit('leisure/setExhibition', this.objContents);
      }).catch((e) => {
        console.log({ ...e });
      });
    }
  },
  mounted() {
    if (this.$store.state.leisure.objExhibition && Object.keys(this.$store.state.leisure.objExhibition).length > 0) {
      this.objContents = this.$store.state.leisure.objExhibition;
    } else {
      this.getLeisureContents();
    }
    const storeSearchOption = this.$store.state.leisure.objSearchOption;
    if ((storeSearchOption && storeSearchOption.category.length <= 0) || (storeSearchOption && storeSearchOption.region.length <= 0)) {
      this.getLeisureRegionCategory();
    }
    if (!this.$store.state.reservation.uninitialized) {
      this.$store.commit('reservation/clearState');
    }
  },
};
