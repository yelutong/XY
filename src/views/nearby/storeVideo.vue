<template>
  <div class="wrapper page-buy storeVideo">
    <header class="mint-header is-fixed">
      <div class="mint-header-button is-left">
      </div> 
        <h1 class="mint-header-title">
          <button-tab>
            <button-tab-item :selected="selected==1?true:false" @on-item-click="consoleIndex(1)">推荐</button-tab-item>
            <button-tab-item :selected="selected==2?true:false" @on-item-click="consoleIndex(2)">分类</button-tab-item>
            <button-tab-item :selected="selected==3?true:false" @on-item-click="consoleIndex(3)">收藏</button-tab-item>
          </button-tab>
        </h1> 
        <div class="mint-header-button is-right"></div>
    </header>

    <div class="lay-goods mt50">
     <div v-if="selected==1">
      <swiper loop :show-dots='false' :height="videoHeight" direction="vertical" @on-index-change="swiperChange">
        <swiper-item class="black" v-for="(item, index) in listPlayer" :key="index"><div  class="prism-player" :id="item.classId"></div></swiper-item>
      </swiper>
     </div>
     <div v-if="selected==2">
     <scroller lock-x :scroll-bottom-offset="10" :scrollbar-y=false height="-60" use-pullup use-pulldown @on-scroll-bottom="getVideOlist"  v-model="status" ref="scroller" @on-pullup-loading="getVideOlist">
     <div>
     <flexbox :gutter="0" wrap="wrap" class="storeVideoData pda15 bg-white" v-if="listData">
      <flexbox-item v-for="(item, index) in listData" :key="index">
        <router-link class="relative vertical-view" :to="{path:'/videoDetail', query:{id:item.id}}">
          <div class="relative"><img class="absolute topImg" :src="topImg"/><img ref="companyStyle" :height="clientHeight" class="img" :src="item.videoCover" /></div>
          <div class="flexg2 listRight">
            <p class="goodsName pdlr5 txt-black-real" v-text="item.title"></p> 
            <p class="pdlr5"><rater disabled :font-size="10" active-color="#ff4f00" value="5.0"></rater><i class="fs-12 ml10 txt-orange">5.0</i></p>
            <div>
            <p class="fs-18 pdlr5 mb10 left">
            <span class="left"><img class="zanImg" :src="zanImg"/><i v-text="item.goodsCount" class="ml5 txt-dark"></i></span>
            <span class="left ml10"><img class="plImg zanImg" :src="plImg"/><i class="ml5 txt-dark" v-text="item.commentCount"></i></span>
            </p>
            </div>
          </div>
        </router-link>
      </flexbox-item> 
    </flexbox>
   </div>
    <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
          <span v-show="status.pullupStatus === 'default'"></span>
          <span class="pullup-arrow" v-show="status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
          <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
          <span v-show="status.pullupStatus === 'complete'">已加载完成</span>
    </div>
    </scroller>
    </div>


    </div>
    <v-footer active="storeVideo"/>
  </div>
</template>

