<template>
  <div class="tabHome">
    <div class="infoArticle article">
      <div class="detailCategory">
        <span v-if="place.category !== 'HOTEL'">{{ categoryMap[place.category.toUpperCase()] }}</span>
        <span>{{ place.themes && place.themes[0] && hotelThemeMap[place.themes[0]] ? hotelThemeMap[place.themes[0]] : '호텔' }}</span>
        <span v-show="place.star && place.star.rating">| {{ place.star ? place.star.rating : '' }}성급</span>
      </div>
      <div class="detailName">{{ place.korName }}</div>
      <div class="detailDirection">
        <div>{{ place.location }}</div>
        <div v-if="objPlace.review" class="review" @click="scrollTo('reviewArticle')">
          <div></div>
          <div>{{ getReviewInfo('totalRating') }}점</div>
          <div>(후기 {{ $format.numberFormat(objPlace.review.total) }})</div>
        </div>
      </div>
      <Price
        :priceInfo="{
          coverPrice: minPriceRoom ? minPriceRoom.price : 0,
          discountPrice: minPriceRoom ? minPriceRoom.discountPrice : 0,
          status: '',
        }"
        :discount="$format.optimizedDiscountPrice(minPriceRoom ? (minPriceRoom.discountPrice || minPriceRoom.price) : 0, $store.state.channelInfo.discount.place) || {}"
      ></Price>
      <div class="noticeWrap" v-if="arrNotice('EVENT').length > 0">
        <div @click="openPopup('event')">
          <ul
            :style="{ transform: `translateY(-${eventNoticeIndex * 38}px)` }"
          >
            <li v-for="x in arrNotice('EVENT')" :key="x.no">
              {{ x.contents || x.title }}
            </li>
          </ul>
        </div>
      </div>
      <div class="blank" v-else></div>
    </div>
    <div class="positionArticle article">
      <div class="address">
        <div>{{ place.address }}</div>
      </div>
      <div
        v-if="imgWidth"
        class="detailMap"
      >
        <img alt="google_map" class="detailMap" :src="`https://maps.googleapis.com/maps/api/staticmap?center=${place.latitude},${place.longitude}&zoom=15&size=${imgWidth}x${parseInt(imgWidth * 0.3, 10)}&maptype=roadmap&key=AIzaSyB6o8nbr-hhHtv94YeM6i583FAYNo0E5oI`"
          :style="{
            height: `${parseInt((imgWidth * 108) / 375, 10)}px`
          }"
          @click="openPopup('detailMap')"
        >
      </div>
    </div>
    <div class="roomArticle article">
      <Room
        :type="'home'"
        :params="params"
        :objPlace="objPlace"
        @clickRoomMore="clickRoomMore"
        @submit="submit"
        @openSearch="clickBtn"
      ></Room>
    </div>
    <div class="amenityArticle article" v-if="place.amenities && arrNotice('CUSTOMER_BENEFITS').length > 0">
      <p>편의시설</p>
      <div v-swiper="options" class="amenityBox" v-if="place.amenities">
        <ul class="swiper-wrapper">
          <li
            class="swiper-slide"
            v-for="(x, index) in place.amenities"
            :key="index"
          >
            <div
              :style="{ backgroundImage: `url(${getImage(x.comment)})` }"
            ></div>
            <div>{{ x.comment }}</div>
          </li>
        </ul>
      </div>
      <ul class="benefit" v-if="arrNotice('CUSTOMER_BENEFITS').length > 0">
        <li v-for="(x, index) in arrNotice('CUSTOMER_BENEFITS')" :key="index">
          <div v-html="x.contents ? x.contents.replace(/\n/g, '<br>') : x.title"></div>
        </li>
      </ul>
    </div>
    <div class="descriptionArticle article" v-if="objPlace.place.description || objPlace.place.introduction || arrNotice('GREETING').length > 0">
      <p>숙소소개</p>
      <ul>
        <li v-if="objPlace.place.description"><div v-html="objPlace.place.description.replace(/\n/g, '<br>')"></div></li>
        <li v-if="objPlace.place.introduction"><div v-html="objPlace.place.introduction.replace(/\n/g, '<br>')"></div></li>
        <li v-for="(x, index) in arrNotice('GREETING')" :key="index">
          <div v-html="x.contents ? x.contents.replace(/\n/g, '<br>') : x.title"></div>
        </li>
      </ul>
    </div>
    <div class="descriptionArticle article" v-if="arrNotice('RESERVATION').length > 0">
      <p>이용안내</p>
      <ul class="usage">
        <li v-for="(x, index) in arrNotice('RESERVATION')" :key="index">
          <div v-html="x.contents ? x.contents.replace(/\n/g, '<br>') : x.title"></div>
        </li>
      </ul>
    </div>
    <div class="cancelArticle article">
      <div class="contents">
        <p>취소 및 환불정책</p>
        <ul>
          <li>{{ getFreeCancelDate }}</li>
          <li>상세한 취소 규정은 '자세히 보기'에서 확인하실 수 있습니다.</li>
        </ul>
      </div>
      <div class="btnWrap">
        <button @click="openPopup('cancel')">자세히 보기</button>
      </div>
    </div>
    <div class="reviewArticle article" v-if="objPlace.review" ref="reviewArticle">
      <div>
        <review-content
          :objPlace="objPlace"
          :type="'summary'"
        ></review-content>
      </div>
      <div class="btnWrap">
        <button
          v-if="objPlace.review.total > 3"
          @click="openPopup('review')"
        >리뷰 {{ objPlace.review.total }}개 모두 보기</button>
      </div>
    </div>
    <div class="etcArticle article">
      <button
        v-if="objPlace.place.phone && objPlace.place.phone.length > 0"
        class="clickable"
        @click="openPopup('seller')"
      >판매자 정보</button>
    </div>
    <div class="helpArticle">
      <div>고객센터</div>
      <div>1644-1346</div>
      <div>연중무휴 09:00~익일 03:00</div>
      <a href="http://plus.kakao.com/home/@야놀자고객센터" target="_blank">1:1 채팅상담</a>
    </div>
    <global-button
      :text="'객실 선택'"
      :disabled="!minPriceRoom"
      @submit="minPriceRoom ? clickRoomBtn() : ''"
    ></global-button>
  </div>
