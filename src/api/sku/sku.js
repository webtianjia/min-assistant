import fly from "../flyio";

export default {
  getSkuList: (data) => {
    return fly.request("/goods/list", data);
  },
  addSku: (data) => {
    return fly.request("/goods/add", data);
  },
  deleteSku: (data) => {
    return fly.request("/goods/delete", data);
  },
  matchSku:(data)=>{
    return fly.request("/goods/match", data);
  }
};


