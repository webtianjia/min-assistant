import loginAPI from "@/api/login/login";

const state = {};
//getters
const getters = {};

// mutations
const mutations = {
  setStorage(state, data) {
    wx.setStorageSync("userId", data.id);
    wx.setStorageSync("auth_code", data.auth_code);
  }
};

// actions
const actions = {
  async login({ commit }, param) {
    await  loginAPI.login(param).then(response => {
      if (response.success) {
        commit("setStorage", response.data);
      }
    }).catch(error => {
      console.log("登录出错", error);
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
