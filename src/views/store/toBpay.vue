<template>
  <div class="wrapper wxLogin page-bind-new">
    <vHeader title="向商家付款"/>
   
    <div class="center mtb60">
     <span class="img25 h40 inlneblock mr10"><img :src="logo" /></span>
     <span class="fs-14 h40 inlneblock">铭记时尚服装</span>
    </div>

    <div class="white pdlr20">
      <p class="txt-gray1 h40 fs-14 pdt10">总金额</p>
      <p><x-input title="￥" type="number" placeholder="" v-model="password" :min="0" :max="20" @on-change="change"></x-input></p>
    </div>
    <div class="pdlr20"><button class="btn-submit btn-bind flex1 radius5" @click="toBpay">支付</button></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Toast } from "mint-ui";
import { XInput } from 'vux';
import vHeader from "@/components/v-header";
const qs = require("qs");
export default {
  data() {
    return {
      logo: require("../../assets/images/store2.png"),
      bindInfo: {
        phone: "",
        code: "",
        time: 60,
        hasSend: false
      },
      headimgurl:'',//微信头像地址
      nickname:'',//微信昵称
      proUserId:'',//推荐人id
      sex:'',//微信性别
    };
  },
  components: {
   vHeader,
   XInput
  },
  computed: {
     ...mapState(["token", "openId", "userId"])
  },
  beforeCreate() {
    document.title = "向商家付款";
  },
  created() {
    
  },
  destroyed(){
   
  },
  methods: {
    //...mapActions(["atnOpenId","atnToken","atnProUserId"]),
    change (val) {
      console.log('on change', val)
    },
    toBpay() { 
      this.showTip("点击了支付");
    }
  }
};
</script>

<style lang="stylus">
@import '../../assets/css/media';
@import '../../assets/css/bind';
</style>
