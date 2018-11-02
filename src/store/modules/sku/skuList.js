import sku from "../../../api/sku/sku";

const state = {
  skuList: [],
  param: {
    limit: 5,
    start: 0,
    query_name: "",
    page: 1
  },
  total: 0
};

// getters
const getters = {
  isNoDataBottom: (state) => {
    if (state.total) {
      return (parseInt(state.total / state.param.limit) + 1) <= state.param.page;
    }
  }
};

//mutations
const mutations = {
  setSkuList(state, skuList) {
    state.skuList.push(...skuList);
  },
  deleteSku(state, skuId) {
    state.skuList = state.skuList.filter(item => item.id !== skuId);
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
  }
};

//actions
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
  deleteSku({ commit }, id) {
    sku.deleteSku({ id }).then(response => {
      if (response.success) {
        commit("deleteSku", id);
      }
    }).catch(error => {
      console.log("删除商品失败", error);
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
