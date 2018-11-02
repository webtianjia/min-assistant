<template>
  <div class="container">
    <form @submit.prevent="formSubmit">
      <div class="form-horizontal">
        <div class="form-group">
          <label class="label">姓名</label>
          <input name="consigneeName" v-model="consignee.name" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入收件人姓名">
        </div>
        <div class="form-group">
          <label class="label">手机电话</label>
          <input name="consigneePhone" v-model="consignee.phone" type="number" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入收件人电话">
        </div>
        <div class="form-group">
          <label class="label">选择地区</label>
          <div @click="showPicker" class="form-control">
            <span style="color:#9e9e9e" v-show="consignee.province===''">请选择所到省市区</span>
            <span>{{consignee.province}}{{consignee.city}}{{consignee.area}}</span>
          </div>
          <input type="text" hidden name="address" v-model="consignee.province">
        </div>
        <div class="form-group">
          <label class="label">详细地址</label>
          <input name="consigneeAddrDetail" class="form-control" v-model="consignee.address"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入详细地址，不少于5个汉字">
        </div>
        <div class="form-group">
          <label class="label">身份证号</label>
          <input name="consigneeIdCard" class="form-control" type="idcard" v-model="consignee.card_no"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入您的身份证号">
        </div>
        <div class="tip">
          <span class="text">郑重声明：个人身份证照片仅用于清关使用</span>
        </div>
        <div class="idCard-img">
          <div class="card" @click="chooseImage('S')" :class="{S:!consignee.S}">
            <div class="clear" @click.stop="consignee.S=''" v-show="consignee.S"></div>
            <img @click.stop="handleImagePreview(consignee.S)" mode="aspectFit" class="chooseImage" :src="consignee.S"
                 v-show="consignee.S">
            <span class="text" v-show="!consignee.S">上传正面照片</span>
          </div>
          <div class="card" @click="chooseImage('N')" :class="{N:!consignee.N}">
            <div class="clear" @click.stop="consignee.N=''" v-show="consignee.N"></div>
            <img @click.stop="handleImagePreview(consignee.N)" mode="aspectFit" class="chooseImage" :src="consignee.N"
                 v-show="consignee.N">
            <span class="text" v-show="!consignee.N">上传反面照片</span>
          </div>
        </div>
        <button class="btn" form-type='submit' :class="{active:hasSubmit}"><span class="text">保存</span></button>
        <mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="[0,0,0]" @onChange="onChange" @onCancel="onCancel"
                           @onConfirm="onConfirm"></mpvue-city-picker>
      </div>
    </form>
    <mptoast/>
  </div>
</template>

<script>
  import { initData } from "../../../utils/index";
  import { mapActions } from "vuex";

  import mpvueCityPicker from "mpvue-citypicker";
  import mptoast from "mptoast";
  import { WxValidate } from "../../../utils/WxValidate";

  let Validate;

  export default {
    name: "editConsignee",
    data() {
      return {
        consignee: {
          name: "",
          phone: "",
          province: "",
          city: "",
          area: "",
          address: "",
          card_no: "",
          S: "",
          N: ""
        }
      };
    },
    computed: {
      hasSubmit() {
        if (this.consignee.name && this.consignee.phone && this.consignee.province && this.consignee.address && this.consignee.card_no) {
          return true;
        }
        return false;
      }
    },
    components: {
      mpvueCityPicker,
      mptoast
    },
    methods: {
      ...mapActions("consigneeEdit", {
        addConsignee: "addConsignee"
      }),
      showPicker() {
        this.$refs.mpvueCityPicker.show();
      },
      onConfirm(res) {
        let [provinces, city, areas] = res.label.split("-");
        this.consignee.province = provinces;
        this.consignee.city = city;
        this.consignee.area = areas;
      },
      formSubmit(event) {
        if (this.hasSubmit) {
          if (!Validate.checkForm(event.mp)) {
            const error = Validate.errorList[0];
            this.$mptoast(`${error.msg}`, "error");
          } else {
            this.addConsignee(this.consignee).then(response => {
              if (response.success) {
                this.$router.back();
              }
            }).catch(error => {
              console.log("修改出错", error);
            });
          }
        }
      },
      initValidate() {
        const rules = {
          consigneeName: {
            required: true,
            consigneeName: true
          },
          consigneePhone: {
            required: true,
            tel: true
          },
          address: {
            required: true
          },
          consigneeAddrDetail: {
            required: true,
            minlength: 5
          },
          consigneeIdCard: {
            required: true,
            idcard: true
          }
        };
        const messages = {
          consigneeName: {
            required: "请输入收件人姓名"
          },
          consigneePhone: {
            required: "请输入手机号码",
            tel: "请输入正确的手机号码"
          },
          address: {
            required: "请选择收货地址"
          },
          consigneeAddrDetail: {
            required: "请输入详细地址",
            minlength: "请输入详细收货地址,不少于5个汉字"
          },
          consigneeIdCard: {
            required: "请输入身份证号码",
            idcard: "请输入正确身份证号码"
          }
        };
        Validate = new WxValidate(rules, messages);
        Validate.addMethod("consigneeName", (value) => {
          return /^[\u4E00-\u9FA5]{2,4}$/.test(value);
        }, "请输入正确中文名");
      },
      chooseImage(obj) {
        wx.chooseImage({
          sizeType: ["original", "compressed"],  //可选择原图或压缩后的图片
          sourceType: ["album", "camera"], //可选择性开放访问相册、相机
          success: res => {
            let [imagePath] = res.tempFilePaths;
            this.consignee[obj] = imagePath;
          }
        });
      },
      handleImagePreview(path) {
        wx.previewImage({
          current: 0,  //当前预览的图片
          urls: [path]  //所有要预览的图片
        });
      }
    },
    mounted() {
      let param = this.$mp.query.data;
      if (param) {
        this.consignee = Object.assign(this.consignee, JSON.parse(param));
      } else {
        initData(this.consignee);
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


  .tip {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    height: 34px;
    width: 100%;
    background: #f1f1f1;
    border-radius: 2px;
    .text {
      font-size: 12px;
      color: #9e9e9e;
    }
  }

  .idCard-img {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .card {
      flex: 0 0 50%;
      width: 50%;
      height: 80px;
      background: no-repeat center center;
      background-size: 125px 80px;
      position: relative;
      &.S {
        background-image: data-uri("../../../../static/img/idCard-S.png");
      }
      &.N {
        background-image: data-uri("../../../../static/img/idCard-N.png");
      }
      .chooseImage {
        max-width: 100%;
        max-height: 100%;
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
      .text {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -20px;
        font-size: 12px;
        color: #2e2e2e;
      }
    }
  }

  .btn {
    width: 320px;
    height: 40px;
    margin: 60px auto;
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
