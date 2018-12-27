<template>
  <div class="wrapper page-wallet">
    <vHeader title="个人设置"/>
    <div class="mt50">
      <x-button @click.native="loginOut">退出登录</x-button>
    </div>
    <v-nodata v-if="noWallet" bgcolor="grey" text="- 暂无明细数据 -" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import vNodata from "@/components/v-nodata";
import { XButton } from 'vux';
import vHeader from "@/components/v-header";
export default {
  data() {
    return {
      walletInfo: [],
      noWallet: false
    };
  },
  components: {
    "v-nodata": vNodata,
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
@import '../../assets/css/media';
@import '../../assets/css/wallet';
</style>
