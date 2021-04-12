<template>
  <div>
    <Header :arrClass="['home']"></Header>
    <Guest
      @submit="submit"
    ></Guest>
  </div>
</template>

<script>
import Guest from '@/components/MVP/Common/Guest.vue';

export default {
  components: {
    Guest,
  },
  methods: {
    submit(adults, children) {
      const query = { ...this.$route.query };
      query.adults = adults === 2 ? undefined : adults;
      query.children = children === 0 ? undefined : children;
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: query.callBack || '/place/results',
        query: {
          ...query,
          callBack: undefined,
        },
      });
    },
  },
};
</script>

<style lang="scss"></style>
