<template>
  <div :class="selected==1?'wrapper storeVideo':'wrapper page-buy storeVideo'">
    <header :class="selected==1?'mint-header newBg is-fixed':'mint-header is-fixed'">
      <div class="mint-header-button is-left">
      </div> 
        <h1 class="mint-header-title">
          <button-tab>
            <button-tab-item :selected="selected==1?true:false" @on-item-click="consoleIndex(1)">推荐</button-tab-item>
            <button-tab-item :selected="selected==2?true:false" @on-item-click="consoleIndex(2)">列表</button-tab-item>
            <button-tab-item :selected="selected==3?true:false" @on-item-click="consoleIndex(3)">收藏</button-tab-item>
          </button-tab>
        </h1> 
        <div class="mint-header-button is-right"></div>
    </header>

    <div :class="selected==1?'lay-goods':'lay-goods mt50'">
     <div v-if="selected==1">
      <swiper loop :show-dots='false' :height="videoHeight" direction="vertical" @on-index-change="swiperChange">
        <swiper-item class="black" v-for="(item, index) in listPlayer" :key="index">
          <div  class="prism-player" :id="item.classId"></div>
          <div class="storeIconBtm vertical-view">
            <p><img :src="storeIcon" class="storeIcon left" /><span class="txt-white left lh-30 ml5 fs-14" v-text="item.title"></span></p>
            <p><span class="txt-white left lh-30 fs-14">好评率</span><span class="left lh-30 fs-14 ml10"><rater disabled :font-size="10" active-color="#ff4f00" value="5.0"></rater><i class="fs-14 ml5 txt-orange">5.0</i></span></p>
            <p><span class="txt-white  lh-30 fs-14">距离</span><span class="txt-white lh-30 fs-14 ml10" v-text="disFormat2(item.distance)"></span></p>
          </div>
          <div class="vertical-view storeIconRt">
            <p @click="toStore(item.storeId)"><img :src="urlPic+item.imgLogo" class="storeImg mb10" /></p>
            <p @click="recivce(item)"><img :src="storeIcon1" class="storeImg2" /></p>
            <p class="txt-white lh-30 fs-14">收藏</p>
            <p @click="zanStore(item)"><img :src="storeIcon2" class="storeImg2" /></p>
            <p class="txt-white lh-30 fs-14" v-text="item.goodsCount"></p>
            <p @click="toastCom(item)"><img :src="storeIcon3" class="storeImg2" /></p>
            <p class="txt-white lh-30 fs-14" v-text="item.commentCount"></p>
          </div>
        </swiper-item>
      </swiper>
     </div>
     <div v-if="selected==2">
     <scroller lock-x :scroll-bottom-offset="10" :scrollbar-y=false height="-1" use-pullup  @on-scroll-bottom="getVideOlist"  v-model="status" ref="scroller" @on-pullup-loading="getVideOlist">
     <div>
     <flexbox :gutter="0" wrap="wrap" class="storeVideoData pda15 bg-white" v-if="listData">
      <flexbox-item v-for="(item, index) in listData" :key="index">
        <router-link class="relative vertical-view" :to="{path:'/videoDetail', query:{id:item.id,title:item.title,distance:item.distance,storeId:item.storeId,videoId:item.videoId,collectStatus:item.collectStatus?1:0,goodsCount:item.goodsCount,commentCount: item.commentCount,clickStatus:item.clickStatus?1:0,imgLogo:item.imgLogo }}">
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
    <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -20px; text-align: center;">
          <span v-show="status.pullupStatus === 'default'"></span>
          <span class="pullup-arrow" v-show="status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
          <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
          <span v-show="status.pullupStatus === 'complete'">已加载完成</span>
    </div>
    </scroller>
    </div>
    <div v-if="selected==3">
      <flexbox :gutter="0" wrap="wrap" class="storeVideoData pda15 bg-white" v-if="listDataCom">
          <flexbox-item v-for="(item, index) in listDataCom" :key="index">
            <router-link class="relative vertical-view" :to="{path:'/videoDetail', query:{id:item.id,title:item.title,distance:item.distance,storeId:item.storeId,videoId:item.videoId,collectStatus:item.collectStatus?1:0,goodsCount:item.goodsCount,commentCount: item.commentCount,clickStatus:item.clickStatus?1:0,imgLogo:item.imgLogo }}">
              <div class="relative"><img class="absolute topImg" :src="topImg"/><img ref="reviceStyle" :height="clientHeight" class="img" :src="item.videoCover" /></div>
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
    <div class="picker-new">
      <div :class="show ?'picker-mask show':'picker-mask'" @click="closePickerBox"></div>
       <div :class="show ?'picker-panel show':'picker-panel'">
        <div class="h45 vux-1px-b relative titleEx">{{gentel.commentCount}}条评论<i class="txt-gray" @click="closePickerBox">×</i></div>
        <div class="groupEx mb10 pda15 vertical-view evaStore relative page-goodseva">
              <div v-if="listDataEva" class="eva-list evaCom eva-list">
                  <div class="item" v-for="(item, index) in listDataEva" :key="index">
                    <div class="eva-pro">
                      <div class="pro">
                        <div class="art-box">
                          <img class="avatar" :src="item.headPhoto?urlPic+item.headPhoto:''" />
                        </div>
                        <span class="name">{{ item.nickName }}</span>
                      </div>
                      <div class="date">
                        <i class="ico i-date"></i>{{ item.addTime }}
                      </div>
                    </div>
                    <div class="eva-text brk-wod txt-left">{{ item.context }}</div>
                  </div>
              </div>
          <div class="bottomCom">
          <x-textarea :max="100" placeholder="快来说说你的感受吧~"  v-model="textareaCom"></x-textarea>
          <span class="right mt20" @click="sendCom(gentel)"><x-button mini type="primary">发送</x-button></span>
       </div>
        </div>
      </div>
    </div> 


    </div>
    <v-footer v-if="selected!=1" active="storeVideo"/>
  </div>
