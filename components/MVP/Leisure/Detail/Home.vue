<template>
  <div class="detailContentHomeTab fixWidth">
    <div class="titleInfo">
      <div class="category">{{ leisureTypeName }}</div>
      <div class="title">{{ objLeisure.leisure.name }}</div>
      <Price
        :discount="$format.optimizedDiscountPrice(minCostOption.gajagoSalePrice || minCostOption.coverPrice, $store.state.channelInfo.discount.leisure) || {}"
        :priceInfo="{
          coverPrice: minCostOption.coverPrice,
          discountPrice: minCostOption.gajagoSalePrice,
          status: objLeisure.leisure.status
        }"
      ></Price>
      <div v-if="objLeisure.leisure.dealIntroduce" class="filterTag">{{ objLeisure.leisure.dealIntroduce }}</div>
      <div v-else class="blank"></div>
    </div>
    <div
      v-if="objLeisure.leisure.dealInfo"
      class="dealInfo infoWrap"
    >
      <div class="title">상품 정보</div>
      <div v-html="replaceNewLineChar(objLeisure.leisure.dealInfo)" class="info"></div>
    </div>
    <div class="content">
      <div
        v-if="objLeisure.leisure.socialImages && objLeisure.leisure.socialImages.length > 0"
        class="detailImage"
        :style="{
              height: isContentsImgOpen ? 'auto' : `${socialImageHeight}px`,
              overflow: isContentsImgOpen ? 'auto' : `hidden`,
            }"
      >
        <img
          v-for="(url, index) in isContentsImgOpen ? objLeisure.leisure.socialImages : objLeisure.leisure.socialImages.slice(0, 1)"
          :key="index"
          :src="url"
          :alt="`detail${index}`"
        >
        <div class="btnWrap">
          <button
            v-if="!isContentsImgOpen"
            @click="isContentsImgOpen = true"
            class="readMore"
          >자세히 보기</button>
        </div>
      </div>
      <div class="leisureDetailOption">
        <div
          v-if="objLeisure.leisure.dealPriceGroups && objLeisure.leisure.dealPriceGroups.length > 0 && objLeisure.leisure.options && objLeisure.leisure.options.length > 0"
          class="productOptionWrap"
        >
          <OptionGroup
            :arrOptionGroups="objLeisure.leisure.dealPriceGroups.slice(0, 3)"
            :objSelectedOptions="objSelectedOptions"
            :arrOption="objLeisure.leisure.options"
            @changeOption="changeOption"
          ></OptionGroup>
          <button
            v-if="objLeisure.leisure.dealPriceGroups && objLeisure.leisure.dealPriceGroups.length > 3"
            @click="$emit('setSelectedTab', 1)"
            class="moreBtn"
          >상품 모두 보기</button>
        </div>
        <div v-else class="noOption">예약 가능한 상품이 업습니다.</div>
      </div>
      <div
        v-if="objLeisure.leisure.usageInfo"
        class="infoWrap"
      >
        <div class="title">상품 사용안내</div>
        <div v-html="replaceNewLineChar(objLeisure.leisure.usageInfo)" class="info"></div>
      </div>
      <div
        v-if="objLeisure.leisure.noticeInfo"
        class="infoWrap"
      >
        <div class="title">필수 안내</div>
        <div v-html="replaceNewLineChar(objLeisure.leisure.noticeInfo)" class="info"></div>
      </div>
      <div
        v-if="objLeisure.leisure.refundInfo"
        class="infoWrap"
      >
        <div class="title">환불 정보</div>
        <div v-html="replaceNewLineChar(objLeisure.leisure.refundInfo)" class="info"></div>
      </div>
      <div
        v-if="objLeisure.leisure.storeInfo"
        class="infoWrap"
      >
        <div class="title">업체 정보</div>
        <div v-html="replaceNewLineChar(objLeisure.leisure.storeInfo)" class="info"></div>
      </div>
      <div class="address">
        <div class="title">
          <span class="name">주소</span>
          <span class="val">{{ objLeisure.leisure.address }}</span>
        </div>
        <div v-if="maxWidth && objLeisure.leisure.lat && objLeisure.leisure.lon" @click="$emit('openPopup', 'Map')" class="map">
          <img
            :src="`https://maps.googleapis.com/maps/api/staticmap?center=${objLeisure.leisure.lat},${objLeisure.leisure.lon}&zoom=15&size=${maxWidth}x${Math.floor(mapImageHeight)}&maptype=roadmap&key=AIzaSyB6o8nbr-hhHtv94YeM6i583FAYNo0E5oI`"
            :style="{
              height: `${parseInt(mapImageHeight, 10)}px`
            }"
            alt="detailMap"
          >
        </div>
      </div>
      <div class="detailInfo">
        <ul>
          <li @click="$emit('openPopup', 'storeInfo')">
            <span>판매자 정보</span>
            <div class="arrowRight"></div>
          </li>
        </ul>
      </div>
      <div class="customerCenter">
        <div class="title">고객센터</div>
        <div class="tel">1644-1346</div>
        <div class="time">연중무휴 09:00~19:00</div>
        <a class="kakaoChat" href="http://plus.kakao.com/home/@야놀자고객센터" target="_blank">1:1 채팅상담</a>
      </div>
    </div>
  </div>
