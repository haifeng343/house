const houseApi = require('../../api/houseApi.js');
const userApi = require('../../api/userApi.js');
const monitorApi = require('../../api/monitorApi.js');
const util = require('../../utils/util.js');
const monitor = require('../../utils/monitor.js');
const house = require('../../utils/house.js');
const regeneratorRuntime = require('../../lib/runtime.js');
const app = getApp();
Page({
  data: {
    tjfilter: {},
    xzfilter: {},
    mnfilter: {},
    zgfilter: {},
    tjCount: 0,
    tjIdData: [],
    xzCount: 0,
    xzIdData: [],
    mnCount: 0,
    mnIdData: [],
    zgCount: 0,
    zgIdData: [],
    allCount: 0,
    allData: [],
    allOriginalData: [],
    lowPrice: 0,
    averagePrice: 0,
    lowPriceData: '',
    tjLowPriceData: '',
    xzLowPriceData: '',
    mnLowPriceData: '',
    zgLowPriceData: '',
    showScrollTop: false,
    scrollDetail: 0,
    enoughDisplay: 'none',
    enoughBottomDisplay: 'none',
    monitorDisplay: 'none',
    monitorBottomDisplay: 'none',
    collectDisplay: 'none',
    ddCoin: 0,
    sIndex: 1,
    loadingDisplay: 'block',
    countFlag: '',
    checkInDate: '--', //入住日期
    checkOutDate: '--', //退日期
    cityName: '--',
    locationName: '全城',
    publicDisplay: 'none',
    isBack: false,
    listSortType: 1, //列表排序，1 低到高；2高到低
    showUI: true,
    y: 0,
    containerHeight: 9999,
    canScroll: true
  },
  topFlag: false,
  cardHeight: 0,
  scrollFlag: true,
  clickSelectItem(e) {
    var type = e.detail.type;
    if (type) {
      this.setData({
        showAdvance: true,
        showAdvanceType: type,
        canScroll: false
      });
    } else {
      this.setData({
        showAdvance: false,
        showAdvanceType: 0,
        canScroll: true
      });
    }
  },
  submitAdvance() {
    var houseSelect = this.selectComponent('#houseSelect');
    houseSelect.reSetData();
    console.log('查询完毕');
    this.scrollFlag = false;
    this.setData({
      showAdvance: false,
      canScroll: true,
      loadingDisplay: 'block',
      countFlag: '',
      allData: [],
      y: 0,
      containerHeight: 9999,
      showUI: true
    });
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let tjScreen = house.tjScreenParam(1)
    let xzScreen = house.xzScreenParam(1)
    let mnScreen = house.mnScreenPara(1)
    let zgScreen = house.zgScreenPara(1)
    let x = app.globalData.searchData
    this.setData({
      tjfilter: tjScreen,
      xzfilter: xzScreen,
      mnfilter: mnScreen,
      zgfilter: zgScreen,
      checkInDate: x.beginDate.split('-')[1] +'.' +x.beginDate.split('-')[2],
      checkOutDate: x.endDate.split('-')[1] +'.' +x.endDate.split('-')[2],
      cityName: x.city,
      locationName: x.area || '全城',
      listSortType: 1
    });
    this.getAllData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo();
    this.setData({
      showAdvance: false,
      showAdvanceType: 0,
      canScroll: true
    });
    if (this.data.isBack) {
      this.setData({
        loadingDisplay: 'block',
        countFlag: '',
        allData: [],
        y: 0,
        showUI: true,
        containerHeight: 9999
      });
      this.onLoad();
    }
  },

  handleScroll(event) {
    // 这里虽然写的多了一点,但是把频繁的setData调用减少了很多次
    if (this.scrollFlag === false) {
      this.scrollFlag = true;
      return;
    }
    if (this.topFlag === true) {
      this.topFlag = false;
      return;
    }
    const {
      scrollTop
    } = event.detail;
    if (this.data.showUI === true) {
      this.setData({
        showUI: false
      });
    }
    if (scrollTop > 600 && this.data.showScrollTop === false) {
      this.setData({
        showScrollTop: true
      });
    }
    if (scrollTop < 600 && this.data.showScrollTop === true) {
      this.setData({
        showScrollTop: false
      });
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (
      scrollTop > (this.data.allData.length - 5) * this.cardHeight &&
      this.data.allData.length < this.data.allOriginalData.length
    ) {
      this.doAddDataToArray(scrollTop);
    } else {
      this.timer = setTimeout(() => {
        this.setData({
          showUI: true
        });
      }, 100);
    }
  },

  handleReachBottom() {
    this.setData({
      showUI: true
    });
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.data.allData.length >= 50) {
      this.setData({
        enoughBottomDisplay: 'block',
        canScroll: false
      });
    } else {
      this.setData({
        monitorBottomDisplay: 'block',
        canScroll: false
      });
    }
  },

  doAddDataToArray(scrollTop) {
    if (this.data.allData.length < this.data.allOriginalData.length) {
      const index = this.data.allData.length;
      const endIndex = ~~(scrollTop / this.cardHeight) + 10;
      const addArr = this.data.allOriginalData.slice(
        index,
        Math.min(endIndex, 50)
      );
      const newArr = [].concat(this.data.allData).concat(addArr);
      this.scrollFlag = false;
      this.setData({
        allData: newArr
      });
    }
  },

  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function(res) {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  goTop() {
    this.topFlag = true;
    this.setData({
      y: 0,
      showUI: true,
      showScrollTop: false
    });
  },
  goSort() {
    let arr = [...this.data.allOriginalData];
    if (this.data.listSortType == 2) {
      arr.sort(util.compareSort('finalPrice', 'asc'));
      wx.showToast({
        title: '已按最低价排序',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 1
      });
    } else {
      arr.sort(util.compareSort('finalPrice', 'desc'));
      wx.showToast({
        title: '已按最高价排序',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 2
      });
    }
    this.scrollFlag = false;
    this.setData({
      allOriginalData: arr,
      allData: arr.slice(0, 10),
      loadingDisplay: 'none',
      canScroll: true,
      y: 0,
    });
  },

  async getAllData() {
    wx.removeStorageSync('collectionObj');
    let tjDataObj = await house.getTjData(1, this.data.tjfilter);
    let xzDataObj = await house.getXzData(1, this.data.xzfilter);
    let mnDataObj = await house.getMnData(1, this.data.mnfilter);
    let zgDataObj = await house.getZgData(1, this.data.zgfilter);
    let tjData = tjDataObj.arr;
    let xzData = xzDataObj.arr;
    let mnData = mnDataObj.arr;
    let zgData = zgDataObj.arr;
    this.setData({
      tjCount: tjDataObj.tjCount,
      xzCount: xzDataObj.xzCount,
      mnCount: mnDataObj.mnCount,
      zgCount: zgDataObj.zgCount
    })

    let houseData = house.getHouseData({
      tjCount: tjDataObj.tjCount,
      xzCount: xzDataObj.xzCount,
      mnCount: mnDataObj.mnCount,
      zgCount: zgDataObj.zgCount,
      tjData,
      xzData,
      mnData,
      zgData
    })

    if (houseData.allCount > 0) {
      this.setData({
        countFlag: 1
      });
    } else {
      this.setData({
        countFlag: 0
      });
    }

    this.setData({
      allOriginalData: houseData.allData,
      allData: houseData.allData.slice(0, 5),
      allCount: houseData.allCount,
      averagePrice: houseData.averagePrice,
      lowPrice: houseData.lowPrice,
      lowPriceData: houseData.lowPriceData,
      tjLowPriceData: houseData.tjLowPriceData,
      xzLowPriceData: houseData.xzLowPriceData,
      mnLowPriceData: houseData.mnLowPriceData,
      zgLowPriceData: houseData.zgLowPriceData,
      tjIdData: houseData.tjId,
      xzIdData: houseData.xzId,
      mnIdData: houseData.mnId,
      zgIdData: houseData.zgId,
      loadingDisplay: 'none',
      isBack: false,
      canScroll: true,
      y: 0,
      showUI: true
      },
      () => {
        this.scrollFlag = false;
        if (allData.length > 0) {
          wx.createSelectorQuery()
            .select(`.house_card`)
            .boundingClientRect(rect => {
              this.cardHeight = rect.height + 20; // 高度外加20个像素的margin-bottom
              this.setData({
                containerHeight: this.cardHeight * allData.length + 100
              });
            })
            .exec();
        }
      }
    );
  },

  goToPlatformDetail(e) {
    let platform = e.currentTarget.dataset.platform;
    let productid = e.currentTarget.dataset.productid;
    monitor.navigateToMiniProgram(
      platform,
      productid,
      app.globalData.searchData.beginDate,
      app.globalData.searchData.endDate
    );
  },
  /**
   * 跳转统计详情
   */
  goToDetail() {
    let app = getApp();
    app.globalData.houseListData = {
      allCount: this.data.allCount,
      showCount: this.data.allOriginalData.length,
      averagePrice: this.data.averagePrice,
      lowPrice: this.data.lowPrice,
      lowPriceData: this.data.lowPriceData,
      tjLowPriceData: this.data.tjLowPriceData,
      xzLowPriceData: this.data.xzLowPriceData,
      mnLowPriceData: this.data.mnLowPriceData,
      zgLowPriceData: this.data.zgLowPriceData,
      tjCount: this.data.tjCount,
      xzCount: this.data.xzCount,
      mnCount: this.data.mnCount,
      zgCount: this.data.zgCount,
      tjFilterCount: this.data.tjIdData,
      xzFilterCount: this.data.xzIdData,
      mnFilterCount: this.data.mnIdData,
      zgFilterCount: this.data.zgIdData,
      ddCoin: this.data.ddCoin,
      bindPhone: this.data.bindPhone,
      bindPublic: this.data.bindPublic,
      isBack: false
    };
    wx.navigateTo({
      url: '../statistics/statistics'
    });
  },

  /**
   * 房源收藏
   */
  goToCollection(e) {
    let num = wx.getStorageSync('collectionNum');
    let index = e.currentTarget.dataset.index;
    let pId = this.data.allData[index].platformId;
    let proId = this.data.allData[index].productId;
    house.houseCollection(pId, proId)
    let item = 'allData[' + index + '].collection';
    this.setData({
      [item]: !e.currentTarget.dataset.collection
    });
    if(!num){
      this.setData({
        collectDisplay: 'block',
      });
    }
  },
  getEnoughEvent(e) {
    this.setData({
      enoughDisplay: e.detail,
      canScroll: true
    });
  },
  getBottomEnoughEvent(e) {
    this.setData({
      enoughBottomDisplay: e.detail,
      canScroll: true
    });
  },
  getPublicEvent(e) {
    if (this.data.publicType == 1) {
      this.setData({
        monitorDisplay: 'block',
        publicDisplay: e.detail
      });
    } else {
      this.setData({
        monitorBottomDisplay: 'block',
        publicDisplay: e.detail
      });
    }
  },
  getPublicConfrimEvent(e) {
    this.setData({
      publicDisplay: e.detail
    });
    wx.navigateTo({
      url: '../public/public'
    });
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
    let count = this.data.allOriginalData.length;
    if (count >= 50) {
      this.setData({
        enoughDisplay: 'block',
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
        monitorDisplay: 'block',
      });
    }
  },

  /**
   * 开启监控取消
   */
  getMonitorEvent(e) {
    this.setData({
      monitorDisplay: e.detail
    });
  },
  /**
   * 开启监控确认
   */
  getmonitorConfirmEvent(e) {
    this.setData({
      monitorDisplay: e.detail.show
    });
    this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect);
  },
  /**
   * 开启监控--未关注公众号时
   */
  getMonitorPublicEvent(e) {
    this.setData({
      monitorDisplay: 'none',
      publicDisplay: e.detail,
      publicType: 1 //1开始监控 2拉底监控
    });
  },
  /**
   * 底部开启监控取消
   */
  getMonitorBottomEvent(e) {
    this.setData({
      monitorBottomDisplay: e.detail,
      canScroll: true
    });
  },
  /**
   * 底部开启监控确认
   */
  getmonitorBottomConfirmEvent(e) {
    this.setData({
      monitorBottomDisplay: e.detail.show,
      canScroll: true
    });
    this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect);
  },
  /**
   * 底部开启监控--未关注公众号时
   */
  getMonitorrBottomPublicEvent(e) {
    this.setData({
      monitorBottomDisplay: 'none',
      publicDisplay: e.detail,
      publicType: 2 //1开始监控 2拉底监控
    });
  },
  /**
   * 添加监控，开启监控
   */
  getStartMonitor(noteSelect, publicSelect) {
    let data = {
      beginDate: app.globalData.searchData.beginDate, //入住日期
      endDate: app.globalData.searchData.endDate, //离开日期
      cityType: 0, //城市类型，0-国内城市，1-国际城市
      cityName: app.globalData.searchData.city, //城市名称
      //locationName: '',//位置名称
      //locationType: 11,//位置类型11景区，12高校，13机场，14医院，15商圈，16行政区，17地铁 ，18车站
      peopleNum: app.globalData.searchData.gueseNumber,
      rentType: app.globalData.searchData.leaseType, //出租类型,2单间出租，1整套出租 不选择 ''
      //layoutRoom 户型
      //facilities 配套设备
      minPrice: Number(app.globalData.searchData.minPrice),
      maxPrice: Number(app.globalData.searchData.maxPrice),
      sortType: app.globalData.searchData.sort
      //notice
      //fddShortRentBlock
    };
    if (app.globalData.searchData.area) {
      data.locationName = app.globalData.searchData.area;
    }
    if (app.globalData.searchData.areaType) {
      data.locationType = app.globalData.searchData.areaType;
    }
    //通知方式
    let notice = [];
    if (noteSelect) {
      notice.push(2);
    }
    if (publicSelect) {
      notice.push(1);
    }
    data.notice = notice.join(',');
    //户型
    let layoutRoom = [];
    if (
      app.globalData.searchData.houseType &&
      app.globalData.searchData.houseType.length
    ) {
      data.layoutRoom = app.globalData.searchData.houseType.join(',');
    }
    //配套设施
    if (
      app.globalData.searchData.equipment &&
      app.globalData.searchData.equipment.length
    ) {
      data.facilities = app.globalData.searchData.equipment.join(',');
    }
    let tjId = [...this.data.tjIdData];
    let xzId = [...this.data.xzIdData];
    let mnId = [...this.data.mnIdData];
    let zgId = [...this.data.zgIdData];
    let obj = wx.getStorageSync('collectionObj') || {};

    if (obj && obj['tj'] && obj['tj'].length) {
      for (let i = 0; i < obj['tj'].length; i++) {
        let index = tjId.indexOf(obj['tj'][i]);
        tjId.splice(index, 1);
      }
    }
    if (obj && obj['xz'] && obj['xz'].length) {
      for (let i = 0; i < obj['xz'].length; i++) {
        let index = xzId.indexOf(obj['xz'][i]);
        xzId.splice(index, 1);
      }
    }
    if (obj && obj['mn'] && obj['mn'].length) {
      for (let i = 0; i < obj['mn'].length; i++) {
        let index = mnId.indexOf(obj['mn'][i]);
        mnId.splice(index, 1);
      }
    }
    if (obj && obj['zg'] && obj['zg'].length) {
      for (let i = 0; i < obj['zg'].length; i++) {
        let index = zgId.indexOf(obj['zg'][i]);
        zgId.splice(index, 1);
      }
    }
    let fddShortRentBlock = {};
    fddShortRentBlock.tj = tjId;
    fddShortRentBlock.xz = xzId;
    fddShortRentBlock.mn = mnId;
    fddShortRentBlock.zg = zgId;
    data.fddShortRentBlock = fddShortRentBlock;
    monitorApi.addMonitor(data).then(res => {
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      wx.switchTab({
        url: '../monitor/monitor'
      });
    });
  },

  getcollectEventEvent(e) {
    this.setData({
      collectDisplay: e.detail,
    });
  },
  swiperChange(e) {
    let item = 'allData[' + e.currentTarget.dataset.index + '].curIndex';
    this.setData({
      [item]: e.detail.current + 1
    });
  },
});