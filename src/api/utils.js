const ajaxUrl =
  process.env.NODE_ENV === "development"
    ? "https://apptest.xiaomiqiu.com/transport/app"
    : "https://wx.geek.xiuex.com";

export default {
  path: ajaxUrl,
  appCode:"ee43f8a46f8e44e3968b064d4747def8"
};


