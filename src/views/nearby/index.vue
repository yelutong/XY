<template>
  <div class="wrapper nearby">
    <vHeader title="店铺"/>
    <p class="white mb10 mt50">211</p>
    <p @click="toastAddress">地址</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    <p>211</p>
    
    
    <div class="picker-new">
        <div :class="show ?'picker-mask show':'picker-mask'" @click="closePickerBox"></div>
         <div :class="show ?'picker-panel show':'picker-panel'">
          <div class="h45 vux-1px-b relative titleEx">兑换积分<i class="txt-gray" @click="closePickerBox">×</i></div>
          <div class="groupEx mb10 justify-content-space-between pda15">

          <a href="https://apis.map.qq.com/uri/v1/marker?marker=coord:39.892326,116.342763;title:超好吃冰激凌;addr:手帕口桥北铁路道口&referer=myapp">腾讯地图</a><br><br>
         <a href="http://api.map.baidu.com/marker?location=40.047669,116.313082&title=百叶路1号&content=百度奎科大厦&coord_type=bd09ll
&output=html&src=webapp.baidu.openAPIdemo">百度地图</a><br><br>
          <a href="https://uri.amap.com/marker?position=116.473195,39.993253&name=百叶路1号&coordinate=gaode&callnative=1&src=webapp.amap.openAPIdemo">高德地图</a>
           
          </div>
        </div>
      </div> 

    <v-footer active="nearby" />
  </div>
</template>

<script>
// 购物车
import { mapState } from "vuex";
import { Toast } from "mint-ui";
import { XSwitch, Group, Cell } from 'vux';
import vNodata from "@/components/v-nodata";
import vHeader from "@/components/v-header";
import vFooter from "@/components/v-footer";
const qs = require("qs");
export default {
  data() {
    return {
      show: false,
      
    };
  },
  components: { 
    vHeader,
    "v-footer": vFooter
  },
  computed: {
    ...mapState(["token", "autoAddress", "choseAddress"]),
  },
  beforeCreate(){
    document.title = '店铺';
  },
  created() {
   
  },
  methods: {
    closePickerBox(){
      this.show = false;
    },
    toastAddress(){
      this.show = true;
    },
    exchangeData(){
      let orderPrice = {
        'goodsCarts': this.goodsCarts,
        'goodsChannel':  2,
        'isUseIntegral': 1,
        'userCouponIds': this.userCouponIds
      }
      this.$axios
        .post(this.api.orderPriceNew,
        JSON.stringify(orderPrice),
        {
          headers: {"Authorization": this.token , "content-type": "application/json"}
        })
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip("未获取到价格信息");
            return;
          }else{
              if(resData.content.exchange){
                this.exchangeObj = resData.content;
              }
          }
        })
        .catch(res => {
         // this.showTip("未获取到商品信息");
        });
    },
    getCartList(){
      let resData = [];
      if(this.$route.params.selectArr){
        resData = this.$route.params.selectArr;
        sessionStorage.setItem("selectArr",JSON.stringify(this.$route.params.selectArr));
      }else{
        resData = JSON.parse(sessionStorage.getItem("selectArr"));
      }
        // 成功后赋值商品对象，并存进数组
        if(resData && resData.length>0){
          this.isShowList = true;
          this.goodsBuyInfo=resData;
          for (let i of resData){
            this.goodsCarts.push({'id':i.id});
          }
        }else{
          this.isShowList = false;
        }
         
    },
    // 取用户默认地址
    getAutoAddress() {
      this.$axios
        .get(this.api.getDefAddrData, { headers: { "Authorization": this.token } })
        .then(res => {
          const resData = res.data;
          if (resData.content && resData.content.id) {
            this.showAddress = resData.content;
            this.areaId = this.showAddress.areaId;
            this.userAddressId = this.showAddress.id;
          }
        });
    },
    guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    },
    // 结算下单
    makeOrder() {
      // 组合下单数据
      const arrItems = [];
      const goodsBuyInfo = this.goodsBuyInfo;
      const showAddress = this.showAddress;
      if (goodsBuyInfo.length === 0) {
        this.showTip("未获取到商品信息");
        return;
      }
      if (!showAddress) {
        this.showTip("请选择收货地址");
        return;
      }
      
      const orderArrData ={
        'areaId': this.areaId,
        'channel': 2,
        'goodsCarts': this.goodsCarts,
        'isUseIntegral': this.isUseIntegral,
        'remark': this.goodsTips,
        'userAddressId': this.userAddressId,
        'userCouponIds': this.userCouponIds,
        'uuid': this.guid()
      }
      this.$axios
        .post(
          this.api.getOrderForm,
          JSON.stringify(orderArrData),
          {
            headers: {"Authorization": this.token , "content-type": "application/json"}
          }
        )
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip(resData.msg);
            return;
          }
          const orderNumbers = resData.content;
          // 下单成功后跳转支付页
          this.$router.push({
            path: "/goods/pay",
            query: {
              "orderNumbers": orderNumbers,
              'payPrice': this.payPrice
            }
          });
        })
        .catch(res => {
          this.showTip("下单失败，请您稍后重试");
        });
    }
  }
};
</script>

<style lang="stylus">
@import '../../assets/css/nearby';
</style>
