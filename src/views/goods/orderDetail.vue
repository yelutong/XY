<template>
  <div class="wrapper page-buy">
    <vHeader title="订单详情"/>
    <div class="lay-goods white mb10 pd15 mt50" v-if="goodsBuyInfo">
      <div class="item" v-for="(item, index) in goodsBuyInfo.items" :key="index">
        <div class="img-box">
          <img class="img" :src="item.goodsPhoto" />
        </div>
        <div class="info-box">
          <div class="title">
            {{ item.goodsName }}
          </div>
          <div class="price-num">
            <span class="price">￥{{ item.totalPrice }}</span>
            <span class="fs-12">x {{ item.goodsCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="lay-action fix-btom pay-act-btom" v-if="goodsBuyInfo">
      <div class="price-info flex1">
        <span class="tag">合计：</span>
        <span class="total" v-model="num">￥{{ goodsBuyInfo.totalPrice }}</span>
        <span class="tip" v-if="goodsIntegral">(抵扣积分{{goodsIntegral}})</span>
        <span v-else class="tip"> (含运费)</span>
      </div>
      <button class="btn-submit per40" @click="makeOrder">支付订单</button>
    </div>
    <v-nodata v-if="!goodsBuyInfo" bgcolor="grey" text="- 暂无待支付订单 -" />
  </div>
</template>

<script>
// 购物车
import { mapState } from "vuex";
import { Toast } from "mint-ui";
import { XSwitch, Group } from 'vux';
import vNodata from "@/components/v-nodata";
import vHeader from "@/components/v-header";
const qs = require("qs");
export default {
  data() {
    return {
      orderNo:this.getUrlParam("orderNo")||'',
      goodsBuyInfo:""
    }
  },
  components: { 
    "group": Group,
    "v-nodata": vNodata,
    vHeader
  },
  computed: {
    ...mapState(["token"])
  },
  beforeCreate(){
    document.title = '填写订单';
  },
  created() {
    this.getOrderData();
  },
  methods: {
    getOrderData(){
      this.$axios
        .get(this.api.orderformInfo+this.orderNo,{ 
          headers: {"Authorization": this.token } 
        })
        .then(res => {
          const resData = res.data;
          if (resData.code !== 1) {
            this.showTip("获取商品信息失败");
            return;
          }
          const objData = resData.content;
          this.goodsBuyInfo = objData;
         
        })
        .catch(res => {
          this.showTip("获取商品信息失败");
        })
      }
    }
}
</script>
<style lang="stylus">
@import '../../assets/css/pay-act-btom';
@import '../../assets/css/media';
@import '../../assets/css/buy';
</style>
