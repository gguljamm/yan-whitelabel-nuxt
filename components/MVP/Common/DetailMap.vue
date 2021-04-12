<template>
  <div class="tabMap fixWidth">
    <div
      :style="{ height: '100vh', background: '#DDD' }"
      :zoom="18"
      :center="{lat: Number(objLocation.latitude), lng: Number(objLocation.longitude)}"
      :options="{
        zoomControl: true,
        zoomControlOptions: {
          position: 3,
        },
        scaleControl: true,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
      }"
    >
      map disable
      <div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    objLocation: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {

    };
  },
  methods: {},
};
</script>

<style lang="scss"></style>
