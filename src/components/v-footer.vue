<!-- 底部大导航 -->
<template>
  <div class="v-footer">
    <div class="item" :class="{active:item.type === active}" v-for="(item, index) in arrNav" :key="index" @click="pageToBar(item, index)">
      <i class="ico" :class="'i-'+item.type"></i>
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      arrNav: [
        //{ title: "首页", type: "index" },
        //{ title: "小V", type: "vGoods" },
        { title: "附近", type: "nearby" },
        { title: "刷店", type: "storeVideo" },
        { title: "购物车", type: "goodsCart" },
        { title: "订单", type: "orders" },
        { title: "个人", type: "mine" }
        //{ title: "资讯", type: "news" },
      ]
    };
  },
  props: {
    active: {
      type: String,
      default: "index"
    }
  },
  computed: {
    ...mapState(["openId"])
  },
  methods: {
    // 跳转大导航
    pageToBar(item, index) {
      if (item.type !== this.actBar) {
        if (item.type === "index") {
          this.$router.push({
            path: "/index",
          //  query: { open_id: this.openId }
          });
        }
        else if (item.type === "orders") {
          this.$router.push({
            path: "/store/orders",
            query: {
              //status: '[10,20,30,40,50,60]',
            }
          });
        }else if (item.type === "goodsCart") {
          this.$router.push({
            path: "/store/cart"
          });
        }else {
          this.$router.push("/" + item.type);
        }
      }
    }
  }
};
</script>

<style lang="stylus">
.v-footer {
  position: fixed;
  z-index: 20;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  height: 50px;
  border-top: 1px solid #DCDCDC;

  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 11px;

    .ico {
      width: 20px;
      height: 20px;
      margin-bottom:3px;
    }

    .i-index {
      background-image: url('../assets/images/index.png');
    }

    .i-vGoods {
      background-image: url('../assets/images/v.png');
    }
    
    .i-goodsCart {
      background-image: url('../assets/images/cart.png');
    }
    .i-storeVideo {
      background-image: url('../assets/images/video.png');
    }
    .i-mine {
      background-image: url('../assets/images/user.png');
    }

    .i-nearby {
      background-image: url('../assets/images/nearby.png');
    }
    .i-orders {
      background-image: url('../assets/images/order.png');
    }

    &.active {
      color: #FF4F00;

      .i-index {
        background-image: url('../assets/images/index1.png');
      }

      .i-vGoods {
        background-image: url('../assets/images/v1.png');
      }
      .i-storeVideo {
        background-image: url('../assets/images/video-act.png');
      }
      .i-goodsCart {
        background-image: url('../assets/images/cart1.png');
      }

      .i-mine {
        background-image: url('../assets/images/user1.png');
      }

      .i-nearby {
        background-image: url('../assets/images/nearby1.png');
      }
      .i-orders {
        background-image: url('../assets/images/order1.png');
      }

    }
  }
}
</style>