<script>
// 购物车
import { mapState } from "vuex";
import { Swiper, SwiperItem, ButtonTab, ButtonTabItem, Scroller, Spinner, Rater, Flexbox, FlexboxItem } from 'vux';
import { Toast, Header  } from 'mint-ui';
import vFooter from "@/components/v-footer";
import vHeader from "@/components/v-header";
import del from "@/assets/images/del2.png";
const qs = require("qs");
export default {
  data() {
    return {
      canEdit: true,
      totalCount:0,
      selected: 1,
      topImg: require("../../assets/images/video1.png"),
      zanImg: require("../../assets/images/zan.png"),
      plImg: require("../../assets/images/pl.png"),
      videoHeight: document.documentElement.clientHeight+'px',
      listData: [],
      listPlayer:[],
      loadMoreVal:true,
      totalPage: 1,
      currentPage: 0,
      clientHeight:0,
      getSTSData: '',
      id: this.getUrlParam("id"),
      status: {
        pullupStatus: 'default'
      }
    };
  },
  components: { 
    'v-footer': vFooter,
    vHeader,
    Flexbox,
    Rater,
    Scroller,
    Spinner,
    ButtonTab,
    ButtonTabItem,
    FlexboxItem,
    Swiper,
    SwiperItem
  },
  computed: {
    ...mapState(["token"])
  },
  mounted() {
    
  },
  beforeCreate(){
    document.title = '购物车';
  },
  computed: {
    ...mapState(["location"]),
  },
  created() {
    this.getSTS();
  },
  methods: {
    swiperChange(index){
     console.log(index);
     let myVideo = document.getElementsByTagName('video');
     console.log(myVideo);
     for (var i = 0; i < myVideo.length; i++) {
       if(myVideo[i].paused){ //如果已暂停则播放
        // myVideo[index+1].play();
       }else{ //已播放点击则暂停
        myVideo[i].pause(); //暂停控制
       }
       myVideo[i].onclick = function(){
          if(this.paused){
              this.play();
          }else{
              this.pause();
          }
        } 
     }
     
/*
     for(let i of myVideo){
      if(i.paused){ //如果已暂停则播放
       // myVideo[index+1].play();
      }else{ //已播放点击则暂停
        i.pause(); //暂停控制
       }
     }*/
    },
    consoleIndex(index) {
      this.selected=index;
      if(index==1){
       this.listPlayer=[];
       this.getSTS();
      }else if(index==2){
       this.getVideOlist();
      }
    },
    getSTS(){
      let _this = this;
      _this.$axios
        .get(_this.api.getSTS)
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip("未获取到信息");
            return;
          }else{
            //console.log(resData);
            _this.getSTSData = resData.content;
            _this.$axios.post(_this.api.getVideoList,qs.parse({'latitude':_this.location.lat,'longitude':_this.location.lng,'type':null,"page" : 1, "limit":20 }),{headers: {"content-type": "application/json"}})
            .then(res => {
               let arrData= res.data.content.list;
               console.log('dddd');
               console.log(arrData);
               for (let i=0; i<20;i++){
                 arrData[i].classId= 'J_prismPlayer'+arrData[i].id;
                 setTimeout(()=>{
                 _this.videoShow(arrData[i].id,arrData[i].videoId);
                 },1000)
               }
               _this.listPlayer = arrData;
               console.log(_this.listPlayer);
            })
            .catch(res => {
             //失败，请您稍后重试
            });

            }
            })
            .catch(res => {
              
            }); 
            
    },
    videoShow(classId,videoId){
      let player = new Aliplayer({
      id: 'J_prismPlayer'+classId,
      width: '100%',
      height: document.documentElement.clientHeight+'px',
      autoplay: false,
      "skinLayout": [
      {
        "name": "bigPlayButton",
        "align": "blabs",
        "x": 30,
        "y": 80
      },
      {
        "name": "H5Loading",
        "align": "cc"
      },
      {
        "name": "errorDisplay",
        "align": "tlabs",
        "x": 0,
        "y": 0
      },
      {
        "name": "infoDisplay"
      },
      {
        "name": "tooltip",
        "align": "blabs",
        "x": 0,
        "y": 56
      },
      {
        "name": "thumbnail"
      },
      {
        "name": "controlBar",
        "align": "blabs",
        "x": 0,
        "y": 0,
        "children": []
      }
    ],
      //播放方式四：使用STS方式播放
      vid : videoId,
      accessKeyId: this.getSTSData.accessKeyId,
      securityToken: this.getSTSData.securityToken,
      accessKeySecret: this.getSTSData.accessKeySecret,
       region:'cn-shanghai',//eu-central-1,ap-southeast-1
      },function(player){
          console.log('播放器创建好了。')
      });
    },
    getVideOlist(){
      if(this.loadMoreVal){
       this.loadMoreVal=false;
        setTimeout(()=>{
         this.loadMoreVal=true;
        },1000)
     }else{
       return;
     }
     if(this.currentPage< this.totalPage){
      this.currentPage= parseInt(this.currentPage) + 1;
      this.$axios.post(this.api.getVideoList,qs.parse({'latitude':this.location.lat,'longitude':this.location.lng,'type':null,"page" : this.currentPage, "limit":8 }),{headers: {"content-type": "application/json"}})
      .then(res => {
         console.log(res.data);
         this.totalPage=res.data.content.totalPage; 
         this.totalCount = res.data.content.totalCount;
         this.listData = [...this.listData,...res.data.content.list];

          let _this=this;
          setTimeout(function(){
              _this.clientHeight = _this.$refs.companyStyle[0].clientWidth;
           },0)

      })
      .catch(res => {
       //失败，请您稍后重试
      });
    }else{
      this.status.pullupStatus = 'complete';
      setTimeout(()=>{
        this.status.pullupStatus = 'default';
      },1000);
      console.log('已加载完');
     }
    }
  }
}; 
</script>
<style lang="stylus">
@import '../../assets/css/pay-act-btom';
@import '../../assets/css/media';
@import '../../assets/css/buy';
@import '../../assets/css/nearby';
</style>
