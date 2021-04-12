<template>
  <div class="leisureResultPopup">
    <transition name="rise" mode="out-in">
      <template v-if="init">
        <Map
          v-if="$route.params.popup === 'map'"
          :objLocation="objLocation"
          :type="'leisure'"
          :key="'map'"
          @submit="submit"
          @locationSearch="locationSearch"
        ></Map>
        <CategoryPopup
          v-if="$route.params.popup === 'category'"
          :category="arrCategory"
          @submit="popSubmit"
          :key="'category'"
        ></CategoryPopup>
        <RegionPopup
          v-if="$route.params.popup === 'region'"
          @submit="popSubmit"
          :region="arrRegion"
          :key="'region'"
        ></RegionPopup>
      </template>
    </transition>
  </div>
</template>

<script>
import Map from '@/components/MVP/Common/Map.vue';
import RegionPopup from '@/components/MVP/Leisure/List/Popup/Region.vue';
import CategoryPopup from '@/components/MVP/Leisure/List/Popup/Category.vue';

export default {
  components: {
    Map,
    RegionPopup,
    CategoryPopup,
  },
  props: {
    objLocation: {
      type: Object,
      default: () => {},
    },
    arrCategory: {
      type: Array,
      default: () => [],
    },
    arrRegion: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      init: false,
    };
  },
  methods: {
    setMapMarkerActive(index) {
      this.$emit('setMapMarkerActive', index);
    },
    popSubmit(objParams) {
      this.$emit('popSubmit', objParams);
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
  },
  mounted() {
    this.init = true;
  },
};
</script>

<style scoped>
</style>
