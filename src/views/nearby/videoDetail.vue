<template>
  <div class="wrapper vdDetail">
    <vHeader :title="mapTitle"/>
    <div  class="prism-player" id="J_prismPlayer"></div>
  </div>
</template>

<script>
// 购物车
import { mapState } from "vuex";
import { Toast, Header } from "mint-ui";
import { Swiper, SwiperItem } from 'vux';
import vFooter from "@/components/v-footer";
import vHeader from "@/components/v-header";
import del from "@/assets/images/del2.png";
const qs = require("qs");
export default {
  data() {
    return {
      canEdit: true,
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
      id: this.getUrlParam("id"),
      mapTitle: this.getUrlParam("title"),
      videoHeight: document.documentElement.clientHeight+'px',
      showAddress: null,
      goodsArr: [],
      goodsTips: "",
      uuid:''
    };
  },
  components: { 
    'v-footer': vFooter,
    vHeader,
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
