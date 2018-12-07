<template>
  <div class="sku-card" v-if="sku">
    <div class="card-item ">
      <div class="wrapper">
        <span class="text-overflow sku-attr w-134 color-444">{{sku.goods_name}}</span>
        <span class="sku-price warning">￥{{sku.goods_price}}</span>
        <span class="sku-attr" v-if="sku.goods_number">×{{sku.goods_number}}</span>
      </div>
      <div @click="goTo(sku,index)">
        <slot></slot>
      </div>
    </div>
    <div class="card-item">
      <div class="wrapper">
        <span class="sku-attr text-overflow w-134 color-444">{{sku.goods_brand}}</span>
        <span class="sku-attr text-overflow goods_standard">{{sku.goods_standard}}</span>
      </div>
      <div class="controller-btn" v-if="controller">
        <i class="icon icon-edit" @click="editSku(sku)"></i>
        <i class="icon icon-del" @click="deleteSku(sku.id)"></i>
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
      },
      index: {
        type: Number,
        default: null
      },
      controller: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      deleteSku(skuId) {
        this.$emit("delete", { skuId, index: this.index });
      },
      editSku(sku) {
        this.$emit("edit", sku, this.index);
      }
    }
  };
</script>

<style scoped lang="less">
  .sku-card {
    min-height: 65px;
    background: #fff;
    padding: 15px 0;
    box-sizing: border-box;
    .sku-attr {
      font-size: 11px;
      color: #9e9e9e;
      margin-right: 10px;
    }
    .sku-price {
      font-size: 11px;
      width: 80px;
      &.warning {
        color: #ff3636;
      }
    }
    .card-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:last-child {
        margin-top: 10px;
      }
      .wrapper {
        display: flex;
        align-items: center;
      }
    }
    .goods_standard {
      max-width: 100px;
    }
    position: relative;
    &:after {
      content: '';
      height: 1px;
      width: 100%;
      background: #e6e6e6;
      position: absolute;
      bottom: 0;
      left: 0;

    }
    .w-134 {
      width: 134px;
    }
    .icon {
      width: 38px;
      height: 38px;
      background: no-repeat center;
      background-size: 19px;
      background-position: right center;
      &.icon-edit {
        background-image: data-uri("../../static/img/i-edit.png");
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
</style>