</template>

<script>
// 购物车
import { mapState } from "vuex";
import { XButton, XTextarea, Swiper, SwiperItem, ButtonTab, ButtonTabItem, Scroller, Spinner, Rater, Flexbox, FlexboxItem } from 'vux';
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
      show: false,
      selected: 1,
      textareaCom:'',
      gentel:'',
      urlPic:this.api.urlPic,
      topImg: require("../../assets/images/video1.png"),
      zanImg: require("../../assets/images/zan.png"),
      plImg: require("../../assets/images/pl.png"),
      storeIcon: require("../../assets/images/storeIcon.png"),
      storeIcon1: require("../../assets/images/sc1.png"),
      storeIcon2: require("../../assets/images/zan1.png"),
      storeIcon3: require("../../assets/images/pl1.png"),
      videoHeight: document.documentElement.clientHeight+'px',
      listData: [],
      listPlayer:[],
      listDataCom:[],
      listDataEva:[],
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
    XButton,
    XTextarea,
    SwiperItem
  },
  mounted() {
    
  },
  beforeCreate(){
    document.title = '刷店';
  },
  computed: {
    ...mapState(["token","location"]),
  },
  created() {
    this.getSTS();
  },
  methods: {
    sendCom(item){ 
      this.$axios
        .post(
          this.api.commitVideo,
          JSON.stringify({
           'context': this.textareaCom,
           'storeId': item.storeId,
           'videoId': item.id,
          }),
          {
            headers: {
              "content-type": "application/json",
              "Authorization": this.token
            }
          }
        )
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip(resData.msg);
            return;
          }
          this.listDataEva=[];
          this.getEvaData();
          this.textareaCom='';
          this.commentCount++;
          this.showTip('评论成功');
        })
        .catch(res => {
          //this.showTip("数据错误");
        });
    },
    closePickerBox(){
      this.show = false;
    },
    toastCom(item){
      this.show = true;
      this.gentel = item;
      this.getEvaData();
    },
    getEvaData(){
      this.$axios
        .post(
          this.api.commitVideoList,
          JSON.stringify({
           'storeId': this.gentel.storeId,
           'videoId': this.gentel.id,
          }),
          {
            headers: {
              "content-type": "application/json",
              "Authorization": this.token
            }
          }
        )
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip(resData.msg);
            return;
          }
          this.listDataEva = resData.content.list;
          console.log(resData);
        })
        .catch(res => {
          //this.showTip("数据错误");
        });
    },
    zanStore(item){
     this.$axios
        .get(this.api.zanVideo+item.id,{
          headers: {
            "content-type": "application/json",
            "Authorization": this.token
          }
        })
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip(resData.msg);
            return;
          }
          if(item.clickStatus==true){
            item.goodsCount--;
            item.clickStatus=false;
            this.showTip('已取消');
          }else{
            item.clickStatus=true;
            item.goodsCount++;
            this.showTip('已点赞');
          }
        })
        .catch(res => {
         
        });
    },
    recivce(item){
       this.$axios
        .post(
          this.api.cancelOrCoVideo,
          JSON.stringify({
           'status': item.collectStatus==true?false:true,
           'videoId': item.id
          }),
          {
            headers: {
              "content-type": "application/json",
              "Authorization": this.token
            }
          }
        )
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip(resData.msg);
            return;
          }
          if(item.collectStatus==true){
           item.collectStatus=false;
           this.showTip('取消收藏');
          }else{
           item.collectStatus=true;
           this.showTip('收藏成功');
          }
        })
        .catch(res => {
          //this.showTip("数据错误");
        });
    },
    toStore(id){
     this.$router.push({//核心语句
        path:'/store',//跳转的路径
        query:{//路由传参时push和query搭配使用 ，作用时传递参数
          id: id  
        }
      })
    },
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
    },
    consoleIndex(index) {
      this.selected=index;
      if(index==1){
       this.listPlayer=[];
       this.getSTS();
      }else if(index==2){
       this.getVideOlist();
      }else{
       this.listDataComData();
      }
    },
    listDataComData(){
       this.$axios.post(this.api.getVideoList,qs.parse({'latitude':this.location.lat,'longitude':this.location.lng,'type':1}),{headers: {"Authorization": this.token,"content-type": "application/json"}})
        .then(res => {
           let arrData= res.data.content.list;
           this.listDataCom = arrData;
           console.log(arrData);
           let _this=this;
           setTimeout(function(){
              _this.clientHeight = _this.$refs.reviceStyle[0].clientWidth;
           },0)
        })
        .catch(res => {
         //失败，请您稍后重试
        }); 
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
                 },500)
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
@import '../../assets/css/goodseva';
@import '../../assets/css/buy';
@import '../../assets/css/nearby';
</style>
