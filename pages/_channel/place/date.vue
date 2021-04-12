<template>
  <div>
    <Header
      :arrClass="['search']"
    ></Header>
    <Calendar
      :type="'place'"
      @submit="submit"
    ></Calendar>
  </div>
</template>

<script>
import Calendar from '@/components/MVP/Common/Calendar.vue';

export default {
  components: {
    Calendar,
  },
  methods: {
    submit(checkin, checkout) {
      const query = { ...this.$route.query };
      query.checkin = checkin;
      query.checkout = checkout;
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      if (this.$route.query.placeType === 'PLACE_NAME') {
        this.$store.commit('place/setPageStatus', { key: 'detail', value: { scrollTop: 0, tab: 0 } });
        this.$router.push({
          path: `/place/result/${query.locationId}`,
          query: {
            checkin: query.checkin,
            checkout: query.checkout,
            adults: query.adults,
            children: query.children,
          },
        });
      } else {
        if (query.callBack && query.callBack.indexOf('/place/result') >= 0) {
          this.$store.commit('place/setPageStatus', { key: 'detail', value: { scrollTop: 0, tab: 0 } });
        } else if (!query.callBack) {
          this.$store.commit('place/setPageStatus', { key: 'list', value: { scrollTop: 0 } });
        }
        this.$store.commit('history/pushHistory', this.$route.fullPath);
        this.$router.push({
          path: query.callBack || '/place/results',
          query: {
            ...query,
            placeType: undefined,
            callBack: undefined,
            consecutive: undefined,
            category: query.callBack && query.callBack.indexOf('/place/result/') >= 0 ? undefined : query.category,
            keyword: query.callBack ? undefined : query.keyword,
          },
        });
      }
    },
  },
};
</script>

<style lang="scss"></style>
