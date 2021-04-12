<template>
  <div>
    <transition name="rise">
      <div v-show="init">
        <list-filter
          v-if="$route.params.popup === 'filter'"
          :arrPlace="arrPlace"
          :params="params"
          :objFilter="objFilter"
          @changeFilter="changeFilter"
        ></list-filter>
        <list-map
          v-else-if="$route.params.popup === 'map'"
          :objLocation="objLocation"
          :type="'place'"
          @setMapMarkerActive="setMapMarkerActive"
          @clearMapMarker="clearMapMarker"
          @submit="submit"
          @locationSearch="locationSearch"
        ></list-map>
      </div>
    </transition>
    <Sort
      v-if="$route.params.popup === 'sort'"
      :sort="sort"
      @changeSort="changeSort"
    ></Sort>
  </div>
</template>

<script>
import ListFilter from '@/components/MVP/Place/Popup/Filter.vue';
import Sort from '@/components/MVP/Place/Popup/Sort.vue';
import ListMap from '@/components/MVP/Common/Map.vue';

export default {
  // props: ['arrPlace', 'params'],
  props: {
    arrPlace: {
      type: Array,
      default: () => [],
    },
    objLocation: {
      type: Object,
      default: () => {},
    },
    params: {
      type: Object,
      default: () => {},
    },
    sort: {
      type: String,
      default: 'RECOMMENDATION',
    },
    objFilter: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ListFilter,
    ListMap,
    Sort,
  },
  data() {
    return {
      init: false,
    };
  },
  methods: {
    changeSort(cond) {
      this.$emit('changeSort', cond);
    },
    setMapMarkerActive(index) {
      this.$emit('setMapMarkerActive', index);
    },
    clearMapMarker() {
      this.$emit('clearMapMarker');
    },
    locationSearch(center) {
      this.$emit('locationSearch', center);
    },
    submit(id) {
      this.$emit('submit', id);
    },
    changeFilter(filter) {
      this.$emit('changeFilter', filter);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
    });
  },
};
</script>
