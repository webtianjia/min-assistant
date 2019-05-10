<template>
  <div class="container " :class="{'disabled-scroll':settlementDialogStatus}">
    <div class="header-fixed">
      <div class="top-wrapper">
        <div class="switch" @click="changeSwitch" :class="{active:checkedSwitch}">
          <div class="switch-item"><span class="text">常用商品</span></div>
          <div class="switch-item"><span class="text">智能匹配</span></div>
        </div>
      </div>
      <split color="#fff" :height="15"></split>
      <div class="search-bar">
        <div class="input-group" v-if="!checkedSwitch">
          <i class="icon icon-search"></i>
          <input type="text" class="search-input" v-model.lazy="searchInput"
                 placeholder-style="color:#888;" @confirm="confirm" confirm-type="search" placeholder="请输入品名/品牌">
          <i class="icon icon-clear" v-show="searchInput" @click="searchInput=''"></i>
        </div>
        <div class="input-group" v-else>
          <!--<i class="icon icon-search"></i>-->

          <input-code ref="inputCode"  @change="setNumber" placeholder="请输入品名/品牌/或扫描商品条码"></input-code>

   <!--       <input type="text" class="search-input" v-model.lazy="searchInput"
                 placeholder-style="color:#888;" @confirm="confirm" confirm-type="search" placeholder="">

          <i class="icon icon-clear" v-show="searchInput" @click="searchInput=''"></i>-->
        </div>
      </div>
    </div>
    <div class="sku-list">
      <div v-for="sku in skuList" :key="sku.id">
        <sku-card2 :sku="sku" @changeQty="pushProductToCart" :reduce="false"></sku-card2>
      </div>
      <div v-if="searchInput&&skuList.length<=0||matchInput&&skuList.length<=0" style="margin-top: 70px">
        <no-data type="no-sku" text="未搜索到商品"></no-data>
        <div class="add-card" @click="goTo('/pages/sku/editOrderSku/main')">
          <div class="text">手动添加</div>
        </div>
      </div>
    </div>
    <div v-if="isNoDataBottom && skuList.length >6" style="padding-bottom: 50px">
      <no-data-bottom></no-data-bottom>
    </div>
    <settlement-dialog></settlement-dialog>
    <div class="footer-fixed-bottom">
      <div class="settlement" @click="setSettlementStatus(cartTotalCount>0)">
        <div class="item">
          <i class="icon animated" :class="{pulse:display_good_box}"></i>
          已选<span class="hot">{{cartTotalCount}}</span>件商品
        </div>
      </div>
      <div class="btn" :class="{active:cartTotalCount}" @click="submitAddSku">
        <span class="text">确认添加</span>
      </div>
    </div>
    <canvas style="position:fixed; width: 100%; height: 100%; left:0; top:0;" v-show="display_good_box"
            canvas-id="myCanvas"></canvas>
  </div>
</template>

