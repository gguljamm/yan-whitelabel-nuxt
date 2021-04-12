<template>
  <nuxt-child
    v-if="$route.params.popup"
    :objReserveInfo="objReserveInfo"
    :isPhoneConfirmed="isPhoneConfirmed"
    :popKey="popKey"
    :objPlace="objPlace"
    :params="params"
    @certification="certification"
    @openPopup="openPopup"
  ></nuxt-child>
  <div v-else>
    <Header></Header>
    <placePaymentHome
      v-if="objPlace.status === 'loaded'"
      :params="params"
      :objPlace="objPlace"
      :isCarFlag="isCarFlag"
      :placeId="placeId"
      :roomId="roomId"
      :objReserveInfo="objReserveInfo"
      :isPhoneConfirmed="isPhoneConfirmed"
      :arrAgreement="arrAgreement"
      :objGuestInfo="objGuestInfo"
      :isDifferGuest="isDifferGuest"
      @changeAllAgreement="changeAllAgreement"
      @getCarValid="getCarValid"
      @changeCarFlag="changeCarFlag"
      @getPlace="getPlace"
      @submitPlace="submitPlace"
      @openPopup="openPopup"
      @changeDifferGuest="changeDifferGuest"
    ></placePaymentHome>
    <SpinnerLoading v-else></SpinnerLoading>
  </div>
</template>

<script>
import placePaymentHome from '@/components/MVP/Payment/Place/Home.vue';

const getPayment = (compId) => import(`~/components/${compId}/payment.js`).catch(() => import('~/components/MVP/payment.js'));

