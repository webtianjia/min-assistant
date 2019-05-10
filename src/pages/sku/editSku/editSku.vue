<template>
  <div class="container">
    <form @submit.prevent="formSubmit">
      <div class="form-horizontal">
        <div class="form-group">
          <label class="label">商品条码</label>
          <input-code ref="inputCode" bg="#fff" pl="0" ft="30rpx" color="#2e2e2e" @change="setNumber" placeholder="请输入/或扫描商品条码" placeholder-style="color:#9e9e9e;"></input-code>
        </div>
        <div class="form-group">
          <label class="label">商品名称</label>
          <input name="skuName" v-model="sku.goods_name" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品名称">
        </div>
        <div class="form-group">
          <label class="label">商品品牌</label>
          <input name="skuBrand" v-model="sku.goods_brand" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品品牌">
        </div>
        <div class="form-group">
          <label class="label">规格型号</label>
          <input name="skuPic" v-model="sku.goods_standard" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入规格型号，如：500g">
        </div>
        <div class="form-group">
          <label class="label">商品单价</label>
          <input name="price" v-model="sku.goods_price" type="digit" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品单价RMB">
        </div>
        <button class="btn" form-type='submit'><span class="text">保存</span></button>
      </div>
    </form>
  </div>
</template>

<script>
  import { WxValidate } from "@/utils/WxValidate";
  import { mapActions } from "vuex";
  import { showTotal } from "@/utils/index";
  import inputCode from "@/components/input-code";
  let Validate;
  export default {
    name: "createSku",
    components:{
      inputCode
    },
    data() {
      return {
        sku: {
          goods_code:"",
          goods_name: "",
          goods_brand: "",
          goods_standard: "",
          goods_price: ""

        },
        isUpdate: false
      };
    },
    methods: {
      ...mapActions("editSku", {
        addSku: "addSku"
      }),
      setNumber(value) {
        this.sku.goods_code = value;
      },
      formSubmit(event) {
        if (!Validate.checkForm(event.mp)) {
          const error = Validate.errorList[0];
          wx.showModal({
            content: `${error.msg}`,
            showCancel: false
          });
        } else {
          this.addSku(this.sku).then(response => {
            if (response.success) {
              let that = this;
              showTotal({
                title: `操作成功`,
                complete() {
                  setTimeout(() => {
                    that.$router.back();
                  }, 500);
                }
              });
            }
          }).catch(error => {
            console.log("更新商品出错", error);
          });
        }
      },
      initValidate() {
        const rules = {
          skuName: {
            required: true,
            maxlength: 50
          },
          skuBrand: {
            required: true,
            maxlength: 50
          },
          skuPic: {
            required: true,
            maxlength: 50
          },
          price: {
            required: true,
            number: true,
            minNumber: true,
            max: 10000,
            min:0.01
          }
        };
        const messages = {
          skuName: {
            required: "请输入商品名称",
            maxlength: "商品名称最多输入50字符"
          },
          skuBrand: {
            required: "请输入商品品牌",
            maxlength: "商品品牌最多输入50字符"
          },
          skuPic: {
            required: "请输入规格型号",
            maxlength: "规格型号最多输入50字符"
          },
          price: {
            required: "请输入商品单价",
            max:"单价不得超过10000"
          }
        };
        Validate = new WxValidate(rules, messages);
        Validate.addMethod("minNumber", (value, param) => {
          return /^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value);
        }, "小数点后最多为两位");
      }
    },
    mounted() {
      let param = this.$mp.query.data;
      if (param) {
        let goodsObj = JSON.parse(param);
        this.sku = Object.assign(this.sku, goodsObj);
        this.$refs.inputCode.input=goodsObj.goods_code;
        this.isUpdate = true;
      } else {
        this.isUpdate = false;
      }
      this.initValidate();
    },
    onUnload() {
      if (this.$options.data) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.inputCode.clear();
      }
      this._watchers = [];
      if (this._watcher && this._watcher.teardown) {
        this._watcher.teardown();
      }
    }
  };
</script>
