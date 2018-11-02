import sender from "../../../api/sender/sender";

const state = {};
//getters
const getters = {};

// mutations
const mutations = {};

// actions
const actions = {
  addSender({ commit }, param) {
    return sender.addSender(param);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
