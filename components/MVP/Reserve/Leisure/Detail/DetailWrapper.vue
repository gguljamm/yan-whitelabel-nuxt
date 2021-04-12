<template>
  <div class="reserveLeisureDetailWrapper">
    <Header></Header>
    <div v-if="objSelectedReserveInfo" class="detailWrapper fixWidth">
      <div class="detailContent">
        <div class="pageTitle">예약 내역 상세</div>
        <div class="contentInfo">
          <div class="productInfo">
            <div class="titleWrapper" @click="openProductDetail">
              <div>
                <div
                  class="thumbnail"
                  :style="{
                      backgroundImage: objSelectedReserveInfo.image ? `url(${objSelectedReserveInfo.image})` : '',
                    }"
                ></div>
                <div class="info">
                  <div class="category">{{ objSelectedReserveInfo.category }}</div>
                  <div class="name">{{ objSelectedReserveInfo.dealName }}</div>
                </div>
              </div>
            </div>
            <div class="infoListWrapper">
              <div class="list">
                <div class="name">예약 번호</div>
                <div class="val cancel"
                  v-if="!objSelectedReserveInfo.orderOption.some((v) => v.status.indexOf('CANCEL') < 0)"
                >
                  <span>{{ objSelectedReserveInfo.orderId }}</span> 취소 {{ objSelectedReserveInfo.orderOption.some((v) => v.status.indexOf('CANCEL_REQUEST') >= 0) ? '처리 중' : '완료' }}</div>
                <div class="val" v-else>{{ objSelectedReserveInfo.orderId }}</div>
              </div>
              <div class="list">
                <div class="name">구매 일시</div>
                <div class="val">{{ DateFormat(objSelectedReserveInfo.createdDate) }}</div>
              </div>
            </div>
            <div class="btnWrap">
              <button class="largeFillButton" @click="$emit('popup', 'Voucher')">예약 확인서</button>
            </div>
          </div>
          <div
            class="optionWrapper"
            :class="{
              all: objSelectedReserveInfo.orderOption.some((obj) => obj.status === 'NOT_USED'),
            }"
          >
            <div class="infoListWrapper">
              <div class="list">
                <div class="name">구매 수량</div>
                <div class="val">{{ objSelectedReserveInfo.orderOption.reduce((acc, it) => acc + it.quantity, 0) }}개</div>
              </div>
              <div class="list">
                <div class="name">사용 가능</div>
                <div class="val">{{ objSelectedReserveInfo.orderOption.filter((obj) => arrAvailableStatus.indexOf(obj.status) !== -1).length }}개</div>
              </div>
            </div>
            <div v-if="objSelectedReserveInfo.orderOption.some((obj) => obj.status === 'NOT_USED')" class="optionListWrapper available">
              <ProductList
                v-for="(objOption, optionIndex) in objSelectedReserveInfo.orderOption.filter((obj) => arrAvailableStatus.indexOf(obj.status) !== -1)"
                :key="optionIndex"
                :objOption="objOption"
              ></ProductList>
            </div>
            <div v-if="objSelectedReserveInfo.orderOption.some((obj) => obj.status === 'NOT_USED')" class="btnWrap">
              <button class="largeFillButton" @click="$emit('popup', 'Cancel')">예약 취소</button>
            </div>
          </div>
          <div v-if="objSelectedReserveInfo.orderOption.some((obj) => obj.status !== 'NOT_USED')" class="optionListWrapper unavailable">
            <ProductList
              v-for="(objOption, optionIndex) in objSelectedReserveInfo.orderOption.filter((obj) => arrAvailableStatus.indexOf(obj.status) === -1)"
              :key="optionIndex"
              :objOption="objOption"
            ></ProductList>
          </div>
          <div class="popupList">
            <div class="list" @click="$emit('popup', 'CancelPolicy')">
              <span>취소 및 환불 정책</span>
              <div class="icon"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="helpArticle fixWidth">
      <div>고객센터</div>
      <div>1644-1346</div>
      <div>연중무휴 09:00~익일 03:00</div>
      <a href="http://plus.kakao.com/home/@야놀자고객센터" target="_blank">1:1 채팅상담</a>
    </div>
  </div>
</template>

<script>
import ProductList from '@/components/MVP/Reserve/Leisure/Detail/ProductList.vue';

export default {
  props: {
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ProductList,
  },
  data() {
    return {
      arrAvailableStatus: ['NOT_USED', 'CANCEL_REQUEST_FAILED', 'CANCEL_FAILED'],
    };
  },
  methods: {
    DateFormat(str) {
      return str.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(str.split(' ')[0], 'dow')}) `);
    },
    openProductDetail() {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/leisure/result/${this.objSelectedReserveInfo.dealId}`);
    },
  },
};
</script>

<style lang="scss">
.reserveLeisureDetailWrapper{
  .detailWrapper{
    width: 100%;
    min-height: calc(100vh - #{$header} * 1px - 193px);
    .detailContent {
      position: relative;
      width: 100%;
      z-index: 1;
      background-color: #f8f9fb;
      .pageTitle{
        font-weight: bold;
        font-size: 23px;
        line-height: 30px;
        padding: 20px $sidePadding * 1px;
        background-color: #FFF;
      }
      .contentInfo{
        background-color: #FFF;
        .btnWrap{
          padding: 20px $sidePadding * 1px;
          .largeFillButton{
            width: 100%;
            height: 46px;
            border-radius: 4px;
            border: 1px solid #000;
            font-size: 13px;
          }
        }
        .infoListWrapper{
          padding: 10px $sidePadding * 1px 0;
          .list{
            padding: 10px 0;
            line-height: 22px;
            font-size: 16px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            .name{
              color: #939499;
            }
            .val{
              color: #000;
              &.cancel{
                color: #d0021b;
                > span{
                  color: #000;
                  text-decoration: line-through;
                }
              }
            }
          }
        }
        .productInfo{
          border-bottom: 10px solid #f8f9fb;
          .titleWrapper{
            padding: 0 $sidePadding * 1px;
            cursor: pointer;
            > div{
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              padding: 20px 0;
              border-bottom: 1px solid #ebecf1;
            }
            .thumbnail{
              width: 46px;
              height: 46px;
              border-radius: 46px;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              background-color: #ebecf1;
            }
            .info{
              margin-left: 14px;
              .category{
                font-size: 13px;
                line-height: 18px;
                font-weight: bold;
                color: #939499;
              }
              .name{
                font-size: 16px;
                font-weight: bold;
                color: #000;
                line-height: 22px;
              }
            }
          }
        }
        .optionListWrapper{
          padding: 0 $sidePadding * 1px;
          &.available{
            margin-top: 10px;
          }
          &.unavailable{
            padding: 20px $sidePadding * 1px;
            border-bottom: 10px solid #f8f9fb;
          }
        }
        .optionWrapper{
          &.all{
            border-bottom: 10px solid #f8f9fb;
          }
        }
        .popupList{
          .list{
            padding: $sidePadding * 1px 17px $sidePadding * 1px $sidePadding * 1px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            cursor: pointer;
            border-top: 1px solid #ebecf1;
            &:first-of-type{
              border: none;
            }
            span{
              font-size: 16px;
              line-height: 22px;
              color: #000;
            }
            .icon{
              width: 22px;
              height: 22px;
              background-image: url(~assets/img/icon-chevron-right.svg);
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
          }
        }
      }
    }
  }
  .helpArticle{
    padding: 24px $sidePadding * 1px;
    background-color: #f8f9fb;
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
