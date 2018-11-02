import consignee from "../../../api/consignee/consignee";

const state = {};
//getters
const getters = {};

// mutations
const mutations = {};

// actions
const actions = {
  addConsignee({ commit }, param) {
    return consignee.addConsignee(param);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
