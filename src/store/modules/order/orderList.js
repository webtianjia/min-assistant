import order from "@/api/order/order";

const state = {
  orderList: [],
  param: {
    limit: 5,
    start: 0,
    page: 1,
    status: ""
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
  changeStatus(state, status) {
    state.param.status = status;
  },
  initParam(state) {
    state.param.start = 0;
    state.param.page = 1;
    state.orderList = [];
  },
  changeStart(state) {
    state.param.page++;
    state.param.start = (state.param.page - 1) * state.param.limit;
  },
  setOrderList(state, orderList) {
    state.orderList.push(...orderList);
  },
  deleteOrder(state, orderId) {
    state.orderList = state.orderList.filter(item => item.id !== orderId);
  }
};

// actions
const actions = {
  getOrderList({ commit, state }) {
    order.getOrderList(state.param).then(response => {
      if (response.success) {
        state.total = response.data.total;
        commit("setOrderList", response.data.rows);
      }
    }).catch(error => {
      console.log("获取订单列表失败", error);
    });
  },
  async deleteOrder({ commit }, id) {
    await   order.deleteOrder({ id }).then(response => {
      if (response.success) {
        commit("deleteOrder", id);
      }
    }).catch(error => {
      console.log("删除订单失败", error);
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
