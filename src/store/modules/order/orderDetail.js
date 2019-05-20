import order from "@/api/order/order";

const state = {
  orderDetail: null,
  orderRoute: []
};
//getters
const getters = {};

// mutations
const mutations = {
  setOrderDetail(state, orderDetail) {
    state.orderDetail = orderDetail;
  },
  setOrderRoute(state, orderRoute) {
    state.orderRoute = orderRoute;
  }
};

// actions
const actions = {
  getOrder({commit}, id) {
    order.getOrder({id}).then(response => {
      if (response.success) {
        commit("setOrderDetail", response.data);
      }
    }).catch(error => {
      console.log("获取订单详情失败", error);
    });
  },

  async getOrderRoute({commit}, wayBillNo) {
    await  order.getOrderRoute({wayBillNo}).then(response => {
      if (response.success) {
        commit("setOrderRoute", response.data);
      }
    }).catch(error => {
      console.log("获取订单路由失败", error);
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
