<template>
  <div class="container" v-if="orderData">
    <div class="order-success">
      <div class="order-success-img"></div>
      <div class="code-wrapper">
        <label class="label">识别码:</label>
        <span class="text">{{orderData.identification_code}}</span>
      </div>
      <div class="code-img-wrapper">
        <canvas class="barcode" canvas-id="barcode"></canvas>
      </div>
      <div class="package-no">
        包裹号:{{orderData.order_no}}
      </div>
      <a class="btn active mt-25" href="/pages/order/create/main" open-type="switchTab"><span
        class="text">继续寄件</span></a>
      <a class="btn mt-15" href="/pages/user/main" open-type="switchTab"><span class="text">我的包裹</span></a>
    </div>
  </div>
</template>

<script>
  import wxbarcode from "wxbarcode";
  export default {
    name: "orderSuccess",
    data(){
      return {
        orderData:null
      }
    },
    mounted() {
      let param = this.$mp.query.data;
      if(param){
        this.orderData= Object.assign({}, JSON.parse(param));
        wxbarcode.barcode("barcode", this.orderData.identification_code, 600, 150);
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
    },
  };
</script>

<style scoped lang="less">
  .order-success {
    padding: 10px 15px;
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .order-success-img {
    width: 100%;
    height: 200px;
    background: data-uri("../../../../static/img/orderSuccess.png") no-repeat center;
    background-size: cover;
  }

  .code-wrapper {
    margin-top: 5px;
    font-size: 18px;
    .label {
      color: #9e9e9e;
    }
    .text {
      color: #2e2e2e;
    }
  }

  .code-img-wrapper {
    height: 70px;
    margin-top: 35px;
    .barcode {
      width: 300px;
      max-height: 100%;
    }
  }

  .info-text {
    margin-top: 10px;
    font-size: 13px;
    color: #2e2e2e;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .package-no {
    margin-top: 50px;
    font-size: 15px;
    color: #9e9e9e;
  }

  .btn {
    width: 320px;
    height: 40px;
    background: #fff;
    color: #2aa2fa;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    border: 1px solid #2aa2fa;
    &.active {
      background: #2aa2fa;
      .text {
        color: #fff;
      }
    }
    .text {
      font-size: 15px;
    }
  }

  .mt-25 {
    margin-top: 25px;
  }

  .mt-15 {
    margin-top: 15px;
  }
</style>
