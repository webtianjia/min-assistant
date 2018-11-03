<template>
  <div class="sku-card">
    <div class="sku-title text-overflow">
      {{sku.goods_name}}{{sku.goods_brand}}{{sku.goods_standard}}
    </div>
    <div class="card-item">
      <div class="sku-pic text-overflow">{{sku.goods_standard}}</div>
      <div class="sku-price">
        <span>￥</span>
        <span>{{sku.goods_price}}</span>
      </div>
      <span class="qty-control">x{{sku.goods_number}}</span>
      <div class="icon-control">
        <i class="icon icon-del" @click="deleteConfirm(sku.id)"></i>
        <i class="icon icon-edit" @click="editSku(sku)"></i>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "skuCard-3",
    props: {
      sku: {
        type: Object,
        default: null
      },
      index: {
        type: Number
      }
    },
    methods: {
      deleteConfirm(id) {
        this.$emit("deleteConfirm", id);
      },
      editSku(sku, index) {
        this.$emit("editSku", sku);
      }
    }
  };
</script>

<style scoped lang="less">
  .sku-card {
    min-height: 80px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    box-sizing: border-box;
    padding: 15px;

    .sku-title {
      font-size: 13px;
      color: #444;
    }
    .card-item {
      display: flex;
      margin-top: 18px;
      align-items: center;
      justify-content: space-between;
      .sku-pic {
        width: 85px;
        font-size: 13px;
        color: #9e9e9e;
      }
      .sku-price {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        margin-right: 24px;
      }
      .icon-control{
        display: flex;
      }
      .icon {
        justify-self: flex-start;
        width: 38px;
        height: 38px;
        background: no-repeat center;
        background-size: 19px;
        &.icon-edit {
          background-image: data-uri("../../static/img/i-edit.png");
          background-position: right center;
        }
        &.icon-del {
          background-image: url("../../static/img/i-del.png");
        }
      }
    }
  }
</style>
