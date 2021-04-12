export const state = () => ({
  arrHistory: [],
  enterFlag: '',
});

export const mutations = {
  pushHistory(state, data) {
    state.arrHistory.push(data);
  },
  popHistory(state) {
    state.arrHistory.pop()
  },
  setEnterFlag(state, data) {
    state.enterFlag = data || '';
  }
};

export const actions = {

}
