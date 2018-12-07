<template>
  <div class="settlement">
    <div class='settlement-mask' v-show=" settlementDialogStatus" @click.stop='setSettlementStatus(false)'></div>
    <div :class="['settlement-actionsheet', settlementDialogStatus?'settlement-actionsheet_toggle':'']">
      <div class="panel">
        <div class="panel-heading">
          <div class="wrapper" @click="deleteConfirm">
            <i class="icon icon-del"></i>
            <span class="text">清空选中</span>
          </div>
          <i class="icon icon-close" @click="setSettlementStatus(false)"></i>
        </div>
        <div class="panel-body">
          <div class="sku-list">
            <div v-for="(sku,$index) in productList" :key="sku.id" v-show="sku.goods_number>0">
              <sku-card2 checked :sku="sku" :index="$index" @changeQty="changeQty" @changeChecked="changeChecked">
                <a class="icon icon-edit"></a>
              </sku-card2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import split from "@/components/split";
  import skuCard2 from "@/components/skuCard-2";

  import { mapState, mapMutations, mapGetters } from "vuex";

  export default {
    name: "settlement-dialog",
    computed: {
      ...mapState("shopCart", {
        settlementDialogStatus: "settlementDialogStatus",
        productList: "productList"
      }),
      ...mapGetters("shopCart", {
        cartTotalCount: "cartTotalCount"
      })
    },
    components: {
      split,
      skuCard2
    },
    methods: {
      ...mapMutations("shopCart", {
        setSettlementStatus: "setSettlementStatus",
        clearSelectedALL: "clearSelectedALL",
        changeQty: "changeQty",
        changeChecked:"changeChecked"
      }),
      deleteConfirm() {
        let that = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除所有选中商品？",
          success(WXresponse) {
            if (WXresponse.confirm) {
              that.clearSelectedALL();
            }
          }
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .settlement {
    .settlement-mask {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .6);
      & + .settlement-actionsheet {
        position: fixed;
        left: 0;
        bottom: 0;
        -webkit-transform: translate(0, 100%);
        transform: translate(0, 100%);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        z-index: 5000;
        width: 100%;
        min-height: 200px;
        background-color: #FFF;
        transition: transform .3s;
      }
      & + .settlement-actionsheet_toggle {
        -webkit-transform: translate(0, 0);
        transform: translate(0, 0);
      }
    }
    .panel {
      .panel-heading {
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f8f8f8;
        .wrapper {
          display: flex;
          align-items: center;
          justify-content: left;
          .text {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
    .icon {
      width: 38px;
      height: 38px;
      background: no-repeat center;
      background-size: 19px;
      &.icon-del {
        background-image: data-uri("../../static/img/i-del.png");
      }
      &.icon-close {
        background-image: data-uri("../../static/img/i-close.png");
      }
      &.icon-edit {
        flex: 0 0 38px;
        background-image: url("../../static/img/i-edit.png");
      }
    }
    .sku-list {
      padding: 0 15px;
      box-sizing: border-box;
      max-height: 300px;
      overflow-y: auto;
    }
    .panel-body {
      padding-bottom: 60px;
    }
  }


</style>
