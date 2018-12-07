<template>
  <div class="sku-card-2" v-if="sku">
    <div class="card-item ">
      <div class="wrapper">
        <span class="text-overflow sku-attr w-134 color-444">{{sku.goods_name}}</span>
        <span class="sku-price warning" v-if="sku.goods_price">￥{{sku.goods_price}}</span>
        <span class="sku-price warning" v-else v-show="reduce">待设价</span>
        <div @click="goTo(sku,index)">
          <slot></slot>
        </div>
      </div>
      <div>
        <div v-if="checked" @click="changeChecked" class="checkbox" :class="{active:active}">
          <i class="i-checked-box"></i>
          <span class="label">常用商品</span>
        </div>
      </div>
    </div>
    <div class="card-item">
      <div class="wrapper">
        <span class="sku-attr text-overflow w-134 color-444">{{sku.goods_brand}}</span>
        <span class="sku-attr text-overflow goods_standard">{{sku.goods_standard}}</span>
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
    data() {
      return {
        active: false
      };
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
      },
      checked: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      changeQty(value, e) {
        this.$emit("changeQty", { sku: this.sku, value: value, index: this.index }, e);
      },
      changeChecked() {
        this.active = !this.active;
        this.$emit("changeChecked", { index: this.index, value: this.active });
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
      max-width: 80px;
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
      .wrapper-2 {
        display: flex;
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
  }

  .checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    margin-right: 8px;
    .label {
      font-size: 12px;
      color: #9e9e9e;
    }
    .i-checked-box {
      width: 14px;
      height: 14px;
      background: data-uri("../../static/img/i-checked-2.png") no-repeat center;
      background-size: cover;
      margin-right: 4px;
    }
    &.active {
      .i-checked-box {
        background-image: data-uri("../../static/img/i-checked-2-active.png");
      }
    }
  }
</style>