</template>

<script>
import ReviewContent from './ReviewContent.vue';
import Room from './Room.vue';
import Price from '~/components/MVP/Common/Price.vue';

export default {
  components: {
    Room,
    ReviewContent,
    Price,
  },
  props: ['objPlace', 'params', 'imgHeight'],
  data() {
    return {
      categoryMap: {
        PENSION: '펜션',
        MOTEL: '중저가 숙소',
        HOTEL: '호텔',
        GUESTHOUSE: '게스트하우스',
      },
      hotelThemeMap: {
        family: '가족호텔',
        resort: '리조트',
        business: '비즈니스',
        residence: '레지던스',
        condo: '콘도',
      },
      imgWidth: (window.outerWidth > 768 ? 768 : window.outerWidth) || 768,
      eventNoticeIndex: 0,
      interval: null,
      options: {
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 5,
      },
    };
  },
  computed: {
    arrRoom() {
      if (this.place.rooms) {
        let arr = [];
        arr = arr.concat(this.place.rooms.filter((z) => z.price).sort((a, b) => a.discountPrice - b.discountPrice));
        arr = arr.concat(this.place.rooms.filter((z) => !z.price));
        return arr;
      }
      return [];
    },
    minPriceRoom() {
      let min = null;
      for (let x = 0; x < this.arrRoom.length; x += 1) {
        if ((!min && this.arrRoom[x].discountPrice)
          || (this.arrRoom[x].discountPrice && min.discountPrice > this.arrRoom[x].discountPrice)) {
          min = this.arrRoom[x];
        }
      }
      return min;
    },
    place() {
      return this.objPlace.place;
    },
    getFreeCancelDate() {
      if (!this.place.cancelPolicies) {
        return '취소 및 환불 불가';
      }
      const val = this.place.cancelPolicies.find((v) => v.cancelPenaltyPercent === 0);
      let text = '무료 취소 및 무료 환불 불가';
      if (val) {
        const d = new Date(this.params.checkin);
        d.setDate(d.getDate() - val.day);
        d.setHours(val.hour);
        text = `${this.$format.ymdDate(d)} ${this.$format.zeros(d.getHours())}:00:00 까지 무료 취소 가능`;
        if (d.getTime() < new Date().getTime()) {
          text = '무료 취소 및 무료 환불 불가';
        }
      }
      return text;
    },
  },
  methods: {
    arrNotice(flag) {
      return this.place.notices ? this.place.notices.filter((v) => v.noticeType === flag) : [];
    },
    getImage(text) {
      try {
        return require(`~/assets/img/filter_amenity_selected/${text.split('/')[0]}.png`); // eslint-disable-line
      } catch (e) {
        return require(`~/assets/img/filter_amenity_selected/어메니티.png`); // eslint-disable-line
      }
    },
    getReviewInfo(flag) {
      return (this.objPlace.review.reviews.reduce((total, x) => total + x[flag], 0) / this.objPlace.review.reviews.length).toFixed(1);
    },
    submit(roomNo) {
      this.$emit('submit', roomNo);
    },
    onCopy() {
      this.$store.commit('openNotice', { text: '클립보드에 복사되었습니다.' });
    },
    openPopup(flag) {
      this.$emit('openPopup', flag);
    },
    clickBtn(flag) {
      this.$emit('openSearch', flag);
    },
    clickRoomBtn() {
      this.$emit('changeTab', 1);
    },
    clickRoomMore() {
      this.$emit('changeTab', 1);
    },
    scrollTo(target) {
      if (this.$refs[target]) {
        const p = this.$refs[target].getBoundingClientRect();
        const header = document.getElementsByClassName('gnbWrapper')[0].children[0].offsetHeight;
        window.scrollTo(0, p.top + (window.pageYOffset || document.documentElement.scrollTop) - header - 44);
      }
    },
  },
  mounted() {
    if (this.arrNotice('EVENT').length > 2) {
      this.interval = setInterval(() => {
        if (this.eventNoticeIndex + 1 >= this.arrNotice('EVENT').length) {
          this.eventNoticeIndex = 0;
        } else {
          this.eventNoticeIndex += 1;
        }
      }, 3000);
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
};
</script>

<style lang="scss">
  .tabHome{
    background-color: #f8f9fb;
    min-height: calc(100vh - #{ $header * 1px });
    font-size: 12px;
    > .article{
      background-color: #FFF;
    }
    p{
      padding: 24px 0 10px;
      font-size: 14px;
      font-weight: bold;
      line-height: 16px;
      &.clickable{
        cursor: pointer;
        position: relative;
        &:after{
          content: '';
          position: absolute;
          background: url(~assets/img/icon-chevron-right.svg) center center no-repeat;
          background-size: 22px;
          right: 0;
          width: 22px;
          height: 22px;
          top: 12px;
        }
      }
    }
    .article{
      margin-bottom: 10px;
      &.reviewArticle{
        margin-bottom: 10px;
      }
      .btnWrap{
        background-color: #FFF;
        width: 100%;
        padding: 20px $sidePadding * 1px;
        border-bottom: 1px solid #ebecf1;
        > button{
          width: 100%;
          height: 46px;
          border-radius: 4px;
          border: 1px solid #000;
          font-size: 13px;
        }
      }
    }
    .infoArticle{
      padding: 12px $sidePadding * 1px 0;
      .detailCategory{
        line-height: 17px;
        font-size: 11px;
        font-weight: bold;
        color: #939499;
      }
      .detailName{
        line-height: 22px;
        font-size: 16px;
        font-weight: bold;
      }
      .detailDirection{
        margin-top: 4px;
        font-size: 11px;
        line-height: 18px;
        padding-bottom: 10px;
        > div{
          float: left;
        }
        .review{
          cursor: pointer;
          > div{
            float: left;
          }
          > div:nth-of-type(1){
            width: 14px;
            height: 14px;
            background: url(~assets/img/star.svg) center center no-repeat;
            background-size: 14px;
            margin-right: 2px;
            margin-left: 8px;
            margin-top: 2px;
          }
          > div:nth-of-type(2){
            font-size: 11px;
            font-weight: bold;
            line-height: 18px;
          }
          > div:nth-of-type(3){
            font-size: 11px;
            color: #939499;
            line-height: 18px;
          }
        }
        &:after{
          content: '';
          display: block;
          clear: both;
        }
      }
      .blank{
        padding-bottom: 20px;
      }
      .noticeWrap{
        margin-top: 12px;
        border-top: 1px solid #ebecf1;
        > div{
          height: 38px;
          line-height: 38px;
          overflow: hidden;
          position: relative;
          padding-right: 18px;
          cursor: pointer;
          ul{
            transition: transform .3s ease;
            li{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              position: relative;
              height: 38px;
              color: #939499;
            }
          }
          &:after{
            content: '';
            display: block;
            position: absolute;
            right: 0;
            top: 10px;
            width: 14px;
            height: 14px;
            background: url(~assets/img/icon-chevron-right.svg) no-repeat center center;
            background-size: 14px;
          }
        }
      }
    }
    .positionArticle{
      padding: 20px 0 0;
      > div{
        padding: 0 $sidePadding * 1px;
        &.address{
          padding-bottom: 16px;
          > div{
            line-height: 21px;
            &:before{
              content: '주소';
              display: block;
              width: 32px;
              height: 21px;
              float: left;
              border: 1px solid #ebecf1;
              border-radius: 2px;
              text-align: center;
              line-height: 19px;
              font-size: 11px;
              color: #939499;
              margin-right: 8px;
            }
          }
        }
        &.buttons{
          > div{
            padding: 16px 0;
            > button{
              width: 25%;
              float: left;
              &:before{
                content: '';
                width: 40px;
                height: 40px;
                display: block;
                background-color: lightgray;
                border-radius: 20px;
                margin: 0 auto 8px;
              }
            }
            &:after{
              clear: both;
              display: block;
              content: '';
            }
          }
        }
        &.way{
          > div{
            padding-top: 16px;
            border-top: 1px solid #ebecf1;
            > div:first-of-type{
              font-size: 13px;
              font-weight: bold;
              line-height: 18px;
              color: #939499;
            }
            > div:nth-of-type(2){
              font-size: 13px;
              line-height: 18px;
              margin-top: 4px;
            }
          }
        }
      }
      .detailMap{
        width: 100%;
        cursor: pointer;
        position: relative;
        padding: 0;
        &:before{
          content: '';
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          margin-left: -15px;
          margin-top: -15px;
          width: 30px;
          height: 30px;
          background: url(~assets/img/icon-location-back.svg) center center no-repeat;
          background-size: 30px;
          border-radius: 15px;
          box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
        }
        > img{
          display: block;
          width: 100%;
        }
      }
    }
    .descriptionArticle{
      padding: 0 $sidePadding * 1px 20px;
      ul{
        li{
          margin-top: 20px;
          &:first-of-type{
            margin-top: 0;
          }
        }
        div{
          font-size: 16px;
          line-height: 22px;
          padding-left: 20px;
          position: relative;
          &:before{
            position: absolute;
            left: 0;
            width: 20px;
            text-align: center;
            top: 0;
            content: '\2022';
          }
        }
      }
    }
    .cancelArticle{
      .contents{
        padding: 0 $sidePadding * 1px;
        ul{
          padding: 16px 12px;
          border-radius: 4px;
          background-color: #fdf1f1;
          li{
            font-size: 13px;
            line-height: 20px;
            &:before{
              content: '\2022';
            }
          }
        }
      }
    }
    .roomArticle{
      p {
        padding-left: $sidePadding * 1px;
        padding-right: $sidePadding * 1px;
      }
    }
    .amenityArticle{
      padding-bottom: 20px;
      p {
        padding-left: $sidePadding * 1px;
        padding-right: $sidePadding * 1px;
      }
      .amenityBox{
        margin-top: 10px;
        padding: 0 $sidePadding * 1px;
        > ul{
          > li{
            font-size: 13px;
            width: 58px;
            height: 58px;
            text-align: center;
            line-height: 20px;
            cursor: grab;
            > div:first-of-type{
              width: 40px;
              height: 30px;
              margin: 0 auto 8px;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: contain;
            }
          }
        }
      }
      .benefit{
        padding: 0 $sidePadding * 1px;
        margin-top: 20px;
        div{
          font-size: 13px;
          line-height: 20px;
          color: #939499;
          &:before{
            content: '\2022';
          }
        }
      }
    }
    .etcArticle{
      > button{
        padding: 0 $sidePadding * 1px;
        width: 100%;
        height: 70px;
        line-height: 70px;
        border-bottom: 1px solid #ebecf1;
        text-align: left;
        font-size: 16px;
        position: relative;
        &:after{
          content: '';
          display: block;
          position: absolute;
          right: $sidePadding * 1px;
          top: 24px;
          width: 22px;
          height: 22px;
          background: url(~assets/img/icon-chevron-right.svg) no-repeat center center;
          background-size: 22px;
        }
      }
    }
    .reviewArticle{
      padding: 20px 0 0;
      > div:first-of-type{
        padding: 0 $sidePadding * 1px;
      }
     }
    .helpArticle{
      padding: 20px $sidePadding * 1px 30px;
      > div:first-of-type{
        font-size: 14px;
        font-weight: bold;
        line-height: 17px;
        color: #585858;
      }
      > div:nth-of-type(2){
        font-size: 22px;
        font-weight: bold;
        color: #585858;
        line-height: 28px;
        margin: 10px 0;
      }
      > div:nth-of-type(3){
        line-height: 18px;
        font-size: 13px;
        color: #868686;
      }
      > a{
        width: 113px;
        height: 42px;
        border-radius: 21px;
        background-color: #fff;
        border: 1px solid #ebecf1;
        text-align: center;
        line-height: 40px;
        display: block;
        margin-top: 20px;
        text-decoration: none;
        font-size: 13px;
        font-weight: bold;
      }
    }
  }
</style>
