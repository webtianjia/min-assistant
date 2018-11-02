import fly from "../flyio";

export default {
  login: (data) => {
    return fly.request("/login", data);
  },
};
