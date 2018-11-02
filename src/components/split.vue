<template>
    <div class="split" :style="{height:height+'px',background:color}"></div>
</template>
<script>
  export default {
    name: "split",
    props:{
      height:{
        type:Number,
        default:7
      },
      color:{
        type:String,
        default:'#f2f2f2'
      }
    }
  };
</script>

<style scoped>
  .split{
    width: 100%;
  }
</style>
