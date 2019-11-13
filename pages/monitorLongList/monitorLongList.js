const house = require('../../utils/house.js');
const monitor = require('../../utils/monitor.js');
const monitorApi = require('../../api/monitorApi.js')
const regeneratorRuntime = require('../../lib/runtime.js');
const util = require('../../utils/util.js');
const userApi = require('../../api/userApi.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countFlag: '',
    allOriginalData: [],
    allData: [],
    allCount: 0,
    averagePrice: 0,
    lowPrice: 0,
    lowPriceData: {},
    wiwjLowPriceData: {},
    lianjiaLowPriceData: {},
    wiwjIdData: [],
    lianjiaIdData: [],
    wiwjCount: 0,
    lianjiaCount: 0,
    stopDisplay: 'none',
    monitorEndDisplay:'none',
    loadingDisplay: 'block',
    monitorenoughDisplay: 'none',
    collectDisplay: 'none',
    enoughBottom: false,
    monitorBottom: false
  },
  onLoad: function (options) {
    let data = app.globalData.monitorLongData
    this.setData({
      monitorId: data.item.id,
      monitorItem: data.item,
    })
    this.getMonitorData();
  },
  onShow: function () {
    this.getUserInfo();
  },
  onReachBottom() {
    console.log('到底了')
    this.setData({
      loadingShow: true
    })
    if (this.data.allData.length < this.data.allOriginalData.length) {
      let timers = setTimeout(() => {
        this.addDataToArray()
        clearTimeout(timers)
      }, 500)
    } else {
      this.setData({
        loadingShow: false
      })
      if (this.data.bottomType === 2) {
        if (this.data.allCount >= 50) {
          if (!this.data.enoughBottom) {
            this.setData({
              monitorenoughDisplay: 'block',
              dialogTitle: '哎呀，到底了',
              dialogText: '已看完筛选出的50套房源，各平台 还有更多房源可供选择, 您可以前往继续 查询。',
              dialogBtn: '取消',
              enoughBottom: true,
            });
          } else {
            wx.showToast({
              title: '到底了',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '到底了',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '到底了',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  addDataToArray() {
    if (this.data.allData.length < this.data.allOriginalData.length) {
      const index = this.data.allData.length;
      const addArr = this.data.allOriginalData.slice(index, index + 5);
      const newArr = [].concat(this.data.allData).concat(addArr);
      this.setData({
        allData: newArr,
        loadingShow: false
      })
    }
  },
  goTop() {
    console.log('到顶部')
    const version = wx.getSystemInfoSync().SDKVersion
    if (util.compareVersion(version, '2.7.3') >= 0) {
      wx.pageScrollTo({
        selector: ".block",
        duration: 1500
      })
    } else {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1500
      })
    }
  },
  goRefresh() {
    this.setData({
      loadingDisplay: 'block',
      countFlag: '',
      allData: [],
    });
    this.onLoad()
  },
  goSort() { },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
      scrollIng: true
    })
    let timer = setTimeout(() => {
      if (this.data.scrollTop === e.scrollTop) {
        this.setData({
          scrollTop: e.scrollTop,
          scrollIng: false
        })
        console.log('滚动结束')
        clearTimeout(timer)
      }
    }, 300)
  },

  getMonitorData(){
    let data = {
      monitorId: this.data.monitorId,
    };
    monitorApi.monitorLongDetail(data).then(res => {
      console.log(res)
      if (!res) {
        this.setData({
          loadingDisplay: 'none',
          countFlag: 2,
          countBack: true
        })
        return;
      }
      let houseList = res.data.data.houseList; //监控房源
      let monitorDetail = res.data.data.monitorDetail; //监控条件
      let monitorCount = res.data.data.monitorCount; //监控计算

      if (!monitorCount || !monitorCount.allTotal || monitorCount.allTotal == 0 || houseList.length == 0) {
        this.setData({
          countFlag: 0,
          loadingDisplay: 'none',
          bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
          taskTime: monitor.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
          startTimeName: monitor.startTimeName(monitorDetail.startTime),
          fee: monitorDetail.fee,
          monitorId: monitorDetail.id,
          totalFee: monitorDetail.totalFee, //消耗盯盯币
          allOriginalData: [],
          allData: [],
          allCount: 0
        })
        return;
      }

      let monitorHouseData = house.getMonitorLongHouseData(houseList);//监控房源列表
      let enoughList = [];
      if (monitorDetail.houseSource == 1) {
        if (monitorCount.wiwjTotal > -1) { enoughList.push({ key: 'wiwj', name: '我爱我家', value: monitorCount.wiwjTotal }) }
        if (monitorCount.ljTotal > -1) { enoughList.push({ key: 'lj', name: '贝壳', value: monitorCount.ljTotal }) }
      }
      if (monitorDetail.houseSource == 2){
        if (monitorCount.ftxTotal > -1) { enoughList.push({ key: 'ftx', name: '房天下', value: monitorCount.ftxTotal }) }
        if (monitorCount.tcTotal > -1) { enoughList.push({ key: 'tc', name: '58同城', value: monitorCount.tcTotal }) }
      }
      console.log(monitorHouseData)
      this.setData({
        allOriginalData: monitorHouseData.allData,
        allData: monitorHouseData.allData.slice(0, 5),
        allCount: monitorCount.allTotal,
        averagePrice: monitorHouseData.averagePrice,
        lowPrice: monitorHouseData.lowPrice,
        highAreaData: monitorHouseData.highAreaData,
        lowPriceData: monitorHouseData.lowPriceData,
        wiwjLowPriceData: monitorHouseData.wiwjLowPriceData,
        ljLowPriceData: monitorHouseData.ljLowPriceData,
        ftxLowPriceData: monitorHouseData.ftxLowPriceData,
        wbtcLowPriceData: monitorHouseData.wbtcLowPriceData,
        enoughList,
        wiwjCount: monitorCount.wiwjTotal,
        ljCount: monitorCount.ljTotal,
        ftxCount: monitorCount.ftxTotal,
        tcCount: monitorCount.tcTotal,
        wiwjIdData: monitorHouseData.wiwjId,
        ljIdData: monitorHouseData.ljId,
        ftxIdData: monitorHouseData.ftxId,
        tcIdData: monitorHouseData.wbtcId,
        isMonitorHouse: 1, //1;不可收藏；0；可收藏
        taskTime: monitor.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
        startTimeName: monitor.startTimeName(monitorDetail.startTime),
        fee: monitorDetail.fee,
        monitorId: monitorDetail.id,
        totalFee: monitorDetail.totalFee, //消耗盯盯币
        bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
        loadingDisplay: 'none',
        countFlag: 1,
        sortType: monitorDetail.sortType,
        chooseType: monitorDetail.houseSource,
      })
    })
  },
  async getAllBrandData() {
    let enoughList = [];
    let wiwjDataObj = await house.getWiwjData();
    let lianjiaDataObj = await house.getLianjiaData()
    if (wiwjDataObj.network && lianjiaDataObj.network) {
      this.setData({
        loadingDisplay: 'none',
        countFlag: 2,
      })
      return;
    }
    let wiwjData = wiwjDataObj.arr || [];
    let lianjiaData = lianjiaDataObj.arr || [];
    if (wiwjDataObj.wiwjCount > -1) { enoughList.push({ key: 'wiwj', name: '我爱我家', value: wiwjDataObj.wiwjCount }) }
    if (lianjiaDataObj.lianjiaCount > -1) { enoughList.push({ key: 'lj', name: '贝壳', value: lianjiaDataObj.lianjiaCount }) }
    enoughList.sort(util.compareSort('value', 'desc'));
    console.log(wiwjDataObj)
    console.log(lianjiaDataObj)
    let houseData = house.getBrandHouseData({
      wiwjCount: wiwjDataObj.wiwjCount,
      lianjiaCount: lianjiaDataObj.lianjiaCount,
      wiwjData,
      lianjiaData,
      type: 1
    })
    console.log(houseData)
    if (houseData.allCount > 0 && houseData.allData.length > 0) {
      this.setData({
        countFlag: 1,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount,
        averagePrice: houseData.averagePrice,
        lowPrice: houseData.lowPrice,
        lowPriceData: houseData.lowPriceData,
        wiwjLowPriceData: houseData.wiwjLowPriceData,
        lianjiaLowPriceData: houseData.lianjiaLowPriceData,
        wiwjIdData: houseData.wiwjId,
        lianjiaIdData: houseData.lianjiaId,
        wiwjCount: wiwjDataObj.wiwjCount,
        lianjiaCount: lianjiaDataObj.lianjiaCount,
        enoughList,
        loadingDisplay: 'none',
      });
    } else {
      this.setData({
        countFlag: 0,
      });
    }
  },
  async getAllPersonalData() {
    let enoughList = [];
    let fangtianxiaDataObj = await house.getFangtianxiaData()
    let wbtcDataObj = await house.getWbtcData()
    if (fangtianxiaDataObj.network && wbtcDataObj.network) {
      this.setData({
        loadingDisplay: 'none',
        countFlag: 2,
      })
      return;
    }
    let fangtianxiaData = fangtianxiaDataObj.arr || [];
    let wbtcData = wbtcDataObj.arr || [];
    if (fangtianxiaDataObj.fangtianxiaCount > -1) { enoughList.push({ key: 'ftx', name: '房天下', value: fangtianxiaDataObj.fangtianxiaCount }) }
    if (wbtcDataObj.wbtcCount > -1) { enoughList.push({ key: 'tc', name: '58同城', value: wbtcDataObj.wbtcCount }) }
    enoughList.sort(util.compareSort('value', 'desc'));
    console.log(fangtianxiaData)
    console.log(wbtcData)
    let houseData = house.getPersonalHouseData({
      fangtianxiaCount: fangtianxiaDataObj.fangtianxiaCount,
      wbtcCount: wbtcDataObj.wbtcCount,
      fangtianxiaData,
      wbtcData,
      type: 1
    })
    console.log(houseData)
    if (houseData.allCount > 0 && houseData.allData.length > 0) {
      this.setData({
        countFlag: 1,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount,
        averagePrice: houseData.averagePrice,
        lowPrice: houseData.lowPrice,
        lowPriceData: houseData.lowPriceData,
        fangtianxiaLowPriceData: houseData.fangtianxiaLowPriceData,
        wbtcLowPriceData: houseData.wbtcLowPriceData,
        fangtianxiaId: houseData.fangtianxiaId,
        wbtcId: houseData.wbtcId,
        fangtianxiaCount: fangtianxiaDataObj.fangtianxiaCount,
        wbtcCount: wbtcDataObj.wbtcCount,
        enoughList,
        loadingDisplay: 'none',
      });
    } else {
      this.setData({
        countFlag: 0,
      });
    }
  },
  /**
   * 获取用户信息，盯盯币，是否绑定微信公众号 和 手机绑定
   */
  getUserInfo() {
    let data = {};
    userApi.userInfo(data).then(res => {
      this.setData({
        ddCoin: res.data.data.coinAccount.useCoin,
        bindPhone: res.data.data.phone, // 是否绑定手机号
        bindPublic: res.data.data.public // 是否绑定公众号
      });
    });
  },
  //跳转统计详情
  goToDetail() {
    const app = getApp()
    app.globalData.houseListData = {
      allCount: this.data.allCount,
      showCount: this.data.allOriginalData.length,
      averagePrice: this.data.averagePrice,
      lowPrice: this.data.lowPrice,
      highAreaData: this.data.highAreaData,
      lowPriceData: this.data.lowPriceData,
      wiwjLowPriceData: this.data.wiwjLowPriceData,
      lianjiaLowPriceData: this.data.ljLowPriceData,
      fangtianxiaLowPriceData: this.data.ftxLowPriceData,
      wbtcLowPriceData: this.data.wbtcLowPriceData,
      enoughList: this.data.enoughList,
      wiwjFilterCount: this.data.wiwjIdData,
      lianjiaFilterCount: this.data.ljIdData,
      fangtianxiaFilterCount: this.data.ftxIdData,
      wbtcFilterCount: this.data.tcIdData,
      bottomType: this.data.bottomType, //0:房源列表；1监控详情房源列表；2监控详情修改之后,
      isMonitorHouse: this.data.isMonitorHouse, //1;不可收藏；0；可收藏
      taskTime: this.data.taskTime,
      startTimeName: this.data.startTimeName,
      fee: this.data.fee,
      monitorId: this.data.monitorId,
      totalFee: this.data.totalFee, //消耗盯盯币
      isBack: false,
      sortType: this.data.sortType,
      chooseType: this.data.chooseType
    }
    wx.navigateTo({
      url: '../statistics/statistics?rentType=2',
    })
  },
  //结束监控
  stopMonitor() {
    this.setData({
      stopDisplay: 'block',
    })
  },
  //继续监控
  getstopEventEvent(e) {
    this.setData({
      stopDisplay: e.detail,
    })
  },
  //结束监控确认
  getstopConfirmEventEvent(e) {
    let data = {
      monitorId: this.data.monitorId,
    }
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
          delta: 1
        })
      }
    })
  },
  //不再关注；添加黑名单
  delItem(e) {
    let item = this.data.allData[e.detail.index]
    this.setData({
      monitorEndDisplay: 'block',
      deleteItem: item
    })
  },
  //取消不再关注
  getmonitorEndEvent(e) {
    this.setData({
      monitorEndDisplay: e.detail,
    })
  },
  //不再关注确认
  getmonitorEndConfirmEvent(e) {
    let data = {
      uniqueId: this.data.deleteItem.housesid,
      monitorId: this.data.monitorId,
      platform: this.data.deleteItem.platformId
    }
    monitorApi.addFddLongRentBlock(data).then(res => {
      if (res.data.success) {
        wx.showToast({
          title: res.data.resultMsg,
          icon: 'success',
          duration: 2000
        })
        this.setData({
          monitorEndDisplay: 'none',
          allData: []
        })
        this.getMonitorData()
      }
    })
  },
  //返回到监控列表页面
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  //房源充足，到底和查看更多弹窗隐藏
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail
    });
  },
  //房源收藏
  goToCollection(e) {
    let num = wx.getStorageSync('collectionNum');
    let index = e.detail.index;
    let pId = this.data.allData[index].platformId;
    let proId = this.data.allData[index].housesid;
    house.houseCollection(pId, proId)
    let item = 'allData[' + index + '].collection';
    this.setData({
      [item]: !this.data.allData[index].collection
    });
    if (!num) {
      this.setData({
        collectDisplay: 'block',
      });
    }
  },
  // 房源收藏确认
  getcollectEventEvent(e) {
    this.setData({
      collectDisplay: e.detail,
    });
  },
  preventTouchMove() { }
})