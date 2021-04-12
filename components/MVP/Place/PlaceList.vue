<template>
  <div class="placeListWrapper">
    <component
      :is="getTopInfo"
      :params="params"
      :categoryMap="categoryMap"
      :isDawn="isDawn"
      @reSearch="reSearch"
      @changeTab="changeTab"
    ></component>
    <div class="placeListSection">
      <div class="filterBox">
        <div class="fixWidth">
          <div class="buttonWrap">
            <button @click="$emit('openPopup', 'filter')"
              :class="{ active: objFilter.amenities.length > 0 || objFilter.priceFrom || objFilter.priceTo }"
            >필터</button>
          </div>
        </div>
      </div>
      <dawn-check-in v-if="isDawn"></dawn-check-in>
      <div class="sortBox fixWidth" v-if="objPlace.list && objPlace.list.length > 0">
        <span v-if="objPlace.total">총 {{ $format.numberFormat(objPlace.total) }}개</span>
        <button @click="$emit('openPopup', 'sort')">{{ sortNameMap[sort] }}</button>
      </div>
      <ul v-if="objPlace.list && objPlace.list.length > 0" class="fixWidth">
        <li v-for="x in objPlace.list" :key="x.no" @click="submit(x.no)">
          <div class="bgImg">
            <div :style="{backgroundImage: `url(${ x.imageUrl ? x.imageUrl : '' })` }"></div>
          </div>
          <div class="textBox">
            <div class="intro">
              <div>
                <span v-if="x.category !== 'HOTEL'">{{ categoryNameMap[x.category.toLowerCase()] }}</span>
                <span v-else>
                  {{ x.themes && x.themes[0] && hotelThemeMap[x.themes[0]] ? hotelThemeMap[x.themes[0]] : '호텔' }}
                </span>
                <span v-show="x.star && x.star.rating">| {{ x.star ? x.star.rating : '' }}성급</span>
              </div>
            </div>
            <div class="name">{{ x.name }}</div>
            <div class="review">
              <div class="locationText" v-if="x.location || x.directions" v-html="x.location || x.directions"></div>
              <div class="reviewText" v-if="x.review">{{ x.review.rating.toFixed(1) }}<span>({{ x.review.count }})</span></div>
            </div>
            <Price
              :priceInfo="{
                coverPrice: x.minPrice,
                discountPrice: x.minDiscountPrice,
                status: x.openPossibility !== 'AVAILABLE' ? 'SOLDOUT' : 'SALE'
              }"
              :discount="$format.optimizedDiscountPrice(x.minDisCountPrice || x.minPrice, $store.state.channelInfo.discount.place) || {}"
            ></Price>
          </div>
          <div class="notice" v-if="x.notices && x.notices.find((v) => v.noticeType === 'CUSTOMER_BENEFITS')">
            <div v-html="x.notices.find((v) => v.noticeType === 'CUSTOMER_BENEFITS' || v.noticeType === 'EVENT').contents"></div>
          </div>
        </li>
      </ul>
      <div v-if="objPlace.status === 'loading'" class="spinnerLoading">
        <div></div>
      </div>
      <div
        v-if="objPlace.status === 'loaded' && objPlace.list && objPlace.list.length === 0"
        class="noResult"
        :style="{
          marginTop: $route.query.type === 'search' ? '152px' : '96px',
        }"
      >
        <div>검색된 상품이 없습니다.</div>
        <div>검색어나 검색 조건을 변경하세요.</div>
      </div>
    </div>
    <div v-if="objPlace.list && objPlace.list.length > 0" class="btnMap">
      <button
        v-if="!$store.state.env.isLowVersion"
        @click="$emit('openPopup', 'map')"
      >지도로 찾기</button>
    </div>
  </div>
</template>

<script>
import DawnCheckIn from '~/components/MVP/Common/DawnCheckIn.vue';
import Price from '~/components/MVP/Common/Price.vue';

const getTopInfoComp = (channelName) => import(`~/components/${channelName}/Place/TopInfo.vue`).catch(() => import('~/components/MVP/Place/TopInfo.vue'));

