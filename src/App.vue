<script>
  import { mapActions } from "vuex";

  export default {
    methods: {
      ...mapActions("login",{
        login:"login"
      })
    },
    created() {
      this.login();
    }

  };
</script>

<style lang="less">
  .container {
    min-height: 100vh;
    background: #fff;
  }

  .line {
    margin: 0 15px;
    height: 1rpx;
    background: #e6e6e6;
  }

  .text-overflow {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .disabled-scroll {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    z-index: 0;
  }

  .header-fixed {
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    position: fixed;
    z-index: 10;
  }

  .form-horizontal {
    padding: 0 15px;
    .form-group {
      display: flex;
      align-items: center;
      padding: 15px 0;
      overflow: hidden;
      background: #fff;
      position: relative;
      &::after {
        content: '';
        height: 1px;
        width: 100%;
        background: #f2f2f2;
        position: absolute;
        bottom: 0;
      }
      .label {
        font-size: 15px;
        color: #2e2e2e;
        min-width: 110px;
      }
      .form-control {
        width: 100%;
        font-size: 15px;
        color: #2e2e2e;
        &[disabled] {
          background: #ddd;
        }
      }
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 32px;
      margin-top: 40px;
      border-radius: 16px;
      background: #fff;
      border: 1px solid #444;
      .text {
        font-size: 12px;
        color: #2e2e2e;
      }
    }
  }
</style>
