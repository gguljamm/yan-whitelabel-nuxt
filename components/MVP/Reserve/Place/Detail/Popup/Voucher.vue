<template>
  <div class="placeReserveVoucher">
    <div class="fixWidth">
      <div class="pageTitle">예약 확인서</div>
      <div class="infoWrap">
        <div
          v-for="(objItem, index) in [objReservationInfo]"
          :key="index"
          class="info"
        >
          <div class="title">{{ objItem.title }}</div>
          <div class="content">
            <div
              v-for="(groupList, index2) in objItem.list"
              :key="index2"
              class="listWrapper"
            >
              <div class="optionList">
                <div
                  v-for="(group, index3) in groupList"
                  :key="index3"
                  class="list"
                >
                  <div class="name">{{ group.name }}</div>
                  <div class="value cancel" v-if="group.name === '예약 번호' && objSelectedReserveInfo.reservationInfo.reservationStatus === 'CANCELED'">
                    <span>{{ group.value }}</span> 취소 완료
                  </div>
                  <div class="value" v-else>{{ group.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="(objItem, index) in [objProductInfo]"
          :key="`${index}-product`"
          class="info productInfo"
        >
          <div class="title">{{ objItem.title }}</div>
          <div
            class="content"
            :class="{
              canceled: objSelectedReserveInfo.reservationInfo.reservationStatus === 'CANCELED',
            }"
          >
            <div
              v-for="(groupList, index2) in objItem.list"
              :key="index2"
              class="listWrapper"
            >
              <div class="list">
                <div class="name">{{ groupList.name }}</div>
                <div class="value" v-html="groupList.value"></div>
              </div>
            </div>
            <div
              v-if="objSelectedReserveInfo.reservationInfo.reservationStatus === 'CANCELED'"
              class="cancelInfo"
            >
              <div
                v-for="(objList, index) in arrCancelInfo"
                :key="index"
                class="listWrapper"
              >
                <div class="list">
                  <div class="name">{{ objList.name }}</div>
                  <div
                    class="value"
                    :class="objList.key"
                  >{{ objList.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info payment">
          <div class="title">{{ objPayment.title }}</div>
          <div class="content">
            <div
              v-for="(objList, index) in objPayment.list"
              :key="index"
              class="listWrapper"
            >
              <div class="list">
                <div class="name">{{ objList.name }}</div>
                <div class="value" v-html="objList.value"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isCancelable" class="btnWrap">
        <button @click="openCancel" class="largeFillButton">예약 취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isCancelable: {
      type: Boolean,
      default: false,
    },
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    objReservationInfo() {
      const { reservationInfo } = this.objSelectedReserveInfo;
      return {
        title: '예약 정보',
        list: [
          [{
            name: '예약 번호',
            value: reservationInfo.yanReservationNo,
          }, {
            name: '구매 일시',
            value: this.placeListDateFormat(reservationInfo.reservationDate),
          }],
          [{
            name: '예약자명',
            value: reservationInfo.customerName,
          }, {
            name: '예약자 연락처',
            value: this.$format.formatPhone(reservationInfo.customerPhone),
          }],
          [{
            name: '방문자명',
            value: reservationInfo.visitorName || reservationInfo.customerName,
          }, {
            name: '방문자 연락처',
            value: this.$format.formatPhone(reservationInfo.visitorPhone || reservationInfo.customerPhone),
          }],
          [{
            name: '투숙 유형',
            value: reservationInfo.consecutive ? '연박' : '단박',
          }, {
            name: '투숙 일자',
            value: this.placeListDateFormat(reservationInfo.checkIn),
          }, {
            name: '퇴실 일자',
            value: this.placeListDateFormat(reservationInfo.checkOut),
          }],
        ],
      };
    },
    objProductInfo() {
      const { placeInfo, reservationInfo } = this.objSelectedReserveInfo;
      return {
        title: '예약 내역',
        list: [
          {
            name: '숙소 이름',
            value: placeInfo.placeName,
          },
          {
            name: '객실 정보',
            value: reservationInfo.roomLevel,
          },
          {
            name: '주소',
            value: placeInfo.address,
          },
        ],
      };
    },
    arrCancelInfo() {
      const { reservationInfo } = this.objSelectedReserveInfo;
      let obj = [];
      if (reservationInfo.reservationStatus === 'CANCELED') {
        obj = [
          {
            name: '상태',
            value: '취소 완료',
            key: 'cancelState',
          },
          {
            name: '취소 날짜',
            value: this.placeListDateFormat(reservationInfo.canceledDate),
            key: 'cancelDate',
          },
          {
            name: '위약금',
            value: `(-) ${this.$format.numberFormat(reservationInfo.penaltyFee)}원`,
            key: 'cancelFee',
          },
          {
            name: '취소 금액',
            value: `${this.$format.numberFormat((reservationInfo.paymentPrice - reservationInfo.penaltyFee))}원`,
            key: 'cancelPrice',
          },
        ];
      }
      return obj;
    },
    objPayment() {
      const { reservationInfo } = this.objSelectedReserveInfo;
      const { paymentPrice, welfarePoint, roomPrice } = reservationInfo;
      let cancelPrice = 0;
      const map = {
        creditCardAmount: '카드 결제',
        account: '계좌 이체',
        welfarePoint: '기타 결제',
      };
      const obj = {
        title: '결제 내역',
        list: [
          {
            name: '예약 금액',
            value: `${this.$format.numberFormat(roomPrice)}원`,
          },
          {
            name: '결제 수단',
            value: `${ Object.keys(map).filter((v) => reservationInfo[v]).map((v) => map[v]).join(' + ') }`,
          },
        ],
      };
      if (roomPrice !== paymentPrice) {
        obj.list.push({
          name: '할인 금액',
          value: `(-) ${this.$format.numberFormat(roomPrice - paymentPrice)}원`,
        });
      }
      if (welfarePoint) {
        obj.list.push({
          name: '기타 결제',
          value: `${this.$format.numberFormat(welfarePoint)}원`,
        });
      }
      if (reservationInfo.reservationStatus === 'CANCELED') {
        cancelPrice = (reservationInfo.paymentPrice - reservationInfo.penaltyFee);
        obj.list.push({
          name: '취소금액',
          value: `(-) ${this.$format.numberFormat(cancelPrice)}원`,
        });
      }
      obj.list.push({
        name: '최종 결제 금액',
        value: `<strong>${this.$format.numberFormat((paymentPrice - cancelPrice))}</strong>원`,
      });
      return obj;
    },
  },
  methods: {
    placeListDateFormat(str) {
      return str.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(str.split(' ')[0], 'dow')}) `);
    },
    openCancel() {
      this.$emit('popup', 'Cancel');
    },
  },
};
</script>

<style lang="scss">
  .placeReserveVoucher{
    padding-bottom: 80px;
    .pageTitle{
      font-size: 23px;
      font-weight: bold;
      line-height: 30px;
      padding: 20px $sidePadding * 1px;
    }
    .infoWrap{
      .info{
        margin-top: 20px;
        color: #000;
        border-bottom: 10px solid #f8f9fb;
        &:first-of-type{
          margin-top: 0;
        }
        &:last-of-type{
          border: none;
        }
        .title{
          font-weight: bold;
          font-size: 13px;
          line-height: 20px;
          padding: 10px $sidePadding * 1px;
        }
        .content{
          padding: 0 0 20px;
          .listWrapper{
            padding: 0 $sidePadding * 1px;
            .optionList{
              border-top: 1px solid #ebecf1;
              padding: 10px 0;
            }
            &:first-of-type{
              .optionList{
                padding: 0 0 10px 0;
                border: none;
              }
            }
            &:last-of-type{
              .optionList{
                padding: 10px 0 0 0;
              }
            }
            .list{
              width: 100%;
              padding: 10px 0;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-pack: justify;
              -ms-flex-pack: justify;
              justify-content: space-between;
              font-size: 16px;
              line-height: 22px;
              .name{
                flex-shrink: 0;
                color: #939499;
                width: 35%;
              }
              .value{
                flex-shrink: 0;
                color: #000;
                width: 65%;
                text-align: right;
                &.cancel{
                  color: #d31111;
                  > span{
                    text-decoration: line-through;
                    color: #000;
                  }
                }
              }
              &:first-of-type{
                margin-top: 0;
              }
            }
          }
        }
        &.payment{
          .content{
            .listWrapper{
              &:last-of-type{
                margin-top: 10px;
                > div{
                  padding-top: 20px;
                  border-top: 1px solid #ebecf1;
                }
                .value{
                  font-size: 18px;
                }
              }
            }
          }
        }
        &.productInfo{
          .content{
            &.canceled{
              padding: 0;
            }
            .cancelInfo{
              background-color: #f8f9fb;
              padding: 10px 0 0;
              .cancelState{
                color: #d31111;
              }
            }
          }
        }
      }
    }
    .btnWrap{
      margin-top: 30px;
      padding: 20px $sidePadding * 1px;
      .largeFillButton{
        width: 100%;
        height: 46px;
        border-radius: 4px;
        border: 1px solid #000;
      }
    }
  }
</style>
