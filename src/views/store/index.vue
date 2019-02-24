<template>
  <div :class="top==0?'nearby active':'nearby'" id="storePage">
    <vHeader :title="storeTitle"/>
    <div class="white mt40 blueBg w100 relative">
      <p class="storeImgBox"><img v-if="storeData.imgLogo" :src="urlPic+storeData.imgLogo" class="storeImg" /></p>
    </div>
    <div class="">
      <div class="pd10 white">
        <p class="pdt40 lh-36 vux-1px-b center fs-14 txt-black-real" v-text="storeData.merchantName"></p>
        <p @click="toastAddress" v-text="storeData.merchantAddress" class="addr w100 txt-black"></p>
        <p class="vux-1px-t center pdt10">
          <i class="txt-gray1" v-text="'粉丝'+storeData.fansCount"></i>
          <i class="mg5 txt-gray1" v-text="'销量0'"></i><i class="txt-gray1">评分</i>
          <rater disabled :font-size="10" active-color="#ff4f00" :value="storeData.totalScore"></rater><i class="fs-12 ml5 txt-orange" v-text="dotFormat(storeData.totalScore)"></i>
        </p>
        <p class="salebuy relative txt-gray1 norms21 mgt10 pdb10">
          <b class="fs-14 lh-20">公告：</b>
          <span class="standards1 lh-20" v-if="storeData.o2oConfig && storeData.o2oConfig.noticeContext" v-text="storeData.o2oConfig.noticeContext"></span>
        </p>
      </div>
      <div :class="tabActive?'relative storeTab w100 active':'w100 mgt10 relative storeTab'">
        <tab :line-width=2 active-color='#fc378c' v-model="index">
          <tab-item class="vux-center" :selected="demo2 === item" v-for="(item, index) in list2" @click="demo2 = item" :key="index">{{item}}</tab-item>
        </tab>
      </div>
      <swiper v-model="index" :height="height" :show-dots="false">
        <swiper-item v-for="(item, index) in list2" :key="index">

          <div class="tab-swiper vux-center" v-if="index==0">
              <div class="box2 newListData relative">
                <div class="navLeft">
                  <tab bar-position="top">
                    <tab-item :selected="item.index==0" @on-item-click="onItemClick(item.index)" v-for="item in listData">{{ item.nav }}</tab-item>
                  </tab>
               </div>
                <div class="navRight white pdb20">
                <flexbox class="pd10" orient="vertical" v-if="classDataList"> 
                  <flexbox-item v-for="(goods, index5) in classDataList" :key="index5">
                    <div class="mgt10 justify-content-space-between">
                    <p @click="toDetail(goods.id)" ><img :src="goods.goodsImg?urlPic+goods.goodsImg.split(',')[0]:''"></p>
                    <div class="flexg2 listRight relative">
                      <p class="goodsName txt-black2 fs-14" v-text="goods.goodsName"></p> 
                      <div class="rightBtm justify-content-space-between">
                      <div>
                      <p class="fs-18 mb5 txt-orange bold" v-text="'¥'+goods.salePrice"></p>
                      <p class="txt-gray1 fs-10" v-text="'月销'+goods.currentMonthSaleCount"></p>
                      </div>
                      </div>
                      <inline-x-number class="cartNum" :value="goods.cartNum" :min="0" width="30px" button-style="round"></inline-x-number>
                    </div>
                    </div>
                  </flexbox-item> 
                </flexbox>
                 </div>
                <v-nodata v-if="listData.length==20" bgcolor="grey" text="- 店家暂无商品 -" />
              </div>
          </div>

          <div class="tab-swiper white vux-center pdb10" v-if="index==1">
            <div class="pd10">
               <p class="fs-14 txt-black pdt10 h40">营业执照</p>
               <v-imglist :image-data="imgLicense" size="80" touch="preview" />
               <p class="fs-14 txt-black mgt10 h40">商家照片</p>
               <v-imglist :image-data="imgStore" size="80" touch="preview" />
               <div class="salebuy norms mgt10">
               <b class="fs-14 lh-20 txt-dark">商家名称:</b> 
               <div class="standards1 txt-black lh-20" v-text="storeData.merchantName"></div>
               </div>
               <div class="salebuy norms mgt10">
               <b class="fs-14 lh-20 txt-dark">商家类型:</b> 
               <div class="standards1 txt-black lh-20" v-text="storeData.sellerClassName"></div>
               </div>
               <div class="salebuy norms mgt10">
               <b class="fs-14 lh-20 txt-dark">商家地址:</b> 
               <div class="standards1 txt-black lh-20" v-text="storeData.merchantAddress"></div>
               </div>
               <div class="salebuy norms mgt10">
               <b class="fs-14 lh-20 txt-dark">商家电话:</b> 
               <div class="standards1 txt-black lh-20" v-text="storeData.merchantServicePhone"></div>
               </div>
           </div>
          </div>
          <div class="tab-swiper white vux-center" v-if="index==2">
            <div class="pd10">
              <div class="h45 fs-14 justify-content-space-between">
              <span>评价(0)</span>
              <span><rater disabled :font-size="10" active-color="#ff4f00" :value="storeData.totalScore"></rater><i class="fs-12 ml5 txt-orange" v-text="dotFormat(storeData.totalScore)"></i></span>
              </div>
            </div>

          </div>
        </swiper-item>
      </swiper>

    </div>
    
    <div class="picker-new">
      <div :class="show ?'picker-mask show':'picker-mask'" @click="closePickerBox"></div>
       <div :class="show ?'picker-panel show':'picker-panel'">
        <div class="h45 vux-1px-b relative titleEx">选择地图<i class="txt-gray" @click="closePickerBox">×</i></div>
        <div class="groupEx mb10 pda15 vertical-view">
          <span class="fs-14 h40" @click="goMap('腾讯地图',storeData)">腾讯地图</a></span>
          <span class="fs-14 h40" @click="goMap('百度地图',storeData)">百度地图</a></span>
          <span class="fs-14 h40" @click="goMap('高德地图',storeData)">高德地图</a></span>
        </div>
      </div>
    </div> 
   
  </div>
