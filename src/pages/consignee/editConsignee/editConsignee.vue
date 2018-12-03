<template>
  <div class="container">
    <form @submit.prevent="formSubmit">
      <div class="form-horizontal">
        <div class="form-group">
          <label class="label">姓名</label>
          <input name="consigneeName" v-model="consignee.name" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入收件人姓名">
        </div>
        <div class="form-group">
          <label class="label">手机号码</label>
          <input name="consigneePhone" v-model="consignee.phone" type="number" class="form-control"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入11位大陆手机号码">
        </div>
        <div class="form-group">
          <label class="label">选择地区</label>
          <div @click="showPicker" class="form-control">
            <span style="color:#9e9e9e" v-show="consignee.province===''">请选择所到省市区</span>
            <span>{{consignee.province}}{{consignee.city}}{{consignee.area}}</span>
          </div>
          <input type="text" hidden name="address" v-model="consignee.province">
        </div>
        <div class="form-group">
          <label class="label">详细地址</label>
          <input name="consigneeAddrDetail" class="form-control" v-model="consignee.address"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入详细地址，不少于5个汉字">
        </div>
        <div class="form-group">
          <label class="label">身份证号</label>
          <input name="consigneeIdCard" class="form-control" type="idcard" v-model="consignee.card_no"
                 placeholder-style="color:#9e9e9e;"
                 placeholder="请输入您的身份证号">
        </div>
        <!--        <div class="tip">
                  <span class="text">郑重声明：个人身份证照片仅用于清关使用</span>
                </div>
                <div class="idCard-img">
                  <div class="card" @click="chooseImage('S')" :class="{S:!consignee.S}">
                    <div class="clear" @click.stop="consignee.S=''" v-show="consignee.S"></div>
                    <img @click.stop="handleImagePreview(consignee.S)" mode="aspectFit" class="chooseImage" :src="consignee.S"
                         v-show="consignee.S">
                    <span class="text" v-show="!consignee.S">上传正面照片</span>
                  </div>
                  <div class="card" @click="chooseImage('N')" :class="{N:!consignee.N}">
                    <div class="clear" @click.stop="consignee.N=''" v-show="consignee.N"></div>
                    <img @click.stop="handleImagePreview(consignee.N)" mode="aspectFit" class="chooseImage" :src="consignee.N"
                         v-show="consignee.N">
                    <span class="text" v-show="!consignee.N">上传反面照片</span>
                  </div>
                </div>-->
        <button class="btn" form-type='submit' :class="{active:hasSubmit}"><span class="text">保存</span></button>
        <mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="[0,0,0]" @onChange="onChange"
                           @onConfirm="onConfirm"></mpvue-city-picker>
      </div>
    </form>
  </div>
</template>

