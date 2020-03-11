// components/collectDialog/collectDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls:{
      type:Array
    },
    title:{
      type:String
    },
    tags:{
      type:Array
    },
    IsShowLandlord:{
      type:Boolean
    },
    Landlord:{
      type:Object
    },
    checkInNotice:{
      type:Object
    },
    IsCheckInNotice:{
      type:Boolean
    },
    bottomObject:{
      type:Object
    },
    IsSurroundings:{
      type:Boolean
    },
    surroundings:{
      type:Object
    },
    facility:{
      type:Object
    },
    IsFacility:{
      type:Boolean
    },
    IsHouseDetail:{
      type:Boolean
    },
    houseDetails:{
      type:Object
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
    IsShowLandlord:false,//短租为true，其他为false
    Landlord:{},//房主信息
    IsCheckInNotice:false,//入住须知 短租为true 其他为false
    checkInNotice:{},//入住须知
    bottomObject:{},//短租地步数据 money单价  dayCount几晚
    IsSurroundings:false,//短租环境为true，其他为false
    surroundings:{},//短租环境
    facility:{},//短租配套设施
    IsFacility:false,//短租为true 其他为false
    houseDetails:{},//除短租外的房源详情信息
    IsHouseDetail:false,//除短租外的房源详情信息

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
    ]
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
    }
  }
})
