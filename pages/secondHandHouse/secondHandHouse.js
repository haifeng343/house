const house = require("../../utils/house.js");
const regeneratorRuntime = require("../../lib/runtime.js");
const secondApi = require("../../api/longrent.js"); //二手房
const util = require("../../utils/util.js");
const userApi = require("../../api/userApi.js");
const monitorApi = require("../../api/monitorApi.js");
const app = getApp();
import positionService from "../positionLongSelect/service";
import {
  SearchLongDataSubject
} from "../../utils/searchLongDataStream";
import Http from "../../utils/http.js";
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
    fangtianxiaLowPriceData: {},
    wbtcLowPriceData: {},
    wiwjCount: 0,
    lianjiaCount: 0,
    fangtianxiaCount: 0,
    wbtcCount: 0,
    wiwjFilterData: [],
    lianjiaFilterData: [],
    fangtianxiaFilterData: [],
    wbtcFilterData: [],
    rowData: [],
    loadingDisplay: "block",
    monitorenoughDisplay: "none",
    monitorDisplay: "none",
    followDisplay: 'none',
    publicDisplay: "none",
    enoughBottom: false,
    monitorBottom: false,
    wiwjfilter: {},
    ljfilter: [],
    ftxfilter: {},
    tcfilter: {},
    searchLongData: {},
    positionData: [],
    editFlag: false,
    selectAllFlag: false,
    indexArr: [],
  },
  onLoad: function(options) {
    //1品牌中介，2个人房源
    let x = app.globalData.searchLongData;
    let wiwjfilter = house.wiwjSecondScreenParam(1);
    let ljfilter = house.ljSecondScreenParam(1);
    new positionService().getSearchHoset(x.city, x.chooseType).then(resp => {
      const positionData = resp.data;
      this.setData({
        positionData
      });
    });
    this.setData({
        listSortType: 1,
        wiwjfilter,
        ljfilter,
        searchLongData: Object.assign({}, x),
        chooseType: x.chooseType, //1品牌中介，2个人房源
        longSortTypes: x.longSortTypes //1: 低价优先, 2: 空间优先, 3: 最新发布
      },
      () => {
        this.getAllBrandData();
        this.getIndexLongHouseData();
      }
    );
  },
  onShow: function() {
    this.getUserInfo();
    // secondApi.wiwj.ershouSearch({
    //   "city": 2,
    //   "page": {
    //     "size": 15,
    //     "num": 1
    //   },
    //   "filter": {
    //     "price": "100,200",
    //     "broom": "2",
    //     "buildarea": "0,50",
    //     "heading": "10",
    //     "keywords": "西湖"
    //   }
    // }).then(res => res.data.list.forEach(e => {

    //   console.log(e.BaseDetail)
    // }))

    // secondApi.lianjia.ershouSearch({
    //   "city": 330100,
    //   "page": {
    //     "size": 15,
    //     "num": 1
    //   },
    //   "filter": {
    //     "condition": "ep500bp400"
    //   }
    // }).then(res => console.log(res))


  },
  submit(e) {
    //把改变的值重新
    let allArr = [...this.data.allOriginalData]
    let arr = Object.keys(e.detail);
    if (arr.length) {
      if (arr.length == 1 && arr[0] == 'advSort') {
        app.globalData.searchLongData['advSort'] = e.detail['advSort'];
        this.setData({
          loadingDisplay: "block",
          allData: []
        });
        if (e.detail['advSort'] == 1) {
          allArr.sort(util.compareSort("price", "asc"));
        }
        if (e.detail['advSort'] == 11) {
          allArr.sort(util.compareSort("price", "desc"));
        }
        if (e.detail['advSort'] == 2) {
          allArr.sort(util.compareSort("unit_price", "asc"));
        }
        if (e.detail['advSort'] == 21) {
          allArr.sort(util.compareSort("unit_price", "desc"));
        }
        if (e.detail['advSort'] == 31) {
          allArr.sort(util.compareSort("area", "desc"));
        }
        this.setData({
          loadingDisplay: "none",
          allOriginalData: allArr,
          allData: allArr.slice(0, 5)
        })
      } else {
        for (let key in e.detail) {
          app.globalData.searchLongData[key] = e.detail[key];
        }
        SearchLongDataSubject.next();
        this.setData({
          loadingDisplay: "block",
          countFlag: "",
          allData: [],
          editFlag: false,
          selectAllFlag: false
        });
        this.onLoad();
      }
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
      if (this.data.allCount > 50) {
        if (!this.data.enoughBottom) {
          if (this.data.editFlag) {
            return
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
            return
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

  goRefresh() {
    this.setData({
      loadingDisplay: "block",
      countFlag: "",
      allData: []
    });
    this.onLoad();
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
  getIndexLongHouseData() {
    Http.get("/long/indexHose.json").then(resp => {
      const hourLongMoney = resp.data.hourMoney || 2;
      wx.setStorageSync("hourLongMoney", hourLongMoney);
      this.setData({
        fee: hourLongMoney
      })
    });
  },
  async getAllBrandData() {
    wx.removeStorageSync('fddShortRentBlock');
    let enoughList = [];
    let wiwjDataObj = await house.getSecondWiwjData(1, this.data.wiwjfilter);
    let lianjiaDataObj = await house.getSecondLianjiaData(1, this.data.ljfilter);
    if (wiwjDataObj.network && lianjiaDataObj.network) {
      this.setData({
        loadingDisplay: "none",
        countFlag: 2
      });
      return;
    }
    console.log(wiwjDataObj);
    console.log(lianjiaDataObj);
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
        name: "链家",
        value: lianjiaDataObj.lianjiaCount
      });
    }
    enoughList.sort(util.compareSort("value", "desc"));
    let houseData = house.getBrandSecondHouseData({//数据返回处理方法
      wiwjCount: wiwjDataObj.wiwjCount,
      lianjiaCount: lianjiaDataObj.lianjiaCount,
      wiwjData,
      lianjiaData,
      type: 1
    });
    console.log(houseData)
    if (houseData.allCount > 0) {
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
        wiwjCount: wiwjDataObj.wiwjCount,
        lianjiaCount: lianjiaDataObj.lianjiaCount,
        wiwjFilterData: houseData.wiwjFilterData,
        lianjiaFilterData: houseData.lianjiaFilterData,
        enoughList,
        loadingDisplay: "none",
        rowData: houseData.rowData
      });
    } else {
      this.setData({
        loadingDisplay: "none",
        countFlag: 0,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount
      });
    }
  },
  async getAllPersonalData() {
    wx.removeStorageSync('fddShortRentBlock');
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
        fangtianxiaCount: fangtianxiaDataObj.fangtianxiaCount,
        wbtcCount: wbtcDataObj.wbtcCount,
        fangtianxiaFilterData: houseData.fangtianxiaFilterData,
        wbtcFilterData: houseData.wbtcFilterData,
        enoughList,
        loadingDisplay: "none",
        rowData: houseData.rowData
      });
    } else {
      this.setData({
        loadingDisplay: "none",
        countFlag: 0,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount
      });
    }
  },
  // 获取用户信息，盯盯币，是否绑定微信公众号 和 手机绑定
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
        dialogText: "已帮您甄选" +
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
  // 跳转统计详情
  goToDetail() {
    let app = getApp();
    app.globalData.houseListData = {
      allCount: this.data.allCount,
      wiwjCount: this.data.wiwjCount,
      lianjiaCount: this.data.lianjiaCount,
      fangtianxiaCount: this.data.fangtianxiaCount,
      wbtcCount: this.data.wbtcCount,
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
      chooseType: this.data.chooseType,
      allOriginalData: this.data.allOriginalData,
      rowData: this.data.rowData,
    };
    if (this.data.chooseType === 1) {
      app.globalData.houseListData[
        "wiwjLowPriceData"
      ] = this.data.wiwjLowPriceData;
      app.globalData.houseListData[
        "lianjiaLowPriceData"
      ] = this.data.lianjiaLowPriceData;
      app.globalData.houseListData["wiwjFilterData"] = this.data.wiwjFilterData;
      app.globalData.houseListData[
        "lianjiaFilterData"
      ] = this.data.lianjiaFilterData;
    }
    if (this.data.chooseType === 2) {
      app.globalData.houseListData[
        "fangtianxiaLowPriceData"
      ] = this.data.fangtianxiaLowPriceData;
      app.globalData.houseListData[
        "wbtcLowPriceData"
      ] = this.data.wbtcLowPriceData;
      app.globalData.houseListData[
        "fangtianxiaFilterData"
      ] = this.data.fangtianxiaFilterData;
      app.globalData.houseListData["wbtcFilterData"] = this.data.wbtcFilterData;
    }
    this.setData({
      editFlag: false,
      selectAllFlag: true
    })
    this.goToSelectAll()
    wx.navigateTo({
      url: "../statistics/statistics?rentType=3"
    });
  },
  goEdit() {
    this.setData({
      editFlag: !this.data.editFlag
    })
    if (!this.data.editFlag) {
      this.setData({
        selectAllFlag: true
      })
      this.goToSelectAll()
    }
  },
  
  
  // 开启监控取消
  getMonitorEvent(e) {
    this.setData({
      monitorDisplay: e.detail
    });
  },
  // 开启监控确认
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
    let data = {
      noteSelect,
      publicSelect,
      rowData: this.data.rowData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      wiwjCount: this.data.wiwjCount,
      lianjiaCount: this.data.lianjiaCount
    }
    let addData = house.addSecondMonitorData(data)
    console.log(addData)
    wx.showLoading({
      title: '正在添加监控...',
      mask: true
    });
    monitorApi.addSecondMonitor(addData).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      app.switchRent = 3;
      wx.switchTab({
        url: "../monitor/monitor"
      });
    });
  },
  // 开启监控--未关注公众号时-点击关注号
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
  // 房源充足，到底和查看更多弹窗隐藏
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail
    });
  },
});