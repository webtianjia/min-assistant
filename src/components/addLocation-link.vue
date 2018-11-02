<template>
  <div class="add-link" @click="goTo">
    <div class="wrapper">
      <i class="icon icon-address"></i>
      <span class="text">{{title}}</span>
    </div>
    <i class="icon icon-right"></i>
  </div>
</template>

<script>
  export default {
    name: "addLocation-link",
    props: {
      title: {
        type: String,
        default: ""
      },
      path: {
        type: String,
        default: ""
      }
    },
    methods: {
      goTo() {
        this.$router.push({
          path: this.path
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .add-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background: #fff;
    .icon-address {
      width: 19px;
      height: 19px;
      background: data-uri("../../static/img/i-address.png") no-repeat center;
      background-size: cover;
    }
    .icon-right {
      width: 11px;
      height: 12px;
      background: data-uri("../../static/img/right.png") no-repeat center;
      background-size: cover;
    }
    .wrapper {
      display: flex;
      align-items: center;
      .text {
        margin-left: 10px;
        font-size: 15px;
        color: #2e2e2e;
      }
    }
  }
</style>
