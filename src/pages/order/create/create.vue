<template>
  <div class="container">
    <div class="order-no header-fixed">
      <input-code ref="inputCode" @change="setNumber" placeholder="扫描或输入西游标签跟踪号"></input-code>
    </div>
    <div style="margin-top:54px"></div>
    <split></split>
    <div class="address-card" @click="goTo('/pages/sender/senderList/main?createOrder=true')">
      <div class="card-left">
        <i class="icon icon-sender"></i>
      </div>
      <div class="card-body" v-if="sender">
        <p class="text">
          <span class="name">{{sender.name}}</span>
          <span class="phone">{{sender.phoneStr}}</span>
          <i class="icon icon-passport" v-show="sender.senderPassport"></i>
        </p>
        <p class="text">
          <span class="address">{{sender.address}}</span>
        </p>
      </div>
      <div class="card-body" v-else>
        <span class="noData">暂无默认寄件人信息请添加</span>
      </div>
      <div class="card-right">
        <i class="icon icon-card"></i>
      </div>
    </div>
    <split></split>
    <div class="address-card" @click="goTo('/pages/consignee/consigneeList/main?createOrder=true')">
      <div class="card-left">
        <i class="icon icon-addressee"></i>
      </div>
      <div class="card-body" v-if="consignee">
        <p class="text">
          <span class="name">{{consignee.name}}</span>
          <span class="phone">{{consignee.phoneStr}}</span>
          <span class="idCard">{{consignee.card_noStr}}</span>
          <i class="icon icon-idCard"></i>
        </p>
        <p class="text">
          <span class="address">
            <span>{{consignee.province}}</span>
            <span>{{consignee.city}}</span>
            <span>{{consignee.area}}</span>
            <span>{{consignee.address}}</span>
          </span>
        </p>
      </div>
      <div class="card-body" v-else>
        <span class="noData">请输入收件人详细地址</span>
      </div>
      <div class="card-right">
        <i class="icon icon-card"></i>
      </div>
    </div>
    <split></split>
    <div class="sku-card">
      <div class="card-header">
        <div class="title">商品信息</div>
        <div class="select-sku" @click="goTo('/pages/usedSkuList/main')"><span>添加商品</span>
        </div>
      </div>
      <div class="sku-list">
        <div class="sku-item" v-for="sku in cardSkuList" :key="sku.id">
          <div class="sku-name text-overflow">{{sku.goods_name}}{{sku.goods_brand}}</div>
          <div class="sku-spc text-overflow">{{sku.goods_standard}}</div>
          <div class="sku-price text-overflow">￥{{sku.goods_price}}</div>
          <div class="sku-qty text-overflow">{{sku.goods_number}}</div>
          <div class="sku-controller">
            <i class="icon icon-edit" @click="editSku(sku)"></i>
            <i class="icon icon-del" @click="deleteConfirm(sku.id)"></i>
          </div>
        </div>
        <no-data v-if="cardSkuList.length<=0" type="no-sku" text="暂无寄件商品，请添加"></no-data>
      </div>
    </div>
    <div class="submit-btn" :class="{active:hasSubmit}" @click="submitOrder"><span
      class="text">下单</span></div>
    <mptoast/>
  </div>
</template>

