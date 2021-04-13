import axios from 'axios';

export const state = () => ({
  channelInfo: {},
  alertInfo: null,
  noticeInfo: {
    bottom: 20,
    list: [],
  },
  formData: {},
  paymentData: {},
  sessionId: '',
  env: {
    isLowVersion: false,
  },
  layerPopup: null,
});

let noticeKey = 0;

export const getters = {
  getChannelInfo(state) {
    return state.channelInfo;
  }
};

export const mutations = {
  setEnv(state, isLowVersion) {
    state.env.isLowVersion = isLowVersion;
  },
  openNotice(state, value) {
    if (!value) {
      if (state.noticeInfo.list[0]) {
        clearTimeout(state.noticeInfo.list[0].timeout);
        state.noticeInfo.list.shift();
      }
      return;
    }
    if (value.bottom) {
      state.noticeInfo.bottom = value.bottom;
    } else {
      state.noticeInfo.bottom = 20;
    }
    const key = noticeKey++;
    state.noticeInfo.list.push({ text: value.text, key: key, timeout: setTimeout(() => {
      this.commit('shiftNotice');
    }, value.time || 2300) });
    if (state.noticeInfo.list.length > 1) {
      clearTimeout(state.noticeInfo.list[0].timeout);
      state.noticeInfo.list.shift();
    }
  },
  shiftNotice(state) {
    state.noticeInfo.list.shift();
  },
  openAlert(state, value) {
    state.alertInfo = value;
  },
  setFormData(state, value) {
    state.formData = value;
  },
  setSessionId(state, value) {
    state.sessionId = value;
  },
  setChannel(state, value) {
    state.channelInfo = value;
  },
  setPaymentData(state, value) {
    state.paymentData = value;
  },
  setLayerPopup(state, value) {
    state.layerPopup = value;
  },
};