<script>
  import { showTotal } from "@/utils/index";
  import { mapActions } from "vuex";

  import mpvueCityPicker from "mpvue-citypicker";
  import { WxValidate } from "@/utils/WxValidate";
  let Validate;

  export default {
    name: "editConsignee",
    data() {
      return {
        consignee: {
          name: "",
          phone: "",
          province: "",
          city: "",
          area: "",
          address: "",
          card_no: "",
          S: "",
          N: ""
        }
      };
    },
    computed: {
      hasSubmit() {
        if (this.consignee.name && this.consignee.phone && this.consignee.province && this.consignee.address && this.consignee.card_no) {
          return true;
        }
        return false;
      }
    },
    components: {
      mpvueCityPicker
    },
    methods: {
      ...mapActions("consigneeEdit", {
        addConsignee: "addConsignee"
      }),
      showPicker() {
        this.$refs.mpvueCityPicker.show();
      },
      onConfirm(res) {
        let [provinces, city, areas] = res.label.split("-");
        this.consignee.province = provinces;
        this.consignee.city = city;
        this.consignee.area = areas;
      },
      formSubmit(event) {
        if (this.hasSubmit) {
          if (!Validate.checkForm(event.mp)) {
            const error = Validate.errorList[0];
            showTotal({
              title:`${error.msg}`
            })
          } else {
            this.addConsignee(this.consignee).then(response => {
              if (response.success) {
                let that=this;
                showTotal({
                  title:`操作成功`,
                  complete(){
                    setTimeout(()=>{
                      that.$router.back();
                    },500)
                  }
                })
              }
            }).catch(error => {
              console.log("修改出错", error);
            });
          }
        }
      },
      initValidate() {
        const rules = {
          consigneeName: {
            required: true,
            consigneeName: true
          },
          consigneePhone: {
            required: true,
            tel: true
          },
          address: {
            required: true
          },
          consigneeAddrDetail: {
            required: true,
            minlength: 5
          },
          consigneeIdCard: {
            required: true,
            idcard: true,
            idCardValidity: true
          }
        };
        const messages = {
          consigneeName: {
            required: "请输入收件人姓名"
          },
          consigneePhone: {
            required: "请输入手机号码",
            tel: "请输入正确的手机号码"
          },
          address: {
            required: "请选择收货地址"
          },
          consigneeAddrDetail: {
            required: "请输入详细地址",
            minlength: "请输入详细收货地址,不少于5个汉字"
          },
          consigneeIdCard: {
            required: "请输入身份证号码",
            idcard: "请输入正确身份证号码",

          }
        };
        Validate = new WxValidate(rules, messages);
        Validate.addMethod("consigneeName", (value) => {
          return /^[\u4E00-\u9FA5]{2,4}$/.test(value);
        }, "请输入正确中文名");
        Validate.addMethod("idCardValidity", (value) => {
          return check(value) === "OK";
        }, "身份证不合法");
      },
    /*  chooseImage(obj) {
        wx.chooseImage({
          sizeType: ["original", "compressed"],  //可选择原图或压缩后的图片
          sourceType: ["album", "camera"], //可选择性开放访问相册、相机
          success: res => {
            let [imagePath] = res.tempFilePaths;
            this.consignee[obj] = imagePath;
          }
        });
      },
      handleImagePreview(path) {
        wx.previewImage({
          current: 0,  //当前预览的图片
          urls: [path]  //所有要预览的图片
        });
      }*/
    },
    mounted() {
      let param = this.$mp.query.data;
      if (param) {
        this.consignee = Object.assign(this.consignee, JSON.parse(param));
      }
      this.initValidate();
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

  function check(ID_ICCID) {
    let Errors = new Array(
      "OK",
      "身份证号码位数不对!",
      "身份证号码出生日期超出范围或含有非法字符!",
      "身份证号码校验错误!",
      "身份证地区非法!"
    );
    let area = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外"
    };
    let  Y, JYM;
    let S, M;
    let ereg;
    let ID_ICCID_array = new Array();
    ID_ICCID_array = ID_ICCID.split("");
    //地区检验
    if (area[parseInt(ID_ICCID.substr(0, 2))] == null) return Errors[4];
    //身份号码位数及格式检验
    switch (ID_ICCID.length) {
      case 15:
        if ((parseInt(ID_ICCID.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(ID_ICCID.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(ID_ICCID.substr(6, 2)) + 1900) % 4 == 0)) {
          ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
        } else {
          ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
        }
        if (ereg.test(ID_ICCID)) {
          return Errors[0];
        } else {
          return Errors[2];
        }
        break;
      case 18:
        //18位身份号码检测
        //出生日期的合法性检查
        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
        if (parseInt(ID_ICCID.substr(6, 4)) % 4 == 0 || (parseInt(ID_ICCID.substr(6, 4)) % 100 == 0 && parseInt(ID_ICCID.substr(6, 4)) % 4 == 0)) {
          ereg = /^[1-9][0-9]{5}((19)|(20))[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
        } else {
          ereg = /^[1-9][0-9]{5}((19)|(20))[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
        }
        if (ereg.test(ID_ICCID)) {//测试出生日期的合法性
          //计算校验位
          S = (parseInt(ID_ICCID_array[0]) + parseInt(ID_ICCID_array[10])) * 7
            + (parseInt(ID_ICCID_array[1]) + parseInt(ID_ICCID_array[11])) * 9
            + (parseInt(ID_ICCID_array[2]) + parseInt(ID_ICCID_array[12])) * 10
            + (parseInt(ID_ICCID_array[3]) + parseInt(ID_ICCID_array[13])) * 5
            + (parseInt(ID_ICCID_array[4]) + parseInt(ID_ICCID_array[14])) * 8
            + (parseInt(ID_ICCID_array[5]) + parseInt(ID_ICCID_array[15])) * 4
            + (parseInt(ID_ICCID_array[6]) + parseInt(ID_ICCID_array[16])) * 2
            + parseInt(ID_ICCID_array[7]) * 1
            + parseInt(ID_ICCID_array[8]) * 6
            + parseInt(ID_ICCID_array[9]) * 3;
          Y = S % 11;
          M = "F";
          JYM = "10X98765432";
          M = JYM.substr(Y, 1);//判断校验位
          if (M == ID_ICCID_array[17]) {
            return Errors[0];//检测ID的校验位
          } else {
            return Errors[3];
          }
        } else {
          return Errors[2];
        }

        break;
      default:
        return Errors[1];
        break;
    }
  }
</script>

<style scoped lang="less">


  .tip {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    height: 34px;
    width: 100%;
    background: #f1f1f1;
    border-radius: 2px;
    .text {
      font-size: 12px;
      color: #9e9e9e;
    }
  }

/*  .idCard-img {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .card {
      flex: 0 0 50%;
      width: 50%;
      height: 80px;
      background: no-repeat center center;
      background-size: 125px 80px;
      position: relative;
      &.S {
        background-image: data-uri("../../../../static/img/idCard-S.png");
      }
      &.N {
        background-image: data-uri("../../../../static/img/idCard-N.png");
      }
      .chooseImage {
        max-width: 100%;
        max-height: 100%;
      }
      .clear {
        position: absolute;
        right: 0;
        top: 0;
        width: 38px;
        height: 38px;
        background: data-uri("../../../../static/img/i-close.png") no-repeat center;
        background-size: 19px;
      }
      .text {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -20px;
        font-size: 12px;
        color: #2e2e2e;
      }
    }
  }*/

  .btn {
    width: 320px;
    height: 40px;
    margin: 60px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #bbb;
    border-radius: 20px;
    border: none;
    .text {
      color: #fff;
      font-size: 15px;
    }
    &.active {
      background: #2aa2fa;
    }
  }
</style>
