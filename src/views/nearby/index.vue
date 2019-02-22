<template>
  <div class="wrapper nearby">
    <header class="mint-header is-fixed">
        <div class="mint-header-button is-left" v-on:click='cityPatFun'>
          <button class="mint-button mint-button--default mint-button--normal left" v-text="cityInputVal"></button>
          <x-icon type="ios-arrow-down" class="arrowDown left" size="12"></x-icon>
      </div> 
      <h1 class="mint-header-title">店铺</h1> 
      <div class="mint-header-button is-right"><button class="mint-button mint-button--default mint-button--normal"><span class="mint-button-icon"><i class="mintui mintui-search"></i></span> <label class="mint-button-text"></label></button></div>
    </header>
   <p class="white mb10 mt50">211</p>

   <com-citychoice ref="city" v-on:tochildevent='cityjs'></com-citychoice>
    
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
    <v-footer active="nearby" />
  </div>
</template>

<script>
// 购物车
import { mapState } from "vuex";
import { Toast } from "mint-ui";
import { XSwitch, Group, Cell } from 'vux';
import vNodata from "@/components/v-nodata";
import vFooter from "@/components/v-footer";
import comCitychoice from "@/components/comCitychoice";
const qs = require("qs");
export default {
  data() {
    return {
      cityInputVal:'城市', 
    };
  },
  components: { 
    "v-footer": vFooter,
    "com-citychoice": comCitychoice
  },
  mounted(){
   let _this = this;
   this.getCurrentCityName().then(function(data){
     if(data&&data.substr(data.length-1)=='市'){
        data = data.substr(0,data.length-1);
      }
      _this.cityInputVal = data;
    })
  },
  computed: {
    ...mapState(["token"]),
    
  },
  beforeCreate(){
    document.title = '店铺';
  },
  created() {
    
  },
  methods: { 
    cityPatFun:function(){
        this.$refs.city.cityFun();
      },
    cityjs:function(data){
      this.cityInputVal=data;
    },
    getCurrentCityName() {
      return new Promise(function (resolve, reject) {
        let myCity = new BMap.LocalCity()
        myCity.get(function (result) {
          resolve(result.name)
        })
      })
    }
  }
};
</script>

<style lang="stylus">
@import '../../assets/css/nearby';
</style>
