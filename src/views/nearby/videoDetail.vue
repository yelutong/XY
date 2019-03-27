<template>
  <div class="wrapper vdDetail storeVideo">
    <vHeader :title="mapTitle"/>
    <div  class="prism-player" id="J_prismPlayer"></div>
    <div class="storeIconBtm vertical-view">
      <p><img :src="storeIcon" class="storeIcon left" /><span class="txt-white left lh-30 ml5 fs-14" v-text="mapTitle"></span></p>
      <p><span class="txt-white left lh-30 fs-14">好评率</span><span class="left lh-30 fs-14 ml10"><rater disabled :font-size="10" active-color="#ff4f00" value="5.0"></rater><i class="fs-14 ml5 txt-orange">5.0</i></span></p>
      <p><span class="txt-white  lh-30 fs-14">距离</span><span class="txt-white lh-30 fs-14 ml10" v-text="disFormat2(distance)"></span></p>
    </div>
    <div class="vertical-view storeIconRt">
      <p @click="toStore(storeId)"><img :src="urlPic+imgLogo" class="storeImg mb10" /></p>
      <p @click="recivce(videoId,collectStatus)"><img :src="storeIcon1" class="storeImg2" /></p>
      <p class="txt-white lh-30 fs-14">收藏</p>
      <p @click="zanStore"><img :src="storeIcon2" class="storeImg2" /></p>
      <p class="txt-white lh-30 fs-14" v-text="goodsCount"></p>
      <p @click="toastCom"><img :src="storeIcon3" class="storeImg2" /></p>
      <p class="txt-white lh-30 fs-14" v-text="commentCount"></p>
    </div>

    <div class="picker-new">
      <div :class="show ?'picker-mask show':'picker-mask'" @click="closePickerBox"></div>
       <div :class="show ?'picker-panel show':'picker-panel'">
        <div class="h45 vux-1px-b relative titleEx">{{commentCount}}条评论<i class="txt-gray" @click="closePickerBox">×</i></div>
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
          <span class="right mt20" @click="sendCom()"><x-button mini type="primary">发送</x-button></span>
       </div>
        </div>
      </div>
    </div> 

  </div>
</template>

<script>
// 购物车
import { mapState } from "vuex";
import { Toast, Header } from "mint-ui";
import { XButton, Swiper, XTextarea, SwiperItem, Rater } from 'vux';
import vFooter from "@/components/v-footer";
import vHeader from "@/components/v-header";
import del from "@/assets/images/del2.png";
const qs = require("qs");
export default {
  data() {
    return {
      canEdit: true,
      storeIcon: require("../../assets/images/storeIcon.png"),
      storeIcon1: require("../../assets/images/sc1.png"),
      storeIcon2: require("../../assets/images/zan1.png"),
      storeIcon3: require("../../assets/images/pl1.png"),
      list: [],
      del: del,
      allSelect: false,
      checkallList: [],
      checked: [],
      price:0,
      count:0,
      goodsCarts:[],
      payPrice: 0,
      userCouponIds: [],
      goodsChannel: 1,
      isUseIntegral:0,
      num: '',
      urlPic:this.api.urlPic,
      id: this.getUrlParam("id"),
      imgLogo: this.getUrlParam("imgLogo"),
      mapTitle: this.getUrlParam("title"),
      distance: this.getUrlParam("distance"),
      storeId: this.getUrlParam("storeId"),
      videoId: this.getUrlParam("videoId"),
      collectStatus: this.getUrlParam("collectStatus"),
      goodsCount: this.getUrlParam("goodsCount"),
      clickStatus: this.getUrlParam("clickStatus"),
      commentCount: this.getUrlParam("commentCount"),
      videoHeight: document.documentElement.clientHeight+'px',
      showAddress: null,
      goodsArr: [],
      listDataEva:[],
      goodsTips: "",
      uuid:'',
      show: false,
      textareaCom:'',
    };
  },
  components: { 
    'v-footer': vFooter,
    vHeader,
    Swiper,
    Rater,
    XTextarea,
    XButton,
    SwiperItem
  },
  mounted() {
    
  },
  beforeCreate(){
    document.title = '购物车';
  },
  computed: {
    ...mapState(["token","location"]),
  },
  created() {
    this.getSTS();
  },
  methods: {
    getSTS(){
      this.$axios
        .get(this.api.getSTS)
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip("未获取到信息");
            return;
          }else{
            console.log(resData);
            let player = new Aliplayer({
            id: 'J_prismPlayer',
            width: '100%',
            height: document.documentElement.clientHeight+'px',
            autoplay: true,
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
            vid : this.id,
            accessKeyId: resData.content.accessKeyId,
            securityToken: resData.content.securityToken,
            accessKeySecret: resData.content.accessKeySecret,
             region:'cn-shanghai',//eu-central-1,ap-southeast-1
            },function(player){
                console.log('播放器创建好了。')
           });
          }
        })
        .catch(res => {
          
        }); 
    },
    sendCom(){ 
      this.$axios
        .post(
          this.api.commitVideo,
          JSON.stringify({
           'context': this.textareaCom,
           'storeId': Number(this.storeId),
           'videoId': Number(this.videoId),
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
    toastCom(){
      this.show = true;
      this.getEvaData();
    },
    getEvaData(){
      this.$axios
        .post(
          this.api.commitVideoList,
          JSON.stringify({
           'storeId': Number(this.storeId),
           'videoId': Number(this.videoId),
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
    zanStore(){
     this.$axios
        .get(this.api.zanVideo+this.videoId,{
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
          if(this.clickStatus==1){
            this.goodsCount--;
            this.clickStatus=0;
            this.showTip('已取消');
          }else{
            this.clickStatus=1;
            this.goodsCount++;
            this.showTip('已点赞');
          }
        })
        .catch(res => {
         
        });
    },
    recivce(videoId,collectStatus){
       this.$axios
        .post(
          this.api.cancelOrCoVideo,
          JSON.stringify({
           'status': collectStatus==1?false:true,
           'videoId': Number(videoId)
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
          if(collectStatus==1){
           this.collectStatus=0;
           this.showTip('取消收藏');
          }else{
           this.collectStatus=1;
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
  }
}; 
</script> 
<style lang="stylus">
@import '../../assets/css/pay-act-btom';
@import '../../assets/css/goodseva';
@import '../../assets/css/buy';
@import '../../assets/css/nearby';
</style>
