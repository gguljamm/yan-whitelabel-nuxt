<template>
  <div class="paymentPlaceWrapper">
    <div class="content" v-if="objPlace.status === 'loaded' && room">
      <DawnCheckIn v-if="isDawn"></DawnCheckIn>
      <component
        :is="channelNotice"
      ></component>
      <div class="productInfo">
        <div class="titleWrap">
          <div
            class="mainImg"
            :style="{
                backgroundImage: representationImage ? `url(${representationImage.thumbUrl || representationImage.bpUrl})` : '',
              }"
          ></div>
          <div class="info">
            <div class="category">
              <span>{{ categoryNameMap[objPlace.place.category.toLowerCase()] }}</span>
              <span v-show="objPlace.place.star && objPlace.place.star.rating">| {{ objPlace.place.star ? objPlace.place.star.rating : '' }}성급</span>
            </div>
            <div class="name">{{ objPlace.place.korName }}</div>
          </div>
        </div>
        <div class="roomTitleWrap">
          <div class="roomName" v-html="room.name.find(v => v.language === 'ko').name"></div>
          <div class="roomDescription" v-if="room.description" v-html="room.description.replace(/(\r\n|\r|\n)/g, '<br>')"></div>
        </div>
        <div class="roomImage">
          <div ref="mySwiper" v-swiper:paymentPlaceSwiper="swiperOptions" @slideChange="changeSwipe()">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(x, index) in room.images" :key="index">
                <div
                  class="fixedImage"
                  :style="{
                    backgroundImage: `url(${x.bpUrl})`,
                    height: `${imgHeight}px`,
                  }"
                ></div>
              </div>
            </div>
          </div>
          <div class="pageNum">
            <div class="val">{{ imgIndex + 1 }}/{{ room.images.length }}</div>
          </div>
        </div>
        <table class="roomTimeTable">
          <thead>
          <tr>
            <td>체크인</td>
            <td>체크아웃</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{ room.checkIn ? room.checkIn.split(' ')[1].split(':').slice(0, 2).join(':') : '' }} 부터</td>
            <td>{{ room.checkOut ? room.checkOut.split(' ')[1].split(':').slice(0, 2).join(':') : '' }} 까지</td>
          </tr>
          </tbody>
        </table>
        <div class="infoListWrapper">
          <ul>
            <li class="infoList">
              <span>객실</span>
              <span v-html="room.name.find(v => v.language === 'ko').name"></span>
            </li>
            <li>
              <span>날짜</span>
              <span>{{
                  dateFormat(params.checkin)
                }} - {{
                  params.checkin.split('-')[0] !== params.checkout.split('-')[0] ? `${params.checkout}. ` : ''
                }}{{
                  $format.formatDate(params.checkout, 'zerodot') }}
              {{
                  `(${$format.formatDate(params.checkout, 'dow')})`
                }} {{
                  `${$format.getBetweenDay(params.checkin, params.checkout)}박`
                }}</span>
            </li>
            <li>
              <span>기준 인원</span>
              <span>성인 {{ room.capacity }}명 (최대 {{ room.maxCapacity }}명)</span>
            </li>
            <li>
              <span>조식 여부</span>
              <span>조식 {{ room.breakfast === 'AVAILABLE' ? '포함' : '불포함' }}</span>
            </li>
          </ul>
        </div>
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
                @focus="focusInputKey = 'name'"
                @blur="focusInputKey = ''"
              >
              <transition name="fade">
                <div v-if="objGuestInfo.name && focusInputKey === 'name'" class="clear" @click="objGuestInfo.name = ''"></div>
              </transition>
            </div>
            <div class="inputBox">
              <input
                class="customerInput"
                placeholder="방문자 휴대폰 번호"
                type="text" maxlength="13"
                pattern="\d*"
                v-model="objGuestInfo.phone"
                @input="formatPhone($event, 'objGuestInfo')"
                @focus="focusInputKey = 'phone'"
                @blur="focusInputKey = ''"
              >
              <transition name="fade">
                <div v-if="objGuestInfo.phone && focusInputKey === 'phone'" class="clear" @click="objGuestInfo.phone = ''"></div>
              </transition>
            </div>
            <div class="noti">체크인 시 방문자의 정보로 본인 여부를 확인합니다.</div>
          </div>
          <div class="transportation">
            <button :class="!isCarFlag ? 'active' : ''" @click="$emit('changeCarFlag', false)">도보 방문</button>
            <button :class="isCarFlag ? 'active' : ''" @click="checkVehicle()">차량 방문</button>
          </div>
        </div>
      </div>
      <div class="priceInfoWrap">
        <div class="title">가격 및 할인 정보</div>
        <ul>
          <template v-if="room.price && room.price > room.discountPrice">
            <li>
              <span>정상 금액</span>
              <span>{{ $format.numberFormat(room.price) }}원</span>
            </li>
            <li>
              <span>야놀자 할인 금액</span>
              <span>(-) {{ $format.numberFormat(room.price - room.discountPrice) }}원</span>
            </li>
          </template>
          <template v-else>
            <li>
              <span>예약 금액</span>
              <span>{{ $format.numberFormat(lastPrice) }}원</span>
            </li>
          </template>
          <li v-if="$format.optimizedDiscountPrice(lastPrice, $store.state.channelInfo.discount.place)">
            <span>
              {{
                $format.optimizedDiscountPrice(lastPrice, $store.state.channelInfo.discount.place).discountName
                || '추가 즉시 할인'
              }} 금액</span>
            <span>(-) {{ $format.numberFormat(discountPrice) }}원</span>
          </li>
          <li>
            <span>최종 결제 금액</span>
            <span><strong>{{ $format.numberFormat(lastPrice - discountPrice) }}</strong>원</span>
          </li>
        </ul>
      </div>
      <div class="noticeWrap">
        <div class="agreement">
          <div class="title">규정 및 약관 동의</div>
          <div class="refundInfo">
            {{ getFreeCancelDate }}<br>
            상세한 취소 규정은 '취소 및 환불 규칙'에서 확인하실 수 있습니다.
          </div>
          <div class="checkBox" :class="{ active: isActiveAllAgreement }">
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
          price: `<strong>${ $format.numberFormat(lastPrice - discountPrice) }</strong>원`,
        }"
        :disabled="!validData"
        @submit="validData ? submit() : notification()" :class="{ active: validData }"
      ></global-button>
    </div>
    <div class="noResult" v-else-if="objPlace.status === 'loaded' && !room">
      <div>예약 가능한 방이 없습니다.</div>
      <div>다시 시도해주세요.</div>
    </div>
  </div>
