<template>
  <div class="sku-card" v-if="sku">
    <div class="sku-title text-overflow">{{sku.goods_name}}{{sku.goods_brand}}{{sku.goods_standard}}</div>
    <div class="controller">
      <div>
        <span class="sku-pic">{{sku.goods_standard}}</span>
        <span class="sku-price">￥{{sku.goods_price}}</span>
      </div>
      <div class="controller-btn">
        <i class="icon icon-del" @click="deleteSku(sku.id)"></i>
        <i class="icon icon-edit" @click="editSku(sku)"></i>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "sku-card",
    props: {
      sku: {
        type: Object,
        default: null
      }
    },
    methods: {
      deleteSku(skuId) {
        this.$emit("delete", skuId);
      },
      editSku(sku) {
        this.$emit("edit", sku);
      }
    }
  };
</script>

<style scoped lang="less">
  .sku-card {
    min-height: 60px;
    background: #fff;
    padding: 15px;
    font-size: 13px;
    .sku-title {
      color: #444;
    }
    .sku-pic {
      margin-top: 10px;
      font-size: 11px;
      color: #9e9e9e;
    }
    .sku-price {
      margin-left: 40px;
      color: #2e2e2e;
    }
    .controller {
      margin-top: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon {
        width: 38px;
        height: 38px;
        background: no-repeat center;
        background-size: 19px;
        &.icon-edit {
          background-image: data-uri("../../static/img/i-edit.png");
          background-position: right center;
        }
        &.icon-del {
          background-image: data-uri("../../static/img/i-del.png");

        }
      }
      .controller-btn {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
