<template>
  <div class="wrapper page-pay">
    <vHeader title="支付订单"/>
    <div class="pay-item nobd vertical-view mt50">
      
      <div class="lay-address white pda15">
        <div class="adress vertical-view">
          <div class="full-screen fs-14 mgb5">应支付金额：<i class="txt-orange fs-18">￥{{ price }}</i></div>
        </div>
      </div>

      <div class="white payMethod mt10">
      <div class="full-screen h40 mgb5 fs-14">支付方式</div>
       <div class="full-screen justify-content-space-between">
        <div class="horizontal-view orderPay">
          <span><img :src="wx" /></span>
          <span>
            <p class="fs-13">微信支付</p>
            <p class="mt5 fs-12 txt-gray">亿万用户的选择，更快更安全</p>
          </span>
        </div>
        <div  @click="select('wxpublicpay')"><i :class="selectVal=='wxpublicpay'?'ico i-cks checked mt10':'ico i-cks mt10'"></i></div>
      </div>
      <div class="mt20 full-screen justify-content-space-between">
        <div class="horizontal-view orderPay">
          <span><img :src="xy" /></span>
          <span>
            <p class="fs-13">剩余可用<i class="txt-orange fs-13" v-text="dotFormat2(walletInfo.currentEnableIntegral)"></i>消费券</p>
            <p class="mt5 fs-12 txt-gray">极速 安全 新体验</p>
          </span>
        </div>
        <div @click="select('xypay')"><i :class="selectVal=='xypay'?'ico i-cks checked mt10':'ico i-cks mt10'"></i></div>
      </div>
     </div>
    </div>
    <div class="lay-action fix-btom pay-act-btom">
      
        <button class="btn-submit nordu full-screen" v-if="selectVal=='wxpublicpay'" @click="payOrder">{{ payName }} <i class="fs-14">￥{{ price }}</i></button>
        <button class="btn-submit nordu full-screen" v-else @click="confirmPwd">{{ payName }} <i class="fs-14">￥{{ price }}</i></button>
      
    </div>

      <confirm v-model="show5"
      show-input
      ref="confirm5"
      title="支付密码"
      placeholder="请输入登录密码"
      @on-confirm="onConfirm5"
      >
      </confirm>

  </div>
</template>

<script> 
import { Confirm, Group} from 'vux';
import { mapState } from "vuex";
import { MessageBox, Toast } from "mint-ui";
import vHeader from "@/components/v-header";
import wx from "@/assets/images/wx@2x.png";
import xy from "@/assets/images/xypay.png";
const qs = require("qs");
export default {
  data() {
    return {
      xy: xy,
      wx: wx,
      show5: false,
      pwd:'',
      walletInfo:'',
      payName: '微信支付',
      selectVal:'wxpublicpay',
      price: this.getUrlParam("payPrice") || "",
      orderNo: this.getUrlParam("orderNumbers") || ""
    };
  },
  components: {
    vHeader,
    Confirm, 
    Group
  },
  computed: {
    ...mapState(["token"])
  },
  beforeCreate() {
    document.title = "确认支付";
  },
  created() {
    this.getWalletInfo();
  },
  methods: {
    onConfirm5 (value) {
      console.log('input value: ' + value);
      this.$axios
        .post(this.api.confirmPwd,JSON.stringify({'password': value }),{
          headers: {
            "content-type": "application/json",
            "Authorization": this.token
          }
        })
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip('密码错误');
            return;
          }
          this.payOrder();
        })
        .catch(res => {
          this.noWallet = true;
          this.showTip("获取我的钱包数据失败");
        });
        
    },
    confirmPwd(){
      this.$refs.confirm5.setInputValue('');
      this.show5=true; 
    },
    select(obj){
      if(obj=='wxpublicpay'){
        this.selectVal='wxpublicpay';
        this.payName='微信支付';
      }else{
        this.selectVal='xypay';
        this.payName='消费券支付';
      }
    },
    // 获取我的钱包数据
    getWalletInfo() {
      this.$axios
        .get(this.api.userWallet, 
        { 
            headers: { "Authorization": this.token } 
        })
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.noWallet = true;
            this.showTip(resData.message);
            return;
          }
          this.walletInfo = resData.content;
          console.log(this.walletInfo)
        })
        .catch(res => {
          this.noWallet = true;
          this.showTip("获取我的钱包数据失败");
        });
    },
    // 计算出订单总价（不包含运费）
    getAllPrice(arrItem) {
      let price = 0;
      if (!arrItem || arrItem.length === 0) {
        return price;
      }
      arrItem.forEach(val => {
        price += val.product.salePrice * val.productCount;
      });
      return price;
    },
    // 取消订单
    cancelOrder() {
      MessageBox({
        title: "取消提示",
        message: "您确定要取消此订单吗？",
        showCancelButton: true
      }).then(action => {
        if (action === "confirm") {
          this.$axios
            .get(this.api.cancelOrder+this.orderNo, {
              headers: { "Authorization": this.token }
            })
            .then(res => {
              const resData = res.data;
              if (resData.code !== 1) {
                this.showTip("取消失败，请稍后重试");
                return;
              }
              this.showTip("取消订单成功");
              setTimeout(() => {
                this.$router.go(-1);
              }, 2000);
            })
            .catch(res => {
              this.showTip("取消失败，请稍后重试");
            });
        }
      });
    },
    // 点击支付按钮拿支付参数
    payOrder() {
      // 调取支付接口，获取订单所需五个字段
      const loading = Toast({
        message: "支付中...",
        iconClass: "loading",
        duration: 30000
      });
      this.$axios
        .post(
          this.api.otoPay,
          JSON.stringify({
           'channel': 2,
           'orderNumber': this.orderNo,
           'payType': this.selectVal
          }),
          {
            headers: {
              "content-type": "application/json",
              "Authorization": this.token
            }
          }
        )
        .then(res => {
          loading.close();
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip(resData.msg);
            setTimeout(()=>{
              this.$router.push({path: "/mine"});
            },2000)
            return;
          }
          // 返回数据成功后，拿到参数唤起微信支付
          if(this.selectVal=='wxpublicpay'){
            this.weiXinPay(resData.content);
          }else{
            this.showTip("支付成功");
            setTimeout(()=>{
              this.$router.push({path: "/store/orders?status=20&choseDex=1"});
            },2000)
          }
        })
        .catch(res => {
          loading.close();
          this.showTip("支付失败，请稍后重试");
        });
    },
    // 唤起微信支付
    weiXinPay(weiXinArg) {
      let vue = this;
      // 支付函数先声明
      function onBridgeReady() {
        WeixinJSBridge.invoke("getBrandWCPayRequest", JSON.parse(weiXinArg), res => {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 支付成功时
            vue.showTip("支付成功", 2000, "ok");
            setTimeout(() => {
              vue.$router.replace({
                path: "/goods/orders",
                query: { status: 1 }
              });
            }, 2000);
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            // 取消支付时
            vue.showTip("您已取消支付");
          } else {
            // 支付失败时
            vue.showTip(res);
          }
        });
      }
      // 判断无误后开始支付
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    }
  }
};
</script>

<style lang="stylus">
@import '../../assets/css/pay-act-btom';
@import '../../assets/css/media';
@import '../../assets/css/pay';
</style>