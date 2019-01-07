<!-- 首页路由 -->
<template>
  <div class="wechatShare">
 sss
  </div>
</template>

<script>
import { mapActions } from "vuex";
import vSwiper from "@/components/v-swiper";
import vNodata from "@/components/v-nodata";
import swiperPic from "@/assets/images/banner@2x.png";
import { Button } from "mint-ui";
import { Scroller, Spinner, Flexbox, FlexboxItem } from 'vux';
const qs = require("qs");
export default { 
  components: {
    Button
  },
  data() {
    return {
      urlPic:this.api.urlPic,
      totalPage: 1,
      currentPage: 0,
      listData:[],
      newListData:[],
      pullup:true,
      status: {
        pullupStatus: 'default'
      },
      bannerSwipe: {
        speed: 800,
        auto: 3000,
        showIndicators: true,
        continuous: true,
        link: "/goods",
        arrData: []
      }, 
      newsTag: require("@/assets/images/news-tag.png"),
      activityTag: require("@/assets/images/act-tag.png"),
      vAreaList: []
    };
  },
  components: {
    "v-swiper": vSwiper,
    "v-nodata": vNodata,
    Scroller,
    Spinner,
    Flexbox, 
    FlexboxItem
  },
  beforeCreate() {
    
  },
  computed: {

  },
  created() {
    // 读取用户其他数据 
    this.getOpenid();
  },
  methods: {
    ...mapActions(["atnOpenId","atnProUserId"]),
    getOpenid() {
        let code = this.getUrlParam("code");
         
    } 
  }
};
</script> 