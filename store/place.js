export const state = () => ({
  objRecentSearch: {},
  pageStatus: {
    list: {
      scrollTop: 0,
    },
    detail: {
      scrollTop: 0,
      tab: 0,
    },
  },
  objExhibition: {},
});

export const mutations = {
  setExhibition(state, objExhibition) {
    state.objExhibition = objExhibition;
  },
  setRecentSearch(state, data) {
    state.objRecentSearch[data.key] = data.result;
  },
  setPageStatus(state, data) {
    state.pageStatus[data.key] = data.value;
  },
};
