<template>
  <div class="container" v-if="orderDetail">
    <split></split>
    <div class="order-card">
      <div class="card-item">
        <label class="label">包裹号</label>
        <span class="text">{{orderDetail.order_no}}</span>
      </div>
      <div class="card-item">
        <label class="label">识别码</label>
        <span class="text">{{orderDetail.identification_code}}</span>
      </div>
    </div>
    <split></split>
    <div class="address-card" @click="goTo('/pages/sender/senderList/main?updateOrder=true')">
      <div class="card-left">
        <i class="icon icon-sender"></i>
      </div>
      <div class="card-body">
        <p class="text">
          <span class="name">{{orderDetail.sender}}</span>
          <span class="phone">{{orderDetail.sender_phoneStr}}</span>
          <i class="icon icon-passport" v-if="orderDetail.passport"></i>
        </p>
        <p class="text">
          <span class="address">{{orderDetail.sender_address}} </span>
        </p>
      </div>
      <div class="card-right">
        <i class="icon icon-card"></i>
      </div>
    </div>
    <split></split>
    <div class="address-card" @click="goTo('/pages/consignee/consigneeList/main?updateOrder=true')">
      <div class="card-left">
        <i class="icon icon-addressee"></i>
      </div>
      <div class="card-body">
        <p class="text">
          <span class="name">{{orderDetail.consignee}}</span>
          <span class="phone">{{orderDetail.consignee_phoneStr}}</span>
          <span class="idCard">{{orderDetail.consignee_card_noStr}}</span>
          <i class="icon icon-idCard" v-if="orderDetail.consignee_card_no"></i>
        </p>
        <p class="text">
          <span class="address">
            {{orderDetail.consignee_province}}
            {{orderDetail.consignee_city}}
            {{orderDetail.consignee_district}}
            {{orderDetail.consignee_address}}
          </span>
        </p>
      </div>
      <div class="card-right">
        <i class="icon icon-card"></i>
      </div>
    </div>
    <split></split>
    <div class="sku-card">
      <div class="card-header">
        <div class="title">商品信息</div>
        <div class="select-sku" @click="goTo('/pages/order/orderEdit/orderEditSku/main')"><span>修改商品</span>
        </div>
      </div>
      <div class="sku-list">
        <div class="sku-item" v-for="sku in orderDetail.goodsList" :key="sku">
          <div class="sku-name text-overflow">{{sku.goods_name}}{{sku.goods_brand}}{{sku.goods_standard}}</div>
          <div class="sku-spc text-overflow">{{sku.goods_standard}}</div>
          <div class="sku-price text-overflow">￥{{sku.goods_price}}</div>
          <div class="sku-qty text-overflow">{{sku.goods_number}}</div>
        </div>
        <no-data v-if="orderDetail&&orderDetail.goodsList<=0" type="no-sku" text="暂无寄件商品，请添加"></no-data>
      </div>
    </div>
    <div class="submit-btn" :class="{active:hasSubmit}" @click="submitOrder"><span class="text">提交</span>
    </div>
  </div>
</template>

<script>
  import split from "@/components/split";
  import noData from "@/components/no-data";

  import { formatPhone, formatIdCard } from "../../../utils/index";
  import { mapState, mapActions, mapMutations } from "vuex";

  import { getOrderSkuList, setOrderSkuList } from "../../../utils/orderUtil";

  export default {
    name: "orderEdit",
    components: {
      split,
      noData
    },
    computed: {
      hasSubmit() {
        if (this.orderDetail) {
          return this.orderDetail.goodsList.length > 0;
        }
      },
      ...mapState("orderEdit", {
        orderDetail: state => {
          if (state.orderDetail) {
            state.orderDetail.consignee_phoneStr = formatPhone(state.orderDetail.consignee_phone);
            state.orderDetail.consignee_card_noStr = formatIdCard(state.orderDetail.consignee_card_no);
            state.orderDetail.sender_phoneStr = formatIdCard(state.orderDetail.sender_phone);
          }
          return state.orderDetail;
        }
      })
    },
    methods: {
      ...mapActions("orderEdit", {
        getOrder: "getOrder",
        updateOrder: "updateOrder"
      }),
      ...mapMutations("orderEdit", {
        deleteSku: "deleteSku",
        updateSku: "updateSku"
      }),
      goTo(url, data) {
        this.$router.push({
          path: url,
          query: {
            data: JSON.stringify(data)
          }
        });
      },
      submitOrder() {
        if (this.hasSubmit) {
          let param = Object.assign({}, this.orderDetail);
          let goodsList = JSON.stringify(param.goodsList);
          delete  param.goodsList;
          this.updateOrder({
            order: JSON.stringify(param),
            goods: goodsList
          }).then(response => {
            if(response.success){
              this.$router.back();
            }
          }).catch(error => {
            console.log("修改订单失败", error);
          });
        }
      }
    },
    mounted() {
      let param = this.$mp.query.data;
      if (param) {
        this.getOrder(param);
      }
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
  .order-card {
    display: flex;
    height: 44px;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    .card-item {
      font-size: 13px;
      display: flex;
      align-items: center;
      .label {
        color: #9e9e9e;
      }
      .text {
        margin-left: 15px;
        color: #2e2e2e;
      }
    }

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
