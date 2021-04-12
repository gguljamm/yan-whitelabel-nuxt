<template>
  <nuxt-child
    v-if="$route.params.popup"
    :objReserveInfo="objReserveInfo"
    :isPhoneConfirmed="isPhoneConfirmed"
    :popKey="popKey"
    :arrSellerInfos="objLeisure.leisure.sellerInfos"
    @certification="certification"
    @openPopup="openPopup"
  ></nuxt-child>
  <div v-else class="leisurePayment">
    <Header></Header>
    <LeisurePaymentHome
      v-if="objLeisure.status === 'loaded' && Object.keys(objLeisure.leisure).length > 0"
      :objLeisure="objLeisure"
      :params="params"
      :objReserveResult="objReserveResult"
      :objReserveInfo="objReserveInfo"
      :isPhoneConfirmed="isPhoneConfirmed"
      :arrAgreement="arrAgreement"
      :isDifferGuest="isDifferGuest"
      :objGuestInfo="objGuestInfo"
      @changeAllAgreement="changeAllAgreement"
      @openPopup="openPopup"
      @submitReserve="submitReserve"
      @changeDifferGuest="changeDifferGuest"
    ></LeisurePaymentHome>
    <div
      v-else-if="objLeisure.status === 'loaded' && Object.keys(objLeisure.leisure).length <= 0"
      class="noResult"
    >
      <div>예약 가능한 상품이 없습니다.</div>
      <div>다시 시도해주세요.</div>
    </div>
    <SpinnerLoading v-else></SpinnerLoading>
  </div>
</template>

<script>
import LeisurePaymentHome from '@/components/MVP/Payment/Leisure/Home.vue';

const getPayment = (compId) => import(`~/components/${compId}/payment.js`).catch(() => import('~/components/MVP/payment.js'));

export default {
  components: {
    LeisurePaymentHome,
  },
  beforeCreate() {
    if (this.$route.params.popup) {
      this.$router.replace({
        path: `/${this.$route.path.split('/')[1]}/payment/leisure`,
        query: this.$route.query,
      });
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const { dealId, optionsId, count } = this.$route.query;
    const params = {
      dealId,
      optionsId: Array.isArray(optionsId) ? optionsId : [optionsId],
      count: Array.isArray(count) ? count : [count || 1],
    };
    if (params.optionsId.length > params.count.length) {
      for (let x = 0; x < (params.optionsId.length - params.count.length); x += 1) {
        params.count.push(1);
      }
    }
    const storeCustomerInfo = JSON.parse(JSON.stringify(this.$store.state.reservation.customerInfo));
    const isPhoneConfirmed = !!(storeCustomerInfo.name && storeCustomerInfo.phone && this.$store.state.reservation.uninitialized);
    return {
      params,
      objLeisure: {
        status: 'loading',
        leisure: {},
      },
      objReserveResult: {
        status: 'before',
        result: {},
      },
      objReserveInfo: {
        name: storeCustomerInfo.name ? storeCustomerInfo.name : '',
        phone: storeCustomerInfo.phone ? storeCustomerInfo.phone : '',
      },
      objGuestInfo: {
        name: '',
        phone: '',
      },
      isDifferGuest: false,
      isPhoneConfirmed,
      popKey: '',
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
      ],
    };
  },
  methods: {
    changeDifferGuest(isChecked) {
      this.isDifferGuest = isChecked;
    },
    submitReserve(objReserveData) {
      // console.log(objReserveData);
      this.$emit('changeLoading', true);
      // const payUrl = 'http://192.168.0.6:8080/orders/leisure';
      this.$apis.reserveLeisure(objReserveData).then(async (resp) => {
        const compId = this.$store.state.channelInfo.channelName.replace('dev_', '');
        const func = await getPayment(compId);
        func.default.payment(this, objReserveData, resp.data.result.orderId, objReserveData.paymentInfo.totalSalePrice - objReserveData.paymentInfo.discountAmount, 'leisure');
        this.$emit('changeLoading', false);
      }).catch((e) => {
        this.$emit('changeLoading', false);
        console.log({ ...e });
        this.$store.commit('openAlert', {
          text: e.response.status === 500 ? '예약이 실패했습니다. <br> 다시 시도해주세요' : e.response.data.message,
          arrBtn: [{
            text: '확인',
            event: () => {
            },
          }],
        });
      });
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
    openPopup(key) {
      this.popKey = key;
      this.$store.commit('history/pushHistory', this.$route.fullPath);
      this.$router.push({
        path: `${this.$route.path.replace('/verification', '')}/popup`,
        query: this.$route.query,
      });
    },
    changeAllAgreement(isAllAgreement) {
      this.arrAgreement = this.arrAgreement.map((obj) => ({ ...obj, val: isAllAgreement }));
    },
    getLeisure() {
      const { dealId } = this.$route.query;
      if (dealId) {
        this.$apis.getLeisure({ dealId }).then((resp) => {
          this.objLeisure.leisure = resp.data.result;
          console.log(this.objLeisure.leisure);
          const { images, type } = this.objLeisure.leisure;
          this.objLeisure.leisure = {
            ...this.objLeisure.leisure,
            images: [...images].map((img) => ({ bpUrl: img })),
            categoryName: [...type].map((obj) => obj.name)[0],
          };
          this.objLeisure.status = 'loaded';
        }).catch(() => {
          this.objLeisure.status = 'loaded';
        });
      } else {
        this.objLeisure.status = 'loaded';
      }
    },
  },
  mounted() {
    this.getLeisure();
    this.$apis.getDiscountInfo({
      channel: this.$store.state.channelInfo.channelName,
      part: 'LEISURE',
    }).then((resp) => {
      const discount = this.$store.state.channelInfo.discount.leisure;
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
            leisure: resp.data.result,
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
            leisure: resp.data.result,
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

<style lang="scss">
  .leisurePayment{
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
