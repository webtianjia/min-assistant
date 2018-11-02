const ajaxUrl =
  process.env.NODE_ENV === "development"
    ? "https://jiuping.xiaomiqiu.com/transport/app"
    : "https://wx.geek.xiuex.com";

export default {
  path: ajaxUrl,
  appCode:"d38c3431237b4347ae349bc7b5836e9e"
};


