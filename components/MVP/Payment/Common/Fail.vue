<template>
  <div class="completeFail">
    <div class="pageTitle" v-html="message"></div>
    <div class="pageSub">
      <template v-if="$route.query.errorMessage">{{ decodeURIComponent($route.query.errorMessage) }} </template>
      <template v-if="$route.query.detailMessage">{{ decodeURIComponent($route.query.detailMessage) }}</template>
    </div>
    <global-button
      :text="'확인'"
      @submit="submit"
    ></global-button>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'place',
    },
    message: {
      type: String,
      default: '잘못된 접근입니다.',
    },
  },
  data() {
    return {
    };
  },
  methods: {
    submit() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(this.type === 'place' ? '/' : '/leisure');
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
  .completeFail{
    background-color: #FFF;
    min-height: calc(100vh - #{$header * 1px});
    .pageTitle{
      padding: 20px $sidePadding * 1px;
      line-height: 34px;
      font-size: 24px;
      font-weight: bold;
    }
    .pageSub{
      padding: 0 $sidePadding * 1px;
      font-size: 12px;
      line-height: 18px;
    }
  }
</style>