<script>
  import split from "@/components/split";
  import inputCode from "@/components/input-code";
  import noData from "@/components/no-data";

  import mptoast from "mptoast";
  import { formatPhone, formatIdCard } from "../../../utils/index";
  import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
  import { getOrderSkuList } from "../../../utils/orderUtil";

  export default {
    name: "create",
    components: {
      split,
      inputCode,
      noData,
      mptoast
    },
    data() {
      return {
        cardSkuList: getOrderSkuList(),
        package_number: null
      };
    },
    computed: {
      ...mapState("orderCreate", {
        consignee: state => {
          if (state.consignee) {
            state.consignee.phoneStr = formatPhone(state.consignee.phone);
            state.consignee.card_noStr = formatIdCard(state.consignee.card_no);
          }
          return state.consignee;
        },
        sender: state => {
          if (state.sender) {
            state.sender.phoneStr = formatPhone(state.sender.phone);
          }
          return state.sender;
        },
        step: "step"
      }),
      hasSubmit() {
        return this.consignee && this.sender && this.cardSkuList.length > 0;
      }
    },
    methods: {
      ...mapActions("orderCreate", {
        addOrder: "addOrder",
        getDefault: "getDefault"
      }),
      ...mapMutations("orderCreate", {
        initOrderData: "initOrderData",
        deleteSku: "deleteSku"
      }),
      submitOrder() {
        if (this.hasSubmit) {
          this.addOrder({
            order: JSON.stringify({
              package_number: this.package_number,
              sender: this.sender.name,
              sender_phone: this.sender.phone,
              sender_address: this.sender.address,

              status: "create",

              consignee: this.consignee.name,
              consignee_phone: this.consignee.phone,
              consignee_card_no: this.consignee.card_no,
              consignee_province: this.consignee.province,
              consignee_city: this.consignee.city,
              consignee_district: this.consignee.area,
              consignee_address: this.consignee.address
            }),
            goods: JSON.stringify(this.cardSkuList)
          }).then(response => {
            if (response.success) {
              this.$refs.inputCode.clear();
              this.initOrderData();
              this.$router.push({
                path: "/pages/order/orderSuccess/main",
                reLaunch: true,
                query: {
                  data: JSON.stringify(response.data)
                }
              });
            }else {
              this.$mptoast(`${response.msg}`,"error")
            }
          }).catch(error => {
            console.log("创建订单出错", error);
          });
        }
      },
      goTo(url, data) {
        this.$router.push({
          path: url,
          query: {
            data: JSON.stringify(data)
          }
        });
      },
      setNumber(value) {
        this.package_number = value;
      },
      editSku(sku) {
        this.$router.push({
          path: "/pages/sku/editOrderSku/main",
          query: {
            data: JSON.stringify(sku)
          }
        });
      },
      deleteConfirm(id) {
        let that = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除该商品？",
          success(WXresponse) {
            if (WXresponse.confirm) {
              that.deleteSku(id);
            }
          }
        });
      }
    },
    watch: {
      step(value) {
        console.log(value)
        this.cardSkuList = getOrderSkuList();
      }
    },
    mounted() {
      this.initOrderData();
      this.getDefault();
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
  .order-no {
    padding: 10px 15px;
    box-sizing: border-box;
    background: #fff;
  }

  .address-card {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #fff;
    min-height: 90px;
    box-sizing: border-box;
    .card-left {
      .icon {
        width: 24px;
        height: 24px;
        background: no-repeat center;
        background-size: cover;
        &.icon-sender {
          background-image: data-uri("../../../../static/img/i-sender.png");
        }
        &.icon-addressee {
          background-image: data-uri("../../../../static/img/i-addressee.png");
        }
      }
    }
    .card-body {
      padding: 0 10px;
      width: 100%;
      display: flex;
      justify-content: center;
      flex-flow: column;
      .text {
        display: flex;
        align-items: center;
        text-align: justify;
      }
      .noData {
        font-size: 14px;
        color: #9e9e9e;
      }
      .name, .phone, .idCard {
        font-size: 14px;
        color: #2e2e2e;
      }
      .phone {
        margin-left: 10px;
      }
      .idCard {
        margin-left: 20px;
      }
      .address {
        font-size: 14px;
        color: #666;
      }
      .icon-idCard {
        width: 19px;
        height: 19px;
        margin-left: 10px;
        background: data-uri("../../../../static/img/icon-idCard.png") no-repeat center;
        background-size: cover;
      }
      .icon-passport {
        width: 19px;
        height: 19px;
        margin-left: 10px;
        background: data-uri("../../../../static/img/icon-passport.png") no-repeat center;
        background-size: cover;
      }
    }
    .card-right {
      height: 30px;
      width: 60px;
      border-left: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        width: 16px;
        height: 16px;
        background: data-uri("../../../../static/img/i-card.png") no-repeat center;
        background-size: cover;
      }
    }
  }

  .sku-card {
    padding: 15px;
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 15px;
        color: #2e2e2e;
      }
      .select-sku {
        width: 60px;
        height: 21px;
        border-radius: 4px;
        border: 1px solid #2eaaf5;
        color: #2eaaf5;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .sku-list {
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-top: 20px;
      min-height: 145px;
      .sku-item {
        display: flex;
        align-items: center;
        padding: 15px 0;
        font-size: 12px;
        position: relative;
        &:after {

          content: '';
          width: 100%;
          height: 1px;
          background: #e6e6e6;
          position: absolute;
          bottom: 0;
        }
        .sku-name {
          width: 84px;
          margin-right: 15px;

        }
        .sku-spc {
          width: 60px;
          margin-right: 15px;
        }
        .sku-price {
          width: 58px;
          margin-right: 15px;
        }
        .sku-qty {
          text-align: center;
          width: 23px;
          margin-right: 15px;
          box-sizing: border-box;
        }
        .sku-controller {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .icon {
            width: 19px;
            height: 19px;
            background: no-repeat center;
            background-size: cover;
            &.icon-edit {
              margin-right: 19px;
              background-image: url("../../../../static/img/i-edit.png");
            }
            &.icon-del {
              background-image: url("../../../../static/img/i-del.png");
            }
          }
        }
      }
    }
  }

  .container {
    display: flex;
    flex-flow: column;
  }

  .submit-btn {
    width: 320px;
    height: 40px;
    margin: 0 auto 40px;
    background: #bbb;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    &.active {
      background: #2aa2fa;
    }
    .text {
      font-size: 15px;
    }
  }
</style>
