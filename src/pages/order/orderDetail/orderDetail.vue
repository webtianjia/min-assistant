<template>
  <div class="container" v-if="orderDetail">
    <div class="detail-status">
      <ul class="steps">
        <li class="item" :class="{active:orderDetail.statusStr==='未收货'}">
          <span class="text">未收货</span>
        </li>
        <li class="item" :class="{active:orderDetail.statusStr==='运输中'}">
          <span class="text">运输中</span>
        </li>
        <li class="item" :class="{active:orderDetail.statusStr==='已完结'||orderDetail.statusStr==='已关闭'}">
          <span class="text">已完结</span>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="package-card">
      <div class="card-item">
        <div>
          <label class="label">包裹号</label>
          <span class="text">{{orderDetail.order_no}}</span>
        </div>
        <!--<div class="time-wrapper">
          <i class="icon icon-time"></i>
          <span class="text time">16天12:00</span>
        </div>-->
        <div v-if="orderDetail.suttle">
          <label class="label">重量</label>
          <span class="text">{{orderDetail.suttle}}kg</span>
        </div>
      </div>
      <div class="card-item">
        <div class="time-wrapper">
          <label class="label">识别码</label>
          <span class="text">{{orderDetail.identification_code}}</span>
        </div>
      </div>
    </div>
    <split></split>
    <div class="address-card">
      <div class="card-left">
        <i class="icon icon-address"></i>
      </div>
      <div class="card-body">
        <p>
          <span class="name">{{orderDetail.consignee}}</span>
          <span class="phone">{{orderDetail.consignee_phoneStr}}</span>
          <span class="idCard">{{orderDetail.consignee_card_noStr}}</span>
        </p>
        <p class="address">
          {{orderDetail.consignee_province}}
          {{orderDetail.consignee_city}}
          {{orderDetail.consignee_district}}
          {{orderDetail.consignee_address}}
        </p>
      </div>
    </div>
    <split></split>
    <div class="sku-list">
      <div class="sku-card" v-for="item in orderDetail.goodsList" :key="item.id">
        <div class="title text-overflow">
          {{item.goods_name}}
          {{item.goods_brand}}
          {{item.goods_standard}}
        </div>
        <div class="sku-wrapper">
          <div>
            <span class="sku-spc"> {{item.goods_standard}}</span>
            <span class="sku-price"> ￥{{item.goods_price}}</span>
          </div>
          <div class="sku-qty">x{{item.goods_number}}</div>
        </div>
      </div>
    </div>
    <split></split>
    <div class="system-warehouse" v-if="orderDetail.xyReceivingPO">
      <div class="title" @click="toggleClass">
        <span class="text">显示当前收货点信息</span>
        <i class="icon icon-drop " :class="{'active':active}"></i>
      </div>
      <div class="content" v-if="active">
        <p class="address-name">{{orderDetail.xyReceivingPO.receiving_name}}</p>
        <p class="address">
          <i class=" icon icon-address"></i>
          <span class="text">{{orderDetail.xyReceivingPO.receiving_address}}</span>
        </p>
        <p class="phone">
          <i class="icon icon-phone"></i>
          <span class="text">{{orderDetail.xyReceivingPO.contact_phone}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import split from "@/components/split";
  import { formatIdCard, formatPhone } from "../../../utils/index";
  import { formatStatus } from "../utils";
  import { mapActions, mapState } from "vuex";

  export default {
    name: "orderDetail",
    data() {
      return {
        active: false
      };
    },
    computed: {
      ...mapState("orderDetail", {
        orderDetail: state => {
          if (state.orderDetail) {
            state.orderDetail.consignee_card_noStr = formatIdCard(state.orderDetail.consignee_card_no);
            state.orderDetail.consignee_phoneStr = formatPhone(state.orderDetail.consignee_phone);
            state.orderDetail.statusStr = formatStatus(state.orderDetail.status);
          }
          return state.orderDetail;
        }
      })
    },
    methods: {
      ...mapActions("orderDetail", {
        getOrder: "getOrder"
      }),
      toggleClass() {
        this.active = !this.active;
      }
    },
    mounted() {
      let param = this.$mp.query.data;
      if (param) {
        this.getOrder(param);
      }
    },
    components: {
      split
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
  .detail-status {
    height: 90px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .steps {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      width: 100%;
      margin: 0 55px 30px;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -11px;
        height: 2px;
        width: 100%;
        transform: scaleX(.88);
        transform-origin: center;
        box-sizing: border-box;
        background: #d0d0d0;
      }
      .item {
        color: #9e9e9e;
        .text {
          font-size: 13px;
        }
        position: relative;
        &:after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: data-uri("../../../../static/img/step-icon.png") no-repeat center;
          background-size: cover;
          z-index: 10;
        }
        &.active {
          color: #f56356;
          &:after {
            background-image: data-uri("../../../../static/img/step-icon-active.png");
          }
        }
      }
    }
  }

  .package-card {
    padding: 15px;
    font-size: 12px;
    .label {
      color: #9e9e9e;
      margin-right: 5px;
    }
    .text {
      color: #2e2e2e;
    }
    .time {
      font-size: 13px;
      color: #f53656;
    }
    .card-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .time-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-time {
        margin-right: 3px;
        width: 16px;
        height: 16px;
        background: data-uri("../../../../static/img/i-time.png") no-repeat center;
        background-size: cover;
      }
    }

  }

  .address-card {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    .icon-address {
      width: 19px;
      height: 19px;
      background: data-uri("../../../../static/img/i-address.png") no-repeat center;
      background-size: cover;
    }
    .card-left {
      margin-right: 10px;
    }
    .card-body {
      flex: 1;
      width: 100%;
      .name, .phone, .idCard {
        color: #2e2e2e;
      }
      .phone {
        margin-left: 10px;
      }
      .idCard {
        margin-left: 10px;
      }
      .address {
        margin-top: 10px;
        color: #666;
      }
    }
  }

  .sku-list {
    padding: 0 15px;
    .sku-card {
      padding: 15px 0;
      font-size: 12px;
      .title, .price {
        color: #444;
      }
      .sku-wrapper {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
      }
      .sku-spc, .sku-qty {
        color: #9e9e9e;
        font-size: 11px;
      }
      .sku-price {
        margin-left: 20px;
      }
      position: relative;
      &:last-child {
        &:after {
          display: none;
        }
      }
      &:after {
        content: '';
        width: 100%;
        height: 1px;
        background: #e6e6e6;
        position: absolute;
        bottom: 0;
      }
    }
  }

  .system-warehouse {
    .title {
      height: 44px;
      background: #f8f8f8;
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .text {
        font-size: 12px;
        color: #2e2e2e;
      }
      .icon-drop {
        width: 32px;
        height: 32px;
        background: data-uri("../../../../static/img/right.png") no-repeat center center;
        background-size: 11px 12px;
        transition: all .2s;
        transform: rotate(90deg);
        &.active {
          transform: rotate(-90deg);
        }
      }
    }
    .content {
      display: flex;
      flex-flow: column;
      padding: 0 15px;
      font-size: 13px;
      .address-name {
        color: #fe6d26;
        padding: 15px 0;
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
      }
      .address, .phone {
        margin-top: 8px;
        display: flex;
        align-items: center;
      }
      .icon {
        width: 16px;
        height: 16px;
        background: no-repeat center;
        background-size: cover;
        margin-right: 5px;
      }
      .icon-address {
        background-image: data-uri("../../../../static/img/i-address-xs.png");
      }
      .icon-phone {
        background-image: data-uri("../../../../static/img/i-phone.png");
      }
    }
  }
</style>
