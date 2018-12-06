import order from "@/api/order/order";

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
  /*新增*/
  addSku(state, skuList) {
    state.orderDetail.goodsList.push(...skuList);
  },
  /*删除*/
  deleteSku(state, index) {
    const orderSkuList = state.orderDetail.goodsList;
    orderSkuList.splice(index, 1);
    state.orderDetail.goodsList = JSON.parse(JSON.stringify(orderSkuList));
  },
  /*修改*/
  updateSku(state, { sku, index }) {
    state.orderDetail.goodsList[index] = Object.assign(state.orderDetail.goodsList[index], sku);
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
