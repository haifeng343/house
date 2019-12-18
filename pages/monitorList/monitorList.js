const houseApi = require("../../api/houseApi.js");
const monitor = require("../../utils/monitor.js");
const monitorApi = require("../../api/monitorApi.js");
const regeneratorRuntime = require("../../lib/runtime.js");
const util = require("../../utils/util.js");
const house = require("../../utils/house.js");
import { SearchDataSubject } from "../../utils/searchDataStream";
const app = getApp();
Page({
  data: {
    tjfilter: {},
    xzfilter: {},
    mnfilter: {},
    zgfilter: {},
    tjCount: 0,
    xzCount: 0,
    mnCount: 0,
    zgCount: 0,
    allCount: 0,
    allData: [],
    allOriginalData: [],
    tjFilterData: [],
    xzFilterData: [],
    mnFilterData: [],
    zgFilterData: [],
    rowData: [],
    lowPrice: 0,
    averagePrice: 0,
    lowPriceData: "",
    tjLowPriceData: "",
    xzLowPriceData: "",
    mnLowPriceData: "",
    zgLowPriceData: "",
    stopDisplay: "none",
    followDisplay: "none",
    monitorenoughDisplay: "none",
    ddCoin: 0,
    loadingDisplay: "block",
    updateMonitorDisplay: "none",
    countFlag: "",
    checkInDate: "--", //入住日期
    checkOutDate: "--", //退日期
    dayCount: 1, //入住天数
    cityName: "--",
    locationName: "--",
    showAdvance: false,
    showAdvanceType: 0,
    isBack: false,
    hasDifference: false,
    isLoaded: false,
    enoughBottom: false,
    editFlag: false,
    selectAllFlag: false,
    indexArr: [],
    mSelect: 1, //1全部 2新上 3价格
    advSort: "",
    updateData: {},
    isMtype: false
  },
  clickSelectItem(e) {
    var type = e.detail.type;
    if (type) {
      this.setData({
        showAdvance: true,
        showAdvanceType: type,
        cantScroll: false
      });
    } else {
      this.setData({
        showAdvance: false,
        showAdvanceType: 0,
        cantScroll: true
      });
    }
  },
  submitAdvance() {
    var houseSelect = this.selectComponent("#houseSelect")
    houseSelect.reSetData()
    let updateData = { ...JSON.parse(this.data.updateData) }
    if (util.objectDiff(JSON.parse(JSON.stringify(app.globalData.monitorSearchData)), JSON.parse(JSON.stringify(updateData)))) {
      let allArr = [...this.data.allOriginalData]
      this.setData({
        showAdvance: false,
        //loadingDisplay: "block",
        allData: []
      });
      if (app.globalData.monitorSearchData.advSort == 2) {
        allArr.sort(util.compareSort("finalPrice", "asc"));
      }
      if (app.globalData.monitorSearchData.advSort == 3) {
        allArr.sort(util.compareSort("finalPrice", "desc"));
      }
      this.setData({
        loadingDisplay: "none",
        allOriginalData: allArr,
        allData: allArr.slice(0, 5)
      });
    } else {
      this.setData({
        showAdvance: false,
        loadingDisplay: "block",
        countFlag: "",
        checkInDate: monitor.checkDate(
          app.globalData.monitorSearchData.beginDate
        ), //入住日期
        checkOutDate: monitor.checkDate(
          app.globalData.monitorSearchData.endDate
        ), //离开日期
        dayCount: app.globalData.monitorSearchData.dayCount,
        //cityName: app.globalData.monitorSearchData.city, //入住城市
        locationName: app.globalData.monitorSearchData.area || "全城", //地点
        allData: [],
        isBack: true,
        showUI: true,
        editFlag: false,
        selectAllFlag: false,
        advSort: app.globalData.monitorSearchData.advSort,
        mSelect:1
      });
      SearchDataSubject.next();
      this.onShow();
    }
  },
  compareData() {
    const app = getApp();
    var flag = false;
    if (
      util.objectDiff(
        app.globalData.monitorDefaultData,
        app.globalData.monitorSearchData
      )
    ) {
      flag = true;
      this.setData({
        hasDifference: false
      });
    } else {
      this.setData({
        hasDifference: true,
        loadingDisplay: "block",
        countFlag: "",
        checkInDate: monitor.checkDate(
          app.globalData.monitorSearchData.beginDate
        ), //入住日期
        checkOutDate: monitor.checkDate(
          app.globalData.monitorSearchData.endDate
        ), //离开日期
        dayCount: app.globalData.monitorSearchData.dayCount,
        //cityName: app.globalData.monitorSearchData.city, //入住城市
        locationName: app.globalData.monitorSearchData.area || "全城", //地点
        allData: []
      });
    }
    return flag;
  },

  onLoad: function() {
    const app = getApp();
    let data = app.globalData.monitorData;
    this.setData({
      monitorId: data.item.id,
      monitorItem: data.item,
      startTimeName: monitor.startTimeName(data.item.startTime),
      taskTime: monitor.taskTime(data.item.monitorTime, data.item.minutes),
    })
    this.getMonitorData();
  },
  onShow: function() {
    //如果选择的结果与监控的条件不一样；就加载查询
    this.setData({ showAdvance: false, showAdvanceType: 0, cantScroll: true });
    if (this.data.isBack) {
      //isBack true表示是按确定按钮变化的
      // this.setData({
      //   loadingDisplay: 'block',
      //   countFlag: '',
      //   allData: [],
      //   showUI: true
      // });
    }
    if (!this.data.isBack) {
      return;
    } //isBack false表示是从返回键返回的
    if (this.compareData()) {
      this.getMonitorData();
      return;
    }
    let tjScreen = house.tjScreenParam(2);
    let xzScreen = house.xzScreenParam(2);
    let mnScreen = house.mnScreenPara(2);
    let zgScreen = house.zgScreenPara(2);
    this.setData({
      tjfilter: tjScreen,
      xzfilter: xzScreen,
      mnfilter: mnScreen,
      zgfilter: zgScreen,
      updateData: JSON.stringify(app.globalData.monitorSearchData)
    });
    this.getAllData();
  },
  goRefresh() {
    this.onShow();
  },
  onReachBottom() {
    console.log("到底了");
    this.setData({
      loadingShow: true
    });
    if (this.data.allData.length < this.data.allOriginalData.length) {
      let timers = setTimeout(() => {
        this.addDataToArray();
        clearTimeout(timers);
      }, 500);
    } else {
      this.setData({
        loadingShow: false
      });
      if (this.data.bottomType === 2) {
        if (this.data.allCount >= 50) {
          if (!this.data.enoughBottom) {
            if (this.data.editFlag) {
              return;
            }
            this.setData({
              monitorenoughDisplay: "block",
              dialogTitle: "哎呀，到底了",
              dialogText:
                "已看完筛选出的50套房源，各平台 还有更多房源可供选择, 您可以前往继续 查询。",
              dialogBtn: "取消",
              enoughBottom: true
            });
          } else {
            wx.showToast({
              title: "到底了",
              icon: "none",
              duration: 2000
            });
          }
        } else {
          wx.showToast({
            title: "到底了",
            icon: "none",
            duration: 2000
          });
        }
      } else {
        wx.showToast({
          title: "到底了",
          icon: "none",
          duration: 2000
        });
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
      });
    }
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
      scrollIng: true
    });
    let timer = setTimeout(() => {
      if (this.data.scrollTop === e.scrollTop) {
        this.setData({
          scrollTop: e.scrollTop,
          scrollIng: false
        });
        console.log("滚动结束");
        clearTimeout(timer);
      }
    }, 300);
  },
  // 监控详情信息
  getMonitorData(detail) {
    let data = {
      id: this.data.monitorId
    };
    monitorApi.monitorDetail(data).then(res => {
      if (!res) {
        this.setData({
          loadingDisplay: "none",
          countFlag: 2,
          countBack: true
        });
        return;
      }
      let houseList = res.data.data.houseList; //监控房源
      let monitorDetail = res.data.data.monitorDetail; //监控条件
      let monitorCount = res.data.data.monitorCount; //监控计算
      let monitorCityId = {};
      let cityList = JSON.parse(monitorDetail.cityJson || "[]");
      wx.setNavigationBarTitle({
        title:
          "短租-" +
          (monitorDetail.cityName.length > 4
            ? monitorDetail.cityName.slice(0, 4) + "..."
            : monitorDetail.cityName)
      });
      for (const key in cityList) {
        if (key === "mn") {
          monitorCityId.mn = cityList.mn.city_id;
        } else if (key === "xz") {
          monitorCityId.xz = cityList.xz.cityId;
        } else if (key === "tj") {
          monitorCityId.tj = cityList.tj.id;
        } else if (key === "zg") {
          monitorCityId.zg = cityList.zg.id;
        }
      }
      let monitorAreaId = {};
      let monitorLtude = {};
      let areaList = JSON.parse(monitorDetail.positionJson || "[]");
      if (monitorDetail.locationType == 16) {
        //行政区  只有areaid
        monitorAreaId = {
          mn: areaList.mn && areaList.mn.area_id,
          tj: areaList.tj && areaList.tj.value,
          xz: areaList.xz && areaList.xz.id,
          zg: areaList.zg && areaList.zg.id
        };
      } else if (
        monitorDetail.locationType &&
        monitorDetail.locationType !== 16
      ) {
        monitorLtude = {
          mn: areaList.mn && areaList.mn.lat + "," + areaList.mn.lng,
          tj: areaList.tj && areaList.tj.latitude + "," + areaList.tj.longitude,
          xz: areaList.xz && areaList.xz.latitude + "," + areaList.xz.longitude,
          zg: areaList.zg && areaList.zg.latitude + "," + areaList.zg.longitude
        };
        monitorAreaId = {
          mn: areaList.mn && areaList.mn.id,
          tj: areaList.tj && areaList.tj.value,
          xz: areaList.xz && areaList.xz.id,
          zg: areaList.zg && areaList.zg.id
        };
      }
      //监控详情条件 ---高级筛选可用改变
      app.globalData.monitorSearchData = {
        cityType: monitorDetail.cityType,
        area: monitorDetail.locationName,
        areaId: monitorAreaId,
        ltude: monitorLtude,
        areaType: monitorDetail.locationType + "",
        city: monitorDetail.cityName, //城市名
        cityId: monitorCityId, //城市ID
        cityJson: monitorDetail.cityJson,
        positionJson: monitorDetail.positionJson,
        beginDate: monitorDetail.beginDate.split(" ")[0], //开始日期
        endDate: monitorDetail.endDate.split(" ")[0], //离开日期
        dayCount: util.getDays(monitorDetail.beginDate, monitorDetail.endDate),
        gueseNumber: monitorDetail.peopleNum, //入住人数
        leaseType: monitorDetail.rentType ? monitorDetail.rentType.toString() : "", //出租类型,2单间出租，1整套出租 不选择 ''
        houseType:
          (monitorDetail.layoutRoom && monitorDetail.layoutRoom.split(",")) ||
          [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
        minPrice: monitorDetail.minPrice, //最低价
        maxPrice: monitorDetail.maxPrice, //最高价
        sort: monitorDetail.sortType, //搜索方式 1推荐 2低价有限
        equipment:
          (monitorDetail.facilities && monitorDetail.facilities.split(",")) ||
          [],
        // advSort: this.data.advSort ? this.data.advSort : monitorDetail.sortType
        advSort:-1
      };
      //监控详情条件 ---监控默认条件
      app.globalData.monitorDefaultData = {
        cityType: monitorDetail.cityType,
        area: monitorDetail.locationName,
        areaId: monitorAreaId,
        ltude: monitorLtude,
        areaType: monitorDetail.locationType + "",
        city: monitorDetail.cityName, //城市名
        cityId: monitorCityId, //城市ID
        cityJson: monitorDetail.cityJson,
        positionJson: monitorDetail.positionJson,
        beginDate: monitorDetail.beginDate.split(" ")[0], //开始日期
        endDate: monitorDetail.endDate.split(" ")[0], //离开日期
        dayCount: util.getDays(monitorDetail.beginDate, monitorDetail.endDate),
        gueseNumber: monitorDetail.peopleNum, //入住人数
        leaseType: monitorDetail.rentType ? monitorDetail.rentType.toString() : "", //出租类型,2单间出租，1整套出租 不选择 ''
        houseType:
          (monitorDetail.layoutRoom && monitorDetail.layoutRoom.split(",")) ||
          [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
        minPrice: monitorDetail.minPrice, //最低价
        maxPrice: monitorDetail.maxPrice, //最高价
        sort: monitorDetail.sortType, //搜索方式 1推荐 2低价有限
        equipment:
          (monitorDetail.facilities && monitorDetail.facilities.split(",")) ||
          [],
        //advSort: monitorDetail.sortType
        advSort: -1
      };
      let searchData = app.globalData.monitorSearchData;
      let defaultData = app.globalData.monitorDefaultData;
      let budget = "";
      if (monitorDetail.minPrice == 0 && monitorDetail.maxPrice == 99999) {
        budget = "不限";
      }
      if (monitorDetail.minPrice == 0 && monitorDetail.maxPrice < 99999) {
        budget = "￥" + monitorDetail.maxPrice + "以下";
      }
      if (monitorDetail.minPrice > 0 && monitorDetail.maxPrice < 99999) {
        budget = "￥" + monitorDetail.minPrice + "-" + monitorDetail.maxPrice;
      }
      if (monitorDetail.minPrice > 0 && monitorDetail.maxPrice == 99999) {
        budget = "￥" + monitorDetail.minPrice + "以上";
      }
      this.setData({
        checkInDate: monitor.checkDate(searchData.beginDate), //入住日期
        checkOutDate: monitor.checkDate(searchData.endDate), //离开日期
        dayCount: searchData.dayCount,
        cityName: searchData.city, //入住城市
        locationName: searchData.area || "全城", //地点
        defaultBeginDate: defaultData.beginDate,
        defaultEndDate: defaultData.endDate,
        defaultCityName: defaultData.city,
        defaultLocationName: defaultData.area || "全城",
        defaultMInPrice: defaultData.minPrice,
        defaultMaxPrice: defaultData.maxPrice,
        isLoaded: true,
        budget
      });

      if (
        !monitorCount ||
        !monitorCount.allTotal ||
        monitorCount.allTotal == 0 ||
        houseList.length == 0
      ) {
        this.setData({
          countFlag: 0,
          loadingDisplay: "none",
          bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
          taskTime: monitor.taskTime(
            monitorDetail.monitorTime,
            monitorDetail.minutes
          ),
          startTimeName: monitor.startTimeName(monitorDetail.startTime),
          fee: monitorDetail.fee,
          monitorId: monitorDetail.id,
          totalFee: monitorDetail.totalFee, //消耗盯盯币
          allOriginalData: [],
          allData: [],
          allCount: 0,
          editFlag: false,
          mSelect: detail ? detail : this.data.mSelect,
          updateData: JSON.stringify(app.globalData.monitorSearchData)
        })
        return;
      }
      if (!this.data.isMtype) {
        let mType = house.getMonitorHouseType(houseList);
        this.setData({
          mSelect: mType,
          isMtype: true
        });
      }
      wx.hideLoading()
      let monitorHouseData = house.getMonitorHouseData(houseList, detail?detail:this.data.mSelect);//监控房源列表
      if (monitorHouseData.allData.length == 0){
        this.setData({
          countFlag: 0,
          loadingDisplay: "none",
          bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
          taskTime: monitor.taskTime(
            monitorDetail.monitorTime,
            monitorDetail.minutes
          ),
          startTimeName: monitor.startTimeName(monitorDetail.startTime),
          fee: monitorDetail.fee,
          monitorId: monitorDetail.id,
          totalFee: monitorDetail.totalFee, //消耗盯盯币
          allOriginalData: [],
          allData: [],
          allCount: 0,
          editFlag: false,
          mSelect: detail ? detail : this.data.mSelect,
          updateData: JSON.stringify(app.globalData.monitorSearchData)
        })
        return;
      }

      let enoughList = [];
      if (monitorCount.tjTotal > -1) {
        enoughList.push({
          key: "tj",
          name: "途家",
          value: monitorCount.tjTotal
        });
      }
      if (monitorCount.xzTotal > -1) {
        enoughList.push({
          key: "xz",
          name: "小猪",
          value: monitorCount.xzTotal
        });
      }
      if (monitorCount.mnTotal > -1) {
        enoughList.push({
          key: "mn",
          name: "木鸟",
          value: monitorCount.mnTotal
        });
      }
      if (monitorCount.zgTotal > -1) {
        enoughList.push({
          key: "zg",
          name: "榛果",
          value: monitorCount.zgTotal
        });
      }
      enoughList.sort(util.compareSort("value", "desc"));
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
        tjFilterData: monitorHouseData.tjFilterData,
        xzFilterData: monitorHouseData.xzFilterData,
        mnFilterData: monitorHouseData.mnFilterData,
        zgFilterData: monitorHouseData.zgFilterData,
        taskTime: monitor.taskTime(
          monitorDetail.monitorTime,
          monitorDetail.minutes
        ),
        startTimeName: monitor.startTimeName(monitorDetail.startTime),
        fee: monitorDetail.fee,
        monitorId: monitorDetail.id,
        totalFee: monitorDetail.totalFee, //消耗盯盯币
        bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
        loadingDisplay: "none",
        countFlag: 1,
        isBack: false,
        sortType:monitorDetail.sortType,
        mSelect: detail ? detail : this.data.mSelect,
        updateData: JSON.stringify(app.globalData.monitorSearchData)
      })
    })
  },
  async getAllData() {
    wx.removeStorageSync("fddShortRentBlock");
    let tjDataObj = await house.getTjData(2, this.data.tjfilter);
    let xzDataObj = await house.getXzData(2, this.data.xzfilter);
    let mnDataObj = await house.getMnData(2, this.data.mnfilter);
    let zgDataObj = await house.getZgData(2, this.data.zgfilter);
    if (
      tjDataObj.network &&
      xzDataObj.network &&
      mnDataObj.network &&
      zgDataObj.network
    ) {
      this.setData({
        loadingDisplay: "none",
        countFlag: 2,
        countBack: false,
        bottomType: ""
      });
      return;
    }
    let tjData = tjDataObj.arr || [];
    let xzData = xzDataObj.arr || [];
    let mnData = mnDataObj.arr || [];
    let zgData = zgDataObj.arr || [];
    let enoughList = [];
    if (tjDataObj.tjCount > -1) {
      enoughList.push({ key: "tj", name: "途家", value: tjDataObj.tjCount });
    }
    if (xzDataObj.xzCount > -1) {
      enoughList.push({ key: "xz", name: "小猪", value: xzDataObj.xzCount });
    }
    if (mnDataObj.mnCount > -1) {
      enoughList.push({ key: "mn", name: "木鸟", value: mnDataObj.mnCount });
    }
    if (zgDataObj.zgCount > -1) {
      enoughList.push({ key: "zg", name: "榛果", value: zgDataObj.zgCount });
    }
    enoughList.sort(util.compareSort("value", "desc"));
    this.setData({
      tjCount: tjDataObj.tjCount,
      xzCount: xzDataObj.xzCount,
      mnCount: mnDataObj.mnCount,
      zgCount: zgDataObj.zgCount,
      enoughList
    });

    let houseData = house.getHouseData({
      tjCount: tjDataObj.tjCount,
      xzCount: xzDataObj.xzCount,
      mnCount: mnDataObj.mnCount,
      zgCount: zgDataObj.zgCount,
      tjData,
      xzData,
      mnData,
      zgData,
      type: 2
    });

    if (houseData.allCount > 0 && houseData.allData.length > 0) {
      this.setData({
        countFlag: 1
      });
    } else {
      this.setData({
        countFlag: 0
      });
    }
    let y = app.globalData.monitorSearchData;
    let budget = "";
    if (y.minPrice == 0 && y.maxPrice == 99999) {
      budget = "不限";
    }
    if (y.minPrice == 0 && y.maxPrice < 99999) {
      budget = "￥" + y.maxPrice + "以下";
    }
    if (y.minPrice > 0 && y.maxPrice < 99999) {
      budget = "￥" + y.minPrice + "-" + y.maxPrice;
    }
    if (y.minPrice > 0 && y.maxPrice == 99999) {
      budget = "￥" + y.minPrice + "以上";
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
      tjFilterData: houseData.tjFilterData,
      xzFilterData: houseData.xzFilterData,
      mnFilterData: houseData.mnFilterData,
      zgFilterData: houseData.zgFilterData,
      rowData: houseData.rowData,
      loadingDisplay: "none",
      isBack: false,
      enoughBottom: false,
      bottomType: 2,
      isMonitorHouse: 0,
      checkInDate: monitor.checkDate(y.beginDate), //入住日期
      checkOutDate: monitor.checkDate(y.endDate), //离开日期
      dayCount: y.dayCount,
      beginDate: y.beginDate,
      endDate: y.endDate,
      cityName: y.city, //入住城市
      locationName: y.area || "全城", //地点
      sortType: y.sort,
      updateMinPrice: y.minPrice,
      updateMaxPrice: y.maxPrice,
      budget
    });
  },
  // 跳转统计详情
  goToDetail() {
    const app = getApp();
    app.globalData.houseListData = {
      allCount: this.data.allCount,
      tjCount: this.data.tjCount,
      xzCount: this.data.xzCount,
      mnCount: this.data.mnCount,
      zgCount: this.data.zgCount,
      showCount: this.data.allOriginalData.length,
      averagePrice: this.data.averagePrice,
      lowPrice: this.data.lowPrice,
      lowPriceData: this.data.lowPriceData,
      tjLowPriceData: this.data.tjLowPriceData,
      xzLowPriceData: this.data.xzLowPriceData,
      mnLowPriceData: this.data.mnLowPriceData,
      zgLowPriceData: this.data.zgLowPriceData,
      enoughList: this.data.enoughList,
      tjFilterData: this.data.tjFilterData,
      xzFilterData: this.data.xzFilterData,
      mnFilterData: this.data.mnFilterData,
      zgFilterData: this.data.zgFilterData,
      allOriginalData: this.data.allOriginalData,
      rowData: this.data.rowData,
      bottomType: this.data.bottomType, //0:房源列表；1监控详情房源列表；2监控详情修改之后,
      taskTime: this.data.taskTime,
      startTimeName: this.data.startTimeName,
      fee: this.data.fee,
      monitorId: this.data.monitorId,
      totalFee: this.data.totalFee, //消耗盯盯币
      isBack: false,
      sortType: this.data.sortType,
      dayCount: this.data.dayCount
    };
    this.setData({
      editFlag: false,
      selectAllFlag: true
    });
    this.goToSelectAll();
    wx.navigateTo({
      url: "../statistics/statistics?rentType=1"
    });
  },
  goToMAllSelect(e) {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    this.setData({
      allData: []
    })
    this.getMonitorData(e.detail)
  },
  goMselect(e) {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    this.setData({
      allData: []
    })
    this.getMonitorData(e.detail)
  },
  goTocheckAll(e){
    let index = e.currentTarget.dataset.index
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    this.setData({
      allData: []
    })
    this.getMonitorData(index)
  },
  goEdit() {
    this.setData({
      editFlag: !this.data.editFlag
    });
    if (!this.data.editFlag) {
      this.setData({
        selectAllFlag: true
      });
      this.goToSelectAll();
    }
  },
  handleCloseAdvance() {
    var houseSelect = this.selectComponent("#houseSelect");
    if (houseSelect) {
      houseSelect.reSetData();
      this.setData({
        showAdvance: false,
        showAdvanceType: 0
      });
    }
  },
  //不再关注
  deleteItem(e) {
    let num = wx.getStorageSync("followNum");
    let index = e.detail.index;
    if (!num) {
      this.setData({
        followText: "屏蔽房源后，该房源将不会在后续监控中出现！",
        followType: 1,
        followDisplay: "block",
        followIndex: index
      });
    }else{
      this.setData({
        followText: "是否确认屏蔽此房源！",
        followType: 1,
        followDisplay: "block",
        followIndex: index
      });
    }
  },
  //批量不再关注
  deleteBatchItem() {
    let indexArr = this.data.indexArr;
    if (indexArr.length == 0) {
      this.setData({
        editFlag: false
      });
      return;
    }
    this.setData({
      followText:
        "即将屏蔽" +
        this.data.selectNum +
        "套房源，屏蔽后本次监控将不再获取该房源信息",
      followType: 2,
      followDisplay: "block"
    });
  },
  //不再关注弹窗隐藏
  followKnowEvent(e) {
    wx.setStorageSync("followNum", 1);
    let index = this.data.followIndex
    if (this.data.bottomType == 1) {
      let item = this.data.allData[index]
      let allData = [...this.data.allOriginalData]
      let allData2 = [...this.data.allData]
      let data = {
        uniqueId: item.productId,
        monitorId: this.data.monitorId,
        platform: item.platformId
      };
      monitorApi.addFddShortRentBlock(data).then(res => {
        if (res.data.success) {
          allData.splice(index, 1)
          allData2.splice(index, 1)
          let houseData = house.houseShortFilter(allData)
          this.setData({
            singleEditFlag: true
          });
          if (allData.length > 0) {
            if (allData.length > allData2.length) {
              allData2.push(allData[allData2.length])
            }
            this.setData({
              countFlag: 1
            });
          } else {
            this.setData({
              countFlag: 0,
            });
          }
          this.setData({
            allOriginalData: allData,
            allData: allData2,
            averagePrice: houseData.averagePrice,
            lowPrice: houseData.lowPrice,
            lowPriceData: houseData.lowPriceData,
            tjLowPriceData: houseData.tjLowPriceData,
            xzLowPriceData: houseData.xzLowPriceData,
            mnLowPriceData: houseData.mnLowPriceData,
            zgLowPriceData: houseData.zgLowPriceData,
            tjFilterData: houseData.tjFilterData,
            xzFilterData: houseData.xzFilterData,
            mnFilterData: houseData.mnFilterData,
            zgFilterData: houseData.zgFilterData,
            followDisplay: e.detail.show,
            singleEditFlag: false
          });
        }
      });
    }
  },
  followCancelEvent(e) {
    if (e.detail.followType == 1) {
      wx.setStorageSync("followNum", 1);
    }
    this.setData({
      followDisplay: e.detail.show
    });
  },
  //批量不再关注弹窗确认
  followConfirmEvent(e) {
    let indexArr = this.data.indexArr;
    let arr = [...this.data.allOriginalData];
    //a 不再关注之后 遗留的房源数据
    let a = arr.filter((item, index) => {
      return indexArr.indexOf(index) == -1;
    });
    //b 不再关注的房源，添加黑名单
    let b = arr.filter((item, index) => {
      return indexArr.indexOf(index) > -1;
    });
    if (this.data.bottomType == 1) {
      let tjId = [],
        xzId = [],
        mnId = [],
        zgId = [];
      for (let i = 0; i < b.length; i++) {
        if (b[i].platformId == "tj") {
          tjId.push(b[i].productId);
        }
        if (b[i].platformId == "xz") {
          xzId.push(b[i].productId);
        }
        if (b[i].platformId == "mn") {
          mnId.push(b[i].productId);
        }
        if (b[i].platformId == "zg") {
          zgId.push(b[i].productId);
        }
      }
      let data = {
        monitorId: this.data.monitorId
      };
      data.blockData = {
        tj: tjId,
        xz: xzId,
        mn: mnId,
        zg: zgId
      };
      monitorApi.addShortBatchAddBlacklist(data).then(res => {
        this.setData({
          followDisplay: e.detail.show,
          editFlag: false,
          allData: []
        });
        this.getMonitorData();
      });
    }
  },
  goToSelect(e) {
    let num = 0;
    let indexArr = [];
    let index = e.detail.index;
    let item = "allData[" + index + "].collection";
    let items = "allOriginalData[" + index + "].collection";
    let a = [...this.data.allOriginalData];
    this.setData({
      [item]: !this.data.allData[index].collection,
      [items]: !this.data.allOriginalData[index].collection
    });
    for (let i = 0; i < a.length; i++) {
      if (a[i]["collection"]) {
        num++;
        indexArr.push(i);
      }
    }
    if (num == this.data.allOriginalData.length) {
      this.setData({
        selectAllFlag: true,
        selectNum: num,
        indexArr
      });
    } else {
      this.setData({
        selectAllFlag: false,
        selectNum: num,
        indexArr
      });
    }
  },
  goToSelectAll() {
    let num = 0;
    let indexArr = [];
    let d = [...this.data.allData];
    let a = [...this.data.allOriginalData];
    for (let i = 0; i < d.length; i++) {
      d[i]["collection"] = !this.data.selectAllFlag;
    }
    for (let i = 0; i < a.length; i++) {
      a[i]["collection"] = !this.data.selectAllFlag;
      indexArr.push(i);
    }
    if (!this.data.selectAllFlag) {
      num = this.data.allOriginalData.length;
      indexArr;
    } else {
      num = 0;
      indexArr = [];
    }
    this.setData({
      allOriginalData: a,
      allData: d,
      selectAllFlag: !this.data.selectAllFlag,
      selectNum: num,
      indexArr
    });
  },
  //结束监控
  stopMonitor() {
    this.setData({
      stopDisplay: "block"
    });
  },
  // 继续监控
  getstopEventEvent(e) {
    this.setData({
      stopDisplay: e.detail
    });
  },
  // 结束监控确认
  getstopConfirmEventEvent(e) {
    let data = {
      monitorId: this.data.monitorId
    };
    monitorApi.endMonitor(data).then(res => {
      if (res.data.success) {
        wx.showToast({
          title: res.data.resultMsg,
          icon: "success",
          duration: 2000
        });
        this.setData({
          stopDisplay: e.detail
        });
        wx.navigateBack({
          delta: 1
        });
      }
    });
  },
  //返回到监控列表页面
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  //保存修改
  goSave() {
    if (this.data.allCount > 50) {
      this.setData({
        monitorenoughDisplay: "block",
        dialogTitle: "房源充足",
        dialogText:
          "符合条件的房源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体房源。",
        dialogBtn: "知道了"
      });
    } else {
      this.setData({
        updateMonitorDisplay: "block"
      });
    }
  },
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail
    });
  },
  //保存修改 --取消，再看看
  getUpdateCancelEvent(e) {
    this.setData({
      updateMonitorDisplay: e.detail
    });
  },
  //保存修改 --确认
  getUpdateConfrimEvent(e) {
    this.setData({
      updateMonitorDisplay: e.detail
    });
    this.getUpdateMonitor();
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
      zgCount: this.data.zgCount
    };
    let addData = house.updateShortMonitorData(data);
    wx.showLoading({
      title: "正在修改监控...",
      mask: true
    });
    monitorApi.updateMonitor(addData).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      wx.navigateBack({
        delta: 1
      });
    });
  }
});