<script>
  import inputCode from "@/components/input-code";

  import split from "@/components/split";
  import settlementDialog from "@/components/settlement-dialog";
  import skuCard2 from "@/components/skuCard-2";
  import noData from "@/components/no-data";
  import noDataBottom from "@/components/no-data-bottom";

  import AddShopCar from "@/utils/AddShopCar";

  import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
  import { showTotal } from "../../utils";

  export default {
    name: "usedSkuList",
    computed: {
      ...mapState("usedSkuList", {
        skuList: "skuList",
        checkedSwitch: "checkedSwitch"
      }),
      ...mapGetters("usedSkuList", {
        isNoDataBottom: "isNoDataBottom"
      }),
      ...mapState("shopCart", {
        settlementDialogStatus: "settlementDialogStatus"
      }),
      ...mapGetters("shopCart", {
        cartTotalCount: "cartTotalCount",
        shopCartSkuList: "shopCartSkuList"
      })
    },
    data() {
      return {
        display_good_box: false,
        searchInput: "",
        matchInput: "",
        bar_code:""
      };
    },
    methods: {
      ...mapMutations("usedSkuList", {
        initParam: "initParam",
        setQueryName: "setQueryName",
        changeStart: "changeStart",
        changeSwitch: "changeSwitch"
      }),
      ...mapMutations("shopCart", {
        pushProduct: "pushProductToCart",
        setSettlementStatus: "setSettlementStatus",
        clearSelectedALL: "clearSelectedALL"
      }),
      ...mapMutations("orderCreate", {
        createOrderAddSku: "addSku"
      }),
      ...mapMutations("orderEdit", {
        updateOrderAddSku: "addSku"
      }),
      ...mapActions("usedSkuList", {
        getSkuList: "getSkuList",
        matchSkuList: "matchSkuList"
      }),
      setNumber(value) {
        this.$nextTick(()=>{
          this.matchInput = value;
        })
      },
      goTo(url, data) {
        this.searchInput = "";
        this.$router.push({
          path: url,
          query: {
            data: JSON.stringify(data)
          }
        });
      },
      submitAddSku() {
        if (this.cartTotalCount) {
          let skuList = JSON.parse(JSON.stringify(this.shopCartSkuList));
          if (this.validateAllPrice(skuList)) {
            if (this.$mp.query.updateOrder) {
              this.updateOrderAddSku(skuList);
            } else {
              this.createOrderAddSku(skuList);
            }
            this.clearSelectedALL();
            this.$router.back();
          } else {
            showTotal({
              title: "部分商品无价格，请手动设置"
            });
            setTimeout(() => {
              this.setSettlementStatus(true);
            }, 500);

          }
        }
      },
      validateAllPrice(skuList) {
        let sku = skuList.filter(item => !item.goods_price);
        return sku.length === 0;
      },
      searchSku() {
        this.initParam();
        this.setQueryName(this.searchInput);
        this.getSkuList();
      },
      pushProductToCart({ sku, value }, e) {
        this.pushProduct(sku);
        if (e) {
          this.touchOnGoods(e);
        }
      },
      touchOnGoods(e) {
        AddShopCar.startAddShopAnimation([{
          x: 60,
          y: 750 * wx.getSystemInfoSync().windowHeight / wx.getSystemInfoSync().windowWidth - 50
        }, { x: e.clientX, y: e.clientY }], this);
      }
    },
    onShow() {
      this.searchInput = "";
      if (!this.checkedSwitch) {
        this.searchSku();
      }
    },
    onUnload() {
      if (this.$options.data) {
        Object.assign(this.$data, this.$options.data());
      }
      if( this.$refs.inputCode){
        this.$refs.inputCode.clear();//qin
      }

      this._watchers = [];
      if (this._watcher && this._watcher.teardown) {
        this._watcher.teardown();
      }
    },
    onReachBottom() {
      if (this.isNoDataBottom || this.checkedSwitch) {
        return;
      }
      this.changeStart();
      this.getSkuList();
    },
    watch: {
      searchInput(val) {
        if(this.checkedSwitch&&!val){
          this.initParam();
        }else {
          this.$nextTick(() => {
            this.searchSku();
          });
        }

      },
      matchInput(value) {/*zn*/
        if(this.checkedSwitch){
          this.$nextTick(() => {
            this.matchSkuList({ goods_name: value });
          });
        }else {
          this.initParam();
        }

      },
      checkedSwitch(value) {
        this.searchInput = "";
        this.matchInput = "";
        this.initParam();
        if (value===false) {
          this.searchSku();
        }
      }
    },
    components: {
      inputCode,
      split,
      settlementDialog,
      skuCard2,
      noData,
      noDataBottom
    }
  };
</script>
<style scoped lang="less">
  .add-card {
    width: 210px;
    margin: 36px auto 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background: #2eaaf5;
    .text {
      color: #fff;
      font-size: 15px;
    }
  }

  .top-wrapper {
    height: 43px;
    width: 100%;
    background: #2aa2fa;
    display: flex;
    align-items: center;
    justify-content: center;
    .switch {
      width: 212px;
      height: 28px;
      border-radius: 19px;
      box-shadow: 0 0 1px #fff;
      display: flex;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        background: #fff;
        z-index: 10;
        width: 50%;
        height: 100%;
        box-shadow: 0 0 1px #fff;
        border-radius: 19px;
        transition: all .3s;
      }
      &.active {
        &:after {
          transform: translateX(100%);
        }
        .switch-item:first-child {
          color: #d0edff;
        }
        .switch-item:last-child {
          color: #2eaaf5;
        }
      }
      .switch-item {
        position: relative;
        z-index: 20;
        flex: 0 0 50%;
        width: 50%;
        background: transparent;
        font-size: 14px;
        color: #d0edff;
        display: flex;
        align-items: center;
        justify-content: center;
        &:first-child {
          color: #2eaaf5;
        }
        &:last-child {
          color: #d0edff;
        }
      }
    }
  }

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    .input-group {
      flex: 0 0 345px;
      width: 345px;
      position: relative;
      .search-input {
        height: 34px;
        line-height: 34px;
        color: #2e2e2e;
        background: #e9e9e9;
        border-radius: 4px;
        font-size: 14px;
        padding: 0 34px;
      }
      .icon {
        width: 34px;
        height: 34px;
        background: no-repeat center;
        background-size: 16px;
        position: absolute;
      }
      .icon-search {
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        z-index: 10;
        background-image: data-uri("../../../static/img/search-icon.png");
      }
      .icon-clear {
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background-image: data-uri("../../../static/img/search-clear.png");
      }
    }
  }

  .sku-list {
    padding: 100px 15px 50px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch
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
      align-items: center;
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
        font-size: 13px;
        color: #2e2e2e;
        .label {
          color: #2e2e2e;
        }
        .hot {
          color: #f56356;
        }
        .icon {
          width: 28px;
          height: 28px;
          margin-right: 10px;
          background: data-uri("../../../static/img/i-sku.png") no-repeat center;
          background-size: cover;
        }
      }
    }
  }

  @-webkit-keyframes pulse {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }

    50% {
      -webkit-transform: scale3d(1.05, 1.05, 1.05);
      transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  @keyframes pulse {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }

    50% {
      -webkit-transform: scale3d(1.05, 1.05, 1.05);
      transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  .pulse {
    -webkit-animation-name: pulse;
    animation-name: pulse;
  }

  .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
</style>
