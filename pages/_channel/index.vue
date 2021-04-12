<template>
  <Component :is="component"/>
</template>

<script>
const getPost = (slug) => ({
  component: import(`~/components/${slug}/Main.vue`).catch(() => import('~/components/MVP/Main.vue')),
});

export default {
  beforeCreate() {
    this.component = () => getPost(this.$store.state.channelInfo.compId);
  },
};
</script>
