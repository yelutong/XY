const state = {
  openId: '',
  token: '',
  parentId: '',
  userId: '',
  userPhone: '',
  shareId:'',
  proUserId:'',
  weChatInfo: {
    name: '新银众商',
    avatar: require("../assets/images/favicon.png")
  },
  autoAddress: null,
  choseAddress: null,
  // 微信分享信息
  weChatShare: {
    friend: {
      title: "新银众商",
      desc: "新银众商-描述描述！",
      link: "https://mg.xjjxsd.cn/wechat/index.html#/share",
      imgUrl: "https://pic.xjjxsd.cn/static/applet/about/about.jpg"
    },
    friends: {
      title: "新银众商",
      link: "https://mg.xjjxsd.cn/wechat/index.html#/share",
      imgUrl: "https://pic.xjjxsd.cn/static/applet/about/about.jpg"
    }
  }
};

export default state;
