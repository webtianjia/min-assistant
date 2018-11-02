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
      <span class="qty-control">{{sku.goods_number}}</span>
      <i class="icon icon-edit" @click="editSku(sku,index)"></i>
      <i class="icon icon-del" @click="deleteConfirm(index)"></i>
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
      changeQty(value) {
        this.$emit("changeQty", { index: this.index, value });
      },
      deleteConfirm(index) {
        this.$emit("deleteConfirm", index);
      },
      editSku(sku, index) {
        this.$emit("editSku", sku, index);
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
        .input {
          margin-left: 5px;
          font-size: 13px;
          width: 70px;
          height: 19px;
          line-height: 17px;
          background: #f6f6f6;
          border: 1rpx solid #bfbfbf;
          border-radius: 2px;
          padding-left: 5px;
        }
      }
      .icon {
        margin-left: 29px;
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
