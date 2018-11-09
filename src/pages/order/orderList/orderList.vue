<template>
  <div class="container">
    <div class="header-fixed">
      <nav-tabs @change="changeTabs" :tabs="tabs" :selected="navSelected"></nav-tabs>
      <split></split>
    </div>
    <div class="order-list">
      <div v-for="order in orderList" :key="order.id">
        <div class="order-card" @click="goTo('/pages/order/orderDetail/main',order.id)">
          <div class="card-item">
            <div class="order-wrapper">
              <label class="label">包裹号</label>
              <span class="text">{{order.order_no}}</span>
            </div>
            <div class="order-wrapper">
              <!--<i class="icon icon-time"></i>
              <span class="time"><time-down ref="timeDown" @time-end="timeEnd(order)" endText="已过期"
                                            :endTime="order.orderTimeOut"></time-down></span>-->
            </div>
          </div>
          <div class="card-item">
            <div class="order-wrapper">
              <label class="label">识别码</label>
              <span class="text">{{order.identification_code}}</span>
            </div>
          </div>
          <div class="card-item">
            <div class="order-wrapper" style="align-items: normal">
              <label class="label">收件人</label>
              <div class="text">
                <div>
                  <span class="name">{{order.consignee}}</span>
                  <span class="phone">{{order.consignee_phoneStr}}</span>
                  <span class="idCard">{{order.consignee_card_noStr}}</span>
                </div>
                <p class="address">
                  <span>{{order.consignee_province}}</span>
                  <span>{{order.consignee_city}}</span>
                  <span>{{order.consignee_district}}</span>
                  <span>{{order.consignee_address}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="card-item">
            <div class="order-wrapper">
              <label class="label">最新状态</label>
              <span class="text status">{{order.statusStr}}</span>
            </div>
            <div class="order-wrapper">
              <i class="icon icon-edit" v-show="order.status==='create'"
                 @click.stop="goTo('/pages/order/orderEdit/main',order.id)"></i>
              <i class="icon icon-del" v-show="order.status==='create'" @click.stop="deleteConfirm(order.id)"></i>
            </div>
          </div>
        </div>
        <split></split>
      </div>
      <div style="margin-top: 90px" v-if="orderList.length<=0">
        <no-data type="no-sku" text="暂无包裹信息"></no-data>
      </div>
      <div v-if="isNoDataBottom && orderList.length>=3">
        <no-data-bottom></no-data-bottom>
      </div>
    </div>
  </div>
</template>

<script>
  import split from "@/components/split";
  import timeDown from "@/components/timeDown";
  import noData from "@/components/no-data";
  import navTabs from "@/components/nav-tabs";
  import noDataBottom from "@/components/no-data-bottom";

  import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
  import { formatPhone, formatIdCard } from "../../../utils/index";
  import { formatStatus, formatStatusText } from "../utils";

  export default {
    name: "orderList",
    components: {
      split,
      timeDown,
      noData,
      navTabs,
      noDataBottom
    },
    data() {
      return {
        tabs: ["全部", "未收货", "运输中", "已完结"],
        navSelected: ""
      };
    },
    computed: {
      ...mapState("orderList", {
        orderList: state => {
          state.orderList.find(item => {
            item.consignee_phoneStr = formatPhone(item.consignee_phone);
            item.consignee_card_noStr = formatIdCard(item.consignee_card_no);
            item.statusStr = formatStatus(item.status);
          });
          return state.orderList;
        }
      }),
      ...mapGetters("orderList", {
        isNoDataBottom: "isNoDataBottom"
      })
    },
    methods: {
      ...mapMutations("orderList", {
        initParam: "initParam",
        changeStart: "changeStart",
        changeStatus: "changeStatus"
      }),
      ...mapActions("orderList", {
        getOrderList: "getOrderList",
        deleteOrder: "deleteOrder"
      }),
      changeTabs(item) {
        this.initParam();
        this.$mp.query.data=null;
        this.changeStatus(formatStatusText(item));
        this.getOrderList();
      },
      deleteConfirm(id) {
        let that = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除此订单？",
          success(WXresponse) {
            if (WXresponse.confirm) {
              that.deleteOrder(id);
            }
          }
        });
      },
      goTo(url, data) {
        this.$router.push({
          path: url,
          query: {
            data: data
          }
        });
      },
      timeEnd(order) {
        this.orderList.find(item => {
          if (item.id === order.id) item.status = "CLOSE";
        });
      }
    },
    mounted() {
      /*  if (this.$refs.timeDown) {
          this.$refs.timeDown.forEach((item) => {
            item.start();
          });
        }*/
    },
    onShow() {
      this.initParam();
      let param = this.$mp.query.data;
      if (param) {
        this.navSelected = param;
        this.changeStatus(formatStatusText(param));
      }
      this.getOrderList();
    },
    onReachBottom() {
      if (this.isNoDataBottom) {
        return;
      }
      this.changeStart();
      this.getOrderList();
    },
    onUnload() {
      /*    if (this.$refs.timeDown) {
            this.$refs.timeDown.forEach((item) => {
              item.end();
            });
          }*/
      if (this.$options.data) {
        Object.assign(this.$data, this.$options.data());
      }
      this._watchers = [];
      if (this._watcher && this._watcher.teardown) {
        this._watcher.teardown();
      }
    },
    onHide() {
      /*this.$refs.timeDown.forEach((item) => {
        item.end();
      });*/
    }
  };
</script>

<style scoped lang="less">

  .order-list {
    padding-top: 47.5px;
    .order-card {
      padding: 15px;
      background: #fff;
      .card-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 13px;
        font-size: 13px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .order-wrapper {
        display: flex;
        align-items: center;
      }
      .label {
        color: #9e9e9e;
        white-space: nowrap;
        margin-right: 5px;
      }
      .text {
        color: #2e2e2e;
        .address {
          margin-top: 10px;
          color: #666;
        }
        .phone, .idCard {
          margin-left: 20px;
        }
      }

      .status, .time {
        color: #f56356;
      }
      .icon-time {
        margin-right: 3px;
        width: 16px;
        height: 16px;
        background: data-uri("../../../../static/img/i-time.png") no-repeat center;
        background-size: cover;
      }
      .icon-edit, .icon-del {
        width: 38px;
        height: 38px;
        background: no-repeat center;
        background-size: 19px;
      }
      .icon-edit {
        margin-right: 2px;
        background-image: data-uri('../../../../static/img/i-edit.png');
      }
      .icon-del {
        background-position: center right;
        background-image: data-uri('../../../../static/img/i-del.png');
      }
    }
  }
</style>
