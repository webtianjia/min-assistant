<template>
  <i class="badge" v-show="text">{{text}}</i>
</template>

<script>
  export default {
    name: "badge",
    props: {
      value:  Number
    },
    computed: {
      text() {
        return this.value > 99 ? "99+" : this.value;
      }
    }
  };
</script>

<style scoped>
  .badge {
    position: absolute;
    color: #fff;
    min-width: 16px;
    height: 16px;
    padding:  0 2.5px;
    white-space: nowrap;
    vertical-align: middle;
    text-align: center;
    line-height: 17px;
    border-radius: 50%;
    font-size: 10px;
    background: #fe8534;
    right: 20px;
    top: -7px;
  }

</style>
