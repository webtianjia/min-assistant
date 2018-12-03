<template>
  <div class="container">
    <div class="content">
      <ul class="nav-tabs">
        <li class="tab-item " :class="{active:!activeTab}" @click="changeTab('')">
          <span class="text">全部 </span>
        </li>
        <li class="tab-item" :class="{active:activeTab===item.receiving_country}" v-for="item in countryList"
            :key="item.id" @click="changeTab(item.receiving_country)">
          <span class="text">{{item.receiving_country}}</span>
        </li>
      </ul>
      <div class="systemReceivingList">
        <div v-for="systemReceiving in systemReceivingList" :key="systemReceiving.id">
          <div class="location-card">
            <div class="location-card-title">
              <span class="text">{{systemReceiving.receiving_name}}</span>
            </div>
            <div class="location-card-body">
              <div class="card-item">
                <i class="icon icon-address-xs"></i>
                <span class="text">{{systemReceiving.receiving_address}}</span>
              </div>
              <div class="card-item">
                <i class="icon icon-phone"></i>
                <span class="text">{{systemReceiving.contact_phone}}</span>
              </div>
              <div class="card-item">
                <i class="icon icon-time"></i>
                <span class="text">营业时间：{{systemReceiving.business_time}}</span>
              </div>
              <div class="card-item">
                <span style=" white-space: nowrap;display: flex;align-items: center"> <i
                  class="icon icon-desc"></i><span>业务说明：</span></span>
                <div class="text">
                  <span v-html="systemReceiving.explain_desc"></span>
                </div>
              </div>
            </div>
          </div>
          <split></split>
        </div>
        <div style="padding-top: 90px" v-if="systemReceivingList.length<=0">
          <no-data type="no-receiving" text="暂无收货点信息"></no-data>
        </div>
        <div v-if="isNoDataBottom && systemReceivingList.length > 3">
          <no-data-bottom></no-data-bottom>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import split from "@/components/split";
  import noData from "@/components/no-data";
  import noDataBottom from "@/components/no-data-bottom";
  import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

  export default {
    name: "systemReceiving",
    components: {
      split,
      noData,
      noDataBottom
    },
    computed: {
      ...mapState("systemReceivingList", {
        systemReceivingList: "systemReceivingList",
        countryList: "countryList"
      }),
      ...mapGetters("systemReceivingList", {
        isNoDataBottom: "isNoDataBottom",
        activeTab: "activeTab"
      })
    },
    methods: {
      ...mapActions("systemReceivingList", {
        getSystemReceivingList: "getSystemReceivingList",
        getCountryList: "getCountryList"
      }),
      ...mapMutations("systemReceivingList", {
        initParam: "initParam",
        changeStart: "changeStart",
        setCountry: "setCountry"
      }),
      changeTab(value) {
        if (value === this.activeTab) return;
        this.initParam();
        this.setCountry(value);

        this.getSystemReceivingList();
      }
    },
    onReachBottom() {
      if (this.isNoDataBottom) {
        return;
      }
      this.changeStart();
      this.getSystemReceivingList();
    },
    onShow() {
      this.initParam();
      this.getCountryList().then(() => {
        this.getSystemReceivingList();
      });
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
  .content {
    display: flex;
    .nav-tabs {
      flex: 0 0 80px;
      width: 80px;
      min-height: 100vh;
      border-right: 1px solid #e6e6e6;
      .tab-item {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f6f6f6;
        border-bottom: 1px solid #e6e6e6;
        width: 100%;
        min-height: 40px;
        position: relative;
        transition: all .5s;
        &:last-child {
          border: none;
        }
        &:after {
          content: '';
          position: absolute;
          right: -1px;
          height: 100%;
          width: 1px;
          transition: all .5s;
          transform: scaleY(0);
        }
        &.active {
          background: #fff;
          &:after {
            background: #0790e3;
            transform: scaleY(1);
          }
          .text {
            color: #2e2e2e;
          }
        }
        .text {
          font-size: 14px;
          color: #888;
        }
      }
    }
  }

  .systemReceivingList {
    min-height: 100vh;
    width: 100%;
  }

  .location-card {
    padding: 0 15px;
    .location-card-title {
      padding: 15px 0;
      .text {
        font-size: 13px;
        color: #fe6d26;
      }
      position: relative;
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 1px;
        background: #e6e6e6;
        width: 100%;
      }
    }
    .location-card-body {
      padding-bottom: 15px;
      font-size: 13px;
      color: #2e2e2e;
      .card-item {
        margin-top: 8px;
        display: flex;
        align-items: flex-start;
        .icon {
          flex: 0 0 16px;
          width: 16px;
          height: 16px;

          white-space: nowrap;
          background: no-repeat center;
          background-size: cover;
          margin-right: 5px;
          &.icon-address-xs {
            background-image: data-uri("../../../static/img/i-address-xs.png");
          }
          &.icon-phone {
            background-image: data-uri("../../../static/img/i-phone.png");
          }
          &.icon-time {
            background-image: data-uri("../../../static/img/i-time-2.png");
          }
          &.icon-desc {
            background-image: data-uri("../../../static/img/i-yewu.png");
          }
        }
      }

    }
  }
</style>