</template>

<script>
import OptionGroup from '@/components/MVP/Leisure/Detail/OptionGroup.vue';
import Price from '@/components/MVP/Common/Price.vue';

export default {
  components: {
    OptionGroup,
    Price,
  },
  props: {
    objLeisure: {
      type: Object,
      default: () => {},
    },
    objSelectedOptions: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      mapImageHeight: '',
      socialImageHeight: '',
      maxWidth: 0,
      isContentsImgOpen: false,
    };
  },
  computed: {
    leisureTypeName() {
      return this.objLeisure.leisure && this.objLeisure.leisure.type && this.objLeisure.leisure.type.length > 0 ? this.objLeisure.leisure.type[0].name : '';
    },
    minCostOption() {
      let min = null;
      if (this.objLeisure.leisure && this.objLeisure.leisure.options && this.objLeisure.leisure.options.length > 0) {
        for (let x = 0; x < this.objLeisure.leisure.options.length; x += 1) {
          if (!min || min.gajagoSalePrice > this.objLeisure.leisure.options[x].gajagoSalePrice) {
            min = this.objLeisure.leisure.options[x];
          }
        }
      }
      return min || { coverPrice: 0, gajagoSalePrice: 0 };
    },
  },
  methods: {
    changeOption(objOption) {
      this.$emit('changeOption', objOption);
    },
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
  },
  mounted() {
    this.maxWidth = (window.outerWidth > 768 ? 768 : window.outerWidth) || 768;
    this.mapImageHeight = (this.maxWidth * 108) / 375;
    this.socialImageHeight = (this.maxWidth * 330) / 375;
  },
};
</script>