export default {
  props: ['loading'],
  components: {
    placePaymentHome,
  },
  data() {
    let {
      checkin, checkout, keyword, category, adults, children,
    } = this.$route.query;
    if (!checkin) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkin = this.$format.ymdDate(today);
      today.setDate(today.getDate() + 1);
      checkout = this.$format.ymdDate(today);
    }
    if (!category) {
      category = 'all';
    }
    if (!keyword) {
      keyword = '강남';
    }
    if (!adults) {
      adults = 2;
    }
    if (!children) {
      children = 0;
    }
    const params = {
      keyword,
      category,
      checkin,
      checkout,
      adults,
      children,
    };
    const storeCustomerInfo = JSON.parse(JSON.stringify(this.$store.state.reservation.customerInfo));
    const isPhoneConfirmed = !!(storeCustomerInfo.name && storeCustomerInfo.phone && this.$store.state.reservation.uninitialized);
    return {
      params,
      placeId: parseInt(this.$route.query.placeNo, 10),
      roomId: parseInt(this.$route.query.roomNo, 10),
      objPlace: {
        status: 'loading',
        place: {},
        coupon: [],
      },
      isCarFlag: false,
      objReserveInfo: {
        name: storeCustomerInfo.name ? storeCustomerInfo.name : '',
        phone: storeCustomerInfo.phone ? storeCustomerInfo.phone : '',
      },
      objGuestInfo: {
        name: '',
        phone: '',
      },
      isPhoneConfirmed,
      popKey: '',
      isDifferGuest: false,
      arrAgreement: [
        {
          name: '만 14세 이상 이용 동의 (필수)',
          val: false,
        },
        {
          name: '이용규칙 동의 (필수)',
          val: false,
          key: 'ruleUsing',
        },
        {
          name: '취소 및 환불 규칙 동의 (필수)',
          val: false,
          key: 'cancelPolicy',
        },
        {
          name: '개인정보 수집 및 이용 동의 (필수)',
          val: false,
          key: 'PInfoCollectionAndUtilization',
        },
        {
          name: '개인정보 제3자 제공 동의 (필수)',
          val: false,
          key: 'PInfoInfoToThirdParties',
        },
        {
          name: '기준 인원 초과 시 현장결제 하겠습니다. (필수)',
          val: false,
        },
      ],
    };
  },
  methods: {
    async submitPlace(obj) {
      if (this.loading) {
        return;
      }
      this.$emit('changeLoading', true);
      const discountInfo = { ...this.$format.optimizedDiscountPrice(obj.roomPrice, this.$store.state.channelInfo.discount.place) };
      discountInfo.text = undefined;
      discountInfo.maxPriceText = undefined;
      this.$apis.checkReservePlace({ ...obj, ...discountInfo, appliedPrice: undefined }).then(async (resp) => {
        // window.scrollTo(0, 0);
        let discountPrice = obj.roomPrice;
        if (discountInfo && discountInfo.appliedPrice) {
          discountPrice = obj.roomPrice - discountInfo.appliedPrice;
        }
        if (resp.data.code === 200) {
          const compId = this.$store.state.channelInfo.channelName.replace('dev_', '');
          const func = await getPayment(compId);
          func.default.payment(this, obj, resp.data.result.reservationNo, discountPrice, 'place');
        }
        // this.$emit('changeLoading', false);
      }).catch((e) => {
        this.$emit('changeLoading', false);
        console.log({ ...e });
        this.$store.commit('openAlert', {
          text: e.response.status === 500 ? '예약이 실패했습니다. <br> 다시 시도해주세요' : e.response.data.message || '예약이 실패했습니다. <br> 다시 시도해주세요',
          arrBtn: [{
            text: '확인',
            event: () => {
            },
          }],
        });
      });
    },
    getPlace(query) {
      this.objPlace.status = 'loading';
      this.$apis.getPlace(query).then((resp) => {
        if (resp.data.code === 200) {
          this.objPlace.place = resp.data.result;
          // this.$apis.getCoupons({
          //   placeNos: query.placeId,
          //   checkIn: query.checkInDate,
          // }).then((resp2) => {
          //   this.objPlace.status = 'loaded';
          //   if (resp2.data.code === 200) {
          //     this.objPlace.coupon = resp2.data.result[0].coupons;
          //   }
          // }).catch(() => {
          //   this.objPlace.status = 'loaded';
          // });
          this.objPlace.status = 'loaded';
        } else {
          this.objPlace.place = {};
        }
      }).catch(() => {
        this.objPlace.status = 'loaded';
        this.objPlace.place = {};
      });
    },
    getCarValid(obj) {
      if (this.loading) {
        return;
      }
      this.$emit('changeLoading', true);
      this.$apis.checkVehicle(obj).then((resp) => {
        if (resp.data.code === 200 && resp.data.result.result === true) {
          this.isCarFlag = true;
        } else {
          this.$store.commit('openAlert', {
            text: '차량 방문이 불가능합니다.',
            arrBtn: [{ text: '확인' }],
          });
        }
        this.$emit('changeLoading', false);
      }).catch(() => {
        this.$store.commit('openAlert', {
          text: '차량 방문이 불가능합니다.',
          arrBtn: [{ text: '확인' }],
        });
        this.$emit('changeLoading', false);
      });
    },
    changeCarFlag(v) {
      this.isCarFlag = v;
    },
    certification(objReserveInfo) {
      this.objReserveInfo = objReserveInfo;
      this.isPhoneConfirmed = true;
      this.$router.back();
      const agree = this.arrAgreement.find((v) => v.key === 'PInfoCollectionAndUtilization');
      if (agree) {
        agree.val = true;
      }
    },
    changeAllAgreement(isAllAgreement) {
      this.arrAgreement = this.arrAgreement.map((obj) => ({ ...obj, val: isAllAgreement }));
    },
    openPopup(key) {
      this.popKey = key;
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `${this.$route.path.replace('/verification', '')}/popup`,
        query: this.$route.query,
      });
    },
    changeDifferGuest(flag) {
      this.isDifferGuest = flag;
    },
  },
  beforeCreate() {
    if (this.$route.params.popup) {
      this.$router.replace({
        path: `/${this.$route.path.split('/')[1]}/payment/place`,
        query: this.$route.query,
      });
    }
  },
  mounted() {
    const query = {
      checkInDate: this.params.checkin,
      checkOutDate: this.params.checkout,
      adultNum: this.params.adults,
      kidNum: this.params.children,
      placeId: this.placeId,
    };
    this.getPlace(query);
    this.$apis.getDiscountInfo({
      channel: this.$store.state.channelInfo.channelName,
      part: 'PLACE',
    }).then((resp) => {
      const discount = this.$store.state.channelInfo.discount.place;
      const d = resp.data.result;
      if (discount && d && Array.isArray(discount) && Array.isArray(d)
        && (discount.length !== d.length
          || discount.some((v) => {
            const find = d.find((v2) => v2.discountPolicyNo === v.discountPolicyNo);
            return !find || find.maxDiscountAmount !== v.maxDiscountAmount || find.minItemPrice !== v.minItemPrice || find.moneyDiscount.discountAmount !== v.moneyDiscount.discountAmount || find.percentDiscount.discountPercent !== v.percentDiscount.discountPercent;
          }))
      ) {
        this.$store.commit('setChannel', {
          ...this.$store.state.channelInfo,
          discount: {
            ...this.$store.state.channelInfo.discount,
            place: resp.data.result,
          },
        });
        this.$store.commit('openNotice', {
          text: '할인 정보가 변경되었습니다.',
        });
      } else if ((!discount && d) || (discount && !d)) {
        this.$store.commit('setChannel', {
          ...this.$store.state.channelInfo,
          discount: {
            ...this.$store.state.channelInfo.discount,
            place: resp.data.result,
          },
        });
        this.$store.commit('openNotice', {
          text: '할인 정보가 변경되었습니다.',
        });
      }
    });
  },
};
</script>
