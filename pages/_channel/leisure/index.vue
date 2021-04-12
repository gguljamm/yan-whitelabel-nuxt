<template>
  <Component :is="component"/>
</template>

<script>
const getPost = (slug) => ({
  component: import(`~/components/${slug}/Leisure/Main.vue`).catch(() => import('~/components/MVP/Leisure/Main.vue')),
});

export default {
  beforeCreate() {
    this.component = () => getPost(this.$store.state.channelInfo.compId);
  },
  mounted() {
    this.$store.commit('leisure/setPageStatus', { key: 'list', value: { scrollTop: 0 } });
  },
};
</script>
