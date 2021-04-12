<template>
  <div class="leisureMapWrapper">
    <Header
      :arrClass="['onlyBtn']"
    ></Header>
    <div class="popupMap fixWidth">
      <GmapMap
        ref="mapRef"
        :style="{ height: '100vh' }"
        :zoom="15"
        :center="{lat: Number(mapCenter.lat), lng: Number(mapCenter.lng)}"
        :options="{
          // zoomControl: true, // zoom + - btn
          disableDefaultUI: true,
          gestureHandling: 'greedy',
        }"
        @center_changed="moveCenter"
      ></GmapMap>
      <transition name="fade">
        <div class="btnWrap" v-if="isMoved">
          <button
            @click="search"
          >이 위치에서 재검색</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Header from '@/components/MVP/Common/Header.vue';

export default {
  components: {
    Header,
  },
  data() {
    const mapCenter = {
      lat: 37.4977287,
      lng: 127.0271353,
    };
    return {
      mapCenter,
      isMoved: false,
      location: {
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
      },
    };
  },
  methods: {
    clickBack() {
      if (this.$store.state.history.arrHistory.length > 0) {
        this.$store.commit('history/popHistory');
        this.$router.back();
      } else {
        this.$router.push(this.$route.path.indexOf('leisure') >= 0 ? '/leisure' : '/');
      }
    },
    search() {
      this.isMoved = false;
    },
    moveCenter(e) {
      this.isMoved = true;
      this.location = {
        latitude: e.lat(),
        longitude: e.lng(),
      };
    },
  },
};
</script>

<style lang="scss">
.leisureMapWrapper{
  transition: .3s ease;
  .backBtn{
    z-index: 1;
    position: fixed;
    width: 44px;
    height: $header * 1px;
    top: 0;
    left: 0;
    background-position: center;
    background-size: 24px;
    background-repeat: no-repeat;
    background-image: url(~assets/img/icon-close.svg);
  }
  .btnWrap{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    > button{
      height: 40px;
      position: absolute;
      left: 50%;
      bottom: 30px;
      background-color: #000;
      border-radius: 20px;
      color: #fff;
      font-size: 14px;
      box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);
      transform: translateX(-50%);
      padding: 0 24px 0 36px;
      &:before{
        content: '';
        position: absolute;
        width: 24px;
        height: 24px;
        left: 8px;
        top: 8px;
        background: url(~assets/img/icon-search-white.svg) center center no-repeat;
        background-size: 18px;
      }
    }
  }
}
</style>
