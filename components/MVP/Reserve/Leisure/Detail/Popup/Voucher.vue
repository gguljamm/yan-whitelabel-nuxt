<template>
  <div class="leisureReserveVoucher">
    <div class="fixWidth">
      <div class="pageTitle">예약 확인서</div>
      <div class="infoWrap">
        <div class="info">
          <div class="title">{{ objReservationInfo.title }}</div>
          <div class="listWrapper">
            <div
              v-for="(arrGroup, groupIndex) in objReservationInfo.list"
              :key="groupIndex"
              class="groupWrap"
            >
              <div class="group">
                <div class="optionInfo">
                  <div>
                    <div
                      v-for="(objItem, itemIndex) in arrGroup"
                      :key="itemIndex"
                      class="list"
                    >
                      <div class="name">{{ objItem.name }}</div>
                      <div class="val cancel"
                        v-if="objItem.type === 'status' && !objSelectedReserveInfo.orderOption.some((v) => v.status.indexOf('CANCEL') < 0)">
                        <span>{{ objSelectedReserveInfo.orderId }}</span> 취소 {{ objSelectedReserveInfo.orderOption.some((v) => v.status.indexOf('CANCEL_REQUEST') >= 0) ? '처리 중' : '완료' }}
                      </div>
                      <div v-else class="val">{{ objItem.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="title">{{ objProductInfo.title }}</div>
          <div class="listWrapper">
            <div
              v-for="(arrOrderOptionGroup, groupIndex) in objProductInfo.list"
              :key="groupIndex"
              class="groupWrap"
            >
              <div
                v-for="(arrOptionGroup, arrOptionIndex) in arrOrderOptionGroup"
                :key="arrOptionIndex"
                class="group"
              >
                <div class="optionInfo">
                  <div>
                    <div
                      v-for="(objOption, objOptionIndex) in arrOptionGroup.arrOption"
                      :key="objOptionIndex"
                      class="list"
                      :class="objOption.key"
                      v-show="objOption.value"
                    >
                      <div class="name">{{ objOption.name }}</div>
                      <div class="value">{{ objOption.value }}</div>
                    </div>
                  </div>
                </div>
                <div v-if="arrOptionGroup.arrCancelInfo" class="cancelInfo">
                  <div>
                    <div
                      v-for="(objCancelInfo, objCancelInfoIndex) in arrOptionGroup.arrCancelInfo.filter((v) => v.key !== 'date' || v.value)"
                      :key="`${objCancelInfoIndex}-cancel`"
                      class="list"
                      :class="objCancelInfo.key"
                    >
                      <div class="name">{{ objCancelInfo.name }}</div>
                      <div class="value">{{ objCancelInfo.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info payment">
          <div class="title">{{ objPayment.title }}</div>
          <div class="listWrapper">
            <div
              v-for="(objItem, itemIndex) in objPayment.list"
              :key="itemIndex"
              class="list"
            >
              <div class="name">{{ objItem.name }}</div>
              <div class="value">{{ objItem.value }}</div>
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
    arrPopupData: {
      type: Array,
      default: () => [],
    },
    isCancelable: {
      type: Boolean,
      default: false,
    },
    objSelectedReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      statusMap: {
        RESERVATION_REQUESTED: '요청함',
        RESERVATION_SUCCEEDED: '요청 성공',
        RESERVATION_FAILED: '요청 실패',
        CANCEL_REQUESTING: '예약 취소 요청',
        CANCEL_REQUEST_FAILED: '예약 취소 요청 실패',
        CANCEL_REQUESTED: '예약 취소 요청',
        CANCELED: '예약 취소',
        CANCEL_FAILED: '예약 취소 실퍠',
        FORCED_CANCELED: '강제 취소',
        CONSUMED: '사용됨',
      },
    };
  },
  computed: {
    totalPrice() {
      return this.objSelectedReserveInfo.orderOption.reduce((total, objOption) => total + (objOption.salePrice || 0), 0);
    },
    cancelPrice() {
      const map = ['CANCEL_REQUESTING', 'CANCEL_REQUESTED', 'CANCELED', 'FORCED_CANCELED'];
      return this.objSelectedReserveInfo.orderOption.filter((objOption) => map.indexOf(objOption.status) >= 0).reduce((total, objOption) => total + (objOption.salePrice || 0) - (objOption.channelDiscounts && objOption.channelDiscounts.length > 0 ? objOption.channelDiscounts.reduce((total2, v) => total2 + v.discountAmount, 0) : 0), 0);
    },
    objReservationInfo() {
      const { orderId, customerInfo, createdDate } = this.objSelectedReserveInfo;
      return {
        title: '예약 정보',
        list: [
          [{
            name: '예약 번호',
            value: orderId,
            type: 'status',
          },
          {
            name: '예약 일자',
            value: createdDate.replace(/-/g, '.').replace(' ', `(${this.$format.formatDate(createdDate.split(' ')[0], 'dow')}) `),
          }],
          [{
            name: '예약자명',
            value: customerInfo.customerName,
          },
          {
            name: '예약자 연락처',
            value: this.$format.formatPhone(customerInfo.customerPhone),
          }],
          [
          {
            name: '방문자명',
            value: customerInfo.visitorName ? customerInfo.visitorName : customerInfo.customerName,
          },
          {
            name: '방문자 연락처',
            value: this.$format.formatPhone(customerInfo.visitorPhone ? customerInfo.visitorPhone : customerInfo.customerPhone),
          }],
        ],
      };
    },
    objProductInfo() {
      const { orderOption } = this.objSelectedReserveInfo;
      const arrOrderOptionGroup = Object.values(orderOption.reduce((result, obj) => ({ ...result, [`${obj.optionId}`]: (result[`${obj.optionId}`] || []).concat(obj) }), {}));
      return {
        title: '예약 내역',
        list: [
          ...arrOrderOptionGroup.map((arrOptionGroup, arrOrderOptionGroupIndex) => arrOptionGroup.map((objOption, arrOptionGroupIndex) => {
              const obj = {
                arrOption: [
                  {
                    name: `선택 ${arrOrderOptionGroupIndex + 1}${arrOptionGroup.length > 1 ? `-${arrOptionGroupIndex + 1}` : ''}`,
                    value: objOption.optionName,
                  },
                  {
                    name: '주문 번호',
                    value: objOption.orderOptionId,
                  },
                  {
                    name: '핀번호',
                    value: objOption.orderedOptionItem.find((v) => v.pinCode) ? objOption.orderedOptionItem.find((v) => v.pinCode).pinCode : '',
                  },
                  {
                    name: '사용 가능 기간',
                    value: `~${objOption.expiredType === 'ON_PERIOD' ? objOption.period.end : objOption.expirationDate.replace(/-/g, '.')}(${this.$format.formatDate(objOption.expiredType === 'ON_PERIOD' ? objOption.period.end : objOption.expirationDate.split(' ')[0], 'dow')})`,
                  },
                  {
                    name: '할인 금액',
                    value: `(-) ${this.$format.numberFormat(this.discountPrice(objOption))}원`,
                  },
                  {
                    name: '결제 금액',
                    value: `${this.$format.numberFormat((objOption.salePrice || 0) - this.discountPrice(objOption))}원`,
                  },
                ],
              };
              if (objOption.status.indexOf('CANCEL') >= 0) {
                obj.arrCancelInfo = [
                  {
                    name: '상태',
                    value: this.statusMap[objOption.status],
                    key: 'status',
                  },
                  {
                    name: '취소 일시',
                    value: objOption.canceledDate,
                    key: 'date',
                  },
                  {
                    name: '취소 금액',
                    value: `${this.$format.numberFormat((objOption.salePrice || 0) - this.discountPrice(objOption))}원`,
                  },
                ];
              }
              return obj;
            })),
        ],
      };
    },
    objPayment() {
      const list = [
        {
          name: '결제 수단',
          value: '카드 결제',
        },
        {
          name: '예약 금액',
          value: `${this.$format.numberFormat(this.totalPrice)}원`,
        },
      ];
      const { orderOption } = this.objSelectedReserveInfo;
      let totDiscount = 0;
      if (orderOption.some((v) => v.channelDiscounts && v.channelDiscounts.length > 0)) {
        totDiscount = orderOption.reduce((tot, v2) => tot + v2.channelDiscounts.reduce((total, v) => total + v.discountAmount, 0), 0);
        list.push({
          name: '할인 금액',
          value: `(-) ${this.$format.numberFormat(totDiscount)}원`,
        });
      }
      if (this.cancelPrice) {
        list.push({
          name: '환불 금액',
          value: `(-) ${this.$format.numberFormat(this.cancelPrice)}원`,
        });
      }
      list.push({
        name: '최종 결제 금액',
        value: `${this.$format.numberFormat((this.totalPrice - this.cancelPrice - totDiscount))}원`,
      });
      return {
        title: '결제 내역',
        list,
      };
    },
  },
  methods: {
    openCancel() {
      window.scrollTo(0, 0);
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push(`/leisure/reserve/${this.$route.params.detail}/Cancel`);
    },
    discountPrice(option) {
      return option.channelDiscounts && option.channelDiscounts.length > 0 ? option.channelDiscounts.reduce((total, v) => total + v.discountAmount, 0) : 0;
    },
  },
};
</script>

<style lang="scss">
  .leisureReserveVoucher{
    padding-bottom: 80px;
    .pageTitle{
      font-size: 23px;
      font-weight: bold;
      line-height: 30px;
      padding: 20px $sidePadding * 1px;
    }
    .infoWrap{
      .info{
        font-size: 14px;
        color: #000;
        margin-top: 20px;
        border-bottom: 10px solid #f8f9fb;
        &:first-of-type{
          margin-top: 0;
          padding-top: 10px;
        }
        &:last-of-type{
          border: none;
        }
        &.payment{
          padding: 0 $sidePadding * 1px;
          .title{
            padding: 10px 0;
          }
          .listWrapper{
            .list{
              padding: 10px 0;
              &:last-of-type{
                margin-top: 10px;
                border-top: 1px solid #ebecf1;
                padding: 20px 0 10px;
              }
            }
          }
        }
        .title{
          font-weight: bold;
          padding: 10px $sidePadding * 1px;
        }
        .listWrapper{
          .groupWrap{
            padding: 10px 0 0;
            &:first-of-type{
              padding: 0;
            }
            &:last-of-type{
              padding: 10px 0 0;
              .group > div:last-of-type{
                > div{
                  border-bottom: 0;
                }
              }
            }
            .group{
              > div:last-of-type{
                > div{
                  border-bottom: 1px solid #ebecf1;
                }
              }
              .optionInfo{
                padding: 0 $sidePadding * 1px;
                > div{
                  padding: 10px 0;
                }
              }
              &:first-of-type{
                .optionInfo{
                  padding: 0 $sidePadding * 1px;
                  > div{
                    padding: 0 0 10px;
                  }
                }
              }
              .cancelInfo{
                padding: 10px $sidePadding * 1px 0;
                background-color: #f8f9fb;
                > div{
                  padding-bottom: 10px;
                }
                .list{
                  &.status{
                    .value{
                      color: #d31111;
                    }
                  }
                }
              }
            }
          }
          .list{
            width: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            font-size: 16px;
            line-height: 22px;
            padding: 10px 0;
            .name{
              flex-shrink: 0;
              color: #939499;
              width: 35%;
            }
            .val{
              flex-shrink: 0;
              text-align: right;
              width: 65%;
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
