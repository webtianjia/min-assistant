import Vue from "vue";
import Vuex from "vuex";
import usedSkuList from "./modules/usedSkuList/usedSkuList";
import skuList from "./modules/sku/skuList";
import editSku from "./modules/sku/editSku";

import senderList from "./modules/sender/senderList";
import senderEdit from "./modules/sender/senderEdit";

import consigneeList from "./modules/consignee/consigneeList";
import consigneeEdit from "./modules/consignee/consigneeEdit";

import systemReceivingList from "./modules/systemReceiving/systemReceivingList";

import orderList from "./modules/order/orderList";
import orderCreate from "./modules/order/orderCreate";
import orderDetail from "./modules/order/orderDetail";
import orderEdit from "./modules/order/orderEdit";

import login from "./modules/login/login";
import user from "./modules/user/user";

import shopCart from "./modules/shopCart/shopCart";

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    usedSkuList,
    skuList,
    editSku,
    consigneeList,
    consigneeEdit,
    senderList,
    senderEdit,
    systemReceivingList,
    orderList,
    orderCreate,
    orderDetail,
    orderEdit,
    login,
    user,
    shopCart
  }
});

