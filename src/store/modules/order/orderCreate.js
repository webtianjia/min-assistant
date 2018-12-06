import orderAPI from "@/api/order/order";
import senderAPI from "@/api/sender/sender";

const state = {
  consignee: null,
  sender: null,
  orderSkuList: []
};
//getters
const getters = {};

// mutations
const mutations = {
  setConsignee(state, consignee) {
    state.consignee = consignee;
  },
  setSender(state, sender) {
    state.sender = sender;
  },
  clearOrderConsignee(state) {
    state.consignee = null;
  },
  clearOrderSender(state) {
    state.sender = null;
  },
  clearOrderSkuList(state) {
    state.orderSkuList = [];
  },
  initOrderData() {
    this.commit("orderCreate/clearOrderConsignee");
    this.commit("orderCreate/clearOrderSkuList");
  },
  /*修改商品*/
  updateSku(state, { sku, index }) {
    state.orderSkuList[index] = Object.assign(state.orderSkuList[index], sku);
  },
  /*添加商品*/
  addSku(state, skuList) {
    state.orderSkuList.push(...skuList);
  },
  /*删除商品*/
  deleteSku(state, index) {
    const orderSkuList = state.orderSkuList;
    orderSkuList.splice(index, 1);
    state.orderSkuList = JSON.parse(JSON.stringify(orderSkuList));
  }
};

// actions
const actions = {
  addOrder({ commit }, param) {
    return orderAPI.addOrder(param);
  },
  getDefault({ commit }) {
    senderAPI.getDefault().then(response => {
      if (response.data) {
        commit("setSender", response.data);
      }
    }).catch(error => {
      console.log("获取默认发件人错误", error);
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
