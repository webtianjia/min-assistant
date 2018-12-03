import Fly from "flyio/dist/npm/wx";
import utils from "./utils.js";
import { showTotal } from "../utils/index";

const fly = new Fly();
fly.config.baseURL = utils.path;
fly.config.timeout = 60000;
fly.config.method = "POST";
//添加请求拦截器

let timer;
fly.interceptors.request.use((request) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
  }, 300);
  request.headers = {
    "userId": wx.getStorageSync("userId") || "",
    "content-type": "application/x-www-form-urlencoded",
    "appCode": utils.appCode
  };
  if (!request.headers.userId) {
    delete  request.headers.userId;
  }

  let authParams = {
    "timestamp": new Date().getTime()
  };
  /*  request.body && Object.keys(request.body).forEach((val) => {
      if (request.body[val] === "") {
        delete request.body[val];
      }
    });*/

  request.body = {
    ...request.body,
    ...authParams
  };
  return request;
});

//添加响应拦截器
fly.interceptors.response.use((response) => {
    wx.hideLoading();
    if (timer) clearTimeout(timer);
    return response.data;
  }, (error) => {
    //请求出错，根据返回状态码判断出错原因
    wx.hideLoading();
    if (timer) clearTimeout(timer);
    if (error) {
      showTotal(
        {
          title: "网络繁忙，请稍后再试",
          icon: "none",
          mask: true
        }
      );
      return error;
    }
  }
);

export default fly;
