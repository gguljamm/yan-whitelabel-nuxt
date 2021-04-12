<template>
  <div class="paymentLeisureWrapper">
    <div class="productWrap">
      <div class="titleWrap">
        <div
          class="mainImg"
          :style="objLeisure.leisure.images.length > 0 ? { backgroundImage: `url(${objLeisure.leisure.images[0].bpUrl})` } : {}"
        ></div>
        <div class="info">
          <div class="category">{{ objLeisure.leisure.categoryName }}</div>
          <div class="name">{{ objLeisure.leisure.name }}</div>
        </div>
      </div>
      <div v-if="arrOptions.length > 0" class="optionInfo">
        <div class="infoListWrapper">
          <ul
            v-for="(objOption, optionIndex) in arrOptions"
            :key="optionIndex"
          >
            <li>
              <span>선택 {{ optionIndex + 1 }}</span>
              <span>{{ objOption.name }} / {{ params.count[optionIndex] }}개</span>
            </li>
            <li>
              <span>사용 가능 기간</span>
              <span>~{{ dateFormatDot(
                objOption.expiredType === 'ON_PERIOD'
                  ? endDateTimeFormat(objOption.availablePeriod.endDateTime)
                  : $format.ymdDate(new Date(new Date().setDate(new Date().getDate() + objOption.expiredAt)))) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="noOption">
        <div>선택된 상품이 존재하지 않습니다.</div>
        <button @click="$router.push(`/leisure/result/${params.dealId}`)">돌아가기</button>
      </div>
    </div>
    <div v-if="objLeisure.leisure.usageInfo" class="usageInfoWrap">
      <div class="title">상품 사용 안내</div>
      <div class="info" v-html="replaceNewLineChar(objLeisure.leisure.usageInfo)"></div>
    </div>
    <div class="reserveInfoWrap">
      <div class="title">예약 정보</div>
      <div
        v-if="!($store.state.reservation.uninitialized && objReserveInfo.phone && objReserveInfo.name)"
        class="verifyWrap"
      >
        <button
          class="verifyBtn"
          :class="{ verified : isPhoneConfirmed }"
          @click="openVerification('verification')"
        >{{ isPhoneConfirmed ? `${objReserveInfo.name} ${objReserveInfo.phone}` : '인증이 필요합니다.' }}</button>
      </div>
      <div class="otherCustomer">
        <div
          class="checkBox"
          :class="{ active: isDifferGuest }"
        >
          <label><div class="checkIcon"></div><input
            type="checkbox" @change="changeDifferGuest"
          ><span class="checkName">다른 사람이 이용할 거예요</span></label>
        </div>
        <div class="inputWrap" v-if="isDifferGuest">
          <div class="inputBox">
            <input
              class="customerInput"
              placeholder="방문자 이름"
              type="text"
              v-model="objGuestInfo.name"
            >
            <input
              class="customerInput"
              placeholder="방문자 휴대폰 번호"
              type="text" maxlength="13"
              pattern="\d*"
              v-model="objGuestInfo.phone"
              @input="formatPhone($event, 'objGuestInfo')"
            >
          </div>
          <div class="noti">입장 시 방문자의 정보로 본인 여부를 확인합니다.</div>
        </div>
      </div>
    </div>
    <div class="priceInfoWrap">
      <div class="title">가격 및 할인 정보</div>
      <ul>
        <template v-if="totalCoverPrice && totalSalePrice && totalCoverPrice > totalSalePrice">
          <li>
            <span>정상 금액</span>
            <span>{{ $format.numberFormat(totalCoverPrice) }}원</span>
          </li>
          <li>
            <span>야놀자 할인 금액</span>
            <span>(-) {{ $format.numberFormat(totalCoverPrice - totalSalePrice) }}원</span>
          </li>
        </template>
        <template v-else>
          <li>
            <span>예약 금액</span>
            <span>{{ totalSalePrice ? $format.numberFormat(totalSalePrice) : 0 }}원</span>
          </li>
        </template>
        <li v-if="discountAmount">
          <span>
            {{ displayName }} 금액</span>
          <span>(-) {{ $format.numberFormat(discountAmount) }}원</span>
        </li>
        <li>
          <span>최종 결제 금액</span>
          <span><strong>{{ totalSalePrice ? $format.numberFormat(totalSalePrice - discountAmount) : 0 }}</strong>원</span>
        </li>
      </ul>
    </div>
    <div class="noticeWrap">
      <div class="agreement">
        <div class="title">규정 및 약관 동의</div>
        <div v-if="objLeisure.leisure.refundInfo" v-html="replaceNewLineChar(objLeisure.leisure.refundInfo)" class="refundInfo"></div>
        <div
          class="checkBox"
          :class="{ active: isActiveAllAgreement }"
        >
          <label><div class="checkIcon"></div><input
            type="checkbox" @change="$emit('changeAllAgreement', !isActiveAllAgreement)"
          ><span class="checkName">모두 동의</span></label>
        </div>
        <ul>
          <li
            v-for="(obj, index) in arrAgreement"
            :key="index"
          >
            <div class="name">
              <label>
                <div class="checkIcon" :class="{ active: obj.val }"></div>
                <input type="checkbox" v-model="obj.val">
                {{ obj.name }}
              </label>
            </div>
            <div v-if="obj.key" @click="openPopup(obj.key)" class="rightCheck"></div>
          </li>
        </ul>
      </div>
    </div>
    <global-button
      :text="'결제하기'"
      :subText="{
        text: '결제 금액',
        price: `<strong>${ $format.numberFormat(totalSalePrice - discountAmount) }</strong>원`,
      }"
      :disabled="!validData"
      @submit="validData ? submit() : notification()"
    ></global-button>
  </div>
</template>

<script>
import leisureAgreement from '~/utils/static.json';

export default {
  props: {
    objLeisure: {
      type: Object,
      default: () => {},
    },
    objReserveResult: {
      type: Object,
      default: () => {},
    },
    params: {
      type: Object,
      default: () => {},
    },
    isPhoneConfirmed: {
      type: Boolean,
      default: false,
    },
    isDifferGuest: {
      type: Boolean,
      default: false,
    },
    objReserveInfo: {
      type: Object,
      default: () => {},
    },
    objGuestInfo: {
      type: Object,
      default: () => {},
    },
    arrAgreement: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      leisureAgreement: leisureAgreement.leisure.agreement,
    };
  },
  computed: {
    validData() {
      return this.isPhoneConfirmed
        && (!this.isDifferGuest || !(this.objGuestInfo.name === '' || this.objGuestInfo.phone === '' || !/^\d{3}-\d{3,4}-\d{4}$/.test(this.objGuestInfo.phone)))
        && this.isActiveAllAgreement
        && this.arrOptions.length > 0;
    },
    arrOptions() {
      const { optionsId } = this.params;
      return this.objLeisure.leisure.options.filter((obj) => optionsId.map((id) => id * 1).indexOf(obj.id) >= 0);
    },
    totalCoverPrice() {
      const { count } = this.params;
      return this.arrOptions.map((option) => (option.coverPrice)).reduce((acc, it, index) => acc + (it * count[index]), 0);
    },
    totalSalePrice() {
      const { count } = this.params;
      return this.arrOptions.map((option) => (option.gajagoSalePrice)).reduce((acc, it, index) => acc + (it * count[index]), 0);
    },
    isActiveAllAgreement() {
      return this.arrAgreement.every((obj) => obj.val);
    },
    discountAmount() {
      const { count } = this.params;
      return this.arrOptions.reduce((acc, it, index) => acc + (this.discountInfo(it.gajagoSalePrice, 'appliedPrice') * count[index]), 0);
    },
    displayName() {
      const arrName = this.arrOptions.reduce((arr, it) => {
        const temp = this.$format.optimizedDiscountPrice(it.gajagoSalePrice, this.$store.state.channelInfo.discount.leisure);
        if (temp && temp.discountName && arr.indexOf(temp.discountName) < 0) {
          arr.push(temp.discountName);
        }
        return arr;
      }, []);
      if (arrName.length > 0) {
        return arrName.join('+');
      }
      return '추가 즉시 할인';
    },
  },
  methods: {
    discountInfo(price, type) {
      const temp = this.$format.optimizedDiscountPrice(price, this.$store.state.channelInfo.discount.leisure);
      return temp ? temp[type] : 0;
    },
    endDateTimeFormat(str) {
      let date = new Date(`${str.replace(' ', 'T')}.000+09:00`);
      const time = str.split(' ')[1];
      if (time === '00:00:00') {
        date = this.$format.ymdDate(new Date(date - 1));
      } else {
        date = `${this.$format.ymdDate(date)}${time ? ` ${time}` : ''}`;
      }
      return date;
    },
    dateFormatDot(str) {
      return `${str.replace(/-/g, '.')}(${this.$format.formatDate(str.split(' ')[0], 'dow')})`;
    },
    notification() {
      const arrMessage = [];
      if (!this.isPhoneConfirmed) {
        arrMessage.push('본인 인증 후 결제가 가능합니다.');
      } else if (!(!this.isDifferGuest || !(this.objGuestInfo.name === '' || this.objGuestInfo.phone === '' || !/^\d{3}-\d{3,4}-\d{4}$/.test(this.objGuestInfo.phone)))) {
        arrMessage.push('방문자 정보를 모두 입력해주세요.');
      } else if (!this.isActiveAllAgreement) {
        arrMessage.push('규정 및 약관에 동의해주세요.');
      }
      arrMessage.forEach((text) => {
        this.$store.commit('openNotice', {
          text,
          bottom: 86 + 20,
        });
      });
    },
    replaceNewLineChar(strInfo) {
      return strInfo ? strInfo.replace(/(\r\n|\r|\n)/g, '<br>') : '';
    },
    formatPhone(e) {
      let temp = this.objGuestInfo.phone;
      if (/[^0-9]/g.test(e.target.value)) {
        temp = temp.replace(/[^0-9]/g, '');
      }
      if (temp.length < 4) {
        this.objGuestInfo.phone = temp;
      } else if (temp.length < 7) {
        this.objGuestInfo.phone = `${temp.substr(0, 3)}-${temp.substr(3, temp.length - 1)}`;
      } else if (temp.length < 11) {
        this.objGuestInfo.phone = `${temp.substr(0, 3)}-${temp.substr(3, 3)}-${temp.substr(6, temp.length - 1)}`;
      } else {
        this.objGuestInfo.phone = `${temp.substr(0, 3)}-${temp.substr(3, 4)}-${temp.substr(7, temp.length - 1)}`;
      }
    },
    changeDifferGuest() {
      this.$emit('changeDifferGuest', !this.isDifferGuest);
    },
    submit() {
      const { count } = this.params;
      const objReserveData = {
        customerInfo: {
          customerName: this.objReserveInfo.name,
          customerPhone: this.objReserveInfo.phone.replace(/-/g, ''),
        },
        dealName: this.objLeisure.leisure.name,
        dealId: this.objLeisure.leisure.id,
        options: this.arrOptions.map((obj, index) => ({
          optionId: obj.id,
          quantity: (count[index] * 1),
          // costPrice: (obj.coverPrice || obj.gajagoSalePrice || 0),
          salePrice: obj.gajagoSalePrice,
          name: obj.name,
          start: obj.expiredType === 'ON_PERIOD' ? obj.availablePeriod.start : this.$format.ymdDate(new Date()),
          end: obj.expiredType === 'ON_PERIOD' ? obj.availablePeriod.end : this.$format.ymdDate(new Date((new Date()).setDate(new Date().getDate() + obj.expiredAt))),
          discountPolicyNo: this.discountInfo(obj.gajagoSalePrice, 'discountPolicyNo'),
          discountName: this.discountInfo(obj.gajagoSalePrice, 'discountName'),
          discountAmount: this.discountInfo(obj.gajagoSalePrice, 'appliedPrice'),
          maxDiscountAmount: this.discountInfo(obj.gajagoSalePrice, 'maxDiscountAmount'),
          minItemPrice: this.discountInfo(obj.gajagoSalePrice, 'minItemPrice'),
        })),
        paymentInfo: {
          totalSalePrice: this.totalSalePrice,
          discountAmount: this.discountAmount,
        },
        reservedDate: this.$format.ymdDate(new Date()),
        browserId: this.$store.state.sessionId,
      };
      if (this.objLeisure.leisure.categoryName) {
        objReserveData.dealCategory = this.objLeisure.leisure.categoryName;
      }
      if (this.isDifferGuest) {
        objReserveData.customerInfo = {
          ...objReserveData.customerInfo,
          visitorName: this.objGuestInfo.name,
          visitorPhone: this.objGuestInfo.phone.replace(/-/g, ''),
        };
      } else {
        objReserveData.customerInfo = {
          ...objReserveData.customerInfo,
          visitorName: objReserveData.customerInfo.customerName,
          visitorPhone: objReserveData.customerInfo.customerPhone,
        };
      }
      // console.log(objReserveData);
      this.$emit('submitReserve', objReserveData);
    },
    openVerification(flag) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `${this.$route.path}/${flag}`,
        query: this.$route.query,
      });
    },
    openPopup(key) {
      this.$emit('openPopup', key);
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>

<style lang="scss">
.paymentLeisureWrapper{
  .productWrap{
    .infoListWrapper{
      margin-top: 20px;
      padding-bottom: 20px;
      ul{
        li{
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
          span:nth-child(1) {
            display: inline-block;
            width: 35%;
            color: #939499;
            flex-shrink: 0;
          }
          span:nth-child(2) {
            display: inline-block;
            width: 65%;
            color: #000;
            text-align: right;
          }
        }
      }
    }
  }
  .productWrap{
    padding: 0 $sidePadding * 1px;
    background-color: #fff;
    border-bottom: 10px solid #f8f9fb;
    .titleWrap{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #ebecf1;
      .mainImg{
        flex-shrink: 0;
        width: 46px;
        height: 46px;
        border-radius: 23px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #ebecf1;
      }
      .info{
        margin-left: 14px;
        .category{
          color: #939499;
          font-size: 13px;
          font-weight: bold;
          line-height: 18px;
          margin-bottom: 2px;
        }
        .name{
          width: 100%;
          font-weight: bold;
          font-size: 16px;
          line-height: 22px;
        }
      }
    }
    .optionInfo{
      .infoListWrapper{
        ul {
          padding: 10px 0;
          border-top: 1px solid #ebecf1;
          &:first-of-type{
            border: none;
            padding: 0 0 10px;
          }
          &:last-of-type{
            padding: 10px 0 0;
          }
        }
      }
    }
    .noOption{
      padding: 20px 0;
      text-align: center;
      font-size: 14px;
      button{
        display: block;
        margin: 10px auto 0;
        text-decoration: underline;
      }
    }
  }
  .usageInfoWrap{
    padding: 20px $sidePadding * 1px 30px;
    color: #000;
    background-color: #fff;
    border-bottom: 10px solid #f8f9fb;
    .title{
      font-size: 13px;
      padding: 10px 0;
      font-weight: bold;
      line-height: 20px;
    }
    .info{
      font-size: 13px;
      line-height: 20px;
    }
  }
  .reserveInfoWrap{
    padding: 20px 0 30px;
    background-color: #fff;
    border-bottom: 10px solid #f8f9fb;
    .title{
      font-size: 13px;
      line-height: 20px;
      font-weight: bold;
      color: #000;
      padding: 10px $sidePadding * 1px;
    }
    .verifyWrap{
      padding: 24px $sidePadding * 1px;
      border-bottom: 1px solid #ebecf1;
      .verifyBtn{
        width: 100%;
        height: 22px;
        font-size: 16px;
        text-align: left;
        color: #000;
        position: relative;
        &.verified{
          color: #000;
          &:after{
            content: '변경';
            display: block;
            background: none;
            line-height: 20px;
            font-size: 13px;
            color: #939499;
            width: auto;
          }
        }
        &:after{
          content: '';
          position: absolute;
          width: 22px;
          height: 22px;
          background: url(~assets/img/icon-chevron-right.svg) center center no-repeat;
          background-size: 22px;
          right: 0;
          top: 0;
        }
      }
    }
    .otherCustomer{
      padding: 10px $sidePadding * 1px 0;
      .inputWrap{
        padding-top: 10px;
        .inputBox{
          .customerInput{
            font-size: 16px;
            display: block;
            width: 100%;
            height: 55px;
            border: 0;
            border-bottom: 1px solid #ebecf1;
          }
        }
        .noti{
          padding-top: 10px;
          font-size: 13px;
          color: #939499;
          line-height: 17px;
          &:before{
            content: '';
            width: 14px;
            height: 14px;
            float: left;
            background: url(~assets/img/icon-info.svg) center center no-repeat;
            background-size: 14px;
            margin-right: 4px;
            opacity: 0.35;
          }
        }
      }
    }
  }
  .priceInfoWrap{
    padding: 20px $sidePadding * 1px 30px;
    background-color: #fff;
    border-bottom: 10px solid #f8f9fb;
    .title{
      font-size: 13px;
      color: #000;
      font-weight: bold;
      line-height: 20px;
      padding: 10px 0;
    }
    ul{
      li{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        padding: 10px 0;
        line-height: 20px;
        span{
          display: inline-block;
          font-size: 16px;
          &:nth-child(1) {
            color: #939499;
          }
          &:nth-child(2) {
            color: #000;
          }
        }
        &:last-of-type{
          margin-top: 10px;
          padding-top: 20px;
          border-top: 1px solid #ebecf1;
          span:nth-child(2) {
            font-size: 18px;
          }
        }
      }
    }
  }

  .noticeWrap {
    padding: 20px $sidePadding * 1px;
    background-color: #fff;
    .refundInfo {
      border-radius: 4px;
      font-size: 13px;
      line-height: 20px;
      padding: 16px 12px;
      background-color: #fdf1f1;
      color: #000;
      margin-bottom: 10px;
    }
    .agreement{
      padding-bottom: 30px;
      .title{
        font-size: 13px;
        font-weight: bold;
        color: #000;
        padding: 10px 0;
        line-height: 20px;
      }
      .checkBox{
        padding: 10px 0;
        .checkName{
          font-weight: bold;
          color: #000;
        }
      }
      ul{
        li{
          padding: 12px 22px 12px 0;
          position: relative;
          &:first-of-type{
            margin-top: 0;
          }
          .rightCheck{
            cursor: pointer;
            top: 11px;
            right: 0;
            position: absolute;
            width: 22px;
            height: 22px;
            background: url(~assets/img/icon-chevron-right.svg) center center no-repeat;
            background-size: 22px;
          }
          .name{
            line-height: 20px;
            font-size: 13px;
            color: #939499;
            label{
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              input{
                display: none;
              }
            }
            .checkIcon{
              cursor: pointer;
              margin-left: 10px;
              margin-right: 10px;
              width: 20px;
              height: 20px;
              background-color: rgb(197, 198, 203);
              border-radius: 10px;
              &:before{
                content: '';
                display: block;
                width: 20px;
                height: 20px;
                background: url(~assets/img/icon-check-white.svg) center center no-repeat;
                background-size: 20px;
              }
              &.active{
                background-color: #000;
              }
            }
          }
        }
      }
    }
  }
  .checkBox{
    font-size: 14px;
    &.active{
      > label > div{
        background-color: #000;
      }
    }
    > label{
      display: block;
      line-height: 20px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      .checkIcon{
        cursor: pointer;
        width: 20px;
        height: 20px;
        background-color: rgb(197, 198, 203);
        border-radius: 10px;
        &:before{
          content: '';
          display: block;
          width: 20px;
          height: 20px;
          background: url(~assets/img/icon-check-white.svg) center center no-repeat;
          background-size: 20px;
        }
      }
      .checkName{
        margin-left: 8px;
      }
      input{
        display: none;
      }
    }
  }
}
</style>
