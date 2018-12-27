<template>
  <div class="wrapper page-wallet">
    <vHeader title="修改用户名" />
    <div class="mt50">
       
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { XButton } from 'vux';
import vCell from "@/components/v-cell";
import vHeader from "@/components/v-header";
export default {
  data() {
    return {
      walletInfo: [],
      noWallet: false
    };
  },
  components: {
    "v-cell": vCell,
    "x-button": XButton,
    vHeader
  },
  computed: {
    ...mapState(["token"])
  },
  created() {
    // 获取我的钱包数据
    this.getWalletInfo();
  },
  methods: {
    ...mapActions(["atnToken"]),
    // 获取我的钱包数据
    getWalletInfo() {
     
    },
    loginOut(){
      this.$axios
          .get(this.api.loginOut, {
            headers: {"Authorization": this.token }
          })
          .then(res => {
            const resData = res.data;
            if (resData.code !== 1) {
              this.showTip("退出登录失败");
              return;
            }
            this.atnToken('');
            console.log(0);
            let _this = this;
            setTimeout(() => {
              _this.$router.push({path: "/mine/login"});
            }, 1000);
          })
          .catch(res => {
            this.showTip("退出登录失败");
            this.atnToken('');
            let _this = this;
            setTimeout(() => {
              _this.$router.push({path: "/mine/login"});
            }, 1000);
          });
    }
  }
};
</script>

<style lang="stylus">
.loginOutBtn {
  width:90%!important;
  margin: auto;
}
</style>
