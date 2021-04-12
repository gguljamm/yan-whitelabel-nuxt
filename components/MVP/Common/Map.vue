<template>
  <div class="popupMapWrapper">
    <Header
      :arrClass="['onlyBtn']"
    ></Header>
    <div class="popupMap fixWidth" v-if="init">
      <div
        ref="mapRef"
        :style="{ height: '100vh', backgroundColor: '#DDD' }"
        :zoom="15"
        :center="{lat: Number(mapCenter.latitude), lng: Number(mapCenter.longitude)}"
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
        @center_changed="moveCenter"
      >
        disable map
        <div v-if="locationList && locationList.length > 0">
        </div>
      </div>
      <transition name="fade">
        <div class="btnWrap" v-show="activeSearch">
          <button
            v-if="!loading"
            @click="search()"
          >현위치 검색</button>
          <div v-else class="spinnerLoading"><div></div></div>
        </div>
      </transition>
      <transition name="fade">
        <div class="selectedPlaceBox" v-show="true">
          <div class="fixWidth">
            <div
              v-swiper:detailSwiper="swiperOptions"
              @slideChange="swiperChange"
              ref="mapSwiper"
            >
              <div class="swiper-wrapper">
                <div class="swiper-slide"
                  v-for="(x, index) in locationList"
                  :key="index"
                  @click="submit(index)"
                >
                  <div class="listItem">
                    <div class="mainImage" :style="{ backgroundImage: `url(${x.info.image})` }"></div>
                    <div class="infoWrap">
                      <div class="category">{{ categoryMap[x.info.category] || x.info.category }}</div>
                      <div class="name">{{ x.info.name }}</div>
                      <div v-if="x.info.rating && x.info.review" class="ratingWrapper">
                        <div class="rating">
                          <strong>{{ x.info.rating }}</strong><span class="review">({{ x.info.review }})</span>
                        </div>
                      </div>
                      <div class="priceWrap">
                        <div v-if="x.info.originPrice && x.info.salePrice && x.info.originPrice !== x.info.salePrice" class="originPrice">
                          <del>{{ $format.numberFormat(x.info.originPrice) }}원</del>
                        </div>
                        <div class="salePrice">
                          <div class="discountPercent" v-show="x.info.originPrice && x.info.salePrice && x.info.originPrice !== x.info.salePrice">{{ Math.ceil(((x.info.originPrice - (x.info.salePrice || 0)) / x.info.originPrice * 100)) }}<span>%</span></div>
                          <div class="val">{{ x.info.originPrice ? `${$format.numberFormat(x.info.salePrice || x.info.originPrice || 0)}원` : '예약마감' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'place',
    },
    objLocation: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const pos = this.objLocation.list[0] && this.objLocation.list[0].position;
    const center = {
      lat: pos && pos.lat ? pos.lat : 37.4977287,
      lng: pos && pos.lng ? pos.lng : 127.0271353,
    };
    if (this.$route.query.lat && this.$route.query.lng) {
      center.lat = this.$route.query.lat;
      center.lng = this.$route.query.lng;
    }
    return {
      locationList: this.objLocation.list ? JSON.parse(JSON.stringify([...this.objLocation.list])) : [],
      activeSearch: false,
      lastCenter: {
        latitude: center.lat,
        longitude: center.lng,
      },
      mapCenter: {
        latitude: center.lat,
        longitude: center.lng,
      },
      categoryMap: {
        PENSION: '펜션',
        MOTEL: '중저가 숙소',
        HOTEL: '호텔',
        GUESTHOUSE: '게스트하우스',
      },
      loading: false,
      hideBlock: false,
      swiperOptions: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 12,
      },
      init: false,
    };
  },
  methods: {
    submit(index) {
      this.$store.commit('map/saveMarkerList', this.locationList);
      const { info } = this.locationList[index];
      this.$emit('submit', info.id);
    },
    search() {
      if (this.objLocation.status === 'loading') {
        return;
      }
      this.activeSearch = false;
      this.$emit('locationSearch', this.lastCenter);
    },
    moveCenter(e) {
      this.lastCenter = {
        longitude: e.lng(),
        latitude: e.lat(),
      };
      if (!this.hideBlock) {
        this.clearMarkerActive();
        this.activeSearch = true;
      } else {
        this.hideBlock = false;
      }
    },
    swiperChange() {
      const index = this.$refs.mapSwiper.swiper.activeIndex;
      if (this.objLocation.list[index]) {
        this.hideBlock = true;
        // this.$refs.mapRef.$mapPromise.then((map) => {
        //   map.panTo(this.objLocation.list[index].position);
        // });
        this.clearMarkerActive();
        this.locationList[index].active = true;
      }
    },
    clickMarker(index) {
      if (this.$refs.mapSwiper.swiper.activeIndex === index) {
        this.hideBlock = true;
        this.$refs.mapRef.$mapPromise.then((map) => {
          map.panTo(this.objLocation.list[index].position);
        });
        this.clearMarkerActive();
        this.changeSelectedIndex(index);
      } else {
        this.$refs.mapSwiper.swiper.slideTo(index, 0);
      }
    },
    changeSelectedIndex(index) {
      this.locationList[index].active = !this.locationList[index].active;
    },
    clearMarkerActive() {
      this.locationList = this.locationList.map((obj) => ({ ...obj, active: false }));
    },
    svg(data) {
      const { category, originPrice, salePrice } = data.info;
      const priceData = salePrice || originPrice;
      const price = priceData ? `${priceData.toLocaleString()}원` : '예약마감 ';
      const priceLeng = priceData ? `${priceData.toString()}원` : '예약마감 ';
      let moreLongText = this.type === 'place' ? this.categoryMap[category] : category;
      let fontSize = 8;
      if (priceLeng.length * 14 > moreLongText.length * 8) {
        moreLongText = priceLeng;
        fontSize = 14;
      }
      const length = (moreLongText.length * fontSize) + 20;
      const backgroundColor = data.active ? '#000' : '#fff';
      const PfontColor = data.active ? '#fff' : '#000';
      const code = `
        <svg width="${length + 16}" height="56" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));" xmlns="http://www.w3.org/2000/svg">
          <g>
            <rect x="8" y="4" width="${length}" height="48" rx="24" ry="24" fill="${backgroundColor}" />
            <text fill="${PfontColor}" style="font-family: Arial, sans-serif;" x="0" y="50%">
              <tspan x="24px" text-anchor="start" dy="-5" font-size="10px">${this.type === 'place' ? this.categoryMap[category] : category}</tspan>
              <tspan x="24px" text-anchor="start" dy="17" font-size="16px" font-weight="900">${price}</tspan>
            </text>
          </g>
        </svg>`;
      return {
        url: `data:image/svg+xml,${encodeURIComponent(code)}`,
        size: { width: length + 16, height: 56 },
        scaledSize: { width: length + 16, height: 56 },
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
      this.$store.watch(() => (this.$store.state.map.objMapMarker.list), (arrMarker) => {
        this.locationList = JSON.parse(JSON.stringify(arrMarker));
      });
      if (this.locationList.find((v) => v.active)) {
        const index = this.objLocation.list.map((obj) => obj.active).indexOf(true);
        const interval = setInterval(() => {
          if (this.$refs.mapSwiper) {
            this.clickMarker(index);
            clearInterval(interval);
          }
        }, 100);
      }
    });
  },
};
</script>

