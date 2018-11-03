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
  deleteSku(state, index) {
    state.orderDetail.goodsList.splice(index, 1);
  },
  changeQty(state, { value, index }) {
    console.log(state.orderDetail.goodsList[index], value);
    //state.orderDetail.goodsList[index].goods_number = value;
    Vue.set(state.orderDetail.goodsList[index], "goods_number", value);
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
  addSku(state, sku) {
    state.orderDetail.goodsList.push(sku);
  },
  updateSku(state, sku) {
    const index = sku.index;
    let goodsList = state.orderDetail.goodsList;
    state.orderDetail.goodsList=[];
    goodsList[index] = Object.assign({}, sku);
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
