const house = require("../../utils/house.js");
const regeneratorRuntime = require("../../lib/runtime.js");
const util = require("../../utils/util.js");
const userApi = require("../../api/userApi.js");
const monitorApi = require("../../api/monitorApi.js");
const app = getApp();
import positionService from "../positionLongSelect/service";
import { SearchLongDataSubject } from "../../utils/searchLongDataStream";
Page({
  data: {
    countFlag: "",
    allOriginalData: [],
    allData: [],
    allCount: 0,
    averagePrice: 0,
    lowPrice: 0,
    lowPriceData: {},
    highAreaData: {},
    wiwjLowPriceData: {},
    lianjiaLowPriceData: {},
    wiwjIdData: [],
    lianjiaIdData: [],
    fangtianxiaIdData: [],
    wbtcIdData: [],
    wiwjCount: 0,
    lianjiaCount: 0,
    loadingDisplay: "block",
    monitorenoughDisplay: "none",
    monitorDisplay: "none",
    collectDisplay: "none",
    publicDisplay: "none",
    enoughBottom: false,
    monitorBottom: false,
    wiwjfilter: {},
    ljfilter: {},
    ftxfilter: {},
    tcfilter: {},
    searchLongData: {},
    positionData: []
  },
  onLoad: function(options) {
    //1品牌中介，2个人房源
    let x = app.globalData.searchLongData;
    let wiwjfilter = house.wiwjScreenParam(1);
    let ljfilter = house.ljScreenParam(1);
    let ftxfilter = house.ftxScreenParam(1);
    let tcfilter = house.tcScreenParam(1);
    new positionService().getSearchHoset(x.city, x.chooseType).then(resp => {
      const positionData = resp.data;
      this.setData({ positionData });
    });
    this.setData(
      {
        listSortType: 1,
        wiwjfilter,
        ljfilter,
        ftxfilter,
        tcfilter,
        searchLongData: Object.assign({}, x),
        chooseType: x.chooseType, //1品牌中介，2个人房源
        longSortTypes: x.longSortTypes //1: 低价优先, 2: 空间优先, 3: 最新发布
      },
      () => {
        if (x.chooseType == 1) {
          this.getAllBrandData();
        } else {
          this.getAllPersonalData();
        }
      }
    );
  },
  onShow: function() {
    this.getUserInfo();
  },
  submit(e){
    console.log(e)
    //把改变的值重新
    let arr = Object.keys(e.detail);
    if(arr.length){
      for (let key in e.detail){
        app.globalData.searchLongData[key] = e.detail[key]
      }
      SearchLongDataSubject.next()
      this.setData({
        loadingDisplay: 'block',
        countFlag: '',
        allData: [],
      });
      this.onLoad()
    }
  },
  onReachBottom() {
    console.log("到底了");
    this.setData({
      loadingShow: true
    });
    if (this.data.allData < this.data.allOriginalData) {
      let timers = setTimeout(() => {
        this.addDataToArray();
        clearTimeout(timers);
      }, 500);
    } else {
      this.setData({
        loadingShow: false
      });
      if (this.data.allCount >= 50) {
        if (!this.data.enoughBottom) {
          this.setData({
            monitorenoughDisplay: "block",
            dialogTitle: "哎呀，到底了",
            dialogText: "您已查看全部房源，更多房源可前往各平台查看",
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
      }
      if (this.data.allCount < 50) {
        if (!this.data.monitorBottom) {
          this.setData({
            monitorDisplay: "block",
            monitorTitle: "到底了!你可以开启监控",
            monitorBottom: true
          });
        } else {
          wx.showToast({
            title: "到底了",
            icon: "none",
            duration: 2000
          });
        }
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
  goTop() {
    console.log("到顶部");
    const version = wx.getSystemInfoSync().SDKVersion;
    if (util.compareVersion(version, "2.7.3") >= 0) {
      wx.pageScrollTo({
        selector: ".block",
        duration: 1500
      });
    } else {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1500
      });
    }
  },
  goRefresh() {
    this.setData({
      loadingDisplay: "block",
      countFlag: "",
      allData: []
    });
    this.onLoad();
  },
  goSort() {
    let arr = [...this.data.allOriginalData];
    let sort = house.sort(arr, this.data.listSortType, "price");
    if (this.data.listSortType == 2) {
      this.setData({
        allData: [],
        loadingDisplay: "block",
        listSortType: 1
      });
    } else {
      this.setData({
        allData: [],
        loadingDisplay: "block",
        listSortType: 2
      });
    }
    this.setData({
      allOriginalData: sort.arr,
      allData: sort.arr.slice(0, 5),
      loadingDisplay: "none"
    });
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
  async getAllBrandData() {
    wx.removeStorageSync("collectionObj");
    let enoughList = [];
    let wiwjDataObj = await house.getWiwjData(1, this.data.wiwjfilter);
    let lianjiaDataObj = await house.getLianjiaData(1, this.data.ljfilter);
    if (wiwjDataObj.network && lianjiaDataObj.network) {
      this.setData({
        loadingDisplay: "none",
        countFlag: 2
      });
      return;
    }
    let wiwjData = wiwjDataObj.arr || [];
    let lianjiaData = lianjiaDataObj.arr || [];
    if (wiwjDataObj.wiwjCount > -1) {
      enoughList.push({
        key: "wiwj",
        name: "我爱我家",
        value: wiwjDataObj.wiwjCount
      });
    }
    if (lianjiaDataObj.lianjiaCount > -1) {
      enoughList.push({
        key: "lj",
        name: "贝壳",
        value: lianjiaDataObj.lianjiaCount
      });
    }
    enoughList.sort(util.compareSort("value", "desc"));
    let houseData = house.getBrandHouseData({
      wiwjCount: wiwjDataObj.wiwjCount,
      lianjiaCount: lianjiaDataObj.lianjiaCount,
      wiwjData,
      lianjiaData,
      type: 1
    });
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
        loadingDisplay: "none"
      });
    } else {
      this.setData({
        loadingDisplay: 'none',
        countFlag: 0,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount,
      });
    }
  },
  async getAllPersonalData() {
    wx.removeStorageSync("collectionObj");
    let enoughList = [];
    let fangtianxiaDataObj = await house.getFangtianxiaData(
      1,
      this.data.ftxfilter
    );
    let wbtcDataObj = await house.getWbtcData(1, this.data.tcfilter);
    if (fangtianxiaDataObj.network && wbtcDataObj.network) {
      this.setData({
        loadingDisplay: "none",
        countFlag: 2
      });
      return;
    }
    let fangtianxiaData = fangtianxiaDataObj.arr || [];
    let wbtcData = wbtcDataObj.arr || [];
    if (fangtianxiaDataObj.fangtianxiaCount > -1) {
      enoughList.push({
        key: "ftx",
        name: "房天下",
        value: fangtianxiaDataObj.fangtianxiaCount
      });
    }
    if (wbtcDataObj.wbtcCount > -1) {
      enoughList.push({
        key: "tc",
        name: "58同城",
        value: wbtcDataObj.wbtcCount
      });
    }
    enoughList.sort(util.compareSort("value", "desc"));
    let houseData = house.getPersonalHouseData({
      fangtianxiaCount: fangtianxiaDataObj.fangtianxiaCount,
      wbtcCount: wbtcDataObj.wbtcCount,
      fangtianxiaData,
      wbtcData,
      type: 1
    });
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
        loadingDisplay: "none"
      });
    } else {
      this.setData({
        loadingDisplay: 'none',
        countFlag: 0,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount,
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
        monitorenoughDisplay: "block",
        dialogTitle: "房源充足",
        dialogText:
          "已帮您甄选" +
          this.data.allOriginalData.length +
          "套房源，若想查看更多房源，请点击前往各平台查看",
        dialogBtn: "知道了"
      });
    } else {
      if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
        // 数据绑定手机号，如果未绑定，跳转到手机号绑定页面
        wx.navigateTo({
          url: "../bindPhone/bindPhone"
        });
        return;
      }
      this.setData({
        monitorDisplay: "block",
        monitorTitle: "房源监控确认"
      });
    }
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
      highAreaData: this.data.highAreaData,
      enoughList: this.data.enoughList,
      ddCoin: this.data.ddCoin,
      bindPhone: this.data.bindPhone,
      bindPublic: this.data.bindPublic,
      isBack: false,
      sortType: this.data.longSortTypes,
      chooseType: this.data.chooseType
    };
    if (this.data.chooseType == 1) {
      app.globalData.houseListData[
        "wiwjLowPriceData"
      ] = this.data.wiwjLowPriceData;
      app.globalData.houseListData[
        "lianjiaLowPriceData"
      ] = this.data.lianjiaLowPriceData;
      app.globalData.houseListData["wiwjFilterCount"] = this.data.wiwjIdData;
      app.globalData.houseListData[
        "lianjiaFilterCount"
      ] = this.data.lianjiaIdData;
    }
    if (this.data.chooseType == 2) {
      app.globalData.houseListData[
        "fangtianxiaLowPriceData"
      ] = this.data.fangtianxiaLowPriceData;
      app.globalData.houseListData[
        "wbtcLowPriceData"
      ] = this.data.wbtcLowPriceData;
      app.globalData.houseListData[
        "fangtianxiaFilterCount"
      ] = this.data.fangtianxiaIdData;
      app.globalData.houseListData["wbtcFilterCount"] = this.data.wbtcIdData;
    }
    wx.navigateTo({
      url: "../statistics/statistics?rentType=2"
    });
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
    let app = getApp();
    if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
      // 数据绑定手机号，如果未绑定，跳转到手机号绑定页面
      wx.navigateTo({
        url: "../bindPhone/bindPhone"
      });
      return;
    }
    this.setData({
      monitorDisplay: e.detail.show
    });
    this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect);
  },

  getStartMonitor(noteSelect, publicSelect) {
    let app = getApp();
    let y = app.globalData.searchLongData;
    let data = {
      houseSource: y.chooseType, //房来源:1品牌中介，2个人房源
      cityName: y.city, //城市名称
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
      if (y.areaId.subwaysLine) { data['parentName '] = y.areaId.subwaysLine}
    } 
    if (y.areaType == 60){ //附近
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
    //通知方式
    let notice = [];
    if (noteSelect) {
      notice.push(2);
    }
    if (publicSelect) {
      notice.push(1);
    }
    data["notice"] = notice.join(",");
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
    monitorApi.addLongMonitor(data).then(res => {
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      app.switchRent = 2;
      wx.switchTab({
        url: "../monitor/monitor"
      });
    });
  },
  /**
   * 开启监控--未关注公众号时-点击关注号
   */
  getMonitorPublicEvent(e) {
    this.setData({
      monitorDisplay: "none",
      publicDisplay: e.detail,
      publicType: 1 //1开始监控 2拉底监控
    });
  },
  //公众号取消
  getPublicEvent(e) {
    this.setData({
      monitorDisplay: "block",
      publicDisplay: e.detail
    });
  },
  //公众号关注
  getPublicConfrimEvent(e) {
    this.setData({
      publicDisplay: e.detail
    });
    wx.navigateTo({
      url: "../public/public"
    });
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
    let num = wx.getStorageSync("collectionNum");
    let index = e.detail.index;
    let pId = this.data.allData[index].platformId;
    let proId = this.data.allData[index].housesid;
    house.houseCollection(pId, proId);
    let item = "allData[" + index + "].collection";
    this.setData({
      [item]: !this.data.allData[index].collection
    });
    if (!num) {
      this.setData({
        collectDisplay: "block"
      });
    }
  },
  /**
   * 房源收藏确认
   */
  getcollectEventEvent(e) {
    this.setData({
      collectDisplay: e.detail
    });
  },
  preventTouchMove() {}
});