export default {
  props: {
    params: {
      type: Object,
      default: () => {},
    },
    objPlace: {
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
    DawnCheckIn,
    Price,
  },
  data() {
    const today = new Date();
    const tmp = new Date();
    tmp.setDate(tmp.getDate() - 1);
    const yesterday = this.$format.ymdDate(tmp);
    // const { category } = this.$route.query;
    // const isDawn = (category === 'motel')
    const { category, type } = this.$route.query;
    const isDawn = (category === 'motel' || category === 'hotel' || type === 'search')
      && today.getHours() >= 0
      && today.getHours() < 2
      && yesterday === this.$route.query.checkin;
    const categoryMap = isDawn ? {
      all: '전체',
      motel: '중저가 숙소',
      hotel: '호텔',
    } : {
      all: '전체',
      motel: '중저가 숙소',
      hotel: '호텔',
      guesthouse: '게스트하우스',
      pension: '펜션/풀빌라',
    };
    const instance = getTopInfoComp(this.$store.state.channelInfo.channelName);
    return {
      getTopInfo: () => instance,
      isDawn,
      categoryMap,
      noticeMap: [
        { text: '공지' },
        { text: '이벤트' },
        { text: '한줄인사말' },
        { text: '' },
        { text: '예약 공지사항' },
        { text: '예약 혜택' },
      ],
      categoryNameMap: {
        pension: '펜션',
        motel: '중저가 숙소',
        hotel: '호텔',
        guesthouse: '게스트하우스',
      },
      sortNameMap: {
        RECOMMENDATION: '추천 순',
        REVIEW: '후기 많은 순',
        PRICEDESC: '숙박 예약가 높은 순',
        PRICEASC: '숙박 예약가 낮은 순',
        DISCOUNTRATE: '할인율 높은 순',
      },
      hotelThemeMap: {
        family: '가족호텔',
        resort: '리조트',
        business: '비즈니스',
        residence: '레지던스',
        condo: '콘도',
      },
    };
  },
  methods: {
    reSearch(params) {
      this.$emit('reSearch', params);
    },
    changeTab(x) {
      this.$emit('changeTab', x);
    },
    submit(no) {
      this.$emit('submit', no);
    },
  },
};
</script>

<style lang="scss">
  .placeListWrapper{
    .placeListSection{
      background-color: #f8f9fb;
      min-height: calc(100vh - #{$header * 1px} - 45px);
      .filterBox{
        background-color: #fff;
        .buttonWrap{
          padding: 10px $sidePadding * 1px;
          button{
            padding: 0 10px;
            height: 36px;
            border-radius: 4px;
            border: solid 1px #f1f1f1;
            background-color: #ffffff;
            font-size: 13px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            &::before{
              content: '';
              display: block;
              width: 18px;
              height: 18px;
              background-image: url(~assets/img/MVP/icon-filter-black.svg);
              background-position: center;
              background-size: 18px;
              background-repeat: no-repeat;
              margin-right: 4px;
            }
            &.active{
              color: #FFF;
              background-color: #000;
              border-color: #000;
              &::before{
                background-image: url(~assets/img/MVP/icon-filter-white.svg);
              }
            }
          }
        }
      }
      .sortBox{
        height: 32px;
        line-height: 32px;
        padding: 0 $sidePadding * 1px;
        font-size: 11px;
        color: #939499;
        > button{
          float: right;
          height: 34px;
          line-height: 34px;
          position: relative;
          padding-left: 22px;
          &:before{
            content: '';
            position: absolute;
            top: calc(50% - 9px);
            left: 0;
            width: 18px;
            height: 18px;
            background: url(~assets/img/icon-sort-black.svg) center center no-repeat;
            background-size: 14px;
          }
        }
      }
      ul{
        padding-bottom: 80px;
        li{
          background-color: #FFF;
          cursor: pointer;
          width: 100%;
          margin-bottom: 8px;
          border-bottom: 1px solid #ebecf1;
          .bgImg{
            width: 100%;
            > div{
              width: 100%;
              background-size: cover;
              background-position: center center;
              background-repeat: no-repeat;
              padding-bottom: 51.2%;
            }
          }
          .textBox{
            padding: 0 24px 12px;
            > .intro {
              margin-top: 12px;
              > div{
                float: left;
                font-size: 11px;
                font-weight: bold;
                line-height: 18px;
                color: #939499;
              }
              &:after{
                content: '';
                clear: both;
                display: block;
              }
            }
            .name {
              font-size: 16px;
              font-weight: bold;
              line-height: 22px;
            }
            .review{
              font-size: 11px;
              line-height: 18px;
              > div{
                float: left;
                &.locationText{
                  margin-right: 8px;
                }
                &.reviewText{
                  font-weight: bold;
                  > span{
                    font-weight: normal;
                    color: #939499;
                  }
                  &:before{
                    content: '';
                    display: inline-block;
                    background: url(~assets/img/star.svg) center center no-repeat;
                    background-size: 14px;
                    height: 14px;
                    width: 14px;
                    float: left;
                    margin-top: 2px;
                    margin-right: 2px;
                  }
                }
              }
              &:after{
                content: '';
                display: block;
                clear: both;
              }
            }
          }
          .notice{
            padding: 0 24px 10px;
            font-size: 11px;
            color: #939499;
            line-height: 18px;
            > div{
              padding-top: 9px;
              border-top: 1px solid #ebecf1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .noResult{
        text-align: center;
        > div:first-of-type{
          color: #000;
          font-size: 23px;
          line-height: 30px;
          font-weight: bold;
        }
        > div:nth-of-type(2){
          color: #939499;
          font-size: 13px;
          line-height: 20px;
          margin-top: 4px;
        }
      }
      .spinnerLoading{
        padding-top: 32px;
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
    .btnMap{
      position: fixed;
      bottom: 20px;
      width: 100%;
      left: 0;
      > button{
        padding: 0 16px 0 38px;
        height: 42px;
        border-radius: 21px;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
        background-color: #000;
        font-size: 14px;
        position: relative;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        color: #FFF;
        &:before{
          position: absolute;
          content: '';
          width: 20px;
          height: 20px;
          background: url(~assets/img/icon-map-white.svg) center center no-repeat;
          background-size: 20px;
          top: 11px;
          left: 14px;
        }
      }
    }
  }
  .fromTop-enter-active, .fromTop-leave-active {
    transition: .3s ease;
    transform: translateY(0);
  }
  .fromTop-enter, .fromTop-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    transform: translateY(-50px);
    opacity: .8;
  }
</style>
