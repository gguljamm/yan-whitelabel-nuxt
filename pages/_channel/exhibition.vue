<template>
  <exhibition-content
    :key="$route.fullPath"
  ></exhibition-content>
</template>
<script>
import ExhibitionContent from '~/components/MVP/Exhibition/ExhibitionContent.vue';

export default {
  components: { ExhibitionContent },
};
</script>
