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
    mnIdCount: 0,
    mnData: [],
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
    scrollTop: 0,
    scrollDetail: 0,
    stopDisplay: 'none',
    collectDisplay: 'none',
    enoughDisplay: 'none',
    enoughBottomDisplay: 'none',
    ddCoin: 0,
    sIndex: 1,
    loadingDisplay: 'block',
    updateMonitorDisplay: 'none',
    countFlag: '',
    checkInDate: '--', //入住日期
    checkOutDate: '--', //退日期
    cityName: '--',
    locationName: '--',
    delBtnWidth: 134,
    showAdvance: false,
    showAdvanceType: 0,
    isBack: false,
    hasDifference: false,
    isLoaded: false,
    removeRight:-162,
    listSortType: 1,//列表排序，1 低到高；2高到低
    monitorEndDisplay:'none',
    showScrollTop: false,
    showUI: true,
    y: 0,
    containerHeight: 9999,
    canScroll: true
  },
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
      cityName: app.globalData.monitorSearchData.city, //入住城市
      locationName: app.globalData.monitorSearchData.area || '全城', //地点
      allData: [],
      y: 0,
      containerHeight: 9999,
      showUI: true
    })
    this.onShow();
  },
  compareData() {
    const app = getApp();
    var flag = false;
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
        cityName: app.globalData.monitorSearchData.city, //入住城市
        locationName: app.globalData.monitorSearchData.area || '全城', //地点
      });
      //this.setData({
        //checkInDate: monitor.checkDate(app.globalData.monitorSearchData.beginDate), //入住日期
        //checkOutDate: monitor.checkDate(app.globalData.monitorSearchData.endDate), //离开日期
        //cityName: app.globalData.monitorSearchData.city, //入住城市
        //locationName: app.globalData.monitorSearchData.area || '全城', //地点
        // defaultBeginDate: app.globalData.monitorSearchData.beginDate,
        // defaultEndDate: app.globalData.monitorSearchData.endDate,
        // defaultCityName: app.globalData.monitorSearchData.city,
        // defaultLocationName: app.globalData.monitorSearchData.area || '--',
        // defaultMInPrice: app.globalData.monitorSearchData.minPrice,
        // defaultMaxPrice: app.globalData.monitorSearchData.maxPrice,
      //})
    }
    return flag;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const app = getApp()
    console.log(app);
    let data = app.globalData.monitorData
    console.log(data);
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //如果选择的结果与监控的条件不一样；就加载查询
    this.setData({ showAdvance: false, showAdvanceType: 0, cantScroll: true })
    if (this.compareData()) {
      this.getMonitorData();
      return
    }
    //排序方式 
    let tjconditions = [];
    let xzOrderBy = 'recommend'
    let mnSort = 0
    let zgsortType = 0;
    if (app.globalData.monitorSearchData.sort == 1) { //1推荐 2低价优先
      tjconditions.push({ "gType": 4, "type": 4, "value": 1 })
      xzOrderBy = 'recommend'
      mnSort = 0
      zgsortType = 0
    } else {
      tjconditions.push({ "gType": 4, "type": 4, "value": 2 })
      xzOrderBy = 'zuipianyi'
      mnSort = 2
      zgsortType = 2
    }
    //入住人数 gueseNumber
    let tjgueseNumber = 1
    if (app.globalData.monitorSearchData.gueseNumber != -1) { // 不限人数
      tjgueseNumber = 500 + Number(app.globalData.monitorSearchData.gueseNumber)
      tjconditions.push({ "gType": 1, "type": 6, "value": tjgueseNumber })
    }

    //行政区域 途家
    if (app.globalData.monitorSearchData.areaType && app.globalData.monitorSearchData.area) {
      if (app.globalData.monitorSearchData.areaId.tj) {
        tjconditions.push({ "gType": 2, "type": 5, "value": app.globalData.monitorSearchData.areaId.tj })
      }
    } else {
      //手动定位的不管
    }


    //户型
    let mnroomNum = [];
    let zglayoutRoomList = [];
    if (app.globalData.monitorSearchData.houseType.length) {
      for (let i = 0; i < app.globalData.monitorSearchData.houseType.length; i++) {
        tjconditions.push({ "gType": 1, "type": 6, "value": Number(app.globalData.monitorSearchData.houseType[i]) })
        mnroomNum.push(Number(app.globalData.monitorSearchData.houseType[i]))
        zglayoutRoomList.push(Number(app.globalData.monitorSearchData.houseType[i]))
      }
    }
    //出租类型
    let xzLeaseType = 'whole'
    let mnrentType = []
    let zgrentTypeList = []
    if (app.globalData.monitorSearchData.leaseType === 2) { //2单间 1整租 不选择''
      tjconditions.push({ "gType": 1, "type": 6, "value": 902 })
      xzLeaseType = 'room'
      mnrentType = [2]
      zgrentTypeList = [1]
    }
    if (app.globalData.monitorSearchData.leaseType === 1) {
      tjconditions.push({ "gType": 1, "type": 6, "value": 901 })
      xzLeaseType = 'whole'
      mnrentType = [1]
      zgrentTypeList = [0]
    }
    //配套设施
    let xzFacilitys = [];
    let mnSupport = [];
    let zgfacilities = []
    if (app.globalData.monitorSearchData.equipment.length) {
      for (let i = 0; i < app.globalData.monitorSearchData.equipment.length; i++) {
        let e = app.globalData.monitorSearchData.equipment[i] + ""
        switch (e) {
          case '1':
            tjconditions.push({ "gType": 1, "type": 6, "value": 201 })
            xzFacilitys.push('facility_Netword')
            mnSupport.push(2)
            zgfacilities.push(1)
            break;
          case '2':
            tjconditions.push({ "gType": 1, "type": 6, "value": 206 })
            xzFacilitys.push('facility_AirCondition')
            mnSupport.push(5)
            zgfacilities.push(10)
            break;
          case '3':
            tjconditions.push({ "gType": 1, "type": 6, "value": 205 })
            xzFacilitys.push('facility_Tv')
            mnSupport.push(3)
            zgfacilities.push(8)
            break;
          case '4':
            tjconditions.push({ "gType": 1, "type": 6, "value": 204 })
            //xzFacilitys.push('洗衣机')
            mnSupport.push(7)
            zgfacilities.push(14)
            break;
          case '5':
            tjconditions.push({ "gType": 1, "type": 6, "value": 207 })
            //xzFacilitys.push('冰箱')
            mnSupport.push(8)
            //zgfacilities.push('冰箱)
            break;
          case '6':
            tjconditions.push({ "gType": 1, "type": 6, "value": 203 })
            xzFacilitys.push('facility_Shower')
            mnSupport.push(9)
            //zgfacilities.push('全天热水')
            break;
          case '7':
            tjconditions.push({ "gType": 1, "type": 6, "value": 202 })
            //xzFacilitys.push('电梯')
            mnSupport.push(17)
            zgfacilities.push(4)
            break;
        }
      }
    }
    //价格区间
    let minPrice = app.globalData.monitorSearchData.minPrice == 0 ? 1 : Number(app.globalData.monitorSearchData.minPrice)
    let maxPrice = Number(app.globalData.monitorSearchData.maxPrice)
    tjconditions.push({ "gType": 1, "type": 7, "value": minPrice + ',' + maxPrice })

    //小猪筛选
    let xzfilterObj = {
      checkInDay: app.globalData.monitorSearchData.beginDate,
      checkOutDay: app.globalData.monitorSearchData.endDate,
      orderBy: xzOrderBy,
      //leaseType: xzLeaseType,
      minPrice: minPrice,
      maxPrice: maxPrice,
    }
    if (app.globalData.searchData.leaseType != '' && app.globalData.searchData.leaseType != 'undefined') {
      xzfilterObj.leaseType = xzLeaseType
    }
    if (app.globalData.monitorSearchData.houseType.length > 0) {
      xzfilterObj.huXing = app.globalData.monitorSearchData.houseType.join(',')
    }
    if (xzFacilitys.length > 0) {
      xzfilterObj.facilitys = xzFacilitys.join('|')
    }
    //行政区域 小猪
    if (app.globalData.monitorSearchData.areaType && app.globalData.monitorSearchData.area) {
      if (app.globalData.monitorSearchData.areaType == 16) {
        if (app.globalData.monitorSearchData.areaId.xz) {
          xzfilterObj.distId = app.globalData.monitorSearchData.areaId.xz
        }
      } else {
        if (app.globalData.monitorSearchData.areaId.xz) {
          xzfilterObj.locId = app.globalData.monitorSearchData.areaId.xz
        }
      }
    } else {
      //手动定位的不管
    }
    //木鸟筛选
    let mnfilterObj = {
      beginDate: app.globalData.monitorSearchData.beginDate,
      endDate: app.globalData.monitorSearchData.endDate,
      sort: mnSort,
      //rentType: mnrentType,
      priceMax: maxPrice,
      priceMin: minPrice,
    }
    if (mnrentType.length > 0) {
      mnfilterObj.rentType = mnrentType
    }
    if (mnroomNum.length > 0) {
      mnfilterObj.roomNum = mnroomNum
    }
    if (mnSupport.length > 0) {
      mnfilterObj.support = mnSupport
    }
    //行政区域 木鸟
    if (app.globalData.monitorSearchData.areaType && app.globalData.monitorSearchData.area) {
      if (app.globalData.monitorSearchData.areaType == 16) {
        if (app.globalData.monitorSearchData.areaId.mn) {
          mnfilterObj.areaId = app.globalData.monitorSearchData.areaId.mn
        }
      } else {
        if (app.globalData.monitorSearchData.areaId.mn) {
          mnfilterObj.landmarkId = app.globalData.monitorSearchData.areaId.mn
          mnfilterObj.lat = app.globalData.monitorSearchData.ltude.mn.split(',')[0]
          mnfilterObj.lng = app.globalData.monitorSearchData.ltude.mn.split(',')[1]
        }
      }
    } else {
      //手动定位的不管
    }
    //榛果筛选
    let zgfilterObj = {
      dateBegin: app.globalData.monitorSearchData.beginDate.replace(/-/g, ''),
      dateEnd: app.globalData.monitorSearchData.endDate.replace(/-/g, ''),
      minPrice: minPrice * 100,
      maxPrice: maxPrice * 100,
      //rentTypeList: zgrentTypeList,
      sortType: zgsortType
    }
    if (zgrentTypeList.length > 0) {
      zgfilterObj.rentTypeList = zgrentTypeList
    }
    if (zglayoutRoomList.length > 0) {
      zgfilterObj.layoutRoomList = zglayoutRoomList
    }
    if (zgfacilities.length > 0) {
      zgfilterObj.facilities = zgfacilities
    }
    //行政区域 榛果
    if (app.globalData.monitorSearchData.areaType && app.globalData.monitorSearchData.area) {
      zgfilterObj.locationId = -4
      zgfilterObj.locationCategoryId = -4
      let type = app.globalData.monitorSearchData.areaType+""
      if (app.globalData.monitorSearchData.areaId.zg) {
        zgfilterObj.locationId = app.globalData.monitorSearchData.areaId.zg
        if (app.globalData.monitorSearchData.areaType != 16) {
          zgfilterObj.locationLatitude = app.globalData.monitorSearchData.ltude.zg.split(',')[0]
          zgfilterObj.locationLongitude = app.globalData.monitorSearchData.ltude.zg.split(',')[1]
        }
        switch (type) {
          case '11':
            zgfilterObj.locationCategoryId = 1
            break;
          case '12':
            zgfilterObj.locationCategoryId = 2
            break;
          case '13':
            zgfilterObj.locationCategoryId = -4
            break;
          case '14':
            zgfilterObj.locationCategoryId = 4
            break;
          case '15':
            zgfilterObj.locationCategoryId = 5
            break;
          case '16':
            zgfilterObj.locationCategoryId = 6
            break;
          case '17':
            zgfilterObj.locationCategoryId = -4
            break;
          case '18':
            zgfilterObj.locationCategoryId = -4
            break;
        }
      }
    } else {
      //手动定位不管
    }

    if (app.globalData.monitorSearchData.gueseNumber != -1) {
      xzfilterObj.guestNum = app.globalData.monitorSearchData.gueseNumber
      mnfilterObj.guestNum = app.globalData.monitorSearchData.gueseNumber

    }
    if (app.globalData.monitorSearchData.gueseNumber != -1) {
      if (app.globalData.monitorSearchData.gueseNumber == 10) {
        zgfilterObj.minCheckInNumber = 10
      } else {
        zgfilterObj.minCheckInNumber = app.globalData.monitorSearchData.gueseNumber
        zgfilterObj.maxCheckInNumber = app.globalData.monitorSearchData.gueseNumber
      }
    }
    this.setData({
      tjfilter: {
        beginDate: app.globalData.monitorSearchData.beginDate,
        endDate: app.globalData.monitorSearchData.endDate,
        conditions: tjconditions
      },
      xzfilter: xzfilterObj,
      mnfilter: mnfilterObj,
      zgfilter: zgfilterObj,
      listSortType: 1
    })
    this.getAllData();
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
   * 监控详情信息
   */
  getMonitorData() {
    let allData = []; //监控房源列表
    let tjFilterData = []; //监控途家房源
    let xzFilterData = []; //监控小猪房源
    let mnFilterData = []; //监控木鸟房源
    let zgFilterData = []; //监控榛果房源
    let tjId = [],
      xzId = [],
      mnId = [],
      zgId = [];
    let data = {
      id: this.data.monitorId,
    };
    monitorApi.monitorDetail(data).then(res => {
      if(!res){
        this.setData({
          loadingDisplay: 'none',
          countFlag: 2, 
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

      app.globalData.monitorSearchData = {
        cityType: monitorDetail.cityType,
        area: monitorDetail.locationName,
        areaId: monitorAreaId,
        ltude: monitorLtude,
        areaType: monitorDetail.locationType,
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

      app.globalData.monitorDefaultData = {
        cityType: monitorDetail.cityType,
        area: monitorDetail.locationName,
        areaId: monitorAreaId,
        ltude: monitorLtude,
        areaType: monitorDetail.locationType,
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

      let totalFee = res.data.data.monitorDetail.fee
      this.setData({
        checkInDate: monitor.checkDate(app.globalData.monitorSearchData.beginDate), //入住日期
        checkOutDate: monitor.checkDate(app.globalData.monitorSearchData.endDate), //离开日期
        cityName: app.globalData.monitorSearchData.city, //入住城市
        locationName: app.globalData.monitorSearchData.area || '全城', //地点
        defaultBeginDate: app.globalData.monitorDefaultData.beginDate,
        defaultEndDate: app.globalData.monitorDefaultData.endDate,
        defaultCityName: app.globalData.monitorDefaultData.city,
        defaultLocationName: app.globalData.monitorDefaultData.area || '--',
        defaultMInPrice: app.globalData.monitorDefaultData.minPrice,
        defaultMaxPrice: app.globalData.monitorDefaultData.maxPrice,
        isLoaded: true,
        totalFee
      })

      if (!monitorCount || !monitorCount.allTotal || monitorCount.allTotal == 0 || houseList.length == 0) {
        this.setData({
          countFlag: 0,
          loadingDisplay: 'none',
          bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
        })
        return;
      }

      for (let i = 0; i < houseList.length; i++) {
        if (houseList[i].platform == 'tj') {
          allData.push({
            platformId: houseList[i].platform,
            curIndex: 1,
            finishLoadFlag: false,
            unitName: houseList[i].data.unitName,
            logoUrl: houseList[i].data.logoUrl,
            pictureList: houseList[i].data.pictureList,
            preloadDetail: houseList[i].data.preloadDetail.baseBrief[0].title + '/' + houseList[i].data.preloadDetail.baseBrief[1].title + '/' + houseList[i].data.preloadDetail.baseBrief[2].title,
            finalPrice: Number(houseList[i].data.finalPrice),
            productId: houseList[i].data.unitId,
            right: 0
          })
          tjFilterData.push({
            platformId: houseList[i].platform,
            curIndex: 1,
            finishLoadFlag: false,
            unitName: houseList[i].data.unitName,
            logoUrl: houseList[i].data.logoUrl,
            pictureList: houseList[i].data.pictureList,
            preloadDetail: houseList[i].data.preloadDetail.baseBrief[0].title + '/' + houseList[i].data.preloadDetail.baseBrief[1].title + '/' + houseList[i].data.preloadDetail.baseBrief[2].title,
            finalPrice: Number(houseList[i].data.finalPrice),
            productId: houseList[i].data.unitId,
          })

          tjId.push(houseList[i].data.unitId)
        }

        if (houseList[i].platform == 'xz') {
          allData.push({
            platformId: houseList[i].platform,
            curIndex: 1,
            finishLoadFlag: false,
            unitName: houseList[i].data.luTitle,
            logoUrl: houseList[i].data.landlordheadimgurl,
            pictureList: houseList[i].data.coverImages,
            preloadDetail: houseList[i].data.luLeaseType + '/' + houseList[i].data.houseTypeInfo + '/' + houseList[i].data.guestnum,
            finalPrice: Number(houseList[i].data.showPriceV2.showPrice || houseList[i].data.luPrice),
            productId: houseList[i].data.luId,
            right: 0
          })
          xzFilterData.push({
            platformId: houseList[i].platform,
            curIndex: 1,
            finishLoadFlag: false,
            unitName: houseList[i].data.luTitle,
            logoUrl: houseList[i].data.landlordheadimgurl,
            pictureList: houseList[i].data.coverImages,
            preloadDetail: houseList[i].data.luLeaseType + '/' + houseList[i].data.houseTypeInfo + '/' + houseList[i].data.guestnum,
            finalPrice: Number(houseList[i].data.showPriceV2.showPrice || houseList[i].data.luPrice),
            productId: houseList[i].data.luId,
          })

          xzId.push(houseList[i].data.luId)
        }

        if (houseList[i].platform == 'mn') {
          allData.push({
            platformId: houseList[i].platform,
            curIndex: 1,
            finishLoadFlag: false,
            unitName: houseList[i].data.title,
            logoUrl: houseList[i].data.image_host,
            pictureList: houseList[i].data.image_list,
            preloadDetail: houseList[i].data.rent_type + '/' + houseList[i].data.source_type + '/宜住' + houseList[i].data.max_num,
            finalPrice: Number(houseList[i].data.sale_price),
            productId: houseList[i].data.room_id,
            right: 0
          })
          mnFilterData.push({
            platformId: houseList[i].platform,
            curIndex: 1,
            finishLoadFlag: false,
            unitName: houseList[i].data.title,
            logoUrl: houseList[i].data.image_host,
            pictureList: houseList[i].data.image_list,
            preloadDetail: houseList[i].data.rent_type + '/' + houseList[i].data.source_type + '/宜住' + houseList[i].data.max_num,
            finalPrice: Number(houseList[i].data.sale_price),
            productId: houseList[i].data.room_id,
          })

          mnId.push(houseList[i].data.room_id)
        }

        if (houseList[i].platform == 'zg') {
          allData.push({
            platformId: 'zg',
            curIndex: 1,
            finishLoadFlag: false,
            unitName: houseList[i].data.title.replace(/\n/g, " "),
            logoUrl: houseList[i].data.hostAvatarUrl,
            pictureList: houseList[i].data.productImages,
            preloadDetail: houseList[i].data.rentLayoutDesc + '/' + houseList[i].data.guestNumberDesc,
            finalPrice: houseList[i].data.discountPrice ? houseList[i].data.discountPrice / 100 : houseList[i].data.price / 100,
            productId: houseList[i].data.productId,
            right: 0
          })
          zgFilterData.push({
            platformId: 'zg',
            curIndex: 1,
            finishLoadFlag: false,
            unitName: houseList[i].data.title.replace(/\n/g, " "),
            logoUrl: houseList[i].data.hostAvatarUrl,
            pictureList: houseList[i].data.productImages,
            preloadDetail: houseList[i].data.rentLayoutDesc + '/' + houseList[i].data.guestNumberDesc,
            finalPrice: houseList[i].data.discountPrice ? houseList[i].data.discountPrice / 100 : houseList[i].data.price / 100,
            productId: houseList[i].data.productId
          })

          zgId.push(houseList[i].data.productId)
        }
      }
      let average = allData.length > 0 ? allData.reduce((sum, {
        finalPrice
      }) => sum + finalPrice, 0) / allData.length : 0;
      let sortArr = [...allData];
      let tjSortArr = [...tjFilterData]
      let xzSortArr = [...xzFilterData]
      let mnSortArr = [...mnFilterData]
      let zgSortArr = [...zgFilterData]

      //所有房源最低价格的数据
      sortArr.sort(util.compareSort('finalPrice', 'asc'))
      let lowPriceData = sortArr[0] || {}
      //途家最低价格数据
      tjSortArr.sort(util.compareSort('finalPrice', 'asc'))
      let tjLowPriceData = tjSortArr[0] || {}
      //小猪最低价格数据
      xzSortArr.sort(util.compareSort('finalPrice', 'asc'))
      let xzLowPriceData = xzSortArr[0] || {}
      //木鸟最低价格数据
      mnSortArr.sort(util.compareSort('finalPrice', 'asc'))
      let mnLowPriceData = mnSortArr[0] || {}
      //榛果最低价格数据
      zgSortArr.sort(util.compareSort('finalPrice', 'asc'))
      let zgLowPriceData = zgSortArr[0] || {}

      //所有最低价
      let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) {
        return o.finalPrice
      })) : 0


      this.setData({
        allOriginalData: allData,
        allData: allData.slice(0, 5),
        allCount: monitorCount.allTotal,
        averagePrice: parseInt(average),
        lowPrice: lowPrice,
        lowPriceData,
        tjLowPriceData,
        xzLowPriceData,
        mnLowPriceData,
        zgLowPriceData,
        tjCount: monitorCount.tjTotal,
        xzCount: monitorCount.xzTotal,
        mnCount: monitorCount.mnTotal,
        zgCount: monitorCount.zgTotal,
        tjIdData: tjId,
        xzIdData: xzId,
        mnIdData: mnId,
        zgIdData: zgId,
        isMonitorHouse: 1, //1;不可收藏；0；可收藏
        taskTime: monitor.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
        startTimeName: monitor.startTimeName(monitorDetail.startTime),
        fee: monitorDetail.fee,
        monitorId: monitorDetail.id,
        totalFee: monitorDetail.totalFee, //消耗盯盯币
        bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
        loadingDisplay: 'none',
        countFlag: 1,
        y: 0,
        showUI: true
      }, () => {
        this.scrollFlag = false;
        if (allData.length > 0) {
          wx.createSelectorQuery()
            .select(`.house_card`)
            .boundingClientRect(rect => {
              this.cardHeight = rect.height + 64; // 高度外加20个像素的margin-bottom
              this.setData({
                containerHeight: this.cardHeight * allData.length + 100
              });
            })
            .exec();
        }
      })
    })
  },
  goTop: function (e) {
    if (wx.pageScrollTo) {
      this.setData({
        scrollTop: 0
      })
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  goSort() {
    let arr = [...this.data.allOriginalData]
    if (this.data.listSortType == 2) {
      arr.sort(util.compareSort('finalPrice', 'asc'))
      wx.showToast({
        title: '已按最低价排序',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 1,
      })
    } else {
      arr.sort(util.compareSort('finalPrice', 'desc'))
      wx.showToast({
        title: '已按最高价排序',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 2,
      })
    }
    this.setData({
      allOriginalData: arr,
      allData: arr.slice(0, 5),
      loadingDisplay: 'none'
    })
  },

  async getAllData() {
    wx.removeStorageSync('collectionObj')
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
    let tjFilterData = [],
      xzFilterData = [],
      mnFilterData = [],
      zgFilterData = [];
    let tjId = [],
      xzId = [],
      mnId = [],
      zgId = [];
    let maxTotal = 50;
    let allData = [];
    
    for (let i = 0; i < maxTotal; i++) {
      if(this.data.tjCount>0){
        let tj = this.addPlatfromData(allData, tjData, i);
        if (tj == 0) {
          break;
        }
        if (tj == 1 && tjData[i].allowBooking) {
          let tjObjs = {};
          let tjObj = tjData[i];
          tjObjs.platformId = 'tj';
          tjObjs.curIndex = 1
          tjObjs.finishLoadFlag = false
          tjObjs.collection = false
          tjObjs.unitName = tjObj.unitName;
          tjObjs.logoUrl = tjObj.logoUrl;
          tjObjs.pictureList = tjObj.pictureList;
          tjObjs.preloadDetail = tjObj.preloadDetail.baseBrief[0].title + '/' + tjObj.preloadDetail.baseBrief[1].title + '/' + tjObj.preloadDetail.baseBrief[2].title
          tjObjs.finalPrice = Number(tjObj.finalPrice)
          tjObjs.productId = tjObj.unitId
          tjFilterData.push(tjObjs)
          tjId.push(tjObj.unitId)
          if (tjObjs.finalPrice > 0) {
            allData.push(tjObjs)
          }
        }
      }
      if (this.data.xzCount > 0){
        let xz = this.addPlatfromData(allData, xzData, i);
        if (xz == 0) {
          break;
        }
        if (xz == 1) {
          let xzObjs = {}
          let xzObj = xzData[i];
          xzObjs.platformId = 'xz'
          xzObjs.curIndex = 1
          xzObjs.finishLoadFlag = false
          xzObjs.collection = false
          xzObjs.unitName = xzObj.luTitle
          xzObjs.logoUrl = xzObj.landlordheadimgurl
          xzObjs.pictureList = xzObj.coverImages
          xzObjs.preloadDetail = xzObj.luLeaseType + '/' + xzObj.houseTypeInfo + '/' + xzObj.guestnum
          xzObjs.finalPrice = Number(xzObj.showPriceV2.showPrice || xzObj.luPrice)
          xzObjs.productId = xzObj.luId
          xzFilterData.push(xzObjs)
          xzId.push(xzObj.luId)
          if (xzObjs.finalPrice > 0) {
            allData.push(xzObjs)
          }
        }
      }
      if (this.data.mnCount > 0){
        let mn = this.addPlatfromData(allData, mnData, i);
        if (mn == 0) {
          break;
        }
        if (mn == 1) {
          let mnObjs = {}
          let mnObj = mnData[i]
          mnObjs.platformId = 'mn'
          mnObjs.curIndex = 1
          mnObjs.finishLoadFlag = false
          mnObjs.collection = false
          mnObjs.unitName = mnObj.title
          mnObjs.logoUrl = mnObj.image_host
          mnObjs.pictureList = mnObj.image_list
          mnObjs.preloadDetail = mnObj.rent_type + '/' + mnObj.source_type + '/宜住' + mnObj.max_num
          mnObjs.finalPrice = Number(mnObj.sale_price)
          mnObjs.productId = mnObj.room_id
          mnFilterData.push(mnObjs)
          mnId.push(mnObj.room_id)
          if (mnObjs.finalPrice > 0) {
            allData.push(mnObjs)
          }
        }
      }
      if (this.data.zgCount > 0){
        let zg = this.addPlatfromData(allData, zgData, i);
        if (zg == 0) {
          break;
        }
        if (zg == 1) {
          let zgObjs = {}
          let zgObj = zgData[i]
          zgObjs.platformId = 'zg'
          zgObjs.curIndex = 1
          zgObjs.finishLoadFlag = false
          zgObjs.collection = false
          zgObjs.unitName = zgObj.title.replace(/\n/g, " ")
          zgObjs.logoUrl = zgObj.hostAvatarUrl
          zgObjs.pictureList = zgObj.productImages
          zgObjs.preloadDetail = zgObj.rentLayoutDesc + '/' + zgObj.guestNumberDesc
          zgObjs.finalPrice = zgObj.discountPrice ? zgObj.discountPrice / 100 : zgObj.price / 100
          zgObjs.productId = zgObj.productId
          zgFilterData.push(zgObjs)
          zgId.push(zgObj.productId)
          if (zgObjs.finalPrice > 0) {
            allData.push(zgObjs)
          }
        }
      }
    }
    //总房源数量
    let allCount = 0
    if (this.data.tjCount > -1) {
      allCount += this.data.tjCount
    }
    if (this.data.xzCount > -1) {
      allCount += this.data.xzCount
    }
    if (this.data.mnCount > -1) {
      allCount += this.data.mnCount
    }
    if (this.data.zgCount > -1) {
      allCount += this.data.zgCount
    }
    //平均价
    let average = allData.length > 0 ? allData.reduce((sum, {
      finalPrice
    }) => sum + finalPrice, 0) / allData.length : 0;
    let sortArr = [...allData];
    let tjSortArr = [...tjFilterData]
    let xzSortArr = [...xzFilterData]
    let mnSortArr = [...mnFilterData]
    let zgSortArr = [...zgFilterData]

    //所有最低价
    let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) {
      return o.finalPrice
    })) : 0

    //所有房源最低价格的数据
    sortArr.sort(util.compareSort('finalPrice', 'asc'))
    let lowPriceData = sortArr[0]
    allData = sortArr;
    //途家最低价格数据
    tjSortArr.sort(util.compareSort('finalPrice', 'asc'))
    let tjLowPriceData = tjSortArr[0]
    //小猪最低价格数据
    xzSortArr.sort(util.compareSort('finalPrice', 'asc'))
    let xzLowPriceData = xzSortArr[0]
    //木鸟最低价格数据
    mnSortArr.sort(util.compareSort('finalPrice', 'asc'))
    let mnLowPriceData = mnSortArr[0]
    //榛果最低价格数据
    zgSortArr.sort(util.compareSort('finalPrice', 'asc'))
    let zgLowPriceData = zgSortArr[0]
    if (allCount > 0) {
      this.setData({
        countFlag: 1
      })
    } else {
      this.setData({
        countFlag: 0
      })
    }

    this.setData({
      allOriginalData: allData,
      allData: allData.slice(0, 5),
      allCount,
      averagePrice: parseInt(average),
      lowPrice,
      lowPriceData,
      tjLowPriceData,
      xzLowPriceData,
      mnLowPriceData,
      zgLowPriceData,
      tjIdData: tjId,
      xzIdData: xzId,
      mnIdData: mnId,
      zgIdData: zgId,
      loadingDisplay: 'none',
      bottomType: 2,
      isMonitorHouse: 0,
      checkInDate: monitor.checkDate(app.globalData.monitorSearchData.beginDate), //入住日期
      checkOutDate: monitor.checkDate(app.globalData.monitorSearchData.endDate), //离开日期
      beginDate: app.globalData.monitorSearchData.beginDate,
      endDate: app.globalData.monitorSearchData.endDate,
      cityName: app.globalData.monitorSearchData.city, //入住城市
      locationName: app.globalData.monitorSearchData.area || '全城', //地点
      sortType: app.globalData.monitorSearchData.sort,
      updateMinPrice: app.globalData.monitorSearchData.minPrice,
      updateMaxPrice: app.globalData.monitorSearchData.maxPrice,
    })
  },
  addPlatfromData(allData, PlatfromData, index) {
    let all
    if (index < PlatfromData.length) {
      //是否已满
      if (allData.length >= 50) {
        return 0 //总已满
      } else {
        return 1 //总的未满
      }
    } else {
      return 2 //某个平台满
    }
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
      tjCount: this.data.tjCount,
      xzCount: this.data.xzCount,
      mnCount: this.data.mnCount,
      zgCount: this.data.zgCount,
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
    if (this.data.isMonitorHouse === 0) {
      return;
    }
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
   * 收藏
   */
  goToCollection(e) {
    //开启收藏
    let num = wx.getStorageSync('collectionNum');
    let obj = wx.getStorageSync('collectionObj') || {};
    let pId = this.data.allData[e.currentTarget.dataset.index].platformId
    let proId = this.data.allData[e.currentTarget.dataset.index].productId

    if (!obj[pId]) {
      obj[pId] = [];
      obj[pId].push(proId)
    } else {
      if (obj[pId].indexOf(proId) == -1) {
        obj[pId].push(proId)
      } else {
        obj[pId] && obj[pId].splice(obj[pId].indexOf(proId), 1)
      }
    }

    wx.setStorageSync('collectionObj', obj)
    let item = "allData[" + e.currentTarget.dataset.index + "].collection";
    this.setData({
      [item]: !e.currentTarget.dataset.collection
    })
    if (num) {
      num++
      wx.setStorageSync('collectionNum', num)
    } else {
      wx.setStorageSync('collectionNum', 1)
      this.setData({
        collectDisplay: 'block',
      })
    }
  },
  goToPlatformDetail(e) {
    let platform = e.currentTarget.dataset.platform
    let productid = e.currentTarget.dataset.productid
    monitor.navigateToMiniProgram(platform, productid)
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

})