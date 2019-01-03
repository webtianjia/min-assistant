<template>
  <div class="container" v-if="orderDetail" :class="{'disabled-scroll':ruleModal}">
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
    <div class="line" v-if="orderDetail.logistics_main && orderDetail.waybill_no"></div>
    <div class="logistics" v-if="orderDetail.logistics_main && orderDetail.waybill_no">
      <span class="title">{{orderDetail.logistics_main}}</span>
      <span class="text">{{orderDetail.waybill_no}}</span>
      <button class="button" @click="getOrderRoute">查看物流</button>
    </div>
    <vDialog v-model="ruleModal" @show="ruleModalConfirm" :vList="message"></vDialog>
    <split></split>
    <div class="package-card">
      <div class="card-item">
        <div>
          <label class="label">包裹号</label>
          <span class="text">{{orderDetail.order_no}}</span>
        </div>
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
      <div class="card-item" v-if="orderDetail.package_number">
        <div class="time-wrapper">
          <label class="label">小面单号</label>
          <span class="text">{{orderDetail.package_number}}</span>
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
      <div v-for="sku in orderDetail.goodsList" :key="sku.id">
        <sku-card :sku="sku" :controller="false"></sku-card>
      </div>
      <!--    <div class="sku-card" v-for="item in orderDetail.goodsList" :key="item.id">
            <div class="title text-overflow">
              {{item.goods_name}}
              {{item.goods_brand}}
              {{item.goods_standard}}
            </div>
            <div class="sku-wrapper">
              <div style="display: flex;align-items: center">
                <span class="sku-spc text-overflow"> {{item.goods_standard}}</span>
                <span class="sku-price"> ￥{{item.goods_price}}</span>
              </div>
              <div class="sku-qty">x{{item.goods_number}}</div>
            </div>
          </div>-->
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
      </div>
    </div>
    <canvas style="width: 100%; height: 336px;position: fixed;bottom: 200vh;right:200vh;background: #fff"
            canvas-id="drawingCanvas"></canvas>
  </div>
</template>

<script>
  import split from "@/components/split";
  import { formatIdCard, formatPhone } from "@/utils/index";
  import skuCard from "@/components/skuCard";
  import vDialog from "@/components/dialog";
  import { showTotal } from "../../../utils/index";
  import { formatStatus } from "../utils";
  import { mapActions, mapState } from "vuex";

  export default {
    name: "orderDetail",
    data() {
      return {
        active: false,
        imageUrl: null,
        ruleModal: false,
        message: null
      };
    },
    components: {
      split,
      skuCard,
      vDialog
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
      ruleModalConfirm(value) {
        this.ruleModal = value;
      },
      getOrderRoute() {
        let that = this;
        wx.showLoading({
          title: "正在查询....",
          mask: true
        });
        let url = "https://m.kuaidi100.com/query?type=" + getLogisticsCode(this.orderDetail.logistics_main) + "&postid=" + this.orderDetail.waybill_no + "&id=1&valicode=&temp=" + Math.random();
        wx.request({
          url: url,
          success(res) {
            wx.hideLoading();
            if (res.data.status == "200") {
              that.message = res.data.data;
              that.ruleModalConfirm(true);
            } else {
              showTotal({
                title: res.data.message,
                icon: "none",
                mask: true,
                duration: 3000
              });
            }
          }
        });
      },
      toggleClass() {
        this.active = !this.active;
      },
      drawing(canvas, orderDetail) {
        if (!orderDetail) return;
        const context = wx.createCanvasContext(canvas);
        const windowWidth = wx.getSystemInfoSync().windowWidth;
        /*
        * 订单
        * */
        context.setFillStyle("#fff");
        context.fillRect(0, 0, windowWidth, 336);
        context.globalCompositeOperation = "source-over";

        context.setFillStyle("#29bbeb");
        context.fillRect(0, 0, windowWidth, 110);
        context.globalCompositeOperation = "source-over";
        context.setFontSize(14);
        context.setFillStyle("#fff");
        context.setTextAlign("right");
        context.fillText("包裹号", 88, 30, 88);
        context.fillText("下单时间", 88, 60, 88);
        if (orderDetail.logistics_main && orderDetail.waybill_no) {
          context.fillText(orderDetail.logistics_main, 88, 90);
        }
        context.setTextAlign("left");
        context.fillText(orderDetail.order_no, 108, 30);
        context.fillText(orderDetail.create_time, 108, 60);

        if (orderDetail.logistics_main && orderDetail.waybill_no) {
          context.fillText(orderDetail.waybill_no, 108, 90);
        }
        /*
        * 地址
        * */
        context.drawImage("../../../static/img/shareStatic/address-1.png", 20, 140, 22, 22);
        context.setTextAlign("left");
        context.setFillStyle("#2e2e2e");

        context.fillText(`${orderDetail.consignee + "   " + orderDetail.consignee_phoneStr + "    " + orderDetail.consignee_card_noStr}`, 56, 148, windowWidth - 34);
        context.fillText(`${    orderDetail.consignee_province + orderDetail.consignee_city + orderDetail.consignee_district + orderDetail.consignee_address}`, 56, 168, windowWidth - 56 - 22);

        /*
        * split
        * */
        context.setFillStyle("#f0f0f0");
        context.fillRect(20, 189, windowWidth - 40, 12);

        /*
         * 收货点
         * */
        context.setFillStyle("#2e2e2e");
        if (orderDetail.xyReceivingPO) {
          context.fillText(orderDetail.xyReceivingPO.receiving_name, 20, 231, windowWidth - 20);

          context.setFillStyle("#f0f0f0");
          context.fillRect(20, 245, windowWidth - 40, 1);
          context.setFillStyle("#2e2e2e");
          context.drawImage("../../../static/img/shareStatic/address-2.png", 20, 259, 18, 18);
          context.fillText(orderDetail.xyReceivingPO.receiving_address, 50, 273, windowWidth - 20);
        }
        let that = this;
        context.draw(false,
          setTimeout(function() {
            wx.canvasToTempFilePath({
              canvasId: canvas,
              width: windowWidth,
              fileType: "jpg",
              height: 340,
              success(res) {
                that.imageUrl = res.tempFilePath;
              },
              fail: function(res) {

              }
            });
          }, 1000)
        );
      }
    },
    mounted() {
      let param = this.$mp.query.data;
      if (param) {
        this.getOrder(param);
      }
    },
    watch: {
      orderDetail(value) {
        this.drawing("drawingCanvas", value);
      }
    },
    onShareAppMessage() {
      let imageUrl = this.imageUrl;
      let id = this.orderDetail.id;
      let title = this.orderDetail.statusStr;
      if (!imageUrl) return false;
      return {
        title: `订单状态 : ${title}`,
        path: "pages/order/orderDetail/main?data=" + id,
        imageUrl: imageUrl
      };
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

  function getLogisticsCode(str) {
    switch (str) {
      case "圆通":
        return "yuantong";
      case "申通":
        return "shentong";
      case "中通":
        return "zhongtong";
      case "韵达":
        return "yunda";
      case "邮政":
        return "youzhengguonei";
      case "顺丰":
        return "shunfeng";
      default :
        return "";
    }
  }


</script>

<style scoped lang="less">

  .transport-text {
    font-size: 12px;
    color: #666666;
    line-height: 1.5;
  }

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

  .logistics {
    height: 41px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    .title, .text {
      font-size: 12px;
      color: #2e2e2e;
    }
    .title {
      margin-right: 10px;
    }
    .button {
      font-size: 12px;
      color: #2e2e2e;
      margin-left: 10px;
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
