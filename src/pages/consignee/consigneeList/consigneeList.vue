<template>
  <div class="container">
    <div class="header-fixed">
      <split></split>
      <add-location-link title="添加收件人" path="/pages/consignee/editConsignee/main"></add-location-link>
      <split></split>
    </div>
    <div class="address-list">
      <div v-for="consignee in consigneeList" :key="consignee.id">
        <div class="address-card" @click="setOrderConsignee(consignee)">
          <div class="card-wrapper">
            <div class="user-wrapper">
              <span class="name">{{consignee.name}}</span>
              <span class="phone">{{consignee.phoneStr}}</span>
              <span class="idCard">{{consignee.card_noStr}}</span>
              <i class="icon icon-idCard"></i>
            </div>
            <div class="controller">
              <i class="icon icon-edit" @click.stop="goTo('/pages/consignee/editConsignee/main',consignee)"></i>
              <i class="icon icon-del" @click.stop="deleteConfirm(consignee.id)"></i>
            </div>
          </div>
          <p class="address">
            <span>{{consignee.province}}</span>
            <span>{{consignee.city}}</span>
            <span>{{consignee.area}}</span>
            <span>{{consignee.address}}</span>
          </p>
        </div>
        <split></split>
      </div>
      <div style="margin-top: 90px" v-if="consigneeList.length<=0">
        <no-data type="no-addr" text="暂无收件人，请添加"></no-data>
      </div>
    </div>
  </div>
</template>

<script>
  import split from "@/components/split";
  import addLocationLink from "@/components/addLocation-link";
  import noData from "@/components/no-data";

  import { mapState, mapActions, mapMutations } from "vuex";
  import { formatIdCard, formatPhone ,showTotal} from "@/utils/index";

  export default {
    name: "addresseeList",
    components: {
      split,
      addLocationLink,
      noData
    },
    computed: {
      ...mapState("consigneeList", {
        consigneeList: state => {
          state.consigneeList.forEach(item => {
            item.card_noStr = formatIdCard(item.card_no);
            item.phoneStr = formatPhone(item.phone);
          });
          return state.consigneeList;
        }
      }),
      ...mapState("orderCreate", {
        orderConsignee: "consignee"
      })
    },
    methods: {
      ...mapActions("consigneeList", {
        getConsigneeList: "getConsigneeList",
        deleteConsignee: "deleteConsignee"
      }),
      ...mapMutations("orderEdit", {
        updateOrderConsignee: "setConsignee"
      }),
      ...mapMutations("orderCreate", {
        setConsignee: "setConsignee",
        clearOrderConsignee: "clearOrderConsignee"
      }),
      deleteConfirm(id) {
        let that = this;
        wx.showModal({
          title: "提示",
          content: "是否确认删除该收件人？",
          success(WXresponse) {
            if (WXresponse.confirm) {
              that.deleteConsignee(id).then(()=>{
                showTotal({
                  title:`删除成功`
                })
              });
              if (that.orderConsignee && id === that.orderConsignee.id) {
                that.clearOrderConsignee();
              }
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
      },
      setOrderConsignee(consignee) {
        if (this.$mp.query.createOrder) {
          this.setConsignee(consignee);
          this.$router.back();
        }
        if (this.$mp.query.updateOrder) {
          this.updateOrderConsignee(consignee);
          this.$router.back();
        }
      }
    },
    onShow() {
      this.getConsigneeList();
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
      .name, .phone, .idCard {
        font-size: 13px;
        color: #444;
      }
      .phone {
        margin-left: 10px;
      }
      .idCard {
        margin-left: 25px;
      }
      .icon-passport {
        width: 19px;
        height: 19px;
        margin-left: 10px;
        background: data-uri("../../../../static/img/icon-passport.png") no-repeat center;
        background-size: cover;
      }
      .icon-idCard {
        width: 19px;
        height: 19px;
        margin-left: 10px;
        background: data-uri("../../../../static/img/icon-idCard.png") no-repeat center;
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