</template>

<script>
import placeAgreement from '~/utils/static.json';
import DawnCheckIn from '~/components/MVP/Common/DawnCheckIn.vue';

const getChannelNoticeComp = (channelName) => import(`~/components/${channelName}/ChannelNotice.vue`).catch(() => import('~/components/MVP/ChannelNotice.vue'));

export default {
  components: {
    DawnCheckIn,
  },
  props: {
    objPlace: {
      type: Object,
      default: () => {},
    },
    isCarFlag: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => {},
    },
    placeId: {
      type: Number,
      default: 0,
    },
    roomId: {
      type: Number,
      default: 0,
    },
    isPhoneConfirmed: {
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
    isDifferGuest: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const today = new Date();
    const tmp = new Date();
    tmp.setDate(tmp.getDate() - 1);
    const yesterday = this.$format.ymdDate(tmp);
    const isDawn = today.getHours() >= 0 && today.getHours() < 2 && yesterday === this.$route.query.checkin && (this.objPlace.place.category === 'MOTEL' || this.objPlace.place.category === 'HOTEL');
    return {
      isDawn,
      swiperOptions: {},
      imgIndex: 0,
      imgHeight: 0,
      focusInputKey: '',
      categoryNameMap: {
        pension: '펜션',
        motel: '중저가 숙소',
        hotel: '호텔',
        guesthouse: '게스트하우스',
      },
      placeAgreement: placeAgreement.place,
    };
  },
  computed: {
    channelNotice() {
      const instance = getChannelNoticeComp(this.$store.state.channelInfo.channelName);
      return () => instance;
    },
    room() {
      /* eslint-disable */
      return this.objPlace.place.rooms ? this.objPlace.place.rooms.find((v) => v.no === this.roomId) : null;
      /* eslint-enable */
    },
    validData() {
      return this.isPhoneConfirmed
        && (!this.isDifferGuest || !(this.objGuestInfo.name === '' || this.objGuestInfo.phone === '' || !/^\d{3}-\d{3,4}-\d{4}$/.test(this.objGuestInfo.phone)))
        && this.isActiveAllAgreement;
    },
    representationImage() {
      return this.objPlace.place.images ? this.objPlace.place.images.find((v) => v.categoryType === 'REPRESENTATION') || this.objPlace.place.images[0] : '';
    },
    lastPrice() {
      return this.room.discountPrice || this.room.price || 0;
    },
    discountPrice() {
      const discount = this.$format.optimizedDiscountPrice(this.lastPrice, this.$store.state.channelInfo.discount.place);
      return discount ? discount.appliedPrice : 0;
    },
    isActiveAllAgreement() {
      return this.arrAgreement.every((obj) => obj.val);
    },
    getFreeCancelDate() {
      if (!this.objPlace.place.cancelPolicies) {
        return '취소 및 환불 불가';
      }
      const val = this.objPlace.place.cancelPolicies.find((v) => v.cancelPenaltyPercent === 0);
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
    dateFormat(str) {
      return `${str.replace(/-/g, '.')}(${this.$format.formatDate(str, 'dow')})`;
    },
    submit() {
      const obj = {
        checkIn: this.room.checkIn,
        checkOut: this.room.checkOut,
        customerName: (this.objReserveInfo.name),
        customerPhone: this.objReserveInfo.phone.replace(/-/g, ''),
        hasVehicle: this.isCarFlag,
        roomPrice: this.room.discountPrice || this.room.price || 0,
        placeInfo: {
          category: this.objPlace.place.category,
          placeNo: this.placeId,
          roomNo: this.roomId,
          placeName: (this.objPlace.place.korName),
          placeAddress: (this.objPlace.place.address),
          roomLevel: (this.room.name.find((v) => v.language === 'ko').name),
        },
        browserId: this.$store.state.sessionId,
      };
      if (this.isDifferGuest) {
        obj.visitorName = this.objGuestInfo.name;
        obj.visitorPhone = this.objGuestInfo.phone.replace(/-/g, '');
      } else {
        obj.visitorName = obj.customerName;
        obj.visitorPhone = obj.customerPhone;
      }
      this.$emit('submitPlace', obj);
    },
    changeDifferGuest() {
      this.$emit('changeDifferGuest', !this.isDifferGuest);
    },
    openPopup(key) {
      this.$emit('openPopup', key);
    },
    openVerification(flag) {
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `${this.$route.path}/${flag}`,
        query: this.$route.query,
      });
    },
    changeSwipe() {
      this.imgIndex = this.$refs.mySwiper.swiper.activeIndex;
    },
    checkVehicle() {
      if (this.isCarFlag) {
        return;
      }
      const params = {
        placeId: this.placeId,
        roomId: this.roomId,
        checkInDate: this.params.checkin,
        checkOutDate: this.params.checkout,
      };
      this.$emit('getCarValid', params);
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
    setImgHeight() {
      let h = window.outerWidth;
      if (h > 768) {
        h = 768 * 0.52;
      } else {
        h *= 0.52;
      }
      this.imgHeight = parseInt(h, 10);
    },
  },
  mounted() {
    this.setImgHeight();
  },
  beforeDestroy() {
  },
};
</script>

