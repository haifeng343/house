const monitorApi = require('../../api/monitorApi.js')
const util = require('../../utils/util.js')
Page({
  data: {
    allCount: 0,
    showCount: 0,
    averagePrice: 0,
    lowPrice: 0,
    lowPriceData: '',
    tjFilterCount: [],
    xzFilterCount: [],
    mnFilterCount: [],
    zgFilterCount: [],
    isMonitorHouse: 0, //1;不可收藏；0；可收藏
    stopDisplay: 'none',
    bottomType: 0,
    monitorenoughDisplay: 'none',
    monitorDisplay: 'none',
    publicDisplay:'none',
    updateMonitorDisplay: 'none',
    fee: 0,
    sort: false,
    enoughList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const app = getApp();
    let data = app.globalData.houseListData
    let fee = wx.getStorageSync('hourMoney') || 0
    for (let i = 0; i < data.enoughList.length;i++){
      if (data.enoughList[i].key == 'tj'){
        data.enoughList[i]['selectCount'] = data.tjFilterCount.length
        data.enoughList[i]['lowPriceData'] = data.tjLowPriceData
      }
      if (data.enoughList[i].key == 'xz') {
        data.enoughList[i]['selectCount'] = data.xzFilterCount.length
        data.enoughList[i]['lowPriceData'] = data.xzLowPriceData
      }
      if (data.enoughList[i].key == 'mn') {
        data.enoughList[i]['selectCount'] = data.mnFilterCount.length
        data.enoughList[i]['lowPriceData'] = data.mnLowPriceData
      }
      if (data.enoughList[i].key == 'zg') {
        data.enoughList[i]['selectCount'] = data.zgFilterCount.length
        data.enoughList[i]['lowPriceData'] = data.zgLowPriceData
      }
    }
    this.setData({
      allCount: data.allCount,
      showCount: data.showCount,
      averagePrice: data.averagePrice,
      lowPrice: data.lowPrice,
      lowPriceData: data.lowPriceData,
      enoughList: data.enoughList,
      tjFilterCount: data.tjFilterCount,
      xzFilterCount: data.xzFilterCount,
      mnFilterCount: data.mnFilterCount,
      zgFilterCount: data.zgFilterCount,
      ddCoin: data.ddCoin || 0,
      bindPhone: data.bindPhone || false,
      bindPublic: data.bindPublic || false,
      isMonitorHouse: data.isMonitorHouse || 0,
      bottomType: data.bottomType || 0,
      taskTime: data.taskTime || '',
      startTimeName: data.startTimeName || '',
      fee: data.fee || '',
      monitorId: data.monitorId || '',
      totalFee: data.totalFee || '', //消耗盯盯币
      defaultBeginDate: app.globalData.monitorDefaultData.beginDate,
      defaultEndDate: app.globalData.monitorDefaultData.endDate,
      defaultCityName: app.globalData.monitorDefaultData.city,
      defaultLocationName: app.globalData.monitorDefaultData.area || '--',
      defaultMInPrice: app.globalData.monitorDefaultData.minPrice,
      defaultMaxPrice: app.globalData.monitorDefaultData.maxPrice,
      beginDate: app.globalData.monitorSearchData.beginDate,
      endDate: app.globalData.monitorSearchData.endDate,
      cityName: app.globalData.monitorSearchData.city,
      locationName: app.globalData.monitorSearchData.area || '--',
      updateMinPrice: app.globalData.monitorSearchData.minPrice,
      updateMaxPrice: app.globalData.monitorSearchData.maxPrice,
      sort: data.sortType==2?false:true,
      fee
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 立即开始----开启监控
   */
  getUserInfoFun: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        that.getDdCoin()
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  /**
   * 立即开始----开启监控
   */
  startMonitor() {
    let count = this.data.allCount
    if (count >= 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '房源充足',
        dialogText: '符合条件的房源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体房源。',
        dialogBtn: '知道了',
        maskShow: true,
      })
    } else {
      const app = getApp()
      if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
        wx.navigateTo({
          url: '../bindPhone/bindPhone'
        })
        return;
      }
      this.setData({
        monitorDisplay: 'block',
        maskShow: true,
      })
    }
  },
  /**
   * 立即开始----开启监控取消
   */
  getMonitorEvent(e) {
    this.setData({
      monitorDisplay: e.detail,
    })
  },
  /**
   * 立即开始----开启监控确认
   */
  getmonitorConfirmEvent(e) {
    this.setData({
      monitorDisplay: e.detail.show,
    })
    this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect)
  },
  /**
   * 立即开始----开启监控--未关注公众号时
   */
  getMonitorPublicEvent(e) {
    this.setData({
      monitorDisplay: 'none',
      publicDisplay: e.detail
    })
  },
  /**
   * 公众号隐藏
   */
  getPublicEvent(e) {
    this.setData({
      publicDisplay: e.detail,
      monitorDisplay:'block'
    })
  },
  getPublicConfrimEvent(e) {
    this.setData({
      publicDisplay: e.detail,
    })
    wx.navigateTo({
      url: '../public/public',
    })
  },
  /**
   * 添加监控，开启监控
   */
  getStartMonitor(noteSelect, publicSelect) {
    const app = getApp()
    let data = {
      beginDate: app.globalData.searchData.beginDate, //入住日期
      endDate: app.globalData.searchData.endDate,    //离开日期
      cityType: 0, //城市类型，0-国内城市，1-国际城市
      cityName: app.globalData.searchData.city,//城市名称
      //locationName: '',//位置名称
      //locationType: 11,//位置类型11景区，12高校，13机场，14医院，15商圈，16行政区，17地铁 ，18车站
      peopleNum: app.globalData.searchData.gueseNumber,
      rentType: app.globalData.searchData.leaseType, //出租类型,2单间出租，1整套出租 不选择 '' 
      //layoutRoom 户型
      //facilities 配套设备
      minPrice: Number(app.globalData.searchData.minPrice),
      maxPrice: Number(app.globalData.searchData.maxPrice),
      sortType: app.globalData.searchData.sort,
      //notice 
      //fddShortRentBlock 
    }
    if (app.globalData.searchData.area) {
      data.locationName = app.globalData.searchData.area
    }
    if (app.globalData.searchData.areaType) {
      data.locationType = app.globalData.searchData.areaType
    }
    //通知方式
    let notice = []
    if (noteSelect) {
      notice.push(2)
    }
    if (publicSelect) {
      notice.push(1)
    }
    data.notice = notice.join(',')
    //户型
    let layoutRoom = [];
    if (app.globalData.searchData.houseType && app.globalData.searchData.houseType.length) {
      data.layoutRoom = app.globalData.searchData.houseType.join(',')
    }
    //配套设施
    if (app.globalData.searchData.equipment && app.globalData.searchData.equipment.length) {
      data.facilities = app.globalData.searchData.equipment.join(',')
    }
    console.log(data)
    let tjId = [...this.data.tjFilterCount]
    let xzId = [...this.data.xzFilterCount]
    let mnId = [...this.data.mnFilterCount]
    let zgId = [...this.data.zgFilterCount]
    let obj = wx.getStorageSync('collectionObj') || {};

    if (obj && obj['tj'] && obj['tj'].length) {
      for (let i = 0; i < obj['tj'].length; i++) {
        let index = tjId.indexOf(obj['tj'][i])
        tjId.splice(index, 1)
      }
    }
    if (obj && obj['xz'] && obj['xz'].length) {
      for (let i = 0; i < obj['xz'].length; i++) {
        let index = xzId.indexOf(obj['xz'][i])
        xzId.splice(index, 1)
      }
    }
    if (obj && obj['mn'] && obj['mn'].length) {
      for (let i = 0; i < obj['mn'].length; i++) {
        let index = mnId.indexOf(obj['mn'][i])
        mnId.splice(index, 1)
      }
    }
    if (obj && obj['zg'] && obj['zg'].length) {
      for (let i = 0; i < obj['zg'].length; i++) {
        let index = zgId.indexOf(obj['zg'][i])
        zgId.splice(index, 1)
      }
    }
    let fddShortRentBlock = {}
    fddShortRentBlock.tj = tjId
    fddShortRentBlock.xz = xzId
    fddShortRentBlock.mn = mnId
    fddShortRentBlock.zg = zgId
    data.fddShortRentBlock = fddShortRentBlock
    monitorApi.addMonitor(data).then(res => {
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      })
      wx.switchTab({
        url: '../monitor/monitor'
      })
    })
  },

  
  /**
   * 结束监控
   */
  stopMonitor() {
    this.setData({
      stopDisplay: 'block',
    })
  },
  /**
   * 继续监控
   */
  getstopEventEvent(e) {
    this.setData({
      stopDisplay: e.detail,
    })
  },
  /**
   * 结束监控确认
   */
  getstopConfirmEventEvent(e) {
    let data = {
      monitorId: this.data.monitorId,
    }
    monitorApi.endMonitor(data).then(res => {
      if (res.data.success) {
        wx.showToast({
          title: res.data.resultMsg,
          icon: 'success',
          duration: 2000
        })
        this.setData({
          stopDisplay: e.detail,
        })
        wx.navigateBack({
          delta: 2
        })
      }
    })
  },
  goBack() {
    //返回到监控列表页面
    wx.navigateBack({
      delta: 2
    })
  },
  //保存修改
  goSave() {
    let count = this.data.allCount
    if (count >= 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '房源充足',
        dialogText: '符合条件的房源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体房源。',
        dialogBtn: '知道了'
      })
    } else {
      this.setData({
        updateMonitorDisplay: 'block',
      })
    }
    

  },
  //保存修改 --取消，再看看
  getUpdateCancelEvent(e) {
    this.setData({
      updateMonitorDisplay: e.detail,
    })
  },

  //保存修改 --确认
  getUpdateConfrimEvent(e) {
    let data = {
      id: this.data.monitorId,
      beginDate: app.globalData.monitorSearchData.beginDate, //入住日期
      endDate: app.globalData.monitorSearchData.endDate,    //离开日期
      cityType: 0, //城市类型，0-国内城市，1-国际城市
      cityName: app.globalData.monitorSearchData.city,//城市名称
      //locationName: '',//位置名称
      //locationType: 11,//位置类型11景区，12高校，13机场，14医院，15商圈，16行政区，17地铁 ，18车站
      peopleNum: app.globalData.monitorSearchData.gueseNumber,
      rentType: app.globalData.monitorSearchData.leaseType, //出租类型,2单间出租，1整套出租 不选择 '' 
      //layoutRoom 户型
      //facilities 配套设备
      minPrice: Number(app.globalData.monitorSearchData.minPrice),
      maxPrice: Number(app.globalData.monitorSearchData.maxPrice),
      sortType: app.globalData.monitorSearchData.sort,
      //fddShortRentBlock 
    }
    if (app.globalData.monitorSearchData.area) {
      data.locationName = app.globalData.monitorSearchData.area
    }
    if (app.globalData.monitorSearchData.areaType) {
      data.locationType = app.globalData.monitorSearchData.areaType
    }

    //户型
    let layoutRoom = [];
    if (app.globalData.monitorSearchData.houseType && app.globalData.monitorSearchData.houseType.length) {
      data.layoutRoom = app.globalData.monitorSearchData.houseType.join(',')
    }
    //配套设施
    if (app.globalData.monitorSearchData.equipment && app.globalData.monitorSearchData.equipment.length) {
      data.facilities = app.globalData.monitorSearchData.equipment.join(',')
    }
    let tjId = [...this.data.tjFilterCount]
    let xzId = [...this.data.xzFilterCount]
    let mnId = [...this.data.mnFilterCount]
    let zgId = [...this.data.zgFilterCount]
    let obj = wx.getStorageSync('collectionObj') || {};

    if (obj && obj['tj'] && obj['tj'].length) {
      for (let i = 0; i < obj['tj'].length; i++) {
        let index = tjId.indexOf(obj['tj'][i])
        tjId.splice(index, 1)
      }
    }
    if (obj && obj['xz'] && obj['xz'].length) {
      for (let i = 0; i < obj['xz'].length; i++) {
        let index = xzId.indexOf(obj['xz'][i])
        xzId.splice(index, 1)
      }
    }
    if (obj && obj['mn'] && obj['mn'].length) {
      for (let i = 0; i < obj['mn'].length; i++) {
        let index = mnId.indexOf(obj['mn'][i])
        mnId.splice(index, 1)
      }
    }
    if (obj && obj['zg'] && obj['zg'].length) {
      for (let i = 0; i < obj['zg'].length; i++) {
        let index = zgId.indexOf(obj['zg'][i])
        zgId.splice(index, 1)
      }
    }
    let fddShortRentBlock = {}
    fddShortRentBlock.tj = tjId
    fddShortRentBlock.xz = xzId
    fddShortRentBlock.mn = mnId
    fddShortRentBlock.zg = zgId
    data.fddShortRentBlock = fddShortRentBlock
    monitorApi.updateMonitor(data).then(res => {
      console.log(res)
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      })
      this.setData({
        updateMonitorDisplay: e.detail,
      })
      wx.navigateBack({
        delta: 2
      })
    })
  },


  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail,
    })
  },

})