import Vue from "vue";
import App from "./App";
import MpvueRouterPatch from 'mpvue-router-patch'
Vue.use(MpvueRouterPatch)

Vue.config.productionTip = false;
App.mpType = "app";
import store from "./store/index";

Vue.prototype.$store = store;

const app = new Vue(App);
app.$mount();

