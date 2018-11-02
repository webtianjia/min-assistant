<template>
  <div class="no-data" :class="type">
    <span class="text">{{text}}</span>
  </div>
</template>

<script>
  export default {
    name: "no-data",
    props: {
      type: {
        type: String,
        default: "no-sku"
      },
      text:{
        type:String,
        default:""
      }
    }
  };
</script>

<style scoped lang="less">
  .no-data {
    width: 100%;
    height: 78px;
    background: no-repeat center;
    background-size: 147px 78px;
    margin: 0 auto;
    &.no-sku {
      background-image: data-uri("../../static/img/no-data/no-sku.png");
    }
    &.no-addr {
      background-image: data-uri("../../static/img/no-data/no-addr.png");
    }
    &.no-receiving {
      background-image: data-uri("../../static/img/no-data/no-receiving.png");
      .text{
        bottom: -20px;
      }
    }
    position: relative;
    .text{
      position: absolute;
      left: 50%;
      bottom: -12px;
      transform: translateX(-50%);
      font-size: 12px;
      color: #666;

    }
  }
</style>
