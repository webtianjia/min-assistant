<template>
  <div class="sku-card-2" v-if="sku">
    <div class="sku-title text-overflow">{{sku.goods_name}}{{sku.goods_brand}}{{sku.goods_standard}}</div>
    <div class="card-item">
      <div class="wrapper">
        <span class="sku-pic text-overflow">{{sku.goods_standard}}</span>
        <span class="sku-price">￥{{sku.goods_price}}</span>
      </div>
      <div>
        <number-control @change="changeQty" :value="sku.goods_number"></number-control>
      </div>
    </div>
  </div>
</template>

<script>
  import numberControl from "@/components/number-control";

  export default {
    name: "skuCard-2",
    components: {
      numberControl
    },
    props: {
      sku: {
        type: Object,
        default: null
      }
    },
    methods: {
      changeQty(value,e) {
        this.$emit("changeQty",{id:this.sku.id,value},e);
      }
    }
  };
</script>

<style scoped lang="less">
  .sku-card-2 {
    min-height: 75px;
    background: #fff;
    padding: 15px 0;
    box-sizing: border-box;
    .sku-title {
      font-size: 12px;
      color: #444;
    }
    .sku-pic {
      width: 60px;
      display: inline-block;
      vertical-align: middle;
      font-size: 11px;
      color: #9e9e9e;
    }
    .sku-price {
      font-size: 12px;
      color: #2e2e2e;
    }
    .card-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      .wrapper {
        display: flex;
        align-items: center;
      }
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
  }
</style>
