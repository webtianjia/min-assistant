import loginAPI from "../../../api/login/login";

const state = {};
//getters
const getters = {};

// mutations
const mutations = {
  setStorage(state, data) {
    wx.setStorageSync("user_id", data.id);
    wx.setStorageSync("auth_code", data.auth_code);
  }
};

// actions
const actions = {
  login({ commit }) {
    wx.login({
      success(WXresponse) {
        loginAPI.login(WXresponse).then(response => {
          commit("setStorage", response.data);
        }).catch(error => {
          console.log(error);
        });
      }
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
