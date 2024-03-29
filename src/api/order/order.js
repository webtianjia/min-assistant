import fly from "../flyio";

export default {
  getOrderList: (data) => {
    return fly.request("/order/list", data);
  },
  getOrder: (data) => {
    return fly.request("/order/getOrder", data);
  },
  getOrderCount: (data) => {
    return fly.request("/order/getTotal", data);
  },
  addOrder: (data) => {
    return fly.request("/order/add", data);
  },
  deleteOrder: (data) => {
    return fly.request("/order/delete", data);
  },
  updateOrder: (data) => {
    return fly.request("/order/update", data);
  },
  getOrderRoute:(data) => {
    return fly.request("/route/getRoute", data);
  }
};



