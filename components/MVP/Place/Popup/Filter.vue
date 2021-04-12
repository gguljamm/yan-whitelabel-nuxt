<template>
  <div class="popupFilterWrapper">
    <Header
      :arrClass="['home', 'popup']"
    ></Header>
    <div class="popupFilter fixWidth" v-if="init">
      <div class="pageTitle">필터</div>
      <p>편의시설<span v-if="arrSelectedAmenity.length > 0">{{ arrSelectedAmenity.length }}개 선택</span></p>
      <div class="swiper" v-swiper="!$device.isMobile ? swiperOptions : swiperOptionsMobile"
        :class="$device.isMobile ? 'mobile' : 'web'"
      >
        <ul class="swiper-wrapper">
          <li class="swiper-slide"
            v-for="i in 6"
            :key="i"
            :style="{ width: $device.isMobile ? `${Object.keys(objAmenity).splice((i - 1) * 16, 16).length * 35}px` : '100%' }"
          >
            <button
              class="btnAmenity"
              :class="arrSelectedAmenity.indexOf(x) >= 0 ? 'selected' : ''"
              v-for="x in Object.keys(objAmenity).splice((i - 1) * 16, 16)"
              :key="x"
              @click="clickAmenity(x)"
            ><div
              :style="{
                backgroundImage: `url(${require(`~/assets/img/filter_amenity_selected/${objAmenity[x]}.png`)})`
              }"
            ></div>
            {{ objAmenity[x] }}</button>
          </li>
        </ul>
        <div v-if="!$device.isMobile" class="swiper-button-prev-cust" slot="button-prev"></div>
        <div v-if="!$device.isMobile" class="swiper-button-next-cust" slot="button-next"></div>
      </div>
      <p>가격</p>
      <div class="priceSlider">
        <vue-slider
          v-model="values"
          :min="0"
          :max="500000"
          :interval="10000"
          :dotSize="24"
          :style="{
            padding: 12,
          }"
          :tooltip-formatter="val => val === 0 ? '제한 없음' : val === 500000 ? '제한 없음' : `${val/10000}만원`"
          :dotStyle="{
            backgroundColor: '#FFF',
            border: '1px solid #000',
          }"
          :railStyle="{
            backgroundColor: '#ebecf1',
          }"
          :processStyle="{
            backgroundColor: '#000',
          }"
        ></vue-slider>
        <div class="priceText">
          <span>{{ values[0] === 0 ? '제한 없음' : `${values[0] / 10000}만원` }}</span>
          <span>{{ values[1] === 500000 ? '제한 없음' : `${values[1] / 10000}만원` }}</span>
        </div>
      </div>
      <global-button
        @submit="submit"
        :text="'적용'"
      ></global-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    objFilter: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const objAmenity = {
      ACTIVITY: '체험',
      AIR_BUS: '공항셔틀',
      AMENITY: '어메니티',
      BAGGAGE: '수화물보관',
      BANQUET: '연회장',
      BAR: '바',
      BASIC_SAUCE: '기본양념',
      BATH_TV: '욕실TV',
      BBQ: '바베큐',
      BEACH: '해수욕장인근',
      BICYCLE: '자전거대여',
      BREAKFAST: '조식운영',
      BUFFET: '뷔페',
      BUSINESS: '비즈니스',
      CAFE_ROOM: '카페형룸',
      COFFEE_SHOP: '커피숍',
      COUPLE_PC: '커플PC',
      COUPLE_ROOM: '커플룸',
      DEST24HOUR: '24시간데스크',
      DINING_ROOM: '다이닝룸',
      DUPLEX: '복층구조',
      EVENT: '이벤트가능',
      FEMAIL_ONLY: '여성전용',
      FIRE_PLACE: '벽난로',
      FITNESS: '피트니스',
      FRANCHISE: '프랜차이즈',
      FREE_LAUNDRY: '무료세탁',
      FREE_MOVIE: '무료영화',
      GAME: '게임',
      GRAMPING: '글램핑',
      GROUND: '운동장',
      HANOK: '한옥',
      HINOKI: '히노끼탕',
      INDE_BBQ: '개별바베큐',
      JJIMJJIL: '찜질방',
      JOKGU: '족구장',
      KARAOKE: '노래방',
      KITCHEN: '주방',
      LAPTOP_RENT: '노트북대여',
      MASSAGE_BED: '마사지베드',
      MASSAGE_CHAIR: '안마의자',
      MEAL: '식사가능',
      MEDICINE: '상비약',
      MINI_BAR: '미니바',
      MIRROR: '거울룸',
      NIGHT_ROOM: '나이트룸',
      NO_MAN: '무인텔',
      NO_SMOKING: '객실금연',
      OCEAN_VIEW: '바다전망',
      OPEN_AIR_BATH: '노천탕',
      OUTSIDE_POOL: '야외수영장',
      PAID_LAUNDRY: '유료세탁',
      PARKING: '주차가능',
      PARTY: '파티가능',
      PARTY_ROOM: '파티룸',
      PC_LOUNGE: 'PC라운지',
      PC_ROOM: '객실내PC',
      PET: '동물입실',
      PICK_UP: '픽업가능',
      POOL: '수영장',
      PRINCESS_ROOM: '공주룸',
      PROJECTOR: '프로젝터',
      PROPOSE: '프로포즈',
      PUB_KITCHEN: '공용주방',
      PUB_LIVING_ROOM: '공용거실',
      RENT: '대여',
      RESTAURANT: '레스토랑',
      // ROOF_TOP: '루프탑',
      SALAD_BAR: '샐러드바',
      SAUNA: '사우나',
      SEMINAR: '세미나실',
      SINGLE_CABIN: '독채객실',
      SINGLE_PENSION: '독채펜션',
      SMOKING: '흡연구역',
      SNACK_BAR: '스낵바',
      SPA: '스파',
      STORE: '매점',
      STUDIO: '촬영장소',
      TERRACE: '야외테라스',
      THREE_D_TV: '3DTV',
      TOMITORY: '도미토리',
      TOUR: '투어',
      TWIN_BED: '트윈베드',
      VALLEY: '계곡인접',
      VOD: 'VOD',
      WATER_SLIDE: '워터슬라이드',
      WIFI: '와이파이',
    };
    return {
      arrSelectedAmenity: [].concat(this.objFilter.amenities),
      swiperOptions: {
        navigation: {
          nextEl: '.swiper-button-next-cust',
          prevEl: '.swiper-button-prev-cust',
        },
        slidesPerView: 1,
        spaceBetween: 40,
      },
      swiperOptionsMobile: {
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true,
      },
      objAmenity,
      init: false,
      values: [this.objFilter.priceFrom || 0, this.objFilter.priceTo || 500000],
    };
  },
  methods: {
    submit() {
      this.$emit('changeFilter', {
        amenities: this.arrSelectedAmenity,
        priceFrom: this.values[0] === 0 ? undefined : this.values[0],
        priceTo: this.values[1] === 500000 ? undefined : this.values[1],
      });
    },
    clickAmenity(id) {
      const idx = this.arrSelectedAmenity.indexOf(id);
      if (idx >= 0) {
        this.arrSelectedAmenity.splice(idx, 1);
      } else {
        this.arrSelectedAmenity.push(id);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.init = true;
    }, 300);
  },
};
</script>

