<template>
  <div class="sku-card-2" v-if="sku">
    <div class="card-item ">
      <div class="wrapper">
        <span class="text-overflow sku-attr w-134 color-444">{{sku.goods_name}}</span>
        <span class="sku-price warning" v-if="sku.goods_price">￥{{sku.goods_price}}</span>
        <span class="sku-price warning" v-else v-show="reduce">待设价</span>
      </div>
      <div @click="goTo(sku,index)">
        <slot></slot>
      </div>
    </div>
    <div class="card-item">
      <div class="wrapper">
        <span class="sku-attr text-overflow w-134 color-444">{{sku.goods_brand}}</span>
        <span class="sku-attr text-overflow">{{sku.goods_standard}}</span>
      </div>
      <div>
        <number-control :reduce="reduce" @change="changeQty" :value="sku.goods_number"></number-control>
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
      },
      reduce: {
        type: Boolean,
        default: true
      },
      index: {
        type: Number,
        default: null
      }
    },
    methods: {
      changeQty(value, e) {
        this.$emit("changeQty", { sku: this.sku, value: value, index: this.index }, e);
      },
      goTo(sku, index) {
        this.$router.push({
          path: "/pages/sku/editOrderSku/main",
          query: {
            data: JSON.stringify(sku),
            index: index,
            shopCart: true
          }
        });
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
    .sku-attr {
      font-size: 11px;
      color: #9e9e9e;
      margin-right: 10px;
    }
    .sku-price {
      font-size: 11px;
      &.warning {
        color: #ff3636;
      }
    }
    .card-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    .w-134{
      width: 134px;
    }
  }
</style>
