//state
const state = {
  settlementDialogStatus: false,
  productList: []
};

//getters
const getters = {
  cartTotalCount(state, getters) {
    return getters.shopCartSkuList.reduce((total, sku) => {
      return total + parseInt(sku.goods_number);
    }, 0);
  },
  shopCartSkuList(state) {
    return state.productList.filter(item => item.goods_number > 0);
  }
};

// mutations
const mutations = {
  setSettlementStatus(state, status) {
    state.settlementDialogStatus = status;
  },
  /*加入购物车*/
  pushProductToCart(state, sku) {
    if (sku.id && state.productList.length > 0) {
      if (existId(state.productList, sku.id)) {
        state.productList.find(item => {
          if (item.id === sku.id) {
            item.goods_number = item.goods_number + 1;
          }
        });
      } else {
        state.productList.push({ ...sku, goods_number: 1 });
      }
    } else {
      state.productList.push({ ...sku, goods_number: 1 });
    }
  },
  /*清空购物车*/
  clearSelectedALL(state) {
    state.productList = [];
    state.settlementDialogStatus = false;
  },
  /*修改商品数量*/
  changeQty(state, { index, value }) {
    state.productList[index].goods_number = value;
    if (this.getters["shopCart/cartTotalCount"] === 0) {
      this.commit("shopCart/setSettlementStatus", false);
    }
  },
  /*编辑商品*/
  updateSku(state, { index, sku }) {
    state.productList[index] = Object.assign(state.productList[index], sku);
  },
  addSku(state, sku) {
    state.productList.push(sku);
  }
};

// actions
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

function existId(list, id) {
  let sku = list.filter(item => item.id === id);
  return sku.length > 0;
}
