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
  getRoute: (data) => {
    var tempUurl="https://m.kuaidi100.com/query?type=" + gCompanyCode + "&postid=" + gKuaidiNumber + "&id=1&valicode=&temp=" + Math.random();
    wx.request({
      url: tempUurl,
      success: function( res ) {
        console.log(res);
      }
    })
  }

};



