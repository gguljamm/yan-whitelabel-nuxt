<template>
  <Component :is="component"/>
</template>

<script>
const getPost = (slug) => ({
  component: import(`~/components/${slug}/Event/Main.vue`).catch(() => import('~/components/MVP/Event/Main.vue')),
});

export default {
  beforeCreate() {
    this.component = () => getPost(this.$store.state.channelInfo.compId);
  },
};
</script>
