<template>
  <div class="wrapper updateInfo">
    <vHeader title="修改信息" />
    <div class="mt50">

      <vue-core-image-upload 
      class="up-load" 
      :crop="false" text="" inputAccept="image/*" 
      @imageuploaded="chooseImage" 
      :credentials="false"
      :max-file-size="10485760" 
      :multiple="false" inputOfFile="Filedata" 
      :url="this.api.uploadPhoto" 
      :headers="{'Authorization':this.token}" >
      <img width="150" :src="license" />
    </vue-core-image-upload>
       <v-cell class="share" title="头像" type="btn" />
       <mt-field label="昵称" placeholder="请输入昵称" v-model="nickName"></mt-field>
       <mt-field label="年龄" placeholder="请输入年龄" v-model="age"></mt-field>
        <group>
          <popup-radio title="性别" :options="options1" v-model="option1"></popup-radio>
        </group>
       <mt-field label="邮箱" placeholder="请输入邮箱地址" type="email" v-model="email"></mt-field>
        <div class="loginOutBtn">
        <button class="btn-submit mt50 full-screen" @click="evaGoods">提交修改</button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Field, Cell } from 'mint-ui';
import { Group, PopupRadio } from "vux";
import vCell from "@/components/v-cell";
import vHeader from "@/components/v-header";
import VueCoreImageUpload from "vue-core-image-upload";
export default {
  data() {
    return {
      license:'',
      nickName:'',
      headPhoto: '',
      age: '',
      email: '',
      option1: '男',
      options1: ['男', '女'],
    };
  },
  components: {
    "v-cell": vCell,
    vHeader,
    Group,
    PopupRadio,
    "vue-core-image-upload": VueCoreImageUpload
  },
  computed: {
    ...mapState(["token"])
  },
  created() {
    // 获取我的钱包数据
    this.getWalletInfo();
  },
  methods: {
    ...mapActions(["atnToken"]),
    // 获取我的钱包数据
    getWalletInfo() {
     
    },
    // 接收子组件传来的点击图片事件
    imageAction(index) {
        this.imgList.splice(index, 1);
        this.arrImgId.splice(index, 1);
    },
    // 上传之后的事件
    chooseImage(res) {
         console.log(res)
         if(res.code == 0){
           this.license = res.url;
         }
        /*
        const imgList = this.imgList;

        if (imgList.length >= 8) {
          this.showTip("最多只能上传8张图片");
          return;
        }
        if (data.code !== 1 || !data.data || data.data.length === 0) {
          this.showTip("上传失败，请重试");
          return;
        }
        const arrData = data.data;
        this.imgList.push(arrData[0].imagePath);
        this.arrImgId.push(arrData[0].imgId);
        */
    },
    // 点击发表评价
    evaGoods() {
       
    },
    loginOut(){
      this.$axios
          .get(this.api.loginOut, {
            headers: {"Authorization": this.token }
          })
          .then(res => {
            const resData = res.data;
            if (resData.code !== 1) {
              this.showTip("退出登录失败");
              return;
            }
            this.atnToken('');
            console.log(0);
            let _this = this;
            setTimeout(() => {
              _this.$router.push({path: "/mine/login"});
            }, 1000);
          })
          .catch(res => {
            this.showTip("退出登录失败");
            this.atnToken('');
            let _this = this;
            setTimeout(() => {
              _this.$router.push({path: "/mine/login"});
            }, 1000);
          });
    }
  }
};
</script>

<style lang="stylus">
.updateInfo{
  .loginOutBtn {
  width:90%!important;
  margin: auto;
  }
  .up-load{
    position:relative;
    height:40px;
  }
}
</style>
