<template>
  <div v-html="timeText" class="textHot"></div>
</template>

<script>
  export default {
    name: "timeDown",
    props: {
      endTime: {
        type: [String, Number]
      },
      endText: [String]
    },
    data() {
      return {
        timeText: "",
        flag: false,
        _interval: null
      };
    },
    methods: {
      timeDown() {
        const nowTime = new Date();
        let leftTime = parseInt((this.endTime - nowTime.getTime()) / 1000);
        let d = parseInt(leftTime / (24 * 60 * 60));
        let h = this.formate(parseInt(leftTime / (60 * 60) % 24));
        let m = this.formate(parseInt(leftTime / 60 % 60));
        let s = this.formate(parseInt(leftTime % 60));
        this.timeText = `<span class="hot">${d}</span>天<span class="hot">${h}</span>小时<span class="hot">${m}</span>分钟<span class="hot">${s}</span>秒`;
        if (leftTime <= 0) {
          this.flag = true;
          this.$emit("time-end");
          this.timeText = this.endText;
        }
      },
      formate(time) {
        if (time >= 10) {
          return time;
        } else {
          return `0${time}`;
        }
      },
      start() {
        this._interval = setInterval(() => {
          if (this.flag) {
            this.end();
          } else {
            this.timeDown();
          }
        }, 500);
      },
      end() {
        clearInterval(this._interval);
      }
    }
  };
</script>
<style lang="less" scoped>
  .textHot {
    color: #f26d26;
  }
</style>
