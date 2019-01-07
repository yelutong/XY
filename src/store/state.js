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
      title: "新银众商标题",
      desc: "新银众商-描述描述！",
      link: "http://www.xy999888.com/m/",
      imgUrl: "http://www.xy999888.com/m/static/favicon.png"
    },
    friends: {
      title: "新银众商标题",
      link: "http://www.xy999888.com/m/",
      imgUrl: "http://www.xy999888.com/m/static/favicon.png"
    }
  }
};

export default state;
