// pages/houseDetail/houseDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,//区别 1.短租 2.长租的品牌中介 3.长租的个人房源 4.二手房
    imgUrls:[
      '../../assets/image/bg.png',
      '../../assets/image/bg.png',
      '../../assets/image/bg.png',
      '../../assets/image/bg.png',
      '../../assets/image/bg.png',
    ],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    circular: true,//循环播放
    current: 0, //初始化时第一个显示的图片 下标值（从0）index

    title:'近西湖浙大灵隐 魅蓝组局民俗风情双人床近西湖浙大灵隐 魅蓝组局民俗风情双人床近西湖浙大灵隐 魅蓝组局民俗风情双人床近西湖浙大灵隐 魅蓝组局民俗风情双人床',
    tags:['近地铁','随时看房','男女合租','近地铁','随时看房','男女合租','近地铁','随时看房','男女合租'],//标签
    surroundings:['整租','29m','酒店式公寓'],//环境
    facility:['无线','WIFI','电视','空调','洗衣机','无线','WIFI','电视','空调','洗衣机','无线','WIFI','电视','空调','洗衣机','无线','WIFI','电视','空调','洗衣机'],//短租配套设施
    Landlord:{
      img:'../../assets/image/hotel.png',//头像
      name:'董明珠',//姓名
      tags:['实名认证','自营民俗','dsddddddd','实名认证','自营民俗','实名认证','自营民俗'],//标签
      response:'13',//回复率
      duration:'2',//回复时长
    },
    checkInNotice:{//入住须知
      startTime:'',
      endTime:'',
      claim:'房东接待',
      money:0,
      tags:[
        {
          isTrue:true,
          text:'接待儿童'
        },
        {
          isTrue:true,
          text:'接待儿童'
        },
        {
          isTrue:true,
          text:'接待儿童'
        },
        {
          isTrue:false,
          text:'接待儿童'
        },
        {
          isTrue:true,
          text:'接待儿童'
        },
      ]
    },
    bottomObject:{
      //短租地步数据
      money:0,//单价
      dayCount:0,//短租 几晚
    },
    houseDetails:[//除短租外的房源详情信息
      {
        tag:'售价',
        number:'445'
      },
      {
        tag:'售价',
        number:'445'
      },
      {
        tag:'售价',
        number:'445'
      },
    ],

    houseListData:{},//短租的传递参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
      
  },
  onLoad:function(options){
    console.log(options)
      this.setData({
        houseListData:Object.assign(this.data.houseListData,options),
      });
      if(options.type==1){
        wx.setNavigationBarTitle({
          title: '短租-房源详情',
        });
      }
  },
  goToSelect(e){
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})