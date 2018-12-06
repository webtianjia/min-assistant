<template>
  <div class="isNoDataBottom"><span class="text">{{text}}</span></div>
</template>

<script>
  export default {
    name: "no-data-bottom",
    props: {
      text: {
        type: String,
        default: "没有更多数据了..."
      }
    }
  };
</script>

<style scoped lang="less">
  .isNoDataBottom {
    background: #f1f1f1;
    height: 50px;
    display: flex;
    justify-content: center;
    .text {
      margin-top: 10px;
      font-size: 13px;
      color: #9e9e9e;
    }
  }

</style>
