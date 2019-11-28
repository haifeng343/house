const monitorApi = require('../../api/monitorApi.js')
const util = require('../../utils/util.js')
const house = require('../../utils/house.js');
const app = getApp();
Page({
  data: {
    allCount: 0,
    showCount: 0,
    averagePrice: 0,
    lowPrice: 0,
    lowPriceData: '',
    stopDisplay: 'none',
    bottomType: 0,
    monitorenoughDisplay: 'none',
    monitorDisplay: 'none',
    publicDisplay:'none',
    updateMonitorDisplay: 'none',
    updateLongDisplay: 'none',
    fee: 0,
    sort: false,
    enoughList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const app = getApp(); //rentType  1短租 2长租
    if (options.rentType == 1){
      wx.setNavigationBarTitle({
        title: '短租-统计信息'
      })
      let data = app.globalData.houseListData;
      let fee = 1;
      if(data.fee){
        fee = data.fee
      }else{
        fee = wx.getStorageSync('hourMoney') || 1
      }
      for (let i = 0; i < data.enoughList.length; i++) {
        if (data.enoughList[i].key == 'tj') {
          data.enoughList[i]['selectCount'] = data.tjFilterData.length
          data.enoughList[i]['lowPriceData'] = data.tjLowPriceData
        }
        if (data.enoughList[i].key == 'xz') {
          data.enoughList[i]['selectCount'] = data.xzFilterData.length
          data.enoughList[i]['lowPriceData'] = data.xzLowPriceData
        }
        if (data.enoughList[i].key == 'mn') {
          data.enoughList[i]['selectCount'] = data.mnFilterData.length
          data.enoughList[i]['lowPriceData'] = data.mnLowPriceData
        }
        if (data.enoughList[i].key == 'zg') {
          data.enoughList[i]['selectCount'] = data.zgFilterData.length
          data.enoughList[i]['lowPriceData'] = data.zgLowPriceData
        }
      }
      this.setData({
        allCount: data.allCount,
        tjCount: data.tjCount,
        xzCount: data.xzCount,
        mnCount: data.mnCount,
        zgCount: data.zgCount,
        showCount: data.showCount,
        averagePrice: data.averagePrice,
        lowPrice: data.lowPrice,
        lowPriceData: data.lowPriceData,
        enoughList: data.enoughList,
        allOriginalData: data.allOriginalData,
        rowData: data.rowData,
        ddCoin: data.ddCoin || 0,
        bindPhone: data.bindPhone || false,
        bindPublic: data.bindPublic || false,
        bottomType: data.bottomType || 0,
        taskTime: data.taskTime || '',
        startTimeName: data.startTimeName || '',
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
        sort: data.sortType == 2 ? false : true,
        fee,
        rentType:1 //1：短租 2：长租
      })
    }
    if (options.rentType == 2){
      wx.setNavigationBarTitle({
        title: '长租-统计信息'
      })
      let data = app.globalData.houseListData
      let fee = 2;
      if (data.fee) {
        fee = data.fee
      } else {
        fee = wx.getStorageSync('hourLongMoney') || 2
      }
      for (let i = 0; i < data.enoughList.length; i++) {
        if (data.chooseType == 1){
          if (data.enoughList[i].key == 'wiwj') {
            data.enoughList[i]['selectCount'] = data.wiwjFilterData.length
            data.enoughList[i]['lowPriceData'] = data.wiwjLowPriceData
          }
          if (data.enoughList[i].key == 'lj') {
            data.enoughList[i]['selectCount'] = data.lianjiaFilterData.length
            data.enoughList[i]['lowPriceData'] = data.lianjiaLowPriceData
          }
        }
        if (data.chooseType == 2) {
          if (data.enoughList[i].key == 'ftx') {
            data.enoughList[i]['selectCount'] = data.fangtianxiaFilterData.length
            data.enoughList[i]['lowPriceData'] = data.fangtianxiaLowPriceData
          }
          if (data.enoughList[i].key == 'tc') {
            data.enoughList[i]['selectCount'] = data.wbtcFilterData.length
            data.enoughList[i]['lowPriceData'] = data.wbtcLowPriceData
          }
        }
      }
      this.setData({
        allCount: data.allCount,
        wiwjCount: data.wiwjCount,
        lianjiaCount: data.lianjiaCount,
        fangtianxiaCount: data.fangtianxiaCount,
        wbtcCount: data.wbtcCount,
        showCount: data.showCount,
        averagePrice: data.averagePrice,
        lowPrice: data.lowPrice,
        lowPriceData: data.lowPriceData,
        highAreaData: data.highAreaData,
        enoughList: data.enoughList,
        allOriginalData: data.allOriginalData,
        rowData: data.rowData,
        ddCoin: data.ddCoin || 0,
        bindPhone: data.bindPhone || false,
        bindPublic: data.bindPublic || false,
        bottomType: data.bottomType || 0,
        taskTime: data.taskTime || '',
        startTimeName: data.startTimeName || '',
        monitorId: data.monitorId || '',
        totalFee: data.totalFee || '', //消耗盯盯币
        sort: data.sortType == 1 ? false : true,
        rentType: 2, //1：短租 2：长租
        fee,
        type: (data.bottomType == 1 || data.bottomType == 2)?2:1
      })
    }
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
        that.getDdCoin()
      },
      fail: function(res) {
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
        monitorTitle: '房源监控确认',
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
  // 立即开始----开启监控确认
  getmonitorConfirmEvent(e) {
    this.setData({
      monitorDisplay: e.detail.show,
    })
    if (this.data.rentType == 1){
      this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect)
    }
    if (this.data.rentType == 2) {
      this.getStartLongMonitor(e.detail.noteSelect, e.detail.publicSelect)
    }
    
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
  // 添加监控，开启监控
  getStartMonitor(noteSelect, publicSelect) {
    let data = {
      noteSelect,
      publicSelect,
      rowData: this.data.rowData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      tjCount: this.data.tjCount,
      xzCount: this.data.xzCount,
      mnCount: this.data.mnCount,
      zgCount: this.data.zgCount,
    }
    let addData = house.addMonitorData(data)
    wx.showLoading({
      title: '正在添加监控...',
      mask: true
    });
    monitorApi.addMonitor(addData).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      })
      app.switchRent = 1;
      wx.switchTab({
        url: '../monitor/monitor'
      })
    })
  },
  getStartLongMonitor(noteSelect, publicSelect) {
    let data = {
      noteSelect,
      publicSelect,
      rowData: this.data.rowData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      wiwjCount: this.data.wiwjCount,
      lianjiaCount: this.data.lianjiaCount,
      fangtianxiaCount: this.data.fangtianxiaCount,
      wbtcCount: this.data.wbtcCount,
    }
    let addData = house.addLongMonitorData(data)
    wx.showLoading({
      title: '正在添加监控...',
      mask: true
    });
    monitorApi.addLongMonitor(addData).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      app.switchRent = 2;
      wx.switchTab({
        url: '../monitor/monitor'
      });
    });
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
    if (this.data.rentType == 1){
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
    }

    if (this.data.rentType == 2){
      monitorApi.endLongMonitor(data).then(res => {
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
    }
    
  },
  goBack() {
    //返回到监控列表页面
    wx.navigateBack({
      delta: 2
    })
  },
  //保存修改
  goSave() {
    let app = getApp()
    let count = this.data.allCount
    if (count >= 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '房源充足',
        dialogText: '符合条件的房源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体房源。',
        dialogBtn: '知道了'
      })
    } else {
      if(this.data.rentType == 1){
        this.setData({
          updateMonitorDisplay: 'block',
        })
      }
      if (this.data.rentType == 2) {
        this.setData({
          updateLongDisplay: 'block',
          updateData: app.globalData.monitorSearchLongData,
          defalutData: app.globalData.monitorDefaultSearchLongData
        })
      }
    }
    

  },
  //保存修改 --取消，再看看
  getUpdateCancelEvent(e) {
    this.setData({
      updateMonitorDisplay: e.detail,
    })
  },
  //保存修改 --确认
  getUpdateConfrimEvent(e){
    this.setData({
      updateMonitorDisplay: e.detail,
    })
    this.getUpdateMonitor()
  },
  
  getUpdateMonitor() {
    let data = {
      monitorId: this.data.monitorId,
      rowData: this.data.rowData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      tjCount: this.data.tjCount,
      xzCount: this.data.xzCount,
      mnCount: this.data.mnCount,
      zgCount: this.data.zgCount,
    }
    let addData = house.updateShortMonitorData(data)
    wx.showLoading({
      title: '正在修改监控...',
      mask: true
    });
    monitorApi.updateMonitor(addData).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      })
      wx.navigateBack({
        delta: 2
      })
    })
  },
  getLongUpdateCancelEvent(e){
    this.setData({
      updateLongDisplay: e.detail,
    })
  },
  getLongUpdateConfrimEvent(e){
    this.setData({
      updateLongDisplay: e.detail,
    })
    this.getUpdateLongMonitor()
  },
  getUpdateLongMonitor() {
    let data = {
      monitorId: this.data.monitorId,
      rowData: this.data.rowData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      wiwjCount: this.data.wiwjCount,
      lianjiaCount: this.data.lianjiaCount,
      fangtianxiaCount: this.data.fangtianxiaCount,
      wbtcCount: this.data.wbtcCount,
    }
    let addData = house.updateLongMonitorData(data)
    wx.showLoading({
      title: '正在修改监控...',
      mask: true
    });
    monitorApi.updateLongMonitor(addData).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      wx.navigateBack({
        delta: 2
      })
    });
  },
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail,
    })
  },

})