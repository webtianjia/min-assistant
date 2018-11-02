import orderAPI from "../../../api/order/order";
import senderAPI from "../../../api/sender/sender";
import { initData } from "../../../utils/index";

const state = {
  consignee: null,
  sender: null
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
  initOrderData(state) {
    state.consignee = null;
    this.commit("usedSkuList/clearSelectedALL");
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
