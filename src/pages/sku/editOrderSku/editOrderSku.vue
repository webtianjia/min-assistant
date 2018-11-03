<template>
  <div class="container">
    <form @submit.prevent="formSubmit">
      <div class="form-horizontal">
        <div class="form-group">
          <label class="label">商品名称</label>
          <input name="skuName" :disabled="isUpdate" v-model="sku.goods_name" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品名称">
        </div>
        <div class="form-group">
          <label class="label">商品品牌</label>
          <input name="skuBrand" :disabled="isUpdate" v-model="sku.goods_brand" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品名称">
        </div>
        <div class="form-group">
          <label class="label">规格型号</label>
          <input name="skuPic" :disabled="isUpdate" v-model="sku.goods_standard" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入规格型号，如：500g">
        </div>
        <div class="form-group">
          <label class="label">商品单价</label>
          <input name="price" :disabled="isUpdate" v-model="sku.goods_price" type="digit" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品单价RMB">
        </div>
        <div class="form-group">
          <label class="label">商品数量</label>
          <input name="qty" v-model="sku.goods_number" type="number" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品数量">
        </div>
        <button class="btn" form-type='submit'><span class="text">保存</span></button>
      </div>
    </form>
  </div>
</template>

<script>
  import { initData } from "../../../utils/index";
  import { WxValidate } from "../../../utils/WxValidate";
  import { mapMutations, mapActions } from "vuex";

  let Validate;
  export default {
    name: "editOrderSku",
    data() {
      return {
        sku: {
          goods_name: "",
          goods_brand: "",
          goods_standard: "",
          goods_number: "",
          goods_price: ""
        },
        isUpdate: false
      };
    },
    methods: {
      ...mapMutations("usedSkuList", {
        addOrderSku: "addOrderSku",
        editSku: "editSku"
      }),
      ...mapMutations("orderEdit", {
        orderEditAddSku: "addSku",
        orderEditUpdateSku: "updateSku"
      }),
      ...mapActions("usedSkuList", {
        addSku: "addSku"
      }),
      formSubmit(event) {
        if (!Validate.checkForm(event.mp)) {
          const error = Validate.errorList[0];
          wx.showModal({
            content: `${error.msg}`,
            showCancel: false
          });
        } else {
          if (this.isUpdate) {
            /*修改*/
            if (this.sku.updateOrder) {
              this.orderEditUpdateSku(this.sku)
            } else {
              this.editSku(this.sku);
            }
            this.$router.back();
          } else {
            /*添加*/
            if (this.$mp.query.updateOrder) {
              this.orderEditAddSku(this.sku);
              this.$router.back();
            } else {
              this.addSku(this.sku).then(response => {
                if (response.success) {
                  this.addOrderSku({ sku: response.data, goods_number: this.sku.goods_number });
                  this.$router.back();
                }
              }).catch(error => {
                console.log("添加商品出错", error);
              });
            }
          }
        }
      }
      ,
      initValidate() {
        const rules = {
          skuName: {
            required: true
          },
          skuBrand: {
            required: true
          },
          skuPic: {
            required: true
          },
          qty: {
            required: true,
            number: true
          },
          price: {
            required: true,
            number: true
          }
        };
        const messages = {
          skuName: {
            required: "请输入商品名称"
          },
          skuBrand: {
            required: "请输入商品品牌"
          },
          skuPic: {
            required: "请输入规格型号"
          },
          qty: {
            required: "请输入商品数量",
            number: "请输入正确商品数量"
          },
          price: {
            required: "请输入商品单价"
          }
        };
        Validate = new WxValidate(rules, messages);
      }
    },
    mounted() {
      let param = this.$mp.query.data;
      if (param) {
        this.sku = Object.assign(this.sku, JSON.parse(param));
        this.isUpdate = true;
      } else {
        initData(this.sku);
        this.isUpdate = false;
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
  }
  ;
</script>
