import consignee from "../../../api/consignee/consignee";

const state = {
  consigneeList: []
};
//getters
const getters = {};

// mutations
const mutations = {
  setConsigneeList(state, consigneeList) {
    state.consigneeList = consigneeList;
  },
  deleteConsignee(state, consigneeId) {
    state.consigneeList = state.consigneeList.filter(item => item.id !== consigneeId);
  }
};

// actions
const actions = {
  getConsigneeList({ commit }) {
    consignee.getConsigneeList().then(reponse => {
      if (reponse.success) {
        commit("setConsigneeList", reponse.data);
      }
    }).catch(error => {
      console.log("获取收件人列表出错", error);
    });
  },
  deleteConsignee({ commit }, id) {
    consignee.deleteConsignee({ id }).then(response => {
      if (response.success) {
        commit("deleteConsignee", id);
      }
    }).catch(error => {
      console.log("删除收件人出错", error);
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
