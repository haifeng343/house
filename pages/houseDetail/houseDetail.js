// pages/houseDetail/houseDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    IsSurroundings:true,//短租 环境为true，其他为false
    surroundings:['整租','29m','酒店式公寓'],//环境
    IsFacility:true,//短租 配套设施
    facility:['无线','WIFI','电视','空调','洗衣机','无线','WIFI','电视','空调','洗衣机','无线','WIFI','电视','空调','洗衣机','无线','WIFI','电视','空调','洗衣机'],//短租配套设施
    IsShowLandlord:true,//房东信息 只有短租为true，其他都为false
    Landlord:{
      img:'../../assets/image/hotel.png',//头像
      name:'董明珠',//姓名
      tags:['实名认证','自营民俗','dsddddddd','实名认证','自营民俗','实名认证','自营民俗'],//标签
      response:'13',//回复率
      duration:'2',//回复时长
    },
    IsCheckInNotice:true,//入住须知 短租为true，其他为false
    checkInNotice:{//入住须知
      startTime:'',
      endTime:'',
      claim:'房东接待',
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
    IsHouseDetail:true,//除短租外的房源详情信息
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
      console.log(app.globalData.searchData);
      let person = app.globalData.searchData;
      this.data.checkInNotice.startTime = person.beginDate;
      this.data.checkInNotice.endTime = person.endDate;
      this.data.bottomObject.dayCount = person.dayCount;
      console.log(this.data.checkInNotice);
      this.setData({
        checkInNotice:this.data.checkInNotice,
        bottomObject:this.data.bottomObject,
      })
      if(this.data.bottomObject.dayCount==0){
        wx.setNavigationBarTitle({
          title: '短租-房源详情',
        })
      }
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