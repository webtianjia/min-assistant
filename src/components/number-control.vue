<template>
  <div class="number-control">
    <i class="icon icon-reduce " v-show="value>0" @click="handleChangeStep('reduce')"></i>
    <span class="text" v-show="value>0">{{value}}</span>
    <i class="icon icon-plus" @click="handleChangeStep('plus')"></i>
  </div>
</template>

<script>
  function addNum(num1, num2) {
    let sq1, sq2, m;
    try {
      sq1 = num1.toString().split(".")[1].length;
    } catch (e) {
      sq1 = 0;
    }
    try {
      sq2 = num2.toString().split(".")[1].length;
    } catch (e) {
      sq2 = 0;
    }
    m = Math.pow(10, Math.max(sq1, sq2));
    return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
  }

  export default {
    name: "number-control",
    props: {
      value: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 999
      },
      min: {
        type: Number,
        default: 0
      },
      step: {
        type: Number,
        default: 1
      }
    },
    methods: {
      handleChangeStep(type) {
        const { step, max, min } = this;
        let { value } = this;
        if (type === "reduce") {
          value = addNum(value, -step);
        } else if (type === "plus") {
          value = addNum(value, step);
        }
        if (value < min || value > max) return null;
        this.handleEmit(value);
      },
      handleEmit(value) {
        this.$emit("change",value);
      }
    }
  };
</script>

<style scoped lang="less">
  .number-control {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 96px;
    .icon {
      width: 38px;
      height: 38px;
      background: no-repeat center;
      background-size: 19px;
      &.icon-reduce {
        background-image: data-uri("../../static/img/i-reduce.png");
      }
      &.icon-plus {
        background-image: data-uri("../../static/img/i-plus.png");
      }
    }
    .text {
      width: 40px;
      font-size: 12px;
      color: #2e2e2e;
      text-align: center;
    }

  }

</style>
