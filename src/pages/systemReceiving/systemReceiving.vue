<template>
  <div class="container">
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
            <i class="icon icon-desc"></i>
            <span class="text">业务说明：{{systemReceiving.explain_desc}}</span>
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
        systemReceivingList: "systemReceivingList"
      }),
      ...mapGetters("systemReceivingList", {
        isNoDataBottom: "isNoDataBottom"
      })
    },
    methods: {
      ...mapActions("systemReceivingList", {
        getSystemReceivingList: "getSystemReceivingList"
      }),
      ...mapMutations("systemReceivingList", {
        initParam: "initParam",
        changeStart: "changeStart"
      })
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
      this.getSystemReceivingList();
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
        align-items: center;
        .icon {
          width: 16px;
          height: 16px;
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
