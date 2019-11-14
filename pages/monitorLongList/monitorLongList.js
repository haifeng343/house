const house = require('../../utils/house.js');
const monitor = require('../../utils/monitor.js');
const monitorApi = require('../../api/monitorApi.js')
const regeneratorRuntime = require('../../lib/runtime.js');
const util = require('../../utils/util.js');
const userApi = require('../../api/userApi.js');
import positionService from "../positionLongSelect/service";
const app = getApp();
Page({
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
    fangtianxiaLowPriceData:{},
    wbtcLowPriceData: {},
    wiwjIdData: [],
    lianjiaIdData: [],
    fangtianxiaIdData: [],
    wbtcIdData: [],
    wiwjCount: 0,
    lianjiaCount: 0,
    stopDisplay: 'none',
    monitorEndDisplay:'none',
    loadingDisplay: 'block',
    monitorenoughDisplay: 'none',
    collectDisplay: 'none',
    updateMonitorDisplay: 'none',
    enoughBottom: false,
    monitorBottom: false,
    wiwjfilter:{},
    ljfilter: {},
    ftxfilter: {},
    tcfilter: {},
  },
  onLoad: function (options) {
    let data = app.globalData.monitorLongData
    this.setData({
      monitorId: data.item.id,
    })
    this.getMonitorData();
  },
  onShow: function () {
    this.getUserInfo();
  },
  onHouseShow(){
    let x = app.globalData.monitorSearchLongData
    let wiwjfilter = house.wiwjScreenParam(2);
    let ljfilter = house.ljScreenParam(2);
    let ftxfilter = house.ftxScreenParam(2);
    let tcfilter = house.tcScreenParam(2);
    this.setData({
      listSortType: 1,
      wiwjfilter,
      ljfilter,
      ftxfilter,
      tcfilter,
      chooseType: x.chooseType,//1品牌中介，2个人房源
      longSortTypes: x.longSortTypes //1: 低价优先, 2: 空间优先, 3: 最新发布
    }, () => {
      if (x.chooseType == 1) {
        this.getAllBrandData();
      } else {
        this.getAllPersonalData();
      }
    })
  },
  submit(e) {
    //把改变的值重新
    console.log(e.detail)
    let arr = Object.keys(e.detail);
    if (arr.length) {
      for (let key in e.detail) {
        app.globalData.monitorSearchLongData[key] = e.detail[key]
      }
      this.setData({
        loadingDisplay: 'block',
        countFlag: '',
        allData: [],
        updateData:Object.assign({}, app.globalData.monitorSearchLongData),
      });
      this.onHouseShow()
    }
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
    this.onShow()
  },
  goSort() {
    let arr = [...this.data.allOriginalData]
    let sort = house.sort(arr, this.data.listSortType, 'price')
    if (this.data.listSortType == 2) {
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 1,
      })
    } else {
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 2,
      })
    }
    this.setData({
      allOriginalData: sort.arr,
      allData: sort.arr.slice(0, 5),
      loadingDisplay: 'none',
    })
  },
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
      let monitorCityId = {}
      let cityList = JSON.parse(monitorDetail.cityJson || '{}')
      wx.setNavigationBarTitle({
        title: '长租-' + (monitorDetail.cityName.length > 4 ? monitorDetail.cityName.slice(0, 4) + '...' : monitorDetail.cityName)
      })
      for (let key in cityList) {
        if (key === 'wiwj') {
          monitorCityId.wiwj = cityList.wiwj.code
        } else if (key === 'ftx') {
          monitorCityId.ftx = cityList.ftx
        } else if (key === 'lj') {
          monitorCityId.lj = cityList.lj.city_id
        } else if (key === 'tc') {
          monitorCityId.tc = cityList.tc.dirname
        }
      }
      app.globalData.monitorSearchLongData = {
        chooseType: monitorDetail.houseSource, //1品牌中介，2个人房源
        city: monitorDetail.cityName,//城市名
        cityId: monitorCityId,//城市ID
        cityJson: monitorDetail.cityJson,
        area: monitorDetail.locationName || '',// 地点
        areaId: JSON.parse(monitorDetail.areaJson||{}),//地点标识
        areaType: monitorDetail.locationType,//地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
        areaJson: monitorDetail.searchJson,//json
        longBuildAreas: monitorDetail.buildArea,//0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
        longFloorTypes: monitorDetail.floorType ? monitorDetail.floorType.split(',').map(item => +item) : [],//1: 低楼层, 2: 中楼层, 3: 高楼层
        longHeadings: monitorDetail.heading ? monitorDetail.heading.split(',').map(item => +item) : [],//{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
        longHouseTags: monitorDetail.houseTags ? monitorDetail.houseTags.split(',').map(item => +item) : [],//1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
        longLayouts: monitorDetail.layoutRoom ? monitorDetail.layoutRoom.split(',').map(item => +item) : [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
        longRentTypes: monitorDetail.rentType || 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
        longSortTypes: monitorDetail.sortType || 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
        minPrice: monitorDetail.minPrice,//最低价
        maxPrice: monitorDetail.maxPrice == 99999 ? 10000 : monitorDetail.maxPrice,//最高价 不限99999
      }
      app.globalData.monitorDefaultSearchLongData = {
        chooseType: monitorDetail.houseSource, //1品牌中介，2个人房源
        city: monitorDetail.cityName,//城市名
        cityId: monitorCityId,//城市ID
        cityJson: monitorDetail.cityJson,
        area: monitorDetail.locationName||'',// 地点
        areaId: JSON.parse(monitorDetail.areaJson || {}),//地点标识
        areaType: monitorDetail.locationType,//地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
        areaJson: monitorDetail.searchJson,//json
        longBuildAreas: monitorDetail.buildArea,//0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
        longFloorTypes: monitorDetail.floorType ? monitorDetail.floorType.split(',').map(item => +item) : [],//1: 低楼层, 2: 中楼层, 3: 高楼层
        longHeadings: monitorDetail.heading ? monitorDetail.heading.split(',').map(item=>+item) : [],//{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
        longHouseTags: monitorDetail.houseTags ? monitorDetail.houseTags.split(',').map(item => +item) : [],//1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
        longLayouts: monitorDetail.layoutRoom ? monitorDetail.layoutRoom.split(',').map(item => +item):[], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
        longRentTypes: monitorDetail.rentType||0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
        longSortTypes: monitorDetail.sortType||0, //1: 低价优先, 2: 空间优先, 3: 最新发布
        minPrice: monitorDetail.minPrice,//最低价
        maxPrice: monitorDetail.maxPrice == 99999 ? 10000 : monitorDetail.maxPrice,//最高价 不限99999
      }
      let x = app.globalData.monitorSearchLongData
      new positionService().getSearchHoset(x.city, x.chooseType).then(resp => {
        const positionData = resp.data;
        this.setData({ positionData });
      });
      if (!monitorCount || !monitorCount.allTotal || monitorCount.allTotal == 0 || !houseList ||houseList.length == 0) {
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
          allCount: 0,
          updateData: Object.assign({}, app.globalData.monitorSearchLongData),
          defalutData: Object.assign({}, app.globalData.monitorDefaultSearchLongData),
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
      let num = wx.getStorageSync('monitorLeftNum');
      if (!num) {
        wx.setStorageSync('monitorLeftNum', 1);
        this.setData({
          isFirst:true
        })
      }else{
        this.setData({
          isFirst: false
        })
      }
      this.setData({
        allOriginalData: monitorHouseData.allData,
        allData: monitorHouseData.allData.slice(0, 5),
        allCount: monitorCount.allTotal,
        averagePrice: monitorHouseData.averagePrice,
        lowPrice: monitorHouseData.lowPrice,
        highAreaData: monitorHouseData.highAreaData,
        lowPriceData: monitorHouseData.lowPriceData,
        wiwjLowPriceData: monitorHouseData.wiwjLowPriceData,
        lianjiaLowPriceData: monitorHouseData.ljLowPriceData,
        fangtianxiaLowPriceData: monitorHouseData.ftxLowPriceData,
        wbtcLowPriceData: monitorHouseData.wbtcLowPriceData,
        enoughList,
        wiwjCount: monitorCount.wiwjTotal,
        ljCount: monitorCount.ljTotal,
        ftxCount: monitorCount.ftxTotal,
        tcCount: monitorCount.tcTotal,
        wiwjIdData: monitorHouseData.wiwjId,
        lianjiaIdData: monitorHouseData.ljId,
        fangtianxiaIdData: monitorHouseData.ftxId,
        wbtcIdData: monitorHouseData.wbtcId,
        isMonitorHouse: 1, //1;不可收藏；0；可收藏
        taskTime: monitor.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
        startTimeName: monitor.startTimeName(monitorDetail.startTime),
        fee: monitorDetail.fee,
        monitorId: monitorDetail.id,
        totalFee: monitorDetail.totalFee, //消耗盯盯币
        bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
        loadingDisplay: 'none',
        countFlag: 1,
        longSortTypes: monitorDetail.sortType||'',
        chooseType: monitorDetail.houseSource,
        updateData: Object.assign({}, app.globalData.monitorSearchLongData),
        defalutData: Object.assign({}, app.globalData.monitorDefaultSearchLongData),
      })
    })
  },
  async getAllBrandData() {
    wx.removeStorageSync('collectionObj');
    let enoughList = [];
    let wiwjDataObj = await house.getWiwjData(2, this.data.wiwjfilter);
    let lianjiaDataObj = await house.getLianjiaData(2, this.data.ljfilter)
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
    let houseData = house.getBrandHouseData({
      wiwjCount: wiwjDataObj.wiwjCount,
      lianjiaCount: lianjiaDataObj.lianjiaCount,
      wiwjData,
      lianjiaData,
      type: 1
    })
    if (houseData.allCount > 0 && houseData.allData.length > 0) {
      this.setData({
        countFlag: 1,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount,
        averagePrice: houseData.averagePrice,
        lowPrice: houseData.lowPrice,
        lowPriceData: houseData.lowPriceData,
        highAreaData: houseData.highAreaData,
        wiwjLowPriceData: houseData.wiwjLowPriceData,
        lianjiaLowPriceData: houseData.lianjiaLowPriceData,
        wiwjIdData: houseData.wiwjId,
        lianjiaIdData: houseData.lianjiaId,
        wiwjCount: wiwjDataObj.wiwjCount,
        lianjiaCount: lianjiaDataObj.lianjiaCount,
        enoughList,
        loadingDisplay: 'none',
        enoughBottom: false,
        bottomType: 2,
        isMonitorHouse: 0,
      });
    } else {
      this.setData({
        countFlag: 0,
        loadingDisplay: 'none',
        bottomType: 2,
      });
    }
  },
  async getAllPersonalData() {
    wx.removeStorageSync('collectionObj');
    let enoughList = [];
    let fangtianxiaDataObj = await house.getFangtianxiaData(2, this.data.ftxfilter)
    let wbtcDataObj = await house.getWbtcData(2, this.data.tcfilter)
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
    let houseData = house.getPersonalHouseData({
      fangtianxiaCount: fangtianxiaDataObj.fangtianxiaCount,
      wbtcCount: wbtcDataObj.wbtcCount,
      fangtianxiaData,
      wbtcData,
      type: 1
    })
    if (houseData.allCount > 0 && houseData.allData.length > 0) {
      this.setData({
        countFlag: 1,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount,
        averagePrice: houseData.averagePrice,
        lowPrice: houseData.lowPrice,
        lowPriceData: houseData.lowPriceData,
        highAreaData: houseData.highAreaData,
        fangtianxiaLowPriceData: houseData.fangtianxiaLowPriceData,
        wbtcLowPriceData: houseData.wbtcLowPriceData,
        fangtianxiaIdData: houseData.fangtianxiaId,
        wbtcIdData: houseData.wbtcId,
        fangtianxiaCount: fangtianxiaDataObj.fangtianxiaCount,
        wbtcCount: wbtcDataObj.wbtcCount,
        enoughList,
        loadingDisplay: 'none',
        enoughBottom: false,
        bottomType: 2,
        isMonitorHouse: 0,
      });
    } else {
      this.setData({
        countFlag: 0,
        loadingDisplay: 'none',
        bottomType: 2,
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
      enoughList: this.data.enoughList,
      bottomType: this.data.bottomType, //0:房源列表；1监控详情房源列表；2监控详情修改之后,
      isMonitorHouse: this.data.isMonitorHouse, //1;不可收藏；0；可收藏
      taskTime: this.data.taskTime,
      startTimeName: this.data.startTimeName,
      fee: this.data.fee,
      monitorId: this.data.monitorId,
      totalFee: this.data.totalFee, //消耗盯盯币
      isBack: false,
      sortType: this.data.longSortTypes,
      chooseType: this.data.chooseType
    }
    if (this.data.chooseType == 1){
      app.globalData.houseListData['wiwjLowPriceData'] = this.data.wiwjLowPriceData
      app.globalData.houseListData['lianjiaLowPriceData'] = this.data.lianjiaLowPriceData
      app.globalData.houseListData['wiwjFilterCount'] = this.data.wiwjIdData
      app.globalData.houseListData['lianjiaFilterCount'] = this.data.lianjiaIdData
    }
    if(this.data.chooseType == 2){
      app.globalData.houseListData['fangtianxiaLowPriceData'] = this.data.fangtianxiaLowPriceData
      app.globalData.houseListData['wbtcLowPriceData'] = this.data.wbtcLowPriceData
      app.globalData.houseListData['fangtianxiaFilterCount'] = this.data.fangtianxiaIdData
      app.globalData.houseListData['wbtcFilterCount'] = this.data.wbtcIdData
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
  //保存修改
  goSave() {
    if (this.data.allCount > 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '房源充足',
        dialogText: '符合条件的房源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体房源。',
        dialogBtn: '知道了'
      })
    } else {
      this.setData({
        updateMonitorDisplay: 'block'
      })
    }
  },
  //保存修改 --取消，再看看
  getUpdateCancelEvent(e) {
    this.setData({
      updateMonitorDisplay: e.detail,
    })
  },
  getUpdateConfrimEvent(e){
    let app = getApp();
    let y = app.globalData.monitorSearchLongData;
    console.log(y);
    let data = {
      //houseSource: y.chooseType, //房来源:1品牌中介，2个人房源
      //cityName: y.city, //城市名称
      id: this.data.monitorId,
      searchJson: y.areaJson, //搜索参数拼接
      buildArea: y.longBuildAreas, //面积
      minPrice: y.minPrice,
      maxPrice: y.maxPrice == 10000 ? 99999 : y.maxPrice,
      areaJson: JSON.stringify(y.areaId)
    };
    if (y.longSortTypes) {
      //房源偏好排序类型 1低价优先,2空间优先,3最新发布
      data["sortType"] = y.longSortTypes;
    }
    if (y.areaType) {
      //位置ID
      data["locationType"] = y.areaType;
    }
    if (y.areaType == 50) {//地铁
      if (y.areaId.subwaysLine) { data['parentName '] = y.areaId.subwaysLine }
    }
    if (y.areaType == 60) { //附近
      data['longitude'] = y.areaId.longitude
      data['latitude'] = y.areaId.latitude
      data['nearby'] = y.areaId.nearby
    }
    if (y.area) {
      //位置名称
      data["locationName"] = y.area;
    }
    if (y.longFloorTypes.length) {
      //楼层
      data["floorType"] = y.longFloorTypes.join(",");
    }
    if (y.longRentTypes) {
      //房源类型
      data["rentType"] = y.longRentTypes;
    }
    if (y.longHeadings.length) {
      //朝向
      data["heading"] = y.longHeadings.join(",");
    }
    if (y.longHouseTags.length) {
      //房源亮点
      data["houseTags"] = y.longHouseTags.join(",");
    }
    if (y.longLayouts.length) {
      //户型
      data["layoutRoom"] = y.longLayouts.join(",");
    }

    let obj = wx.getStorageSync("collectionObj") || {};
    let fddShortRentBlock = {};
    if (y.chooseType == 1) {
      let wiwjId = [...this.data.wiwjIdData];
      let ljId = [...this.data.lianjiaIdData];
      if (obj && obj["wiwj"] && obj["wiwj"].length) {
        for (let i = 0; i < obj["wiwj"].length; i++) {
          let index = wiwjId.indexOf(obj["wiwj"][i]);
          wiwjId.splice(index, 1);
        }
      }
      if (obj && obj["lj"] && obj["lj"].length) {
        for (let i = 0; i < obj["lj"].length; i++) {
          let index = ljId.indexOf(obj["lj"][i]);
          ljId.splice(index, 1);
        }
      }
      fddShortRentBlock["wiwj"] = wiwjId;
      fddShortRentBlock["lj"] = ljId;
    } else {
      let ftxId = [...this.data.fangtianxiaIdData];
      let tcId = [...this.data.wbtcIdData];
      if (obj && obj["ftx"] && obj["ftx"].length) {
        for (let i = 0; i < obj["ftx"].length; i++) {
          let index = ftxId.indexOf(obj["ftx"][i]);
          ftxId.splice(index, 1);
        }
      }
      if (obj && obj["tc"] && obj["tc"].length) {
        for (let i = 0; i < obj["tc"].length; i++) {
          let index = tcId.indexOf(obj["tc"][i]);
          tcId.splice(index, 1);
        }
      }
      fddShortRentBlock["ftx"] = ftxId;
      fddShortRentBlock["tc"] = tcId;
    }
    data["fddShortRentBlock"] = fddShortRentBlock;
    console.log(data);
    monitorApi.updateLongMonitor(data).then(res => {
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      this.setData({
        updateMonitorDisplay: e.detail,
      })
      wx.navigateBack({
        delta: 1
      })
    });
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