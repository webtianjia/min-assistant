<template>
  <div class="search-bar">
    <div class="input-group">
      <i class="icon icon-search"></i>
      <input type="text" class="search-input" v-model="searchInput"
             placeholder-style="color:#fff;" @confirm="confirm" confirm-type="search" placeholder="请输入品名/品牌">
      <i class="icon icon-clear" v-show="searchInput" @click="clear"></i>
    </div>
    <span class="search-btn" @click="confirm">查询</span>
  </div>
</template>

<script>
  export default {
    name: "search-bar",
    data() {
      return {
        searchInput: ""
      };
    },
    methods: {
      clear() {
        this.searchInput = "";
      },
      confirm() {
        this.$emit("change", this.searchInput);
      }
    }
  };
</script>

<style scoped lang="less">
  .search-bar {
    background: #2aa2fa;
    padding: 18px 15px;
    display: flex;
    align-items: center;
    .input-group {
      flex: 0 0 310px;
      width: 310px;
      position: relative;
      .search-input {
        height: 34px;
        line-height: 34px;
        color: #fff;
        background: #1995e0;
        border-radius: 4px;
        font-size: 14px;
        padding: 0 34px;
      }
      .icon {
        width: 34px;
        height: 34px;
        background: no-repeat center;
        background-size: 16px;
        position: absolute;
      }
      .icon-search {
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        z-index: 10;
        background-image: data-uri("../../static/img/search-icon.png");
      }
      .icon-clear {
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background-image: data-uri("../../static/img/search-clear.png");
      }
    }
    .search-btn {
      padding-left: 8px;
      display: block;
      color: #fff;
      height: 34px;
      line-height: 34px;
      font-size: 12px;
    }
  }
</style>