<style lang="scss">
  .popupMapWrapper{
    .btnWrap{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      > button{
        position: absolute;
        left: 50%;
        bottom: 30px;
        background-color: #000;
        border-radius: 20px;
        color: #fff;
        font-size: 14px;
        box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);
        transform: translateX(-50%);
        padding: 12px 14px 12px 38px;
        &:before{
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          left: 14px;
          top: 10px;
          background: url(~assets/img/icon-refresh-white.svg) center center no-repeat;
          background-size: 18px;
        }
      }
      .spinnerLoading{
        padding-bottom: 40px;
        > div{
          margin: 0 auto;
          width: 24px;
          background: url(~assets/img/loading.svg) center center no-repeat;
          background-size: 24px;
          height: 24px;
          animation: rotate 2s linear infinite;
        }
      }
    }
    .selectedPlaceBox{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 20px 0;
      .swiper-wrapper{
        .swiper-slide{
          height: 108px;
          width: calc(100vw - 48px);
          max-width: 720px;
          .listItem{
            width: 100%;
            height: 108px;
            background-color: #FFF;
            cursor: pointer;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 4px 2px rgba(0,0,0,.1);
            .mainImage{
              position: absolute;
              left: 0;
              top: 0;
              height: 108px;
              width: 108px;
              background-size: cover;
              background-position: center center;
              background-repeat: no-repeat;
            }
            .infoWrap{
              padding-left: 122px;
              padding-top: 12px;
              position: relative;
              height: 108px;
              padding-right: 14px;
              .category{
                font-size: 13px;
                color: #868686;
                font-weight: bold;
                line-height: 16px;
              }
              .name{
                font-size: 14px;
                margin-top: 4px;
                line-height: 17px;
                font-weight: bold;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              .ratingWrapper{
                line-height: 18px;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                &::before{
                  content: '';
                  display: inline-block;
                  height: 14px;
                  width: 14px;
                  background: url(~assets/img/star.svg) center center no-repeat;
                  background-size: 14px;
                }
                .rating{
                  font-size: 11px;
                  line-height: 18px;
                  margin-left: 2px;
                  strong{
                    color: #000;
                  }
                  .review{
                    color: #939499;
                  }
                }
              }
              .priceWrap{
                position: absolute;
                bottom: 12px;
                right: 14px;
                text-align: right;
                .originPrice{
                  padding-top: 2px;
                  color: #868686;
                  font-size: 10px;
                  line-height: 12px;
                  del{
                    text-decoration: line-through;
                  }
                }
                .salePrice{
                  margin-top: 3px;
                  line-height: 14px;
                  font-size: 0;
                  .discountPercent{
                    color: #d0021b;
                    margin-right: 4px;
                    font-size: 16px;
                    display: inline-block;
                    > span{
                      font-size: 12px;
                    }
                  }
                  .val{
                    font-weight: bold;
                    font-size: 16px;
                    display: inline-block;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
