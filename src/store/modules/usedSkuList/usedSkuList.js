import sku from "../../../api/sku/sku";

import { setOrderSkuList, getOrderSkuList, clearOrderSkuList } from "../../../utils/orderUtil";

const state = {
  settlementDialogStatus: false,
  skuList: [],
  param: {
    limit: 5,
    start: 0,
    query_name: "",
    page: 1
  },
  total: 0,
  cartTotalPrice: 0,
  cartTotalCount: 0
};
//getters
const getters = {
  cardSkuList: (state) => {
    return state.skuList.filter(sku => sku.goods_number >= 1);
  },
  isNoDataBottom: (state) => {
    if (state.total) {
      return (parseInt(state.total / state.param.limit) + 1) <= state.param.page;
    }
  }
};

// mutations
const mutations = {
  setSettlementStatus(state, status) {
    state.settlementDialogStatus = state.cartTotalCount > 0 ? status : false;
  },
  pushProductToCart(state, { id, value }) {
    state.skuList.find(item => {
      if (item.id === id) item.goods_number = value;

      setOrderSkuList(this.getters["usedSkuList/cardSkuList"]);

      this.commit("usedSkuList/cartTotalPrice");
      this.commit("usedSkuList/cartTotalCount");

      if (state.cartTotalCount === 0) {
        this.commit("usedSkuList/setSettlementStatus", false);
      }
      this.commit("orderCreate/watchStep");
    });
  },
  cartTotalPrice(state) {
    state.cartTotalPrice = getOrderSkuList().reduce((total, sku) => {
      return total + parseInt(sku.goods_price) * parseInt(sku.goods_number);
    }, 0);
  },
  cartTotalCount(state) {
    state.cartTotalCount = getOrderSkuList().reduce((total, sku) => {
      return total + parseInt(sku.goods_number);
    }, 0);
  },
  setQueryName(state, query_name) {
    state.param.query_name = query_name;
  },
  initParam(state) {
    state.param.start = 0;
    state.param.query_name = "";
    state.param.page = 1;
    state.skuList = [];
  },
  changeStart(state) {
    state.param.page++;
    state.param.start = (state.param.page - 1) * state.param.limit;
  },

  clearSelectedALL(state) {
    this.commit("usedSkuList/setSettlementStatus", false);
    clearOrderSkuList();
    this.commit("usedSkuList/cartTotalPrice");
    this.commit("usedSkuList/cartTotalCount");
    this.commit("orderCreate/watchStep");
    state.skuList.find(sku => sku.goods_number = 0);
  },

  setSkuList(state, skuList) {
    skuList.forEach(item => item.goods_number = 0);
    let orderSkuList = getOrderSkuList();
    if (orderSkuList && skuList) {
      for (let i = 0; i < orderSkuList.length; i++) {
        for (let j = 0; j < skuList.length; j++) {
          if (orderSkuList[i].id === skuList[j].id) {
            skuList[j].goods_number = orderSkuList[i].goods_number;
          }
        }
      }
      this.commit("usedSkuList/cartTotalPrice");
      this.commit("usedSkuList/cartTotalCount");
    }
    state.settlementDialogStatus = false;
    state.skuList.push(...skuList);
  }
};

// actions
const actions = {
  getSkuList({ commit, state }) {
    sku.getSkuList(state.param).then(response => {
      if (response.success) {
        state.total = response.data.total;
        commit("setSkuList", response.data.rows);
      }
    }).catch(error => {
      console.log("获取商品失败", error);
    });
  },
  addSku({ commit }, param) {
    return sku.addSku(param);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

