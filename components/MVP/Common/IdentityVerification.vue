<template>
  <div class="certificationWrapper">
    <div class="inputWrapper">
      <div class="inputBox">
        <input
          @input="changeReserveInfo()"
          id="reservatedName"
          placeholder="예약자 이름"
          type="text"
          v-model="name"
          @focus="focusInputKey = 'name'"
          @blur="focusInputKey = ''"
          maxlength="30"
        >
        <transition name="fade">
          <div v-if="name && focusInputKey === 'name'" class="clear" @click="name = ''"></div>
        </transition>
      </div>
    </div>
    <div class="inputWrapper">
      <div class="inputBox">
        <input
          id="reservatedPhone" placeholder="예약자 휴대폰 번호" type="text" maxlength="13" pattern="\d*"
          v-model="phone"
          @focus="focusInputKey = 'phone'"
          @blur="focusInputKey = ''"
          @input="formatPhone($event)"
        >
        <transition name="fade">
          <div v-if="phone && focusInputKey === 'phone'" class="clear" @click="phone = ''"></div>
        </transition>
      </div>
    </div>
    <div class="agreement">
      <div class="name">
        <label><div class="checkIcon" :class="agreement ? 'active' : ''"></div> <input type="checkbox" v-model="agreement">
          개인정보 수집 및 이용 동의(필수)
        </label>
      </div>
      <div class="rightCheck" @click="$emit('openPopup', 'PInfoCollectionAndUtilization')"></div>
    </div>
    <div class="inputWrapper">
      <div class="btnWrap">
        <button
          v-if="!confirmed && !isRequestPhone"
          :class="{
              active: validData,
            }"
          class="actionBtn"
          @click="requestPhone()"
        >인증요청
        </button>
      </div>
    </div>
    <transition name="fade">
      <div v-if="validData && isRequestPhone && !confirmed" class="inputWrapper">
        <div class="inputBox">
          <input
            ref="verificationNumber"
            placeholder="인증번호"
            type="number"
            v-model="confirmText"
            :disabled="!isRequestPhone || confirmed"
            autocomplete="off"
            @focus="focusInputKey = 'verificationNumber'"
            @blur="focusInputKey = ''"
            @keyup.enter="confirmText.length > 0 && !confirmed ? confirmPhone() : ''"
          >
          <transition name="fade">
            <div v-if="confirmText && focusInputKey === 'verificationNumber'" class="clear" @click="confirmText = ''"></div>
          </transition>
        </div>
        <div class="btnWrap">
          <transition name="fade">
            <div class="count" v-show="isRequestPhone && !confirmed">{{ countNum }}</div>
          </transition>
          <button
            v-if="!confirmed"
            class="actionBtn"
            @click="validData ? requestPhone() : ''"
          >재요청
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <global-button
        v-if="isRequestPhone && confirmText.length > 0 && !confirmed"
        :text="'본인 인증'"
        :transparent="true"
        @submit="confirmText.length > 0 && !confirmed ? confirmPhone() : ''"
      ></global-button>
    </transition>
    <FullLoading
      v-if="isConfirmLoading"
    ></FullLoading>
  </div>
</template>

<script>
import FullLoading from '@/components/MVP/Common/Loading.vue';

