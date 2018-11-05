<template>
  <div class="container">
    <div class="header-fixed">
      <split></split>
      <add-location-link title="添加寄件人" path="/pages/sender/editSender/main"></add-location-link>
      <split></split>
    </div>
    <div class="address-list">
      <div v-for="sender in senderList" :key="sender.id">
        <div class="address-card" @click="setOrderSender(sender)">
          <div class="card-wrapper">
            <div class="user-wrapper">
              <span class="name">{{sender.name}}</span>
              <span class="phone">{{sender.senderPhoneStr}}</span>
              <i class="icon icon-passport" v-if="sender.senderPassport"></i>
            </div>
            <div class="controller">
              <i class="icon icon-edit" @click.stop="goTo('/pages/sender/editSender/main',sender)"></i>
              <i class="icon icon-del" @click.stop="deleteConfirm(sender.id)"></i>
            </div>
          </div>
          <p class="address">
            <span>{{sender.address}}</span>
          </p>
          <div class="checked-wrapper" @click.stop="setDefault(sender.id)">
            <i class="icon icon-checked" :class="{active:sender.is_default==='y'}"></i>
            <span class="text">默认地址</span>
          </div>
        </div>
        <split></split>
      </div>
      <div style="margin-top: 90px" v-if="senderList.length<=0">
        <no-data type="no-addr" text="暂无寄件人，请添加"></no-data>
      </div>
    </div>
  </div>
</template>

<script>
  import split from "@/components/split";
  import addLocationLink from "@/components/addLocation-link";
  import noData from "@/components/no-data";

  import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
  import { formatPhone } from "../../../utils/index";

  export default {
    name: "senderList",
    components: {
      split,
      addLocationLink,
      noData
    },
    computed: {
      ...mapState("senderList", {
        senderList: state => {
          state.senderList.find(item => {
            item.senderPhoneStr = formatPhone(item.phone);
          });
          return state.senderList;
        }
      })
    },
    methods: {
      ...mapActions("senderList", {
        getSenderList: "getSenderList",
        deleteSender: "deleteSender",
        setDefault: "setDefault"
      }),
      ...mapMutations("orderEdit", {
        updateOrderSender: "setSender"
      }),
      ...mapMutations("orderCreate", {
        setSender: "setSender"
      }),
      setOrderSender(sender) {
        if (this.$mp.query.createOrder) {
          this.setSender(sender);
          this.$router.back();
        }
        if (this.$mp.query.updateOrder) {
          this.updateOrderSender(sender);
          this.$router.back();
        }
      },
      deleteConfirm(id) {
        let that = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除该寄件人？",
          success(WXresponse) {
            if (WXresponse.confirm) {
              that.deleteSender(id);
            }
          }
        });
      },
      goTo(url, data) {
        this.$router.push({
          path: url,
          query: {
            data: JSON.stringify(data)
          }
        });
      }
    },
    onShow() {
      this.getSenderList();
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
  .address-list {
    padding-top: 58px;
    .address-card {
      padding: 0 15px;
      .name, .phone {
        font-size: 13px;
        color: #444;
      }
      .phone {
        margin-left: 10px;
      }
      .icon-passport {
        width: 19px;
        height: 19px;
        margin-left: 10px;
        background: data-uri("../../../../static/img/icon-passport.png") no-repeat center;
        background-size: cover;
      }
      .card-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        .user-wrapper {
          display: flex;
          align-items: center;
        }
        .icon-edit, .icon-del {
          width: 38px;
          height: 38px;
          background: no-repeat center;
          background-size: 19px 19px;
        }
        .icon-edit {
          margin-right: 10px;
          background-image: data-uri("../../../../static/img/i-edit.png");
        }
        .icon-del {
          background-image: data-uri("../../../../static/img/i-del.png");
        }
        .controller {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .address {
        padding: 15px 0;
        font-size: 13px;
        color: #666;
      }
      .checked-wrapper {
        display: flex;
        align-items: center;
        padding: 12px 0;
        position: relative;
        &:before {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          background: #f2f2f2;
          top: 0;
          left: 0;
        }
        .icon-checked {
          width: 16px;
          height: 16px;
          background: data-uri("../../../../static/img/i-checked.png") no-repeat center;
          background-size: cover;
          &.active {
            background-image: data-uri('../../../../static/img/i-checked-active.png');
          }
        }
        .text {
          margin-left: 10px;
          font-size: 13px;
          color: #9e9e9e;
        }
      }
    }
  }
</style>
