<template>
  <div class="container">
    <form @submit.prevent="formSubmit">
      <div class="form-horizontal">
        <div class="form-group">
          <label class="label">姓名</label>
          <input name="senderName" v-model="sender.name" class="form-control" placeholder-style="color:#9e9e9e;"
                 placeholder="请输入寄件人姓名">
        </div>
        <div class="form-group">
          <label class="label">手机电话</label>
          <input name="senderPhone" v-model="sender.phone" class="form-control" placeholder-style="color:#9e9e9e;"
                 placeholder="请输入寄件人电话">
        </div>
        <div class="form-group">
          <label class="label">详细地址</label>
          <input name="senderAddr" v-model="sender.address" class="form-control" placeholder-style="color:#9e9e9e;"
                 placeholder="请输入详细地址，不少于5个汉字">
        </div>
        <div class="card-passport " :class="{'file-passport':!sender.senderPassport}" @click="chooseImage">
          <div class="clear" @click.stop="sender.senderPassport=''" v-show="sender.senderPassport"></div>
          <img @click.stop="handleImagePreview" :style="{width:imgWidth+'rpx',height:imgHeight+'rpx'}"
               class="file-passport-img" :src="sender.senderPassport" @load="imageLoad" v-show="sender.senderPassport">
          <span class="text" v-show="!sender.senderPassport">上传护照</span>
        </div>
        <button class="btn" form-type='submit' :class="{active:hasSubmit}"><span class="text">保存</span></button>
      </div>
    </form>
    <mptoast/>
  </div>
</template>

<script>
  import { initData } from "../../../utils/index";
  import { WxValidate } from "../../../utils/WxValidate";
  import { mapActions } from "vuex";
  import mptoast from "mptoast";
  let Validate;
  export default {
    name: "editSender",
    components:{
      mptoast
    },
    data() {
      return {
        sender: {
          name: "",
          phone: "",
          address: "",
          senderPassport: ""
        },
        imgWidth: "",
        imgHeight: ""
      };
    },
    computed: {
      hasSubmit() {
        return this.sender.name && this.sender.phone && this.sender.address;
      }
    },
    methods: {
      ...mapActions("senderEdit", {
        addSender: "addSender"
      }),
      formSubmit(event) {
        if (this.hasSubmit) {
          if (!Validate.checkForm(event.mp)) {
            const error = Validate.errorList[0];
            this.$mptoast(`${error.msg}`, "error");
          } else {
            this.addSender(this.sender).then(response=>{
              if(response.success){
                this.$router.back();
              }
            }).catch(error=>{
              console.log("修改寄件人出错")
            });
          }
        }
      },
      initValidate() {
        const rules = {
          senderName: {
            required: true,
          },
          senderPhone: {
            required: true,
          },
          senderAddr: {
            required: true,
            minlength: 5
          }
        };
        const messages = {
          senderName: {
            required: "请输入寄件人姓名"
          },
          senderPhone: {
            required: "请输入手机号码",
            tel: "请输入正确的手机号码"
          },
          senderAddr: {
            required: "请输入详细地址",
            minlength: "请输入详细收货地址,不少于5个字符"
          }
        };
        Validate = new WxValidate(rules, messages);
        Validate.addMethod("senderName", (value) => {
          return /^[\u4E00-\u9FA5]{2,4}$/.test(value);
        }, "请输入正确中文名");
      },
      chooseImage() {
        wx.chooseImage({
          sizeType: ["original", "compressed"],  //可选择原图或压缩后的图片
          sourceType: ["album", "camera"], //可选择性开放访问相册、相机
          success: res => {
            let [imagePath] = res.tempFilePaths;
            this.sender.senderPassport = imagePath;
          }
        });
      },
      imageLoad(e) {
        let width = e.mp.detail.width,
          height = e.mp.detail.height,
          ratio = width / height;
        let viewWidth = 500, //设置图片显示宽度
          viewHeight = 500 / ratio;    //计算的高度值
        this.imgWidth = viewWidth;
        this.imgHeight = viewHeight;
      },
      handleImagePreview() {
        let that = this;
        wx.previewImage({
          current: 0,  //当前预览的图片
          urls: [that.sender.senderPassport]  //所有要预览的图片
        });
      }
    },
    mounted() {
      let param = this.$mp.query.data;
      if (param) {
        this.sender = Object.assign(this.sender, JSON.parse(param));
      } else {
        initData(this.sender);
      }
      this.initValidate();
    },
    onUnload() {
      if (this.$options.data) {
        Object.assign(this.$data, this.$options.data());
      }
      this._watchers = [];
      if (this._watcher && this._watcher.teardown) {
        this._watcher.teardown();
      }
    }
  };
</script>

<style scoped lang="less">

  .card-passport {
    margin-top: 15px;
    width: 100%;
    height: 200px;
    border: 1px solid #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    &.file-passport {
      background: data-uri('../../../../static/img/file-passort.png') no-repeat center 15px;
      background-size: 120px 140px;

    }
    .file-passport-img {
      max-width: 100%;
      max-height: 100%;
    }
    .text {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      font-size: 12px;
      color: #2e2e2e;
    }
    .clear {
      position: absolute;
      right: 0;
      top: 0;
      width: 38px;
      height: 38px;
      background: data-uri("../../../../static/img/i-close.png") no-repeat center;
      background-size: 19px;
    }
  }

  .btn {
    width: 320px;
    height: 40px;
    margin: 134px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #bbb;
    border-radius: 20px;
    border: none;
    .text {
      color: #fff;
      font-size: 15px;
    }
    &.active {
      background: #2aa2fa;
    }
  }
</style>
