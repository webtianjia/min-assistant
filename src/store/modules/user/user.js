import order from "@/api/order/order";


const state = {
  orderCount: {
    allTotal: "",
    incomeTotal: "",
    closeTotal: "",
    createTotal: ""
  },
  authCode:""
};
//getters
const getters = {};

// mutations
const mutations = {
  setOrderCount(state, orderCount) {
    state.orderCount = Object.assign(orderCount);
  },
  setAuthCode(state){
    state.authCode = wx.getStorageSync("auth_code");
  }
};

// actions
const actions = {
  getOrderCount({ commit }) {
    order.getOrderCount().then(response => {
      if (response.success) {
        commit("setOrderCount", response.data);
      }
    }).catch(error => {
      console.log("获取订单数量失败", error);
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