<style lang="scss">
  .paymentPlaceWrapper{
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
    .content{
      font-size: 14px;
      .productInfo{
        background-color: #fff;
        border-bottom: 10px solid #f8f9fb;
        padding: 0 $sidePadding * 1px;
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
        .roomTitleWrap{
          .roomName {
            padding-top: 20px;
            font-size: 16px;
            line-height: 22px;
            font-weight: bold;
          }

          .roomDescription {
            font-size: 13px;
            line-height: 20px;
            color: #939499;
          }
        }
        .roomImage {
          width: 100%;
          margin: 8px 0;
          border-radius: 4px;
          overflow: hidden;
          position: relative;

          .fixedImage {
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
          }

          .pageNum {
            position: absolute;
            left: 0;
            width: 100%;
            text-align: center;
            bottom: 0;
            margin-bottom: 8px;
            z-index: 2;
            pointer-events: none;

            .val {
              display: inline-block;
              margin: 0 auto;
              color: #FFF;
              border-radius: 4px;
              font-size: 13px;
              padding: 3px 8px;
              background-color: rgba(0, 0, 0, 0.5);
            }
          }

          &:after {
            z-index: 1;
            pointer-events: none;
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, #000000);
            opacity: 0.5;
          }
        }
        .roomTimeTable {
          width: 100%;
          border-spacing: 0;
          background-color: #f8f9fb;
          border-radius: 4px;
          overflow: hidden;
          text-align: center;
          font-size: 12px;

          thead {
            background-color: #ebecf1;
            font-weight: bold;
          }

          tbody {
            tr {
              td {
                border-bottom: 1px solid #fff;
              }

              &:last-of-type td {
                border-bottom: 0;
              }
            }
          }

          td {
            line-height: 15px;
            height: 38px;
            width: 50%;
            padding: 0 10px;

            &:first-of-type {
              border-right: 1px solid #fff;
            }
          }
        }
        .infoListWrapper{
          margin-top: 40px;
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
      .reserveInfoWrap{
        padding: 20px 0 30px;
        background-color: #fff;
        border-bottom: 10px solid #f8f9fb;
        .title{
          font-size: 13px;
          line-height: 20px;
          font-weight: bold;
          padding: 10px $sidePadding * 1px;
          color: #000;
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
          padding: 0 $sidePadding * 1px;
          .checkBox{
            padding: 10px 0 0;
          }
          .inputWrap{
            padding-top: 10px;
            .inputBox{
              position: relative;
              .customerInput{
                font-size: 16px;
                display: block;
                width: 100%;
                height: 55px;
                border: 0;
                border-bottom: 1px solid #ebecf1;
                transition: border-bottom-color .3s ease;
                &:focus{
                  border-bottom: 1px solid #000;
                }
              }
              .clear{
                width: 14px;
                height: 14px;
                border-radius: 14px;
                background-image: url(~assets/img/delete.svg);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                position: absolute;
                right: 0;
                top: calc(50% - 7px);
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

          .transportation {
            margin-top: 20px;

            &:after {
              content: '';
              clear: both;
              display: block;
            }

            > button {
              width: calc(50% - 5px);
              float: left;
              height: 46px;
              font-size: 15px;
              font-weight: bold;
              color: #939499;
              border-radius: 23px;
              border: solid 1px #ebecf1;

              &:first-of-type {
                margin-right: 10px;
              }

              &.active {
                border-color: #000;
                background-color: #000;
                color: #ffffff;
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
    }
    .noResult{
      height: calc(100vh - #{$header * 1px});
      padding-top: 100px;
      background-color: #FFF;
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
  }
</style>
