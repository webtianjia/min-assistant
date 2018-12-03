import fly from "../flyio";

export default {
  getSystemReceivingList: (data) => {
   return fly.request("/receiving/list", data)
  },
  getCountryList:(data)=>{
    return fly.request("/receiving/countryList", data)
  }
};


