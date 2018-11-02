function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("/");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
}

export function formatPhone(phone) {
  return phone.slice(0, 3) + "****" + phone.slice(-4);
}

export function formatIdCard(idCard) {
  return "****" + idCard.slice(-4);
}

export function initData(obj) {
  for (let item in obj) {
    if (item) {
      let [object, type] = Object.prototype.toString.call(obj[item]).split(" ");
      switch (type.split("]").join("")) {
        case "Array" :
          obj[item] = [];
          break;
        case "String":
          obj[item] = "";
          break;
        case "Object":
          obj[item] = null;
          break;
        default:
          obj[item] = "";
          break;
      }
    }
  }
  return obj;
}


export default {
  formatNumber,
  formatTime,
  formatPhone,
  formatIdCard,
  initData
};
