function setOrderSkuList(orderSkuList) {
  wx.setStorageSync("orderSkuList", JSON.stringify(orderSkuList));
}

function getOrderSkuList() {
  if (wx.getStorageSync("orderSkuList")) {
    return JSON.parse(wx.getStorageSync("orderSkuList"));
  }else {
    return []
  }
}

function clearOrderSkuList() {
  wx.removeStorageSync("orderSkuList");
}

export {
  setOrderSkuList,
  getOrderSkuList,
  clearOrderSkuList
};
