import order from "../../../api/order/order";
import Vue from "mpvue";

const state = {
  orderDetail: null
};
//getters
const getters = {
  goodsList(state) {
    if (state.orderDetail) {
      return state.orderDetail.goodsList;
    }
  }
};

// mutations
const mutations = {
  setOrder(state, orderDetail) {
    state.orderDetail = orderDetail;
  },
  setConsignee(state, consignee) {
    console.log(consignee);
    state.orderDetail.consignee = consignee.name;
    state.orderDetail.consignee_card_no = consignee.card_no;
    state.orderDetail.consignee_address = consignee.address;
    state.orderDetail.consignee_city = consignee.city;
    state.orderDetail.consignee_district = consignee.area;
    state.orderDetail.consignee_province = consignee.province;
  },
  setSender(state, sender) {
    state.orderDetail.sender = sender.name;
    state.orderDetail.sender_address = sender.address;
    state.orderDetail.sender_phone = sender.phone;
  },

  addSku(state, { sku, goods_number }) {
    sku.goods_number = goods_number;
    state.orderDetail.goodsList.push(sku);
  },
  deleteSku(state, id) {
    let goodsList = state.orderDetail.goodsList;
    state.orderDetail.goodsList = goodsList.filter(item => item.id !== id);
  },
  updateSku(state, sku) {
    let goodsList = state.orderDetail.goodsList;
    goodsList.find(item => {
      if (item.id === sku.id) {
        item = Object.assign(item, sku);
      }
    });
    state.orderDetail.goodsList = goodsList;
  }
};

// actions
const actions = {
  getOrder({ commit }, id) {
    order.getOrder({ id }).then(response => {
      if (response.success) {
        commit("setOrder", response.data);
      }
    }).catch(error => {
      console.log("获取订单详情失败", error);
    });
  },
  updateOrder({ commit }, param) {
    return order.updateOrder(param);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