</template>
        
<script>
// 购物车
import { mapState } from "vuex";
import { Toast } from "mint-ui";
import {  InlineXNumber, Swiper, SwiperItem, Tab, TabItem, Rater, Scroller, Spinner,Flexbox, FlexboxItem
 } from 'vux';
import vNodata from "@/components/v-nodata";
import vHeader from "@/components/v-header";
import vImglist from "@/components/v-imglist";
const qs = require("qs");
const list = () => ['商品', '商铺', '评论'];
export default {
  data() {
    return {
      id: this.getUrlParam("id"),
      urlPic:this.api.urlPic,
      imgLicense:[],
      imgStore:[],
      top:0,
      height:'',
      show: false,
      index: 0,
      tabActive: false,
      storeTitle:'',
      list2: list(),
      demo2: '商品',
      storeData: '',
      listData:[],
      classDataList:[],
      listData2:[]
    }
  },
  components: { 
    vHeader,
    Tab,
    TabItem,
    Swiper, 
    SwiperItem,
    Rater,
    Scroller,
    Spinner,
    Flexbox, 
    FlexboxItem,
    InlineXNumber,
    "v-imglist": vImglist,
    "v-nodata": vNodata
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
    document.title = '店铺详情';
  },
  created() {
    this.sellerstoreData();
    this.getGoodsList();
    this.height = window.screen.height-43+'px';
  },
  methods: {
   goMap(title,item){
      this.$router.push({//核心语句
        path:'/map',//跳转的路径
        query:{//路由传参时push和query搭配使用 ，作用时传递参数
          title:title,
          latitude: item.latitude,
          longitude: item.longitude,
          address: item.merchantAddress,
          merchantName: item.merchantName
        }
      })
   },
   onItemClick (index) {
      console.log('on item click:', index);
      this.classDataList = [];
      this.classDataList = this.listData2[index];
      console.log(this.classDataList);
   },
   getGoodsList () {
     this.$axios.post(this.api.otoStoreList,qs.parse({"storeId":this.id}),{headers: {"content-type": "application/json"}})
      .then(res => {
        //this.listData
         let data = res.data.content;
          for(let i in data){
            this.listData.push({'index':i,'nav':data[i].barcodeClass.name});
            let arr = data[i].barcodeStore;
            for(let item of arr){
              item.cartNum = 0;
            }
            this.listData2.push(arr);
          }
          this.classDataList = this.listData2[0];
          console.log(this.listData);
          console.log(this.listData2);
          console.log(this.classDataList);
      })
      .catch(res => {
       //下单失败，请您稍后重试
      });
    },
    handleScroll() { //改变元素#searchBar的top值
      let top = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
      if(top<30){
        this.storeTitle = "";
        this.top = 0;
        this.tabActive = false;
      }else{
        this.storeTitle = this.storeData.merchantName;
        this.top = top;
        if(top>=200){
          this.tabActive = true;
          setTimeout(()=>{
            document.documentElement.scrollTop = document.body.scrollTop = window.pageYOffset = 290;
          },3)
        }else{
           this.tabActive = false;
           setTimeout(()=>{
            document.documentElement.scrollTop = document.body.scrollTop = window.pageYOffset = 0;
          },3)
        }
      }
    },
    toDetail (id) {
      this.$router.push({//核心语句
        path:'/goods',//跳转的路径
        query:{//路由传参时push和query搭配使用 ，作用时传递参数
          id: id 
        }
      })
    },
    // 加入购物车
    addToCart(id) {
      if(!this.token){
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

      let ajaxData ={
        'goodsCount':this.num,
        'goodsId': id,
        'storeId': this.sellerStoreId
      };
      this.$axios
          .post(
            this.api.AddGoodsCart,
            JSON.stringify(ajaxData),
            {
               headers: {"Authorization": this.token , "content-type": "application/json"}
            }
          )
          .then(res => {
            const resData = res.data;
            if (resData.code !== 1) {
              if(resData.code == 403){
                this.showTip("登录超时，请重新登录");
                this.$router.push({name:'login', params: { url: window.location.href}});
              }else{
                this.showTip("网络错误，请重试");
              }
              return;
            }
            this.showTip("加入购物车成功");
            this.verToken();
            // this.$router.push({ path: "/cart", query: { id: id } });
          })
          .catch(res => {
            this.showTip("加入失败，请重试");
          });
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
          if(arrData.imgLicense){
            this.imgLicense.push(this.urlPic+arrData.imgLicense); 
          }
          if(arrData.imgIndoor){
            let imgIndoor = arrData.imgIndoor.split(',');
            for (let item of imgIndoor) {
              this.imgStore.push(this.urlPic+item); 
            }
          }
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
