const house = require('../../utils/house.js');
const regeneratorRuntime = require('../../lib/runtime.js');
const util = require('../../utils/util.js');
const userApi = require('../../api/userApi.js');
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
    loadingDisplay: 'block',
    monitorenoughDisplay: 'none',
    collectDisplay: 'none',
    enoughBottom: false,
    monitorBottom: false
  },
  onLoad: function (options) {
    //品牌中介和个人房源区分
    let houseType = 2
    if (houseType == 1) {
      this.getAllBrandData();
    } else {
      this.getAllPersonalData();
    }

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
    if (lianjiaDataObj.lianjiaCount > -1) { enoughList.push({ key: 'lianjia', name: '贝壳', value: lianjiaDataObj.lianjiaCount }) }
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
    if (fangtianxiaDataObj.fangtianxiaCount > -1) { enoughList.push({ key: 'wiwj', name: '房天下', value: fangtianxiaDataObj.fangtianxiaCount }) }
    if (wbtcDataObj.wbtcCount > -1) { enoughList.push({ key: 'lianjia', name: '58同城', value: wbtcDataObj.wbtcCount }) }
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
  //开启监控
  startMonitor() {
    let count = this.data.allCount;
    let app = getApp()
    if (count >= 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '房源充足',
        dialogText: '已帮您甄选' + this.data.allOriginalData.length + '套房源，若想查看更多房源，请点击前往各平台查看',
        dialogBtn: '知道了'
      });
    } else {
      if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
        // 数据绑定手机号，如果未绑定，跳转到手机号绑定页面
        wx.navigateTo({
          url: '../bindPhone/bindPhone'
        });
        return;
      }
      this.setData({
        monitorTitle: '房源监控确认',
      });
    }
  },



  /**
   * 房源充足，到底和查看更多弹窗隐藏
  */
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail
    });
  },
  /**
   * 房源收藏
   */
  goToCollection(e) {
    let num = wx.getStorageSync('collectionNum');
    let index = e.detail.index;
    let pId = this.data.allData[index].platformId;
    let proId = this.data.allData[index].sqid;
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
  /**
   * 房源收藏确认
   */
  getcollectEventEvent(e) {
    this.setData({
      collectDisplay: e.detail,
    });
  },
  preventTouchMove() { }
})