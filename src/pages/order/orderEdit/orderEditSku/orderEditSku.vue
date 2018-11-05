<template>
  <div class="container">
    <split background="#fff"></split>
    <div class="add-default-card" @click="goTo('/pages/sku/editOrderSku/main?updateOrder=true')">
      <div class="add-default-btn"></div>
    </div>
    <div class="sku-list">
      <div v-for="(sku,index) in goodsList" :key="sku.id">
        <sku-card3 :sku="sku" :index="index" @changeQty="changeQty" @deleteConfirm="deleteConfirm" @editSku="editSku"></sku-card3>
        <split></split>
      </div>
      <div style="padding-top: 70px" v-if="goodsList<=0">
        <no-data type="no-sku" text="暂无寄件商品，请添加"></no-data>
      </div>
    </div>
  </div>
</template>

<script>
  import numberControl from "@/components/number-control";
  import split from "@/components/split";
  import noData from "@/components/no-data";
  import skuCard3 from "@/components/skuCard-3";

  import { mapState, mapGetters, mapMutations } from "vuex";

  export default {
    name: "orderEditSku",
    components: {
      numberControl,
      split,
      noData,
      skuCard3
    },
    computed: {
      ...mapGetters("orderEdit", {
        goodsList: "goodsList"
      })
    },
    methods: {
      ...mapMutations("orderEdit", {
        deleteSku: "deleteSku"
      }),
      deleteConfirm(id) {
        let that = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除该商品？",
          success(WXresponse) {
            if (WXresponse.confirm) {
              that.deleteSku(id);
            }
          }
        });
      },
      editSku(sku){
        this.goTo("/pages/sku/editOrderSku/main",{
          updateOrder:true,
          ...sku
        })
      },
      goTo(url, data) {
        this.$router.push({
          path: url,
          query: {
            data: JSON.stringify(data)
          }
        });
      }
    },
    onUnload() {
      if (this.$options.data) {
        Object.assign(this.$data, this.$options.data());
      }
      this._watchers = [];
      if (this._watcher && this._watcher.teardown) {
        this._watcher.teardown();
      }
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
      background: data-uri("../../../../../static/img/add-sku.png") no-repeat center;
      background-size: cover;
    }
  }


</style>
