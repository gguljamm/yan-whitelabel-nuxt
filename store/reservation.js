export const state = () => ({
  uninitialized: false,
  customerInfo: {
    name: '',
    phone: '',
  },
  place: {},
  leisure: {},
});

export const mutations = {
  setUninitialized(state, isUninitialized) {
    state.uninitialized = isUninitialized;
  },
  setCustomerInfo(state, objCustomerInfo) {
    state.customerInfo = objCustomerInfo;
  },
  setReservationInfo(state, data) {
    state.customerInfo = data.customerInfo;
    let storeData = state[data.type];
    storeData.list = [...data.list];
    storeData.timestamp = data.timestamp;
  },
  clearState(state) {
    state.customerInfo = {
      name: '',
      phone: '',
    };
    state.place = {};
    state.leisure = {};
  },
};
