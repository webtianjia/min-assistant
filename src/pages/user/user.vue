<template>
  <div class="container">
    <div class="user-wrapper">
      <div class="user-avatar">
        <open-data type="userAvatarUrl"></open-data>
      </div>
      <div class='user-name'>
        <open-data type="userNickName"></open-data>
      </div>
    </div>
    <ul class="nav">
      <li class="nav-item" @click="goTo('/pages/order/orderList/main','未收货')">
        <badge :value="createTotal"></badge>
        <i class="icon i-1"></i>
        <span class="text">未收货</span>
      </li>
      <li class="nav-item" @click="goTo('/pages/order/orderList/main','运输中')">
        <badge :value="incomeTotal"></badge>
        <i class="icon i-2"></i>
        <span class="text">运输中</span>
      </li>
      <li class="nav-item" @click="goTo('/pages/order/orderList/main','已完结')">
        <i class="icon i-3"></i>
        <span class="text">已完结</span>
      </li>
      <li class="nav-item" @click="goTo('/pages/order/orderList/main','全部')">
        <i class="icon i-4"></i>
        <span class="text">全部订单</span>
      </li>
    </ul>
    <split></split>
    <ul class="list-group">
      <li class="list-group-item split" @click="goTo('/pages/consignee/consigneeList/main')">
        <span class="text">收件人</span>
        <i class="iconfont icon-right"></i>
      </li>
      <li class="list-group-item split" @click="goTo('/pages/sender/senderList/main')">
        <span class="text">寄件人</span>
        <i class="iconfont icon-right"></i>
      </li>
      <!--<li class="list-group-item" @click="goTo('/pages/systemReceiving/main')">
        <span class="text">收货点</span>
        <i class="iconfont icon-right"></i>
      </li>-->
      <li class="list-group-item" style="margin-top: 25px">
        <span class="text">打包授权码：{{authCode}}</span>
        <span class="copy" @click="setClipboardData(authCode)"><span class="box"><span
          class="text">复制</span></span></span>
      </li>
    </ul>
    <footer class="footer">
      <i class="logo"></i>
      <span class="text">西游科技 | 提供技术支持</span>
    </footer>
  </div>
</template>

<script>
  import badge from "@/components/badge";
  import split from "@/components/split";
  import { showTotal } from "@/utils/index";

  import { mapState, mapActions, mapMutations } from "vuex";

  export default {
    name: "user",
    components: {
      split,
      badge
    },
    computed: {
      ...mapState("user", {
        allTotal: state => state.orderCount.allTotal,
        incomeTotal: state => state.orderCount.incomeTotal,
        closeTotal: state => state.orderCount.closeTotal,
        createTotal: state => state.orderCount.createTotal,
        authCode:"authCode"
      })
    },
    methods: {
      ...mapActions("user", {
        getOrderCount: "getOrderCount"
      }),
      ...mapMutations("user",{
        setAuthCode:"setAuthCode"
      }),
      goTo(url, data) {
        this.$router.push({
          path: url,
          query: {
            data: data
          }
        });
      },
      setClipboardData(value) {
        wx.setClipboardData({
            data: value,
            success() {
              showTotal({
                title: `内容已复制`
              });
            }
          }
        );
      },
    },
    mounted() {
      this.setAuthCode();
    },
    onShow() {
      this.getOrderCount();
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
  .container {
    background: #f1f1f1;
  }

  .footer {
    position: fixed;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      width: 37px;
      height: 18px;
      background: data-uri("../../../static/img/xy-logo.png") no-repeat center;
      background-size: cover;
      margin-right: 3px;
    }
    .text {
      font-size: 10px;
      color: #ccc;
    }
  }

  .user-wrapper {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #2aa2fa;
    .user-avatar {
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 50%;
      border: 1px solid #fff;
    }
    .user-name {
      margin-left: 10px;
      font-size: 15px;
      color: #fff;
    }
  }

  .nav {
    background: #2aa2fa;
    display: flex;
    padding: 18px 15px 24px;
    .nav-item {
      flex: 0 0 25%;
      width: 25%;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      position: relative;
      .text {
        margin-top: 10px;
        font-size: 12px;
        color: #fff;
      }
      .icon {
        width: 36px;
        height: 36px;
        background: no-repeat center;
        background-size: cover;
        &.i-1 {
          background-image: data-uri('../../../static/img/i-1.png');
        }
        &.i-2 {
          background-image: data-uri('../../../static/img/i-2.png');
        }
        &.i-3 {
          background-image: data-uri('../../../static/img/i-3.png');
        }
        &.i-4 {
          background-image: data-uri('../../../static/img/i-4.png');
        }
      }
    }
  }

  .list-group {
    .list-group-item {
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 44px;
      background: #fff;
      .text {
        font-size: 15px;
        color: #2e2e2e;
      }
      .icon-right {
        width: 11px;
        height: 12px;
        background: data-uri("../../../static/img/right.png") no-repeat center;
        background-size: cover;
      }
      &.split {
        position: relative;
        &::after {
          content: '';
          height: 1px;
          width: 100%;
          background: #f1f1f1;
          position: absolute;
          bottom: 0;
          left: 15px;
        }
      }
      position: relative;
      .copy {
        right: 0;
        padding: 0 15px;
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        .box {
          border: 1px solid #999;
          border-radius: 4px;
          width: 34px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          .text {
            font-size: 10px;
          }
        }
      }
    }
  }
</style>
