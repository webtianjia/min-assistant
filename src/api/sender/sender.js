import fly from "../flyio";

export default {
  getSenderList: (data) => {
    return fly.request("/sender/list", data);
  },
  addSender: (data) => {
    return fly.request("/sender/add", data);
  },
  deleteSender: (data) => {
    return fly.request("/sender/delete",data);
  },
  setDefault: (data) => {
    return fly.request("/sender/setDefault", data);
  },
  getDefault: (data) => {
    return fly.request("/sender/getDefault", data);
  }
};


