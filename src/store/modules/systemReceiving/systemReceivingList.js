import systemReceiving from "@/api/systemReceiving/systemReceiving";

const state = {
  systemReceivingList: [],
  param: {
    limit: 5,
    start: 0,
    page: 1,
    receiving_country: ""
  },
  total: 0,
  countryList: []
};
//getters
const getters = {
  activeTab: (state) => {
    return state.param.receiving_country;
  },
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
  setCountry(state, value) {
    state.param.receiving_country = value;
  },
  toggleDesc(state, index) {
    state.systemReceivingList[index].descShow = true;
  },
  changeStart(state) {
    state.param.page++;
    state.param.start = (state.param.page - 1) * state.param.limit;
  },
  setSystemReceivingList(state, systemReceivingList) {
    state.systemReceivingList.push(...systemReceivingList);
  },
  setCountryList(state, countryList) {
    state.countryList = countryList;
  }
};

// actions
const actions = {
  getSystemReceivingList({ commit, state }) {
    systemReceiving.getSystemReceivingList(state.param).then(response => {
      if (response.success) {
        state.total = response.data.total;
        response.data.rows.find(item => {
          item.descShow = false;
        });
        commit("setSystemReceivingList", response.data.rows);
      }
    }).catch(error => {
      console.log("获取收货点失败", error);
    });
  },
  async getCountryList({ commit }) {
    await  systemReceiving.getCountryList().then(response => {
      if (response.success) {
        commit("setCountryList", response.data);
      }
    }).catch(error => {
      console.log("获取国家名单失败", error);
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
