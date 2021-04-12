export default {
  methods: {
    eventSubmit(type, id) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/exhibition${type === 'PLACE' ? '?productType=place' : '?productType=leisure'}&exhibitionId=${id}`);
    },
  },
};
