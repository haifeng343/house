const house = require("../../utils/house.js");
const regeneratorRuntime = require("../../lib/runtime.js");
const secondApi = require("../../api/longrent.js"); //二手房
const util = require("../../utils/util.js");
const userApi = require("../../api/userApi.js");
const monitorApi = require("../../api/monitorApi.js");
const app = getApp();
import positionService from "../positionLongSelect/service";
import {
  SearchSecondDataSubject
} from "../../utils/searchSecondDataStream";
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
    wiwjCount: 0,
    lianjiaCount: 0,
    wiwjFilterData: [],
    lianjiaFilterData: [],
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
    secondSearchData: {},
    positionData: [],
    editFlag: false,
    selectAllFlag: false,
    indexArr: [],
    type:0,////1.短租  2长租的品牌中介 3长租的个人房源 4.二手房
  },
  onLoad: function(options) {
    let x = app.globalData.secondSearchData;
    let wiwjfilter = house.wiwjSecondScreenParam(1);
    let ljfilter = house.ljSecondScreenParam(1);
    new positionService().getSearchHoset(x.city, 1).then(resp => {
      const positionData = resp.data;
      this.setData({
        positionData
      });
    });
    this.setData({
      listSortType: 1,
      wiwjfilter,
      ljfilter,
      type:options.type || 0,
      secondSearchData: Object.assign({}, x),
      secondSortType: x.secondSortTypeMap //1: 低总价优先 2: 低单价优先
      },
      () => {
        this.getAllBrandData();
        this.getIndexLongHouseData();
      }
    );
  },
  onShow: function() {
    this.getUserInfo();
  },
  submit(e) {
    //把改变的值重新
    let allArr = [...this.data.allOriginalData]
    let arr = Object.keys(e.detail);
    if (arr.length) {
      if (arr.length == 1 && arr[0] == 'advSort') {
        app.globalData.secondSearchData['advSort'] = e.detail['advSort'];
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
          allData: allArr.slice(0, 5),
          secondSearchData: Object.assign({}, app.globalData.secondSearchData),
        })
      } else {
        for (let key in e.detail) {
          app.globalData.secondSearchData[key] = e.detail[key];
        }
        if(arr.indexOf('secondSortTypeMap')>-1){
          if(e.detail['secondSortTypeMap'] === 1||e.detail['secondSortTypeMap'] === 2){
            app.globalData.secondSearchData = Object.assign(app.globalData.secondSearchData, {'advSort':e.detail['secondSortTypeMap']});
          }else{
            app.globalData.secondSearchData = Object.assign(app.globalData.secondSearchData, {'advSort':0});
          }
        }
        SearchSecondDataSubject.next();
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
        clearTimeout(timer);
      }
    }, 300);
  },
  getIndexLongHouseData() {
    Http.get("/second/indexHouse.json").then(resp => {
      const hourSecondMoney = resp.data.hourMoney || 1;
      wx.setStorageSync("hourSecondMoney", hourSecondMoney);
      this.setData({
        fee: hourSecondMoney
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
    if (houseData.allCount > 0 && houseData.allData.length>0) {
      this.setData({
        countFlag: 1,
      });
    } else {
      this.setData({
        countFlag: 0,
      });
    }
    this.setData({
      allOriginalData: houseData.allData,
      allData: houseData.allData.slice(0, 5),
      allCount: houseData.allCount,
      averagePrice: houseData.averageunitPrice,//二手房单价平均价
      lowPrice: houseData.lowPrice,
      lowUnitPrice: houseData.lowUnitPrice,//二手房的单位最低价
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
      showCount: this.data.allOriginalData.length,
      averagePrice: this.data.averagePrice,
      lowUnitPrice: this.data.lowUnitPrice,//二手房的单位最低价
      lowPrice: this.data.lowPrice,
      lowPriceData: this.data.lowPriceData,
      highAreaData: this.data.highAreaData,
      enoughList: this.data.enoughList,
      ddCoin: this.data.ddCoin,
      bindPhone: this.data.bindPhone,
      bindPublic: this.data.bindPublic,
      isBack: false,
      sortType: this.data.secondSortType,
      allOriginalData: this.data.allOriginalData,
      rowData: this.data.rowData,
    };
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
    this.setData({
      editFlag: false,
      selectAllFlag: true
    })
    this.goToSelectAll()
    wx.navigateTo({
      url: "../statistics/statistics?rentType=3"
    });
  },
  goToSelectAll() {
    let num = 0
    let indexArr = []
    let d = [...this.data.allData]
    let a = [...this.data.allOriginalData]
    for (let i = 0; i < d.length; i++) {
      d[i]['collection'] = !this.data.selectAllFlag
    }
    for (let i = 0; i < a.length; i++) {
      a[i]['collection'] = !this.data.selectAllFlag
      indexArr.push(i)
    }
    if (!this.data.selectAllFlag) {
      num = this.data.allOriginalData.length
      indexArr
    } else {
      num = 0
      indexArr = []
    }
    this.setData({
      allOriginalData: a,
      allData: d,
      selectAllFlag: !this.data.selectAllFlag,
      selectNum: num,
      indexArr
    })
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
  },
  //跳转到监控规则
  navtoMonitorRule() {
    wx.navigateTo({
      url: '../monitorRule/index',
    })
  },
  // 房源充足，到底和查看更多弹窗隐藏
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail
    });
  },
});