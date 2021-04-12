<template>
  <div class="reserveLeisureListWrapper">
    <div class="pageTitle">예약 내역</div>
    <div class="contents">
      <div
        v-for="(objDeal, index) in arrFilteredListByStatus"
        :key="index"
        class="listWrapper"
      >
        <div class="list">
          <div class="topInfo">
            <div class="dealInfo">
              <div
                class="mainImg"
                :style="objDeal.image ? { backgroundImage: `url(${objDeal.image})` } : {}"
              ></div>
              <div class="info">
                <div class="sub">{{ objDeal.createdDate.replace(/-/g, '.').replace(' ', `(${$format.formatDate(objDeal.createdDate.split(' ')[0], 'dow')}) `) }} | {{ objDeal.orderId }}</div>
                <div class="title">{{ objDeal.dealName }}</div>
              </div>
            </div>
            <div class="quantityWrapper">
              <div class="all">
                <div class="name">구매 수량</div>
                <div class="val">{{ objDeal.orderOption.length }}개</div>
              </div>
              <div class="available">
                <div class="name">사용 가능</div>
                <div class="val">{{ objDeal.orderOption.filter((obj) => arrAvailableStatus.indexOf(obj.status) !== -1).length }}개</div>
              </div>
            </div>
            <div class="optionWrapper">
              <div
                v-for="(arrGroup, groupKey) of objDeal.orderOption.reduce(
                  (result, obj) => ({
                  ...result, [`${obj.optionId}-${obj.status}`]: (result[`${obj.optionId}-${obj.status}`] || []).concat(obj),
                  }), {})"
                :key="groupKey"
                class="option"
              >
                <span
                  v-if="arrAvailableStatus.every((status) => groupKey.indexOf(status) === -1)"
                  class="status"
                >사용불가</span>
                <div class="name" :class="arrAvailableStatus.every((status) => groupKey.indexOf(status) === -1) ? 'unavailable' : ''">{{ arrGroup[0].optionName }}</div>
                <div class="info">
                  <span class="price" :class="arrAvailableStatus.every((status) => groupKey.indexOf(status) === -1) ? 'unavailable' : ''">
                    {{ $format.numberFormat(arrGroup[0].salePrice - (arrGroup[0].channelDiscounts && arrGroup[0].channelDiscounts.length > 0 ? arrGroup[0].channelDiscounts.reduce((tot, v) => tot + v.discountAmount, 0) : 0)) }}원 / {{ arrGroup.length }}개
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="bottomInfo">
            <div class="btnWrap" v-if="$store.state.channelInfo.channelName.replace('dev_', '') !== 'etbs'">
              <button class="check" v-if="objDeal.orderOption.some((obj) => arrAvailableStatus.indexOf(obj.status) !== -1)" @click="openDetail(objDeal, true)">예약 취소</button>
              <button @click="openDetail(objDeal)">예약 내역 상세</button>
            </div>
            <div v-else class="btnWrap">
              <button class="check"
                v-if="!objDeal.orderOption.some((obj) => arrAvailableStatus.indexOf(obj.status) === -1)"
                @click="openDetail(objDeal, true)"
              >예약 취소</button>
              <button @click="openDetail(objDeal)">예약 내역 상세</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    arrReserveList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      arrAvailableStatus: ['NOT_USED', 'CANCEL_REQUEST_FAILED', 'CANCEL_FAILED'],
    };
  },
  computed: {
    arrFilteredListByStatus() {
      const arrReserveList = JSON.parse(JSON.stringify(this.arrReserveList));
      return arrReserveList.sort((a, b) => new Date(`${b.createdDate.replace(' ', 'T')}.000+09:00`) - new Date(`${a.createdDate.replace(' ', 'T')}.000+09:00`));
    },
  },
  methods: {
    openDetail(objDeal, isCancel) {
      this.$emit('openDetail', { objDeal, isCancel });
    },
  },
};
</script>

<style lang="scss">
.reserveLeisureListWrapper{
  padding: 0 $sidePadding * 1px 100px;
  .pageTitle{
    font-size: 23px;
    line-height: 30px;
    font-weight: bold;
    color: #000;
    padding: 20px 0;
  }
  .contents{
    .listWrapper{
      margin-top: 10px;
      &:first-of-type{
        margin-top: 0;
      }
      .list{
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.06);
        border: solid 1px #f1f1f1;
        overflow: hidden;
        border-radius: 4px;
        background-color: #fff;
        .topInfo{
          padding: 10px 0;
          .dealInfo {
            padding: 12px 14px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            border-bottom: 1px solid #ebecf1;
            .mainImg{
              flex-shrink: 0;
              width: 56px;
              height: 56px;
              border-radius: 28px;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center center;
              background-color: #ebecf1;
            }
            .info{
              margin-left: 10px;
              font-weight: bold;
              line-height: 20px;
              .title {
                font-size: 16px;
                color: #000;
              }
              .sub {
                font-size: 13px;
                color: #939499;
              }

            }
          }
          .quantityWrapper{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            background-color: #f8f9fb;
            padding: 10px 13px;
            .all, .available{
              width: 50%;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              .name{
                padding: 0 6px;
                font-size: 10px;
                line-height: 22px;
                background-color: #fff;
                color: #000;
                border: 1px solid #ebecf1;
                border-radius: 11px;
              }
              .val{
                margin-left: 6px;
                font-size: 13px;
                font-weight: bold;
                line-height: 22px;
              }
            }
          }
          .optionWrapper{
            padding: 0 14px;
            .option{
              color: #000;
              font-size: 13px;
              line-height: 18px;
              border-top: 1px solid #ebecf1;
              padding: 10px 0;
              &:first-of-type{
                border-top: none;
              }
              .status{
                border-radius: 11.5px;
                display: inline-block;
                background-color: #cccdd1;
                width: 47px;
                height: 22px;
                line-height: 22px;
                text-align: center;
                color: #fff;
                font-size: 10px;
              }
              .name{
                margin-top: 6px;
                font-size: 13px;
                line-height: 20px;
                color: #000;
                &.unavailable{
                  color: #939499;
                }
              }
              .info{
                .price{
                  font-weight: bold;
                  &.unavailable{
                    color: #939499;
                  }
                }
              }
            }
          }
        }
        .bottomInfo{
          .btnWrap{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            padding: 0 14px 14px;
            button {
              font-size: 13px;
              width: 100%;
              height: 43px;
              border-radius: 4px;
              color: #ff3478;
              border: 1px solid #ff3478;
              &.check{
                width: 50%;
                color: #000;
                border: 1px solid #000;
                & ~ button{
                  width: 50%;
                  margin-left: 7px;
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
