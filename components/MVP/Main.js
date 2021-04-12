export default {
  data() {
    return {
      objContents: {},
    };
  },
  methods: {
    changeTab(path) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path,
      });
    },
    submit(path, query) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path,
        query,
      });
    },
    getPlaceContents() {
      // console.log(this.$store.state.channelInfo.channelName);
      this.$apis.getPlaceContents({ channelName: this.$store.state.channelInfo.channelName }).then((resp) => {
        // console.log(resp.data.result);
        this.objContents = resp.data.result;
        this.$store.commit('place/setExhibition', this.objContents);
        // console.log(this.objContents);
      }).catch((e) => {
        console.log({ ...e });
      });
    }
  },
  mounted() {
    if (this.$store.state.place.objExhibition && Object.keys(this.$store.state.place.objExhibition).length > 0) {
      this.objContents = this.$store.state.place.objExhibition;
    } else {
      this.getPlaceContents();
    }
    if (!this.$store.state.reservation.uninitialized) {
      this.$store.commit('reservation/clearState');
    }
  },
};
