import sku from "@/api/sku/sku";

const state = {};

// getters
const getter = {};

//mutations
const mutations = {};
//actions
const actions = {
  addSku({ commit }, param) {
    return sku.addSku({ ...param });
  }
};


export default {
  namespaced: true,
  state,
  getter,
  actions,
  mutations
};
