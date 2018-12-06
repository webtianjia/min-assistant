<template>
  <div class="container">
    <form @submit.prevent="formSubmit">
      <div class="form-horizontal">
        <div class="form-group">
          <label class="label">商品名称</label>
          <input name="skuName" v-model="sku.goods_name" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品名称">
        </div>
        <div class="form-group">
          <label class="label">商品品牌</label>
          <input name="skuBrand"  v-model="sku.goods_brand" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入商品品牌">
        </div>
        <div class="form-group">
          <label class="label">规格型号</label>
          <input name="skuPic"  v-model="sku.goods_standard" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入规格型号，如：500g">
        </div>
        <div class="form-group">
          <label class="label">商品单价</label>
          <input name="price" v-model="sku.goods_price" type="digit" class="form-control"
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
  import { initData, showTotal } from "@/utils/index";
  import { WxValidate } from "@/utils/WxValidate";
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
      ...mapMutations("orderCreate", {
        createOrderUpdateSku: "updateSku"
      }),
      ...mapMutations("orderEdit", {
        updateOrderUpdateSku: "updateSku"
      }),
      ...mapMutations("shopCart", {
        shopAddSku: "addSku",
        shopUpdateSku: "updateSku"
      }),
      formSubmit(event) {
        if (!Validate.checkForm(event.mp)) {
          const error = Validate.errorList[0];
          showTotal({
            title: `${error.msg}`
          });
        } else {
          if (this.isUpdate) {
            if (this.$mp.query.createOrder) {
              /*修改创建订单商品*/
              this.createOrderUpdateSku({ sku: this.sku, index: this.$mp.query.index });
            }
            if (this.$mp.query.updateOrder) {
              /*修改已生成订单商品*/
              this.updateOrderUpdateSku({ sku: this.sku, index: this.$mp.query.index });
            }
            if (this.$mp.query.shopCart) {
              /*修改购物车商品*/
              this.shopUpdateSku({ sku: this.sku, index: this.$mp.query.index });
            }
          } else {
            /*手动添加商品*/
            this.shopAddSku(this.sku);
          }
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
      },
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
            number: true,
            min: 1,
            max: 999
          },
          price: {
            required: true,
            number: true,
            minNumber: true
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
            number: "请输入正确商品数量",
            min: "数量最少为1",
            max: "数量最多999"
          },
          price: {
            required: "请输入商品单价"
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
        this.sku = Object.assign(this.sku, JSON.parse(param));
        this.isUpdate = true;
      } else {
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
