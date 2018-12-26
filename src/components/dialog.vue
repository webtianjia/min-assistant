<template>
  <div class="dialog" v-show="value">
    <div class="mask"></div>

    <div class="dialog-content">
      <div class="dialog-body">
       <div v-if="vList && vList.length>0">
         <div v-for="item in vList" class="transport-text">
           <span class="transport-left">{{item.time}}</span>
           <span class="transport-middle">--</span>
           <span class="transport-right">{{item.context}}</span>
         </div>
       </div>
      </div>
      <div class="dialog-fotter">
        <span class="close" @click="show(false)"></span>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "dialog",
        props: {
          value:{
            type : Boolean,
            default : false
          },
          vList:{
            type : Array,
            default : []
          }
        },
        methods: {
          show(value) {
            this.$emit("show",value);
          }
        }
    }
</script>


<style scoped lang="less">
  .dialog {
    position: relative;
    .dialog-content {
      position: fixed;
      box-sizing: border-box;
      padding: 4px;
      width: 85%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      background: #fff;
      z-index: 50002;

      .dialog-body {
        min-height: 200px;
        max-height: 400px;
        overflow:auto;
      }

      .transport-text{
        font-size: 12px;
        color: #666666;
        line-height: 1.5;
        padding: 8px;
        box-sizing: border-box;
        width:100%;
        display:flex;
        .transport-left{
          width:25%;
          vertical-align: middle;
        }
        .transport-middle{
          width:5%;
          vertical-align: middle;
        }
        .transport-right{
          width:70%;
          vertical-align: middle;
        }
      }
    }

      .close {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background: data-uri("../../static/img/i-close1.png") no-repeat center;
        bottom: -60px;
        width: 32px;
        height: 60px;
    }
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 50001;
      background: rgba(0,0,0,.5);
    }
  }
</style>
