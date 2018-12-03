<template>
  <ul class="nav nav-tabs" :style="{backgroundColor:backgroundColor}">
    <li :class="{active:active===item}" v-for="item in tabs" :key="item.id" @click="change(item)">
      <span class="text">{{item}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "nav-tabs",
    props: {
      backgroundColor: {
        type: String,
        default: "#fff"
      },
      tabs: [Array],
      selected: { type: String }
    },
    data() {
      return {
        active: this.selected
      };
    },
    methods: {
      change(item) {
        if (item === this.active) return;
        this.active = item;
        this.$emit("change", item);
      }
    },
    watch: {
      selected(value) {
        this.active = value;
      }
    }
  };
</script>

<style scoped lang="less">
  .nav-tabs {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    > li {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .text {
        font-size: 14px;
        color: #9e9e9e;
      }
      &:after {
        content: '';
        position: absolute;
        bottom: 5px;
        width: 35px;
        height: 3px;
        left: 50%;
        transform: translateX(-50%) scaleX(0);
        transition: transform .4s;
        border-radius: 3px;
      }
      &.active {
        .text {
          color: #2e2e2e;
        }
        &:after {
          background: #fe6d26;
          transform: translateX(-50%) scaleX(1);
        }
      }
    }
  }
</style>
