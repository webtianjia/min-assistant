<template>
  <div class="container " :class="{'disabled-scroll':settlementDialogStatus}">
    <div class="header-fixed">
      <search-bar ref="searchBar" @change="searchSku"></search-bar>
      <split color="#fff"></split>
      <div class="add-default-card" @click="goTo('/pages/sku/editOrderSku/main')">
        <div class="add-default-btn"></div>
      </div>
    </div>
    <div class="sku-list">
      <div v-for="sku in skuList" :key="sku.id">
        <sku-card2 :sku="sku" @changeQty="pushProductToCart"></sku-card2>
      </div>
      <div v-if="skuList.length<=0" style="margin-top: 70px">
        <no-data type="no-sku" text="暂无寄件商品，请添加"></no-data>
      </div>
    </div>
    <div v-if="isNoDataBottom && skuList.length > 3" style="margin-bottom: 50px">
      <no-data-bottom></no-data-bottom>
    </div>
    <settlement-dialog></settlement-dialog>
    <div v-if="skuList.length>0" class="footer-fixed-bottom">
      <div class="settlement" @click="setSettlementStatus(!settlementDialogStatus)">
        <div class="item">
          <label class="label">商品总额</label>
          <span class=" price">￥{{cartTotalPrice}}</span>
        </div>
        <div class="item">
          已选<span class="price">{{cartTotalCount}}</span>件商品
        </div>
      </div>
      <div class="btn" :class="{active:cartTotalCount}" @click="submitAppend">
        <span class="text">确认添加</span>
      </div>
    </div>
  </div>
</template>

<script>
  import searchBar from "@/components/search-bar";
  import split from "@/components/split";
  import settlementDialog from "@/components/settlement-dialog";
  import skuCard2 from "@/components/skuCard-2";
  import noData from "@/components/no-data";
  import noDataBottom from "@/components/no-data-bottom";


  import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

  export default {
    name: "usedSkuList",
    computed: {
      ...mapState("usedSkuList", {
        settlementDialogStatus: "settlementDialogStatus",
        skuList: "skuList",
        cartTotalPrice:state=>{
          return state.cartTotalPrice.toFixed(2)
        },
        cartTotalCount: "cartTotalCount"
      }),
      ...mapGetters("usedSkuList", {
        cardSkuList: "cardSkuList",
        isNoDataBottom: "isNoDataBottom"
      })
    },
    methods: {
      ...mapMutations("usedSkuList", {
        setSettlementStatus: "setSettlementStatus",
        pushProductToCart: "pushProductToCart",
        initParam: "initParam",
        setQueryName:"setQueryName",
        changeStart: "changeStart"
      }),
      ...mapActions("usedSkuList", {
        getSkuList: "getSkuList"
      }),
      goTo(url, data) {
        this.$router.push({
          path: url,
          query: {
            data: JSON.stringify(data)
          }
        });
      },
      submitAppend() {
        if (this.cartTotalCount) {
          this.$router.back();
        }
      },
      searchSku(value) {
        this.initParam();
        this.setQueryName(value);
        this.getSkuList();
      }
    },
    onShow() {
      this.initParam();
      if(this.$refs.searchBar){
        this.$refs.searchBar.clear();
      }
      this.getSkuList();
    },
    onUnload() {
      if (this.$options.data) {
        Object.assign(this.$data, this.$options.data());
      }
      this._watchers = [];
      if (this._watcher && this._watcher.teardown) {
        this._watcher.teardown();
      }
    },
    onReachBottom() {
      if (this.isNoDataBottom) {
        return;
      }
      this.changeStart();
      this.getSkuList();
    },
    components: {
      split,
      settlementDialog,
      skuCard2,
      searchBar,
      noData,
      noDataBottom
    }
  };
</script>
<style scoped lang="less">
  .add-default-card {
    width: 100%;
    height: 74px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f1f1;
    .add-default-btn {
      width: 115px;
      height: 34px;
      background: data-uri("../../../static/img/add-sku.png") no-repeat center;
      background-size: cover;
    }
  }

  .sku-list {
    padding: 151px 15px 10px;
  }

  .footer-fixed-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 6000;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      height: 100%;
      min-width: 120px;
      background: #bbb;
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        color: #fff;
        font-size: 16px;
      }
      &.active {
        background: #2aa2fa;
      }
    }
    .settlement {
      padding: 10px 15px;
      box-sizing: border-box;
      height: 50px;
      position: relative;
      width: 100%;
      display: flex;
      align-items: left;
      flex-flow: column;
      &:before {
        content: '';
        height: 1px;
        background: #f2f2f2;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .item {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-top: 8px;
        color: #8a8a8a;
        &:first-child {
          margin-top: 0;
        }
        .label {
          color: #2e2e2e;
        }
        .price {
          color: #f56356;
        }
      }
    }
  }
</style>
