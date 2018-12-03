import sender from "@/api/sender/sender";

const state = {
  senderList: []
};
//getters
const getters = {};

// mutations
const mutations = {
  setSenderList(state, senderList) {
    state.senderList = senderList;
  },
  deleteSender(state, senderId) {
    state.senderList = state.senderList.filter(item => item.id !== senderId);
  },
  setDefault(state, senderId) {
    state.senderList.filter(item => item.is_default = item.id === senderId ? "y" : "n");
  }
};

// actions
const actions = {
  getSenderList({ commit }) {
    sender.getSenderList().then(response => {
      if (response.success) {
        commit("setSenderList", response.data);
      }
    }).catch(error => {
      console.log("获取寄件人列表错误", error);
    });
  },
  async deleteSender({ commit }, id) {
    await sender.deleteSender({ id }).then(response => {
      if (response.success) {
        commit("deleteSender", id);
      }
    }).catch(error => {
      console.log("删除寄件人出错", error);
    });
  },
  async setDefault({ commit }, id) {
    await sender.setDefault({ id }).then(response => {
      if (response.success) {
        commit("setDefault", id);
      }
    }).catch(error => {
      console.log("设置默认寄件人出错", error);
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