<style lang="scss">
  .popupFilterWrapper{
    overflow-x: hidden;
    .pageTitle{
      font-size: 23px;
      line-height: 30px;
      font-weight: bold;
      padding: 20px $sidePadding * 1px;
    }
    .popupFilter{
      background-color: #FFF;
      height: calc(100vh - (#{ $header } * 1px));
      .swiper-container{
        &:before{
          content: '';
          width: 44px;
          height: 100%;
          background-image: linear-gradient(to left, rgba(255, 255, 255, 0), #FFF);
          position: absolute;
          left: 0;
          top: 0;
          z-index: 5;
          pointer-events: none;
        }
        &:after{
          content: '';
          width: 44px;
          height: 100%;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #FFF);
          position: absolute;
          right: 0;
          top: 0;
          z-index: 5;
          pointer-events: none;
        }
      }
      > p{
        padding: 20px;
        font-size: 16px;
        font-weight: bold;
        > span{
          font-weight: normal;
          font-size: 13px;
          float: right;
        }
      }
      .swiper.web{
        padding: 0 40px;
        .btnAmenity{
          width: 12.5%;
        }
      }
      .swiper.mobile{
        padding-left: 20px;
        .swiper-slide{
          &:last-of-type{
            margin-right: 20px;
          }
          .btnAmenity{
            width: 70px;
            font-size: 12px;
          }
        }
      }
      .btnAmenity{
        font-size: 13px;
        margin-bottom: 20px;
        opacity: .3;
        transition: .2s opacity ease;
        line-height: 20px;
        white-space: nowrap;
        &.selected{
          color: #000;
          opacity: 1;
        }
        > div{
          display: block;
          width: 40px;
          height: 29px;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center center;
          margin: 0 auto 9px;
        }
      }
      .priceSlider{
        padding: 0 $sidePadding * 1px;
        .vue-slider{
          padding: 12px
        }
        .priceText{
          padding-top: 10px;
          font-size: 14px;
          > span:nth-of-type(2){
            float: right;
          }
        }
      }
    }
  }
</style>

<style>
.swiper-button-next-cust, .swiper-button-prev-cust{
  width: 40px;
  height: 40px;
  background-color: #FFF;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #ebecf1;
  z-index: 10;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 20px;
}
.swiper-button-next-cust{
  right: 4px;
  background-image: url(~assets/img/icon-chevron-right.svg);
}
.swiper-button-prev-cust{
  left: 4px;
  background-image: url(~assets/img/icon-chevron-left.svg);
}
</style>
