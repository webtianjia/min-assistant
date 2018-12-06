<template>
  <div class="container">
    <div class=" header-fixed">
      <div class="address-link" @click="goTo('/pages/systemReceiving/main')">
        <div class="wrapper">
          <i class="icon icon-address"></i>
          <span class="text">查看所有收货点</span>
        </div>
        <i class="icon icon-right"></i>
      </div>
      <split></split>
      <div class="order-no">
        <input-code ref="inputCode" @change="setNumber" placeholder="扫描或输入小面单号"></input-code>
      </div>
    </div>
    <div style="padding-top: 96px"></div>
    <div class="line" style="margin: 0"></div>

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
    <div class="line"></div>
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
    <div class="order-sku-card">
      <div class="card-header">
        <div class="title">商品信息</div>
        <div class="select-sku" @click="goTo('/pages/usedSkuList/main')"><span>添加商品</span>
        </div>
      </div>
      <div class="sku-list">
        <div v-for="(sku,index) in orderSkuList" :key="index.id">
          <sku-card :sku="sku" :index="index" @delete="deleteConfirm" @edit="editSku"></sku-card>
        </div>
        <no-data v-if="orderSkuList.length<=0" type="no-sku" text="暂无寄件商品，请添加"></no-data>
      </div>
    </div>
    <div class="submit-btn" :class="{active:hasSubmit}" @click="submitOrder"><span
      class="text">下单</span></div>
    <div style="padding-top: 40px"></div>
  </div>
</template>

<script>
  import split from "@/components/split";
  import inputCode from "@/components/input-code";
  import noData from "@/components/no-data";
  import skuCard from "@/components/skuCard";
  import { formatPhone, formatIdCard, showTotal } from "@/utils/index";
  import { mapState, mapMutations, mapActions } from "vuex";

  export default {
    name: "create",
    components: {
      split,
      inputCode,
      noData,
      skuCard
    },
    data() {
      return {
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
        orderSkuList: "orderSkuList"
      }),
      hasSubmit() {
        return this.consignee && this.sender && this.orderSkuList.length > 0;
      }
    },
    methods: {
      ...mapActions("login", {
        login: "login"
      }),
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
            goods: JSON.stringify(this.orderSkuList)
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
            } else {
              showTotal({
                title: `${response.msg}`
              });
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
      editSku(sku, index) {
        this.$router.push({
          path: "/pages/sku/editOrderSku/main",
          query: {
            data: JSON.stringify(sku),
            index: index,
            createOrder: true
          }
        });
      },
      deleteConfirm({ index }) {
        let that = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除该商品？",
          success(WXresponse) {
            if (WXresponse.confirm) {
              that.deleteSku(index);
            }
          }
        });
      }
    },
    created() {
      let that = this;
      wx.login({
        success(wxResponse) {
          that.login(wxResponse).then(() => {
            that.getDefault();
          });
        }
      });
    },
    mounted() {
      this.initOrderData();
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
  .address-link {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #4ab6f7;
    padding: 0 15px;
    .icon-address {
      width: 19px;
      height: 19px;
      background: data-uri("../../../../static/img/i-address-3.png") no-repeat center;
      background-size: cover;
    }
    .icon-right {
      width: 11px;
      height: 12px;
      background: data-uri("../../../../static/img/i-right-fff.png") no-repeat center;
      background-size: cover;
    }
    .wrapper {
      display: flex;
      align-items: center;
      .text {
        margin-left: 10px;
        font-size: 13px;
        color: #fff;
      }
    }
  }

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

  .order-sku-card {
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
      min-height: 105px;
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
          left: 0;
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

  .submit-btn {
    width: 320px;
    height: 40px;
    margin: 0 auto;
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
