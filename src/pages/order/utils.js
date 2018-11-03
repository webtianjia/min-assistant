function formatStatus(status) {
  switch (status) {
    case "create":
      return "未收货";
    case "close":
      return "已完结";
    case "income":
      return "运输中";
    case "shipmented":
      return "运输中";
    case "all":
      return "全部";
  }
}

function formatStatusText(status) {
  switch (status) {
    case "未收货":
      return "create";
    case "已完结":
      return "close";
    case "运输中":
      return "income";
    case "全部":
      return "";
  }
}

export {
  formatStatus,
  formatStatusText
};
