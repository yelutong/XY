<template>
  <div class="wrapper page-ordercenter">
    <vHeader title="我的订单"/>
    <div class="lay-goods mt50">
      <div class="item vertical-view"  v-if="centerList">
        <div class="horizontal-view">
        <router-link class="img-box" :to="{path:'/goods', query:{id:centerList.conList.id}}">
          <img class="img" :src="centerList.conList.goodsPhoto" />
        </router-link>
        <div>
          <p>商品评论</p>

          <group>
            <cell>
              <Rater v-model="data3" :font-size="30" ></Rater>
            </cell>
          </group>
        </div>
      </div>

            <!--
            <div class="action">
              <router-link class="btn-act" v-if="type==='exp'" :to="{path:'/goods/express', query:{'detail-id':centerList.detailId}}">查看物流</router-link>
              <router-link class="btn-act" v-if="type==='eva'" :to="{path:'/goods/evagoods', query:{id:centerList.conList.id}}">评价晒单</router-link>
              <router-link class="btn-act" v-if="type==='eva'" :to="{path:'/goods/evaserve', query:{id:centerList.conList.id}}">服务评价</router-link> 
            </div>
          -->
        <evagoods  v-if="type=='eva'" />
      </div>

      <v-nodata v-else bgcolor="grey" text="- 暂无订单详情 -" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Rater, Group, Cell } from 'vux';
import vNodata from "@/components/v-nodata";
import vHeader from "@/components/v-header";
import evagoods from "@/views/goods/evagoods";
export default {
  data() {
    return {
      data3: '3',
      type: this.getUrlParam("type") || "",
      from: this.getUrlParam("from") || "",
      noList: false,
      centerList: []
    };
  },
  components: {
    "v-nodata": vNodata,
    vHeader,
    evagoods,
    Rater,
    Group,
    Cell
  },
  computed: {
    ...mapState(["token"])
  },
  beforeCreate() {
    document.title = "订单中心";
  },
  created() {
    // 判断是否来自我的订单
    const from = this.from;
    const type = this.type;
    if (from === "orders") {
      this.getListFromOrders(type);
    }
  },
  watch:{
    data3(val,old){
       console.log(val);
    }
  },
  methods: {
    getListFromOrders(type) {
      // 来自订单中心，并区分是物流还是评价
      let key = "";
      switch (type) {
        case "exp":
          key = "expList";
          break;
        case "eva":
          key = "evaList";
          break;
      }
      // 从缓存中拿数据
      let arrGood = JSON.parse(sessionStorage.getItem(key));
      if (arrGood.length == 0) {
        this.noList = true;
        this.centerList = [];
        return;
      }
      this.noList = false;
      this.centerList = arrGood;
      console.log(arrGood)
    }
  }
};
</script>

<style lang="stylus">
@import '../../assets/css/media';
@import '../../assets/css/ordercenter';
.page-ordercenter .vux-rater-inner span{
  font-size:30px;
}
</style>