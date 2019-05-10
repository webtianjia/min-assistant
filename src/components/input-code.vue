<template>
  <div class="input-code">
    <input class="form-control" :style="{background:bg,color:color,paddingLeft:pl,fontSize:ft}" @confirm="confirm" v-model.lazy="input" type="text" :placeholder="placeholder" placeholder-style="color:#888;">
    <div class="input-code-btn" @click="scanCode"></div>
  </div>
</template>

<script>
  export default {
    name: "input-code",
    props: {
      placeholder: {
        type: String,
        default: ""
      },
      scanType:{
       type:String,
       default:"barCode"
      },
      xyLabel:false,
      bg:"#e9e9e9",
      color:"#888",
      pl:"20rpx",
      ft:"30rpx"
    },

    data() {
      return {
        input: ""
      };
    },
    methods: {
      scanCode() {
        let that = this;
        wx.scanCode({
          onlyFromCamera: true,
          scanType:this.scanType,
          success: (response) => {
            if (response) {
              if (this.xyLabel) {
                if (response.scanType === "CODE_128") {
                  that.input = response.result;
                } else {
                  wx.showModal({
                    content: "请扫描或输入正确西游标签跟踪号",
                    showCancel: false
                  });
                }
              } else {
                if (response.scanType !== "QR_CODE" &&
                    response.scanType !=="PDF_417" &&
                  response.scanType !=="DATA_MATRIX" &&
                  response.scanType !=="WX_CODE") {
                  that.input = response.result;
                } else {
                  wx.showModal({
                    content: "请扫描正确的条形码",
                    showCancel: false
                  });
                }
              }
            }
          }
        });

      },
      clear() {
        this.input = "";
      }
    },
    watch: {
      input(value) {
        this.$emit("change", value);
      }
    }
  };
</script>

<style scoped lang="less">
  .input-code {
    width: 100%;
    height: 34px;
    position: relative;
    .form-control {
      width: 100%;
      height: 100%;
      background: #e9e9e9;
      border-radius: 4px;
      color: #888;
      font-size: 13px;
      padding: 0 34px 0 10px;
      box-sizing: border-box;
    }
    .input-code-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 34px;
      height: 100%;
      background: data-uri("../../static/img/i-scan.png") no-repeat center;
      background-size: 24px;
      z-index: 10;
    }
  }
</style>
