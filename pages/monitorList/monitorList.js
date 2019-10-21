const houseApi = require('../../api/houseApi.js')
const monitor = require('../../utils/monitor.js')
const monitorApi = require('../../api/monitorApi.js')
const regeneratorRuntime = require('../../lib/runtime.js')
const util = require('../../utils/util.js')
const house = require('../../utils/house.js');
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
    stopDisplay: 'none',
    collectDisplay: 'none',
    enoughDisplay: 'none',
    enoughBottomDisplay: 'none',
    ddCoin: 0,
    loadingDisplay: 'block',
    updateMonitorDisplay: 'none',
    countFlag: '',
    checkInDate: '--', //入住日期
    checkOutDate: '--', //退日期
    dayCount: 1,//入住天数
    cityName: '--',
    locationName: '--',
    showAdvance: false,
    showAdvanceType: 0,
    isBack: false,
    hasDifference: false,
    isLoaded: false,
    listSortType: 1,//列表排序，1 低到高；2高到低
    monitorEndDisplay:'none',
    showScrollTop: false,
    showUI: true,
    y: 0,
    containerHeight: 9999,
    canScroll: true,
    enoughBottom: false,
  },
  topFlag: false,
  cardHeight: 0,
  scrollFlag: true,
  clickSelectItem(e) {
    var type = e.detail.type;
    if (type) {
      this.setData({ showAdvance: true, showAdvanceType: type, cantScroll: false })
    } else {
      this.setData({ showAdvance: false, showAdvanceType: 0, cantScroll: true })
    }
  },
  submitAdvance() {
    var houseSelect = this.selectComponent("#houseSelect")
    houseSelect.reSetData()
    this.setData({
      showAdvance: false,
      loadingDisplay: 'block',
      countFlag: '',
      checkInDate: monitor.checkDate(app.globalData.monitorSearchData.beginDate), //入住日期
      checkOutDate: monitor.checkDate(app.globalData.monitorSearchData.endDate), //离开日期
      dayCount: app.globalData.monitorSearchData.dayCount,
      cityName: app.globalData.monitorSearchData.city, //入住城市
      locationName: app.globalData.monitorSearchData.area || '全城', //地点
      allData: [],
      y: 0,
      containerHeight: 9999,
      showUI: true,
      isBack:true
    })
    this.onShow();
  },
  compareData() {
    const app = getApp();
    var flag = false;
    console.log(app.globalData.monitorDefaultData)
    console.log(app.globalData.monitorSearchData)
    if (util.objectDiff(app.globalData.monitorDefaultData, app.globalData.monitorSearchData)) {
      flag = true;
      this.setData({
        hasDifference:false
      })
    }else{
      this.setData({
        hasDifference: true,
        loadingDisplay: 'block',
        countFlag: '',
        checkInDate: monitor.checkDate(app.globalData.monitorSearchData.beginDate), //入住日期
        checkOutDate: monitor.checkDate(app.globalData.monitorSearchData.endDate), //离开日期
        dayCount: app.globalData.monitorSearchData.dayCount,
        cityName: app.globalData.monitorSearchData.city, //入住城市
        locationName: app.globalData.monitorSearchData.area || '全城', //地点
      });
    }
    return flag;
  },

  onLoad: function () {
    const app = getApp()
    let data = app.globalData.monitorData
    let fee = wx.getStorageSync('hourMoney')||0;
    this.setData({
      monitorId: data.item.id,
      monitorItem: data.item,
      startTimeName: monitor.startTimeName(data.item.startTime),
      taskTime: monitor.taskTime(data.item.monitorTime, data.item.minutes),
      fee
    })
    this.getMonitorData();
  },
  onShow: function () {
    //如果选择的结果与监控的条件不一样；就加载查询
    this.setData({ showAdvance: false, showAdvanceType: 0, cantScroll: true })
    if (this.data.isBack) { //isBack true表示是按确定按钮变化的
      this.scrollFlag = false;
      this.setData({
        loadingDisplay: 'block',
        countFlag: '',
        allData: [],
        y: 0,
        showUI: true,
        containerHeight: 9999
      });
    }
    if (!this.data.isBack){return} //isBack false表示是从返回键返回的
    if (this.compareData()) {
      this.getMonitorData();
      return
    }
    let tjScreen = house.tjScreenParam(2)
    let xzScreen = house.xzScreenParam(2)
    let mnScreen = house.mnScreenPara(2)
    let zgScreen = house.zgScreenPara(2)
    this.setData({
      tjfilter: tjScreen,
      xzfilter: xzScreen,
      mnfilter: mnScreen,
      zgfilter: zgScreen,
      listSortType: 1
    })
    this.getAllData();
  },
  goRefresh(){
    this.onShow()
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
      }, 700);
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
    if (this.data.bottomType === 2){
      if (this.data.containerHeight == this.data.totalHeight && this.data.allCount >= 50) {
        if (!this.data.enoughBottom) {
          this.setData({
            enoughBottomDisplay: 'block',
            enoughBottom: true,
            //canScroll: false
          });
        }else{
          wx.showToast({
            title: '到底了',
            icon: 'none',
            duration: 2000
          })
        }
      }
      if (this.data.containerHeight == this.data.totalHeight && this.data.allCount < 50){
        wx.showToast({
          title: '到底了',
          icon: 'none',
          duration: 2000
        })
      }
    }else{
      if (this.data.containerHeight == this.data.totalHeight) {
        wx.showToast({
          title: '到底了',
          icon: 'none',
          duration: 2000
        })
      }
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
      },()=>{
        wx.createSelectorQuery()
          .select(`.house_card`)
          .boundingClientRect(rect => {
            this.setData({
              containerHeight: this.cardHeight * this.data.allData.length + 100
            });
          })
          .exec();
      });
    }
  },
  goTop() {
    this.topFlag = true;
    this.setData({
      y: 0,
      showUI: true,
      showScrollTop: false
    });
  },
  goSort() {
    let arr = [...this.data.allOriginalData]
    let sort = house.sort(arr, this.data.listSortType)
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
    this.scrollFlag = false;
    this.setData({
      allOriginalData: sort.arr,
      allData: sort.arr.slice(0, 5),
      loadingDisplay: 'none',
      canScroll: true,
      y: 0,
    })
  },
  
  /**
   * 监控详情信息
   */
  getMonitorData() {
    let data = {
      id: this.data.monitorId,
    };
    monitorApi.monitorDetail(data).then(res => {
      if(!res){
        this.setData({
          loadingDisplay: 'none',
          countFlag: 2, 
          canScroll:false,
          countBack:true
        })
        return;
      }
      let houseList = res.data.data.houseList; //监控房源
      let monitorDetail = res.data.data.monitorDetail; //监控条件
      let monitorCount = res.data.data.monitorCount; //监控计算
      let monitorCityId = {}
      let cityList = JSON.parse(monitorDetail.cityJson || '[]')
      for (const key in cityList) {
        if (key === 'mn') {
          monitorCityId.mn = cityList.mn.city_id
        } else if (key === 'xz') {
          monitorCityId.xz = cityList.xz.cityId
        } else if (key === 'tj') {
          monitorCityId.tj = cityList.tj.id
        } else if (key === 'zg') {
          monitorCityId.zg = cityList.zg.id
        }
      }
      let monitorAreaId = {};
      let monitorLtude = {};
      let areaList = JSON.parse(monitorDetail.positionJson || '[]')
      if (monitorDetail.locationType == 16) {//行政区  只有areaid
        monitorAreaId = {
          mn: areaList.mn && areaList.mn.area_id,
          tj: areaList.tj && areaList.tj.value,
          xz: areaList.xz && areaList.xz.id,
          zg: areaList.zg && areaList.zg.id
        }
      } else if (monitorDetail.locationType && monitorDetail.locationType !== 16) {
        monitorLtude = {
          mn: areaList.mn && (areaList.mn.lat + ',' + areaList.mn.lng),
          tj: areaList.tj && (areaList.tj.latitude + ',' + areaList.tj.longitude),
          xz: areaList.xz && (areaList.xz.latitude + ',' + areaList.xz.longitude),
          zg: areaList.zg && (areaList.zg.latitude + ',' + areaList.zg.longitude)
        }
        monitorAreaId = {
          mn: areaList.mn && (areaList.mn.id),
          tj: areaList.tj && (areaList.tj.value),
          xz: areaList.xz && (areaList.xz.id),
          zg: areaList.zg && (areaList.zg.id)
        }
      }
      //监控详情条件 ---高级筛选可用改变
      app.globalData.monitorSearchData = {
        cityType: monitorDetail.cityType,
        area: monitorDetail.locationName,
        areaId: monitorAreaId,
        ltude: monitorLtude,
        areaType: monitorDetail.locationType+'',
        city: monitorDetail.cityName,//城市名
        cityId: monitorCityId,//城市ID
        cityJson: monitorDetail.cityJson,
        positionJson: monitorDetail.positionJson,
        beginDate: monitorDetail.beginDate.split(" ")[0],//开始日期
        endDate: monitorDetail.endDate.split(" ")[0],//离开日期
        dayCount: util.getDays(monitorDetail.beginDate, monitorDetail.endDate),
        gueseNumber: monitorDetail.peopleNum,//入住人数
        leaseType: monitorDetail.rentType ? monitorDetail.rentType : '',//出租类型,2单间出租，1整套出租 不选择 ''
        houseType: monitorDetail.layoutRoom && monitorDetail.layoutRoom.split(',') || [],//户型 0 一居室 1 二居室 2 三居室 3 4居以上
        minPrice: monitorDetail.minPrice,//最低价
        maxPrice: monitorDetail.maxPrice,//最高价
        sort: monitorDetail.sortType,//搜索方式 1推荐 2低价有限
        equipment: monitorDetail.facilities && monitorDetail.facilities.split(',') || []
      }
      //监控详情条件 ---监控默认条件
      app.globalData.monitorDefaultData = {
        cityType: monitorDetail.cityType,
        area: monitorDetail.locationName,
        areaId: monitorAreaId,
        ltude: monitorLtude,
        areaType: monitorDetail.locationType + '',
        city: monitorDetail.cityName,//城市名
        cityId: monitorCityId,//城市ID
        cityJson: monitorDetail.cityJson,
        positionJson: monitorDetail.positionJson,
        beginDate: monitorDetail.beginDate.split(" ")[0],//开始日期
        endDate: monitorDetail.endDate.split(" ")[0],//离开日期
        dayCount: util.getDays(monitorDetail.beginDate, monitorDetail.endDate),
        gueseNumber: monitorDetail.peopleNum,//入住人数
        leaseType: monitorDetail.rentType ? monitorDetail.rentType : '',//出租类型,2单间出租，1整套出租 不选择 ''
        houseType: monitorDetail.layoutRoom && monitorDetail.layoutRoom.split(',') || [],//户型 0 一居室 1 二居室 2 三居室 3 4居以上
        minPrice: monitorDetail.minPrice,//最低价
        maxPrice: monitorDetail.maxPrice,//最高价
        sort: monitorDetail.sortType,//搜索方式 1推荐 2低价有限
        equipment: monitorDetail.facilities && monitorDetail.facilities.split(',') || []
      }
      let searchData = app.globalData.monitorSearchData;
      let defaultData = app.globalData.monitorDefaultData;
      this.setData({
        checkInDate: monitor.checkDate(searchData.beginDate), //入住日期
        checkOutDate: monitor.checkDate(searchData.endDate), //离开日期
        dayCount: searchData.dayCount,
        cityName: searchData.city, //入住城市
        locationName: searchData.area || '全城', //地点
        defaultBeginDate: defaultData.beginDate,
        defaultEndDate: defaultData.endDate,
        defaultCityName: defaultData.city,
        defaultLocationName: defaultData.area || '全城',
        defaultMInPrice: defaultData.minPrice,
        defaultMaxPrice: defaultData.maxPrice,
        isLoaded: true,
      })

      if (!monitorCount || !monitorCount.allTotal || monitorCount.allTotal == 0 || houseList.length == 0) {
        this.setData({
          countFlag: 0,
          loadingDisplay: 'none',
          canScroll: false,
          bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
        })
        return;
      }
      let monitorHouseData = house.getMonitorHouseData(houseList);//监控房源列表
      let enoughList = [];
      if (monitorCount.tjTotal > -1) { enoughList.push({ key: 'tj', name: '途家', value: monitorCount.tjTotal }) }
      if (monitorCount.xzTotal > -1) { enoughList.push({ key: 'xz', name: '小猪', value: monitorCount.xzTotal }) }
      if (monitorCount.mnTotal > -1) { enoughList.push({ key: 'mn', name: '木鸟', value: monitorCount.mnTotal }) }
      if (monitorCount.zgTotal > -1) { enoughList.push({ key: 'zg', name: '榛果', value: monitorCount.zgTotal }) }

      enoughList.sort(util.compareSort('value', 'desc'));
      
      this.setData({
        allOriginalData: monitorHouseData.allData,
        allData: monitorHouseData.allData.slice(0, 5),
        allCount: monitorCount.allTotal,
        averagePrice: monitorHouseData.averagePrice,
        lowPrice: monitorHouseData.lowPrice,
        lowPriceData: monitorHouseData.lowPriceData,
        tjLowPriceData: monitorHouseData.tjLowPriceData,
        xzLowPriceData: monitorHouseData.xzLowPriceData,
        mnLowPriceData: monitorHouseData.mnLowPriceData,
        zgLowPriceData: monitorHouseData.zgLowPriceData,
        enoughList,
        tjCount: monitorCount.tjTotal,
        xzCount: monitorCount.xzTotal,
        mnCount: monitorCount.mnTotal,
        zgCount: monitorCount.zgTotal,
        tjIdData: monitorHouseData.tjId,
        xzIdData: monitorHouseData.xzId,
        mnIdData: monitorHouseData.mnId,
        zgIdData: monitorHouseData.zgId,
        isMonitorHouse: 1, //1;不可收藏；0；可收藏
        taskTime: monitor.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
        startTimeName: monitor.startTimeName(monitorDetail.startTime),
        fee: monitorDetail.fee,
        monitorId: monitorDetail.id,
        totalFee: monitorDetail.totalFee, //消耗盯盯币
        bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
        loadingDisplay: 'none',
        countFlag: 1,
        isBack: false,
        canScroll: true,
        y: 0,
        showUI: true
      }, () => {
        this.scrollFlag = false;
        if (monitorHouseData.allData.length > 0) {
          wx.createSelectorQuery()
            .select(`.house_card`)
            .boundingClientRect(rect => {
              this.cardHeight = rect.height + 20; // 高度外加20个像素的margin-bottom
              this.setData({
                containerHeight: this.cardHeight * this.data.allData.length + 100,
                totalHeight: this.cardHeight * monitorHouseData.allData.length + 100
              });
            })
            .exec();
        }
      })
    })
  },
  

  async getAllData() {
    wx.removeStorageSync('collectionObj')
    let tjDataObj = await house.getTjData(2, this.data.tjfilter);
    let xzDataObj = await house.getXzData(2, this.data.xzfilter);
    let mnDataObj = await house.getMnData(2, this.data.mnfilter);
    let zgDataObj = await house.getZgData(2, this.data.zgfilter);
    if (tjDataObj.network && xzDataObj.network && mnDataObj.network && zgDataObj.network) {
      this.setData({
        loadingDisplay: 'none',
        countFlag: 2,
        canScroll: false,
        countBack: false
      })
      return;
    }
    let tjData = tjDataObj.arr || [];
    let xzData = xzDataObj.arr || [];
    let mnData = mnDataObj.arr || [];
    let zgData = zgDataObj.arr || [];
    let enoughList = [];
    if (tjDataObj.tjCount > -1) { enoughList.push({ key: 'tj', name: '途家', value: tjDataObj.tjCount }) }
    if (xzDataObj.xzCount > -1) { enoughList.push({ key: 'xz', name: '小猪', value: xzDataObj.xzCount }) }
    if (mnDataObj.mnCount > -1) { enoughList.push({ key: 'mn', name: '木鸟', value: mnDataObj.mnCount }) }
    if (zgDataObj.zgCount > -1) { enoughList.push({ key: 'zg', name: '榛果', value: zgDataObj.zgCount }) }
    enoughList.sort(util.compareSort('value', 'desc'));
    this.setData({
      tjCount: tjDataObj.tjCount,
      xzCount: xzDataObj.xzCount,
      mnCount: mnDataObj.mnCount,
      zgCount: zgDataObj.zgCount,
      enoughList
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
        countFlag: 0,
        canScroll: false
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
      showUI: true,
      enoughBottom: false,
      bottomType: 2,
      isMonitorHouse: 0,
      checkInDate: monitor.checkDate(app.globalData.monitorSearchData.beginDate), //入住日期
      checkOutDate: monitor.checkDate(app.globalData.monitorSearchData.endDate), //离开日期
      dayCount: app.globalData.monitorSearchData.dayCount,
      beginDate: app.globalData.monitorSearchData.beginDate,
      endDate: app.globalData.monitorSearchData.endDate,
      cityName: app.globalData.monitorSearchData.city, //入住城市
      locationName: app.globalData.monitorSearchData.area || '全城', //地点
      sortType: app.globalData.monitorSearchData.sort,
      updateMinPrice: app.globalData.monitorSearchData.minPrice,
      updateMaxPrice: app.globalData.monitorSearchData.maxPrice,
    }, () => {
      this.scrollFlag = false;
      if (houseData.allData.length > 0) {
        wx.createSelectorQuery()
          .select(`.house_card`)
          .boundingClientRect(rect => {
            this.cardHeight = rect.height + 20; // 高度外加20个像素的margin-bottom
            this.setData({
              containerHeight: this.cardHeight * this.data.allData.length + 100,
              totalHeight: this.cardHeight * houseData.allData.length + 100
            });
          })
          .exec();
      }
    })
  },
  /**
   * 跳转统计详情
   */
  goToDetail() {
    const app = getApp()
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
      enoughList: this.data.enoughList,
      tjFilterCount: this.data.tjIdData,
      xzFilterCount: this.data.xzIdData,
      mnFilterCount: this.data.mnIdData,
      zgFilterCount: this.data.zgIdData,
      bottomType: this.data.bottomType, //0:房源列表；1监控详情房源列表；2监控详情修改之后,
      isMonitorHouse: this.data.isMonitorHouse, //1;不可收藏；0；可收藏
      taskTime: this.data.taskTime,
      startTimeName: this.data.startTimeName,
      fee: this.data.fee,
      monitorId: this.data.monitorId,
      totalFee: this.data.totalFee, //消耗盯盯币
      isBack: false
    }
    wx.navigateTo({
      url: '../statistics/statistics',
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
          delta: 1
        })
      }
    })
  },

  getmonitorEndEvent(e) {
    this.setData({
      monitorEndDisplay: e.detail,
    })
  },
  getmonitorEndConfirmEvent(e) {
    let data = {
      uniqueId: this.data.deleteItem.productId,
      monitorId: this.data.monitorId,
      platform: this.data.deleteItem.platformId
    }
    monitorApi.addFddShortRentBlock(data).then(res => {
      if (res.data.success) {
        wx.showToast({
          title: res.data.resultMsg,
          icon: 'success',
          duration: 2000
        })
        this.setData({
          monitorEndDisplay: 'none',
        })
        this.getMonitorData()
      }
    })
  },
  /**
   * 不再关注；添加黑名单
   */
  delItem(e) {
    let item = this.data.allData[e.currentTarget.dataset.index]
    this.setData({
      monitorEndDisplay:'block',
      deleteItem: item
    })
  },
  //返回到监控列表页面
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  //保存修改
  goSave() {
    if (this.data.allCount>50){
      this.setData({
        enoughDisplay: 'block'
      })
    }else{
      this.setData({
        updateMonitorDisplay: 'block'
      })
    }
  },
  getEnoughEvent(e) {
    this.setData({
      enoughDisplay: e.detail,
    })
  },
  getBottomEnoughEvent(e) {
    this.setData({
      enoughBottomDisplay: e.detail,
    })
  },
  getBottomEnoughEvent(e) {
    this.setData({
      enoughBottomDisplay: e.detail,
    })
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
    let tjId = [...this.data.tjIdData]
    let xzId = [...this.data.xzIdData]
    let mnId = [...this.data.mnIdData]
    let zgId = [...this.data.zgIdData]
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
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      })
      this.setData({
        updateMonitorDisplay: e.detail,
      })
      wx.navigateBack({
        delta: 1
      })
    })
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
    if (!num) {
      this.setData({
        collectDisplay: 'block',
      });
    }
  },
  goToPlatformDetail(e) {
    let platform = e.currentTarget.dataset.platform
    let productid = e.currentTarget.dataset.productid
    monitor.navigateToMiniProgram(
      platform, 
      productid, 
      app.globalData.monitorSearchData.beginDate,
      app.globalData.monitorSearchData.endDate
    )
  },
  getcollectEventEvent(e) {
    this.setData({
      collectDisplay: e.detail,
    })
  },
  swiperChange(e) {
    let item = "allData[" + e.currentTarget.dataset.index + "].curIndex";
    this.setData({
      [item]: e.detail.current + 1
    })
  },
  preventTouchMove() { }
})