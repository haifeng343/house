import * as rxjs from "../../utils/rx";
const monitor = require("../../utils/monitor.js");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{//区别 1.短租 2.长租的品牌中介 3.长租的个人房源 4.二手房
      type:Number
    },
    imgUrls:{
      type:Array
    },
    title:{
      type:String
    },
    tags:{
      type:Array
    },
    Landlord:{
      type:Object
    },
    checkInNotice:{
      type:Object
    },
    bottomObject:{
      type:Object
    },
    surroundings:{
      type:Object
    },
    facility:{
      type:Object
    },
    houseDetails:{
      type:Object
    },
    houseListData:{
      type:Object
    },
    platform:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls:[],//轮播图
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    circular: true,//循环播放
    current: 0, //初始化时第一个显示的图片 下标值（从0）index

    title:'',//标题
    Landlord:{},//房主信息
    checkInNotice:{},//入住须知
    bottomObject:{},//短租地步数据 money单价  dayCount几晚
    surroundings:{},//短租环境
    facility:{},//短租配套设施
    houseDetails:{},//除短租外的房源详情信息

    navbarIndex:1,//默认选中房源特色的核心卖点
    navbar:[//房源特色导航栏
      {
        index:1,
        name:'核心卖点'
      },
      {
        index:2,
        name:'周边配套'
      }
    ],
    platform:'',//平台
    houseListData:{},//
    houseSortData:{},//短租传递的参数
    houseLongData:{},//长租传递的参数

    houseSecondData:{},//二手房缓存的详情
  },
    lifetimes:{
      ready(){
        this.setData({
          houseSortData : app.globalData.houseSortData,
          houseLongData : app.globalData.houseLongData,
          houseSecondData : app.globalData.houseSecondData,
        })
        console.log(this.data.houseLondData)
      }
    },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange: function (e) {
      this.setData({
        current: e.detail.current
      })
    },
    navbarChange(e){
      this.setData({
        navbarIndex:e.currentTarget.dataset.index
      })
    },
    goToPlatformDetail(e) {
      console.log(e)
      let platform = e.currentTarget.dataset.platform;
      let productid = e.currentTarget.dataset.productid;
      let beginDate = this.properties.houseListData.beginDate;
      let endDate = this.properties.houseListData.endDate;
      if(this.properties.type==1){
        monitor.navigateToMiniProgram(platform, productid, beginDate, endDate);
      }else if(this.properties.type==2 || this.properties.type==3){
        let city = JSON.parse(decodeURIComponent(e.currentTarget.dataset.city));
        monitor.navigateToLongMiniProgram(platform, productid, city);
      }else if(this.properties.type==4){
        let city = JSON.parse(decodeURIComponent(e.currentTarget.dataset.city));
        monitor.navigateToSecondMiniProgram(platform, productid, city);
      }
    },
  }
})