<style lang="scss">
  .detailContentHomeTab {
    margin-top: 12px;
    background-color: #f8f9fb;
    .arrowRight {
      background-image: url(~assets/img/icon-chevron-right.svg);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }

    .titleInfo {
      border-bottom: 10px solid #f8f9fb;
      padding: 0 $sidePadding * 1px 0;
      background-color: #fff;

      .bookingType {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        span {
          line-height: 20px;
          font-size: 13px;
          color: #000;
        }

        &::before {
          content: '';
          display: block;
          width: 20px;
          height: 20px;
          background-image: url(~assets/img/thunder.svg);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }

      .category {
        font-size: 11px;
        line-height: 18px;
        color: #939499;
        font-weight: bold;
      }

      .title {
        font-size: 16px;
        color: #000;
        line-height: 22px;
        font-weight: bold;
      }

      .price{
        float: right;
        margin-top: 10px;
        .showPrice{
          height: 22px;
          line-height: 22px;
          .discountRate{
            float: left;
            color: #d31111;
          }
          .percent{
            color: #d31111;
            font-size: 12px;
            float: left;
            margin-right: 4px;
          }
          .salePrice{
            float: left;
            &.soldOut{
              color: #cccdd1;
              font-weight: bold;
            }
          }
          &:after{
            content: '';
            clear: both;
            display: block;
          }
        }
        .originVal {
          font-size: 10px;
          color: #868686;
          text-decoration: line-through;
          text-align: right;
        }
      }

      .filterTag {
        margin-top: 12px;
        width: 100%;
        padding: 10px 0;
        border-top: 1px solid #ebecf1;
        font-size: 11px;
        color: #939499;
        line-height: 18px;
        position: relative;
      }
      .blank{
        height: 20px;
      }
    }
    .dealInfo{
      background-color: #fff;
    }
    .infoWrap{
      padding: 20px $sidePadding * 1px 20px;
      border-bottom: 10px solid #f8f9fb;
      .title {
        font-size: 14px;
        font-weight: bold;
        color: #000;
      }
      .info{
        margin-top: 16px;
        color: #000000;
        font-size: 13px;
        line-height: 18px;
      }
    }
    .content {
      background-color: #fff;

      .detailImage {
        position: relative;
        padding-bottom: 50px;
        border-bottom: 10px solid #f8f9fb;

        img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto;
          display: block;
        }
        .btnWrap{
          width: 100%;
          padding: 20px 24px;
          position: absolute;
          transform: translateX(-50%);
          left: 50%;
          bottom: 0;
          background-color: #fff;
          .readMore {
            width: 100%;
            height: 46px;
            border: 1px solid #000;
            border-radius: 4px;
            font-size: 13px;
            z-index: 1;
          }
        }
      }
      .leisureDetailOption {
        padding: 0 $sidePadding * 1px 20px;
        border-bottom: 6px solid #f8f9fb;
        .productOptionWrap{
          padding-top: 10px;
        }

        .moreBtn {
          width: 100%;
          height: 42px;
          border-radius: 4px;
          border: 1px solid #000;
          font-size: 13px;
          line-height: 18px;
          color: #000;
          margin-top: 20px;
        }
        .noOption{
          padding: 40px 0 20px;
          text-align: center;
        }
      }

      .address {
        border-bottom: 10px solid #f8f9fb;

        .title {
          padding: 12px $sidePadding * 1px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          span{
            display: inline-block;
            &.name{
              border: 1px solid #ebecf1;
              background-color: #fff;
              font-size: 10px;
              line-height: 13px;
              color: #939499;
              padding: 4px 8px;
              border-radius: 2px;
            }
            &.val{
              margin-left: 8px;
              font-size: 13px;
              line-height: 20px;
              color: #000;
            }
          }
        }

        .map {
          width: 100%;
          position: relative;
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
          }
          img {
            display: block;
            width: 100%;
          }
        }
      }

      .detailInfo {
        border-bottom: 1px solid #ebecf1;
        ul {
          li {
            padding: 24px $sidePadding * 1px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            border-bottom: 1px solid #ebecf1;
            cursor: pointer;

            &:last-of-type {
              border-bottom: none;
            }

            span {
              font-size: 16px;
              color: #000;
              line-height: 22px;
            }

            .arrowRight {
              width: 22px;
              height: 22px;
            }
          }
        }
      }

      .customerCenter {
        padding: 30px $sidePadding * 1px 30px;
        background-color: #f8f9fb;
        .title {
          font-size: 14px;
          font-weight: bold;
          color: #585858;
        }

        .tel {
          font-size: 22px;
          line-height: 28px;
          color: #585858;
          font-weight: bold;
          margin-top: 10px;
        }

        .time {
          font-size: 13px;
          line-height: 18px;
          color: #868686;
          margin-top: 10px;
        }

        > .kakaoChat {
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
  }
</style>
