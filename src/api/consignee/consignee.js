import fly from "../flyio";

export default {
  getConsigneeList: (data) => {
    return fly.request("/consignee/list", data);
  },
  addConsignee: (data) => {
    return fly.request("/consignee/add", data);
  },
  deleteConsignee: (data) => {
    return fly.request("/consignee/delete", data);
  }
};


