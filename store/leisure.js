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
  objSearchOption: {
    category: [],
    region: [],
  },
  objExhibition: {},
});

export const mutations = {
  setExhibition(state, objExhibition) {
    state.objExhibition = objExhibition;
  },
  setSearchOption(state, data) {
    state.objSearchOption = data;
  },
  setRecentSearch(state, data) {
    const { list, page, totalCount, totalPages, timestamp, } = data.result;
    state.objRecentSearch[data.key] = {
      list: (state.objRecentSearch[data.key] ? state.objRecentSearch[data.key].list : []).concat(...list),
      totalPages,
      page,
      totalCount,
      timestamp,
    };
  },
  setPageStatus(state, data) {
    state.pageStatus[data.key] = data.value;
  },
};
