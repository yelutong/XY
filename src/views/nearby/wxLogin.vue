<template>
  <div class="wrapper white page-bind wxLogin">
    <vHeader title="微信登录"/>
   
    <div class="center mtb60">
     <p class="w100"><img :src="logo" class="logoImg" /></p>
     <p class="w100 fs-14 mt5">新银众商</p>
    </div>
    <button class="btn-submit btn-bind flex1 radius50" @click="wxLogin">微信登录</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Toast } from "mint-ui";
import vHeader from "@/components/v-header";
const qs = require("qs");
export default {
  data() {
    return {
      logo: require("../../assets/images/favicon.png"),
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
   vHeader
  },
  computed: {
     ...mapState(["token", "openId", "userId"])
  },
  beforeCreate() {
    document.title = "微信登录";
  },
  created() {
    document.getElementsByTagName('body')[0].style.height = window.innerHeight+'px'; 
    document.body.classList.add("bg-white");
  },
  destroyed(){
    document.body.classList.remove("bg-white");
  },
  methods: {
    ...mapActions(["atnOpenId","atnToken","atnProUserId"]),
    wxLogin() {
      let openId = this.openId||localStorage.getItem('openId');
      let token = this.token||localStorage.getItem('token');
      if(!openId && !token){//授权操作
        let okRedirectUrl = 'http://www.xy268.com/m/#/index';
        let reUrl = encodeURIComponent(okRedirectUrl) + '&response_type=code&scope=snsapi_userinfo&state=xyh5#wechat_redirect';
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf7af59cdfbcb5388&redirect_uri=' + reUrl;
      }
      if(openId && !this.token){//绑定操作
        MessageBox({
          title: "绑定提示",
          message:
            "您还没有绑定手机，无法进行下单和个人操作，建议您先绑定手机~",
          showCancelButton: true
        }).then(action => {
          if (action === "confirm") {
            this.$router.push("/mine/bind");
          }
        });
        return;
      }
    }

  }
};
</script>

<style lang="stylus">
@import '../../assets/css/media';
@import '../../assets/css/bind';
</style>
