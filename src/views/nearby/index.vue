<template>
  <div class="wrapper nearby">
    <header class="mint-header is-fixed">
        <div class="mint-header-button is-left">
          <button class="mint-button mint-button--default mint-button--normal"><span class="mint-button-icon">
            {{ city }}
            <i class="mintui mintui-back"></i>
          </span> 
          <label class="mint-button-text"></label>
        </button>
      </div> 
      <h1 class="mint-header-title">店铺</h1> 
      <div class="mint-header-button is-right"></div>
    </header>


    <p class="white mb10 mt50">211</p>
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
const qs = require("qs");
export default {
  data() {
    return {
      city:'',
    };
  },
  components: { 
    "v-footer": vFooter
  },
  mounted(){
    console.log(this.getCity());
  },
  computed: {
    ...mapState(["token", "autoAddress", "choseAddress"]),
  },
  beforeCreate(){
    document.title = '店铺';
  },
  created() {
   console.log(this.getCity());
  },
  methods: { 
    
  }
};
</script>

<style lang="stylus">
@import '../../assets/css/nearby';
</style>
