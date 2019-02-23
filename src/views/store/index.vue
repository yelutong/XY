<template>
  <div :class="top==0?'nearby active':'nearby'" id="storePage">
    <vHeader :title="storeTitle"/>
    <div class="white mt40 blueBg w100 relative">
      <p class="storeImgBox"><img :src="urlPic+storeData.imgLogo" class="storeImg" /></p>
    </div>
    <div class="white pd10">
      <p class="pdt40 lh-36 vux-1px-b center fs-14 txt-black-real" v-text="storeData.merchantName"></p>
      <p v-text="storeData.merchantAddress" class="addr w100 txt-black"></p>
      <p class="vux-1px-t center pdt5">
        <i class="txt-gray1" v-text="'粉丝'+storeData.fansCount"></i>
        <i class="mg5 txt-gray1" v-text="'销量0'"></i><i class="txt-gray1">评分</i>
        <rater disabled :font-size="10" active-color="#ff4f00" :value="storeData.totalScore"></rater><i class="fs-12 ml5 txt-orange" v-text="dotFormat(storeData.totalScore)"></i>
      </p>
      <p class="txt-gray1 pdt5">公告：暂无</p>

      <p @click="toastAddress">地址</p>
       <div>
         
       </div>
    </div>
    
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

   
  </div>
</template>

<script>
// 购物车
import { mapState } from "vuex";
import { Toast } from "mint-ui";
import { Rater, XSwitch, Group, Cell } from 'vux';
import vNodata from "@/components/v-nodata";
import vHeader from "@/components/v-header";
const qs = require("qs");
export default {
  data() {
    return {
      id: this.getUrlParam("id"),
      urlPic:this.api.urlPic,
      top:0,
      show: false,
      storeTitle:'',
      storeData: ''
    };
  },
  components: { 
    vHeader,
    Rater
  },
  computed: {
    ...mapState(["token", "autoAddress", "choseAddress"]),
  },
  mounted() {//给window添加一个滚动滚动监听事件
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll); 
  },
  beforeCreate(){
    document.title = '店铺';
  },
  created() {
    this.sellerstoreData();
  },
  methods: {
   handleScroll() { //改变元素#searchBar的top值
      let top = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
      if(top==0){
        this.storeTitle = "";
        this.top = 0;
      }else{
        this.storeTitle = this.storeData.merchantName;
        this.top = top;
      }
    },
    closePickerBox(){
      this.show = false;
    },
    toastAddress(){
      this.show = true;
    },
    sellerstoreData(){
      this.$axios.get(this.api.sellerstoreData+this.id)
      .then(res => {
        if(res.data.code === 1){
          let arrData = res.data.content;
          this.storeData = arrData;
        }
      })
      .catch(res => {
       //下单失败，请您稍后重试
      });
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
