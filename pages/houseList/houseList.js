const houseApi = require("../../api/houseApi.js");
const userApi = require("../../api/userApi.js");
const monitorApi = require("../../api/monitorApi.js");
const util = require("../../utils/util.js");
const monitor = require("../../utils/monitor.js");
const house = require("../../utils/house.js");
const regeneratorRuntime = require("../../lib/runtime.js");
import Http from "../../utils/http.js";
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
    lowPriceData: {},
    tjLowPriceData: {},
    xzLowPriceData: {},
    mnLowPriceData: {},
    zgLowPriceData: {},
    monitorenoughDisplay: "none",
    monitorDisplay: "none",
    followDisplay: "none",
    ddCoin: 0,
    loadingDisplay: "block",
    countFlag: "",
    checkInDate: "--", //入住日期
    checkOutDate: "--", //退日期
    dayCount: 1, //入住天数
    cityName: "--",
    locationName: "全城",
    publicDisplay: "none",
    isBack: false,
    enoughBottom: false,
    monitorBottom: false,
    editFlag: false,
    selectAllFlag: false,
    indexArr: [],
    updateData:{}
  },
  clickSelectItem(e) {
    var type = e.detail.type;
    if (type) {
      this.setData({
        showAdvance: true,
        showAdvanceType: type
      });
    } else {
      this.setData({
        showAdvance: false,
        showAdvanceType: 0
      });
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
  submitAdvance() {
    var houseSelect = this.selectComponent("#houseSelect");
    houseSelect.reSetData();
    let updateData = {...JSON.parse(this.data.updateData)}
    if (util.objectDiff(app.globalData.searchData, updateData)){
      let allArr = [...this.data.allOriginalData]
      this.setData({
        showAdvance: false,
        loadingDisplay: "block",
        allData: []
      });
      if (app.globalData.searchData.advSort == 2) {
        allArr.sort(util.compareSort("finalPrice", "asc"));
      }
      if (app.globalData.searchData.advSort == 3) {
        allArr.sort(util.compareSort("finalPrice", "desc"));
      }
      this.setData({
        loadingDisplay: "none",
        allOriginalData: allArr,
        allData: allArr.slice(0, 5)
      });
      return;
    }
    console.log("查询完毕");
    this.setData({
      showAdvance: false,
      loadingDisplay: "block",
      countFlag: "",
      allData: [],
      showUI: true,
      editFlag: false,
      selectAllFlag: false
    });
    this.onLoad();
  },
  onLoad: function(options) {
    let tjScreen = house.tjScreenParam(1);
    let xzScreen = house.xzScreenParam(1);
    let mnScreen = house.mnScreenPara(1);
    let zgScreen = house.zgScreenPara(1);
    let x = app.globalData.searchData;
    let budget = "";
    if (x.minPrice == 0 && x.maxPrice == 99999) {
      budget = "不限";
    }
    if (x.minPrice == 0 && x.maxPrice < 99999) {
      budget = "￥" + x.maxPrice + "以下";
    }
    if (x.minPrice > 0 && x.maxPrice < 99999) {
      budget = "￥" + x.minPrice + "-" + x.maxPrice;
    }
    if (x.minPrice > 0 && x.maxPrice == 99999) {
      budget = "￥" + x.minPrice + "以上";
    }
    this.setData({
      tjfilter: tjScreen,
      xzfilter: xzScreen,
      mnfilter: mnScreen,
      zgfilter: zgScreen,
      checkInDate: x.beginDate.split("-")[1] + "." + x.beginDate.split("-")[2],
      checkOutDate: x.endDate.split("-")[1] + "." + x.endDate.split("-")[2],
      dayCount: x.dayCount,
      cityName: x.city,
      locationName: x.area || "全城",
      budget: budget,
      sortType: x.sort,
      updateData: JSON.stringify(x)
    });
    this.getIndexHouseData();
    this.getAllData();
  },
  onShow: function() {
    this.getUserInfo();
    if (this.data.isBack) {
      let x = app.globalData.searchData;
      this.setData({
        cityName: x.city
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
      if (this.data.allCount > 50) {
        if (!this.data.enoughBottom) {
          if (this.data.editFlag) {
            return;
          }
          this.setData({
            monitorenoughDisplay: "block",
            dialogTitle: "哎呀，到底了",
            dialogText: "您已查看全部房源，更多房源可前往各平台查看。",
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
      if (this.data.allCount <= 50) {
        if (!this.data.monitorBottom) {
          if (this.data.editFlag) {
            return;
          }
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
  getIndexHouseData() {
    Http.get("/indexHose.json").then(resp => {
      const hourMoney = resp.data.hourMoney || 1;
      wx.setStorageSync("hourMoney", hourMoney);
      this.setData({
        fee: hourMoney
      });
    });
  },
  async getAllData() {
    wx.removeStorageSync("fddShortRentBlock");
    let tjDataObj = await house.getTjData(1, this.data.tjfilter);
    let xzDataObj = await house.getXzData(1, this.data.xzfilter);
    let mnDataObj = await house.getMnData(1, this.data.mnfilter);
    let zgDataObj = await house.getZgData(1, this.data.zgfilter);
    if (
      tjDataObj.network &&
      xzDataObj.network &&
      mnDataObj.network &&
      zgDataObj.network
    ) {
      this.setData({
        loadingDisplay: "none",
        countFlag: 2
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
      type: 1
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
      monitorBottom: false
    });
  },
  //跳转统计详情
  goToDetail() {
    let app = getApp();
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
      ddCoin: this.data.ddCoin,
      bindPhone: this.data.bindPhone,
      bindPublic: this.data.bindPublic,
      isBack: false,
      sortType: this.data.sortType
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
  //不再关注
  deleteItem(e) {
    let num = wx.getStorageSync("followNum");
    if (!num) {
      this.setData({
        followText: "屏蔽房源后，该房源将不会在后续监控中出现！",
        followType: 1,
        followDisplay: "block"
      });
    }
    let index = e.detail.index;
    let proId = this.data.allOriginalData[index].productId;
    let plaId = this.data.allOriginalData[index].platformId;
    let allData = [...this.data.allOriginalData];
    //allData 不再关注之后 遗留的房源数据,b不再关注的房源，添加黑名单
    let b = allData.splice(index, 1);
    let short = wx.getStorageSync("fddShortRentBlock") || [];
    let shortBlock = short.concat(b);
    wx.setStorageSync("fddShortRentBlock", shortBlock);

    let houseData = house.houseShortFilter(allData);
    this.setData({
      allOriginalData: [],
      allData: []
    });
    if (allData.length > 0) {
      this.setData({
        countFlag: 1
      });
    } else {
      this.setData({
        countFlag: 0
      });
    }
    this.setData({
      allOriginalData: allData,
      allData: allData.slice(0, 5),
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
      zgFilterData: houseData.zgFilterData
    });
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
    this.setData({
      followDisplay: e.detail.show
    });
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
    let short = wx.getStorageSync("fddShortRentBlock") || [];
    let shortBlock = short.concat(b);
    wx.setStorageSync("fddShortRentBlock", shortBlock);

    let houseData = house.houseShortFilter(a);
    this.setData({
      allOriginalData: [],
      allData: []
    });
    if (a.length > 0) {
      this.setData({
        countFlag: 1
      });
    } else {
      this.setData({
        countFlag: 0
      });
    }
    this.setData({
      allOriginalData: a,
      allData: a.slice(0, 5),
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
      editFlag: false,
      selectNum: 0,
      followDisplay: e.detail.show
    });
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
  // 房源充足，到底和查看更多弹窗隐藏
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail
    });
  },
  getPublicEvent(e) {
    this.setData({
      monitorDisplay: "block",
      publicDisplay: e.detail
    });
  },
  getPublicConfrimEvent(e) {
    this.setData({
      publicDisplay: e.detail
    });
    wx.navigateTo({
      url: "../public/public"
    });
  },
  //获取用户信息，盯盯币，是否绑定微信公众号 和 手机绑定
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
    let app = getApp();
    if (count > 50) {
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
  //开启监控取消
  getMonitorEvent(e) {
    this.setData({
      monitorDisplay: e.detail
    });
  },
  //开启监控确认
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
  //开启监控--未关注公众号时
  getMonitorPublicEvent(e) {
    this.setData({
      monitorDisplay: "none",
      publicDisplay: e.detail
    });
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
      zgCount: this.data.zgCount
    };
    let addData = house.addMonitorData(data);
    wx.showLoading({
      title: "正在添加监控...",
      mask: true
    });
    monitorApi.addMonitor(addData).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      app.switchRent = 1;
      wx.switchTab({
        url: "../monitor/monitor"
      });
    });
  }
});
