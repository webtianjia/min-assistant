import sku from "@/api/sku/sku";

const state = {
  skuList: [],
  param: {
    limit: 5,
    start: 0,
    query_name: "",
    page: 1
  },
  checkedSwitch: false
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
  changeSwitch(state) {
    state.checkedSwitch = !state.checkedSwitch;
    state.skuList = [];
  },
  setSkuList(state, skuList) {
    state.skuList.push(...skuList);
  },
  setMatchSku(state, skuList) {
    state.skuList = skuList;
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
  matchSkuList({ commit }, goods_name) {
    if (!state.checkedSwitch) return;
    sku.matchSku(goods_name).then(response => {
      if (response.success) {
        response.data.find(item => {
          item.goods_name = item.name;
          item.goods_brand = item.brand_cn;
          item.goods_standard = item.standard;
          item.goods_price = "";
        });
        commit("setMatchSku", response.data);
      }
    }).catch(error => {
      console.log("搜索系统商品失败", error);
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

