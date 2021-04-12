<template>
  <errorComp
    :error="{ statusCode: 404 }"
  ></errorComp>
</template>

<script>
import errorComp from '~/layouts/error.vue';

export default {
  components: {
    errorComp,
  },
};
</script>
