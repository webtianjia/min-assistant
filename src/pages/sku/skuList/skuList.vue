<template>
  <div class="container">
    <div class="header-fixed">
      <search-bar ref="searchBar" @change="searchSku"></search-bar>
      <split color="#fff"></split>
      <div class="add-default-card" @click="goTo()">
        <div class="add-default-btn"></div>
      </div>
    </div>
    <div class="sku-list">
      <div v-for="sku in skuList" :key="sku.id">
        <sku-card :sku="sku" @delete="deleteConfirm" @edit="goTo"></sku-card>
      </div>
    </div>
    <div style="margin-top: 70px" v-if="skuList.length<=0">
      <no-data text="暂无寄件商品，请添加"></no-data>
    </div>
    <div v-if="isNoDataBottom && skuList.length > 3">
      <no-data-bottom></no-data-bottom>
    </div>
  </div>
</template>

<script>
  import split from "@/components/split";
  import skuCard from "@/components/skuCard";
  import searchBar from "@/components/search-bar";
  import noData from "@/components/no-data";
  import noDataBottom from "@/components/no-data-bottom";
  import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
  import { showTotal } from "@/utils/index";

  export default {
    name: "skuList",
    computed: {
      ...mapState("skuList", {
        skuList: state => state.skuList
      }),
      ...mapGetters("skuList", {
        isNoDataBottom: "isNoDataBottom"
      })
    },
    methods: {
      ...mapActions("skuList", {
        getSkuList: "getSkuList",
        deleteSku: "deleteSku"
      }),
      ...mapMutations("skuList", {
        initParam: "initParam",
        changeStart: "changeStart",
        setQueryName: "setQueryName"
      }),
      ...mapMutations("orderCreate", {
        deleteOrderSku: "deleteSku"
      }),
      deleteConfirm({ skuId }) {
        let that = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除该商品？",
          success(WXresponse) {
            if (WXresponse.confirm) {
              that.deleteSku(skuId).then(() => {
                showTotal({
                  title: `删除成功`
                });
                if (that.skuList.length <= 3) {
                  that.initParam();
                  that.getSkuList();
                }
              });
              that.deleteOrderSku(skuId);
            }
          }
        });
      },
      goTo(data) {
        this.$router.push({
          path: "/pages/sku/editSku/main",
          query: {
            data: JSON.stringify(data)
          }
        });
      },
      searchSku(value) {
        this.initParam();
        this.setQueryName(value);
        this.getSkuList();
      }
    },
    onShow() {
      this.initParam();
      if (this.$refs.searchBar) {
        this.$refs.searchBar.clear();
      }
      this.getSkuList();
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
      skuCard,
      searchBar,
      noData,
      noDataBottom
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
      width: 140px;
      height: 34px;
      background: data-uri("../../../../static/img/add-default-sku.png") no-repeat center;
      background-size: cover;
    }
  }

  .sku-list {
    padding: 160px 15px 10px;
  }

</style>
