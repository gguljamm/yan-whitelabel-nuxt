<template>
  <Category
    @submit="popSubmit"
  ></Category>
</template>

<script>
import Category from '@/components/MVP/Leisure/List/Popup/Category.vue';

export default {
  components: {
    Category,
  },
  methods: {
    popSubmit(objParams) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: '/leisure/results',
        query: {
          ...this.$route.query,
          ...objParams,
        },
      });
    },
  },
};
</script>

<style scoped>
</style>
