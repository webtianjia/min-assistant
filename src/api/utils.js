//开发
/*const ajaxUrl =
  process.env.NODE_ENV === "development"
    ? "https://apptest.guyubao.com/transport/app"
    : "https://www.xiupos.com/transport/app";

const appCode =
  process.env.NODE_ENV === "development"
    ? "45282745e19f4ca2bd8db19f8d36777e"
    : "4dee6cc1062943b0887cc5ba0821334b";*/


//测试
const ajaxUrl =
  process.env.NODE_ENV === "development"
    ? "https://www.xiupos.com/transport/app"
    : "https://apptest.xiaomiqiu.com/transport/app";

const appCode =
  process.env.NODE_ENV === "development"
    ? "4dee6cc1062943b0887cc5ba0821334b"
    : "ee43f8a46f8e44e3968b064d4747def8";
export default {
  path: ajaxUrl,
  appCode: appCode
};
//production  && development