export default {
  components: {
    FullLoading,
  },
  props: {
    isPhoneConfirmed: {
      type: Boolean,
      default: false,
    },
    objReserveInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      agreement: false,
      focusInputKey: '',
      name: '',
      phone: '',
      reserveList: [],
      isRequestPhone: false,
      confirmText: '',
      countSec: 180,
      confirmed: false,
      isConfirmLoading: false,
      isPayment: this.$route.path.indexOf('/payment') >= 0,
    };
  },
  computed: {
    validData() {
      return !(this.name === '' || this.phone === ''
        || !/^\d{3}-\d{3,4}-\d{4}$/.test(this.phone))
        && this.agreement;
    },
    countNum() {
      const min = Math.floor(this.countSec / 60);
      return `${min}:${this.$format.zeros(this.countSec % 60)}`;
    },
  },
  methods: {
    changeReserveInfo() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.confirmed = false;
      this.isRequestPhone = false;
      this.confirmText = '';
      const pattern = /[0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g; // eslint-disable-line
      if (pattern.test(this.name)) {
        this.$store.commit('openNotice', { text: '한글 혹은 영어만 입력해주세요.' });
      }
      this.name = this.name.replace(pattern, '');
    },
    requestPhone() {
      if (!this.agreement) {
        this.$store.commit('openNotice', { text: '개인정보 수집 및 이용에 동의해주세요.' });
        return;
      }
      if (!this.validData) {
        this.$store.commit('openNotice', { text: '인증에 필요한 정보를 모두 입력해주세요.' });
        return;
      }
      if (this.isConfirmLoading) {
        return;
      }
      if (this.name.length < 2 || this.name.length > 30) {
        this.$store.commit('openNotice', { text: '이름을 확인해주세요.' });
        return;
      }
      this.isConfirmLoading = true;
      this.$apis.certification({
        name: this.name,
        phoneNumber: this.phone.replace(/-/g, ''),
      }).then((resp) => {
        console.log(resp);
        if (resp.data.code === 200 && resp.data.result.result === 'SUCCESS') {
          const t = new Date();
          const expireTime = new Date(t.getTime() + 60000);
          this.countSec = Math.floor((new Date(expireTime) - new Date()) / 1000);
          if (this.interval) {
            clearInterval(this.interval);
          }
          this.interval = setInterval(() => {
            if (this.countSec <= 0) {
              this.changeReserveInfo();
            }
            this.countSec -= 1;
          }, 1000);
          this.isRequestPhone = true;
          this.confirmText = '';
          this.isConfirmLoading = false;
          this.$nextTick(() => {
            this.$refs.verificationNumber.focus();
          });
        } else if (resp.data.message === 'SEND_LIMIT_EXCEEDED') {
          this.resetPhone();
        } else {
          this.$store.commit('openNotice', { text: '본인 인증 요청 중에 오류가 발생하였습니다.' });
          this.isConfirmLoading = false;
        }
      }).catch((e) => {
        if (e.response.data.message === 'SEND_LIMIT_EXCEEDED') {
          this.resetPhone();
        } else {
          this.$store.commit('openNotice', { text: '본인 인증 요청 중에 오류가 발생하였습니다.' });
          this.isConfirmLoading = false;
        }
      });
    },
    resetPhone() {
      this.$apis.certificationReset({
        phoneNumber: this.phone.replace(/-/g, ''),
      }).then(() => {
        this.isConfirmLoading = false;
        this.requestPhone();
      }).catch(() => {
        this.$store.commit('openNotice', { text: '본인 인증 요청 중에 오류가 발생하였습니다.' });
        this.isConfirmLoading = false;
      });
    },
    confirmPhone() {
      if (!this.agreement) {
        this.$store.commit('openNotice', { text: '개인정보 수집 및 이용 동의에 동의해주세요.' });
        return;
      }
      if (this.isConfirmLoading) {
        return;
      }
      this.isConfirmLoading = true;
      this.$apis.certificationCheck({
        phone: this.phone.replace(/-/g, ''),
        code: this.confirmText,
        browserId: this.$store.state.sessionId,
      }).then((resp) => {
        this.isConfirmLoading = false;
        if (resp.data.code === 200 && resp.data.result.result === 'SUCCESS') {
          if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
          }
          window.scrollTo(0, 0);
          this.confirmed = true;
          this.$store.commit('openNotice', { text: '본인 인증이 완료되었습니다.', bottom: this.isPayment ? 106 : 20 });
          this.$emit('certification', { name: this.name, phone: this.phone });
        } else {
          this.$store.commit('openNotice', { text: resp.data.result.result === 'INCORRECT_CODE' ? '인증번호를 다시 입력해주세요.' : '유효시간이 초과하였습니다.' });
        }
      }).catch(() => {
        this.isConfirmLoading = false;
        this.$store.commit('openNotice', { text: '본인 인증이 실패하였습니다.' });
      });
    },
    formatPhone(e) {
      let temp = this.phone;
      if (/[^0-9]/g.test(e.target.value)) {
        temp = temp.replace(/[^0-9]/g, '');
      }
      if (temp.length < 4) {
        this.phone = temp;
      } else if (temp.length < 7) {
        this.phone = `${temp.substr(0, 3)}-${temp.substr(3, temp.length - 1)}`;
      } else if (temp.length < 11) {
        this.phone = `${temp.substr(0, 3)}-${temp.substr(3, 3)}-${temp.substr(6, temp.length - 1)}`;
      } else {
        this.phone = `${temp.substr(0, 3)}-${temp.substr(3, 4)}-${temp.substr(7, temp.length - 1)}`;
      }
      this.changeReserveInfo();
    },
  },
  mounted() {
    if (this.objReserveInfo.name && this.objReserveInfo.phone) {
      this.name = this.objReserveInfo.name;
      this.phone = this.objReserveInfo.phone;
    }
    this.confirmed = this.isPhoneConfirmed;
  },
};
</script>

<style lang="scss">
  .certificationWrapper{
    border-radius: 4px;
    overflow: hidden;
    .agreement{
      padding: 12px 0;
      position: relative;
      .name{
        line-height: 20px;
        font-size: 13px;
        color: #939499;
        label{
          display: flex;
          align-items: center;
          input{
            display: none;
          }
        }
        .checkIcon{
          margin-right: 10px;
          width: 20px;
          height: 20px;
          background-color: #c5c6cb;
          border-radius: 10px;
          &.active{
            background-color: #000;
          }
          &:before{
            content: '';
            display: block;
            width: 20px;
            height: 20px;
            background: url(~assets/img/icon-check-white.svg) center center no-repeat;
            background-size: 20px;
          }
        }
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
    }
    .inputWrapper{
      .inputBox{
        position: relative;
        input{
          font-size: 16px;
          width: 100%;
          height: 58px;
          border: 0;
          display: block;
          transition: border-bottom-color .3s ease;
          border-bottom: 1px solid #ebecf1;
          background-color: transparent;
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

      .btnWrap {
        width: 100%;
        margin-top: 10px;

        &::after {
          content: '';
          display: block;
          clear: both;
        }

        .count {
          float: left;
          color: #d31111;
          font-size: 13px;
        }

        .actionBtn {
          float: right;
          border-radius: 23px;
          background-color: #fff;
          color: #000;
          font-size: 13px;
          transition: .3s ease;
          padding: 14px 25px;
          border: 1px solid #ebecf1;
          &.active {
            color: #fff;
            border-color: #000;
            font-weight: bold;
            background-color: #000;
          }
        }
      }
    }
  }
</style>
