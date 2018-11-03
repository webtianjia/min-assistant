import systemReceiving from "../../../api/systemReceiving/systemReceiving";

const state = {
  systemReceivingList: [],
  param: {
    limit: 5,
    start: 0,
    page: 1
  },
  total: 0
};
//getters
const getters = {
  isNoDataBottom: (state) => {
    if (state.total) {
      return (parseInt(state.total / state.param.limit) + 1) <= state.param.page;
    }
  }
};

// mutations
const mutations = {
  initParam(state) {
    state.param.start = 0;
    state.param.page = 1;
    state.systemReceivingList = [];
  },
  changeStart(state) {
    state.param.page++;
    state.param.start = (state.param.page - 1) * state.param.limit;
  },
  setSystemReceivingList(state, systemReceivingList) {
    state.systemReceivingList.push(...systemReceivingList);
  }
};

// actions
const actions = {
  getSystemReceivingList({ commit, state }) {
    systemReceiving.getSystemReceivingList(state.param).then(response => {
      if (response.success) {
        state.total = response.data.total;
        commit("setSystemReceivingList", response.data.rows);
      }
    }).catch(error => {
      console.log("获取收货点失败", error);
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
