import orderAPI from "../../../api/order/order";
import senderAPI from "../../../api/sender/sender";
import { getOrderSkuList, setOrderSkuList, clearOrderSkuList } from "../../../utils/orderUtil";

const state = {
  consignee: null,
  sender: null,
  step:0
};
//getters
const getters = {};

// mutations
const mutations = {
  watchStep(state){
    state.step++
  },
  setConsignee(state, consignee) {
    state.consignee = consignee;
  },
  setSender(state, sender) {
    state.sender = sender;
  },
  initOrderData(state) {
    state.consignee = null;
  },

  /*修改商品*/
  updateSku(state, sku) {
    let orderSkuList = getOrderSkuList();
    orderSkuList.find(item => {
      if (item.id === sku.id) {
        item = Object.assign(item, sku);
      }
    });
    setOrderSkuList(orderSkuList);
    this.commit("orderCreate/watchStep");
  },
  /*添加商品*/
  addSku(state, { sku, goods_number }) {
    sku.goods_number = goods_number;
    let orderSkuList = getOrderSkuList();
    if (orderSkuList) {
      orderSkuList.push(sku);
    } else {
      orderSkuList = [sku];
    }
    setOrderSkuList(orderSkuList);
    this.commit("orderCreate/watchStep");
  },
  /*删除商品*/
  deleteSku(state, id) {
    let orderSkuList = getOrderSkuList().filter(item => item.id !== id);
    setOrderSkuList(orderSkuList);
    this.commit("orderCreate/watchStep");
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
