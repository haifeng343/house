const monitor = require("../../utils/monitor.js");
const monitorApi = require('../../api/monitorApi.js');
const userApi = require('../../api/userApi.js')
const app = getApp();
Page({
  data: {
    data:[],
    monitorStopDisplay:'none',
    monitorEndDisplay:'none',
    monitorStartDisplay:'none',
    ddCoin:0,
    active:1
  },
  onLoad: function (options) {
  },
  onShow:function(){
    let token = wx.getStorageSync('token');
    if (token) {
      if (app.switchRent == 1 || !app.switchRent) { 
        this.setData({active:1,data:[]})
        this.getMonitorData()
      }
      if (app.switchRent == 2) {
        this.setData({ active: 2,data: [] })
        this.getLongMonitorData()
      }
      if (app.switchRent == 3) {
        this.setData({ active: 3, data: [] })
        // this.getLongMonitorData()
      }
      this.getUserInfo()
    } else {
      this.setData({
        show: 0
      })
    }
  },
  monitorChange(e){
    var index = e.currentTarget.dataset.index;
    console.log(index)
    let token = wx.getStorageSync('token');
    if(token){
      if (index === '1' && this.data.active != index) {
        // app.switchRent = 2
        this.setData({
          active: 1
        })
        this.getMonitorData()
      }
      if (index === '2' && this.data.active != index) {
        // app.switchRent = 1
        this.setData({
          active: 2
        })
        this.getLongMonitorData()
      }

      if (index === '3' && this.data.active != index) {
        this.setData({
          show: 0,
          active: 3
        })
      }
    }else{
      this.setData({
        show: 0,
      })
    }
  },
  getLongMonitorData(){
    let data = {}
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    monitorApi.getMonitorLongList(data).then(res => {
      wx.hideLoading();
      if (res.data.data.length) {
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].dayNum = monitor.setDay(res.data.data[i].monitorTime)
          res.data.data[i].hourNum = monitor.setHour(res.data.data[i].monitorTime)
          res.data.data[i].index = i
          res.data.data[i].longRentType = 2
          //res.data.data[i].status = 11
        }
        this.setData({
          data: res.data.data,
          show: 1
        })
      } else {
        this.setData({
          show: 0
        })
      }
    })
  },
  getMonitorData(){
    let data={}
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    monitorApi.getMonitorList(data).then(res => {
      wx.hideLoading();
      if (res.data.data.length) {
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].beginDay = monitor.setDate(res.data.data[i].beginDate)
          res.data.data[i].endDay = monitor.setDate(res.data.data[i].endDate)
          res.data.data[i].dayNum = monitor.setDay(res.data.data[i].monitorTime)
          res.data.data[i].hourNum = monitor.setHour(res.data.data[i].monitorTime)
          res.data.data[i].index = i
          res.data.data[i].longRentType = 1
        }
        this.setData({
          data: res.data.data,
          show: 1
        })
      } else {
        this.setData({
          show: 0
        })
      }
    })
  },
  /**
   * 获取用户信息，盯盯币，是否绑定微信公众号 和 手机绑定
   */
  getUserInfo() {
    let data = {}
    userApi.userInfo(data).then(res => {
      this.setData({
        ddCoin: res.data.data.coinAccount.useCoin,
      })
    })
  },
  /**
   * 监控删除弹窗
   */
  delItem(e){
    var item = this.data.data[e.detail.index]
    let deleteItem={
      startTimeName: item.startTime?monitor.startTimeName(item.startTime):'',
      createTime: monitor.startTimeName(item.createTime),
      taskTime: monitor.taskTime(item.monitorTime, item.minutes),
      fee:item.fee,
      totalFee: item.totalFee||0,
      id:item.id
    }
    //未开启-无监控开始时间，消费记录；已过期-无监控开始时间，消费记录
    if (!item.startTime && (item.status == 12 || item.status == 0)){
      this.setData({
        monitorEndDisplay: 'block',
        deleteItem
      })
    }else{
      this.setData({
        monitorStopDisplay: 'block',
        deleteItem
      })
    }
    
  },
  getmonitorStopEvent(e){
    this.setData({
      monitorStopDisplay: e.detail,
    })
  },
  /**
   * 监控删除确认--已开启有监控记录
   */
  getmonitorConfirmEvent(e){
    let data={
      monitorId: this.data.deleteItem.id
    }
    if(this.data.active == 1){
      monitorApi.endMonitor(data).then(res => {
        if (res.data.success) {
          wx.showToast({
            title: res.data.resultMsg,
            icon: 'success',
            duration: 2000
          })
          this.setData({
            monitorStopDisplay: e.detail,
            data: []
          })
          this.getMonitorData();
        }
      })
    }
    if (this.data.active == 2) {
      monitorApi.endLongMonitor(data).then(res => {
        if (res.data.success) {
          wx.showToast({
            title: res.data.resultMsg,
            icon: 'success',
            duration: 2000
          })
          this.setData({
            monitorStopDisplay: e.detail,
            data: []
          })
          this.getLongMonitorData();
        }
      })
    }
    
  },
  getmonitorEndEvent(e){
    this.setData({
      monitorEndDisplay: e.detail,
    })
  },
  /**
   * 监控删除确认--未开启无监控任务
   */
  getmonitorEndConfirmEvent(e){
    let data = {
      monitorId: this.data.deleteItem.id
    }
    if(this.data.active == 1){
      monitorApi.endMonitor(data).then(res => {
        if (res.data.success) {
          wx.showToast({
            title: res.data.resultMsg,
            icon: 'success',
            duration: 2000
          })
          this.setData({
            monitorEndDisplay: e.detail,
            data: []
          })
          this.getMonitorData();
        }
      })
    }
    if (this.data.active == 2) {
      monitorApi.endLongMonitor(data).then(res => {
        if (res.data.success) {
          wx.showToast({
            title: res.data.resultMsg,
            icon: 'success',
            duration: 2000
          })
          this.setData({
            monitorEndDisplay: e.detail,
            data: []
          })
          this.getLongMonitorData();
        }
      })
    }
  },
  /**
   * 立即充值，跳转到充值页面
   */
  recharge(e){
    var type = e.detail.type
    wx.navigateTo({
      url: `/pages/deposit/deposit?type=${type}`
    });
  },

  getmonitorStartEvent(e){
    this.setData({
      monitorStartDisplay: e.detail,
    })
  },
  getmonitorStartConfirmEvent(e){
    this.setData({
      monitorStartDisplay: e.detail,
    })
    this.getMonitorStart()
  },
  //立即开启
  getMonitorStart(){
    let data = {
      monitorId: this.data.startItem.id
    }
    wx.showLoading({
      title: '正在开启监控...',
      mask: true
    });
    if(this.data.active == 1){
      monitorApi.startMonitor(data).then(res => {
        wx.hideLoading();
        if (res.data.success) {
          wx.showToast({
            title: res.data.resultMsg,
            icon: 'success',
            duration: 2000
          })
          this.getMonitorData();
        }
      })
    }
    if (this.data.active == 2) {
      monitorApi.startLongMonitor(data).then(res => {
        wx.hideLoading();
        if (res.data.success) {
          wx.showToast({
            title: res.data.resultMsg,
            icon: 'success',
            duration: 2000
          })
          this.getLongMonitorData();
        }
      })
    }
    
  },
  /**
   * 立即开启弹窗
   */
  openTask(e){
    var item = this.data.data[e.detail.index]
    this.setData({
      monitorStartDisplay: 'block',
      startItem: item
    })
  },
  /**
   * 点击整个灰色卡片事件
   */
  goToClick(e){
    var type = e.detail.type
    var item = this.data.data[e.detail.index]
    if (item.status == 12){
      this.delItem(e)
    }
    if ((item.status == 11 || item.status == 0) && this.data.ddCoin<item.fee) {
      wx.navigateTo({
        url: `/pages/deposit/deposit?type=${type}`
      });
    }
    if ((item.status == 11 || item.status == 0) && this.data.ddCoin >= item.fee) {
      this.openTask(e)
    }
  },
  /**
   * 查看详情
   */
  checkDetail(e){
    var item = this.data.data[e.detail.index]
    app.switchRent = this.data.active
    if(this.data.active == 1){
      app.globalData.monitorSearchData = {
        cityType: "",
        area: "",
        areaId: {}, //存各个平台数据信息
        areaType: "",
        city: "", //城市名
        cityId: {}, //城市ID
        cityJson: "",
        positionJson: "",
        beginDate: "", //开始日期
        endDate: "", //离开日期
        dayCount: 0,
        gueseNumber: 1, //入住人数
        leaseType: "", //房间类型  2单间 1整租
        houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
        minPrice: 0, //最低价
        maxPrice: 99999, //最高价
        sort: 2, //搜索方式 1推荐 2低价有限
        equipment: [],
        advSort: 1,//2 从低到高 3高到底
      }
      app.globalData.monitorDefaultData = {
        cityType: "",
        area: "",
        areaId: {},
        ltude: {},
        areaType: "",
        city: "", //城市名
        cityId: {}, //城市ID
        cityJson: "",
        positionJson: "",
        beginDate: "", //开始日期
        endDate: "", //离开日期
        dayCount: 0,
        gueseNumber: 1, //入住人数
        leaseType: "", //房间类型  2单间 1整租
        houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
        minPrice: 0, //最低价
        maxPrice: 99999, //最高价
        sort: 2, //搜索方式 1推荐 2低价有限
        equipment: [],
        advSort: 1,//2 从低到高 3高到底
      }
      app.globalData.monitorData = {
        item: item
      }
      wx.navigateTo({
        url: '../monitorList/monitorList',
      })
    }
    
    if(this.data.active == 2){
      app.globalData.monitorSearchLongData={
        chooseType: 1, //1品牌中介，2个人房源
        city: "", //城市名
        cityId: {}, //城市ID
        cityJson: "",
        area: "", // 地点
        areaId: {}, //地点标识
        areaType: 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
        areaJson: "", //json
        longBuildAreas: -1, //0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
        longFloorTypes: [], //1: 低楼层, 2: 中楼层, 3: 高楼层
        longHeadings: [], //{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
        longHouseTags: [], //1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
        longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
        longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
        longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
        minPrice: 0, //最低价
        maxPrice: 5500, //最高价 不限99999
        advSort: 0,//1 价格从低到高 2面积高到底 11 价格从高到低 21 面积从低到高 
      }
      app.globalData.monitorDefaultSearchLongData = {
        chooseType: 1, //1品牌中介，2个人房源
        city: "", //城市名
        cityId: {}, //城市ID
        cityJson: "",
        area: "", // 地点
        areaId: {}, //地点标识
        areaType: 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
        areaJson: "", //json
        longBuildAreas: -1, //0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
        longFloorTypes: [], //1: 低楼层, 2: 中楼层, 3: 高楼层
        longHeadings: [], //{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
        longHouseTags: [], //1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
        longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
        longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
        longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
        minPrice: 0, //最低价
        maxPrice: 5500, //最高价 不限99999
        advSort: 0,//1 价格从低到高 2面积高到底 11 价格从高到低 21 面积从低到高 
      }
      app.globalData.monitorLongData = {
        item: item
      }
      wx.navigateTo({
        url: '../monitorLongList/monitorLongList',
      })
    }
  },
  //跳转监控规则页面
  handleGoToRule() {
    app.switchRent = this.data.active
    wx.navigateTo({
      url: '../monitorRule/index',
    })
  }
})