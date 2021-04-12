<template>
  <div class="fixWidth">
    <nuxt-child
      :loading="loading"
      @changeLoading="changeLoading"
    ></nuxt-child>
    <Loading v-if="loading"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/MVP/Common/Loading.vue';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    changeLoading(isLoading) {
      this.loading = isLoading;
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
</style>
