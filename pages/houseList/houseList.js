const houseApi = require('../../api/houseApi.js');
const userApi = require('../../api/userApi.js');
const monitorApi = require('../../api/monitorApi.js');
const util = require('../../utils/util.js');
const monitor = require('../../utils/monitor.js');
const house = require('../../utils/house.js');
const regeneratorRuntime = require('../../lib/runtime.js');
import Http from "../../utils/http.js";
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
    monitorenoughDisplay:'none',
    monitorDisplay: 'none',
    collectDisplay: 'none',
    ddCoin: 0,
    loadingDisplay: 'block',
    countFlag: '',
    checkInDate: '--', //入住日期
    checkOutDate: '--', //退日期
    dayCount: 1,//入住天数
    cityName: '--',
    locationName: '全城',
    publicDisplay: 'none',
    isBack: false,
    listSortType: 1, //列表排序，1 低到高；2高到低
    enoughBottom:false,
    monitorBottom: false
  },
  clickSelectItem(e) {
    var type = e.detail.type;
    if (type) {
      this.setData({
        showAdvance: true,
        showAdvanceType: type,
      });
    } else {
      this.setData({
        showAdvance: false,
        showAdvanceType: 0,
      });
    }
  },
  submitAdvance() {
    var houseSelect = this.selectComponent('#houseSelect');
    houseSelect.reSetData();
    console.log('查询完毕');
    this.setData({
      showAdvance: false,
      loadingDisplay: 'block',
      countFlag: '',
      allData: [],
      showUI: true
    });
    this.onLoad();
  },
  onLoad: function(options) {
    let tjScreen = house.tjScreenParam(1)
    let xzScreen = house.xzScreenParam(1)
    let mnScreen = house.mnScreenPara(1)
    let zgScreen = house.zgScreenPara(1)
    let x = app.globalData.searchData
    let budget = '';
    if (x.minPrice == 0 && x.maxPrice == 99999){
      budget = '不限'
    }
    if (x.minPrice == 0 && x.maxPrice < 99999) {
      budget = '￥' + x.maxPrice+'以下'
    }
    if (x.minPrice > 0 && x.maxPrice < 99999) {
      budget = '￥' + x.minPrice+'-'+x.maxPrice 
    }
    if (x.minPrice > 0 && x.maxPrice == 99999) {
      budget = '￥' + x.minPrice + '以上'
    }
    this.setData({
      tjfilter: tjScreen,
      xzfilter: xzScreen,
      mnfilter: mnScreen,
      zgfilter: zgScreen,
      checkInDate: x.beginDate.split('-')[1] +'.' +x.beginDate.split('-')[2],
      checkOutDate: x.endDate.split('-')[1] +'.' +x.endDate.split('-')[2],
      dayCount: x.dayCount,
      cityName: x.city,
      locationName: x.area || '全城',
      listSortType: 1,
      budget: budget,
      sortType: x.sort
    });
    this.getIndexHouseData()
    this.getAllData();
  },
  onShow: function() {
    this.getUserInfo();
    //this.setData({showAdvance: false,showAdvanceType: 0});
    if (this.data.isBack) {
      // this.setData({
      //   loadingDisplay: 'block',
      //   countFlag: '',
      //   allData: [],
      // });
      // this.onLoad();
      let x = app.globalData.searchData
      this.setData({
        cityName: x.city,
      })
    }
  },
  goRefresh(){
    this.setData({
      loadingDisplay: 'block',
      countFlag: '',
      allData: [],
    });
    this.onLoad()
  },

  onReachBottom(){
    console.log('到底了')
    this.setData({
      loadingShow:true
    })
    if (this.data.allData < this.data.allOriginalData){
      let timers = setTimeout(() => {
          this.addDataToArray()
          clearTimeout(timers)
      }, 500)
    }else{
      this.setData({
        loadingShow: false
      })
      if (this.data.allCount > 50){
        if (!this.data.enoughBottom) {
          this.setData({
            monitorenoughDisplay:'block',
            dialogTitle: '哎呀，到底了',
            dialogText: '您已查看全部房源，更多房源可前往各平台查看。',
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
      }
      if (this.data.allCount <= 50 ){
        if (!this.data.monitorBottom) {
          this.setData({
            monitorDisplay: 'block',
            monitorTitle: '到底了!你可以开启监控',
            monitorBottom: true,
          });
        } else {
          wx.showToast({
            title: '到底了',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
    
  },
  addDataToArray(){
    if (this.data.allData.length < this.data.allOriginalData.length){
      const index = this.data.allData.length;
      const addArr = this.data.allOriginalData.slice(index,index+5);
      const newArr = [].concat(this.data.allData).concat(addArr);
      this.setData({
        allData: newArr,
        loadingShow:false
      })
    }
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
  goSort() {
    let arr = [...this.data.allOriginalData]
    let sort = house.sort(arr, this.data.listSortType)
    if (this.data.listSortType == 2) {
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 1
      })
    } else {
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 2
      })
    }
    this.setData({
      allOriginalData: sort.arr,
      allData: sort.arr.slice(0, 5),
      loadingDisplay: 'none',
    })
  },
  getIndexHouseData(){
    Http.get('/indexHose.json').then(resp => {
      const hourMoney = resp.data.hourMoney||1
      wx.setStorageSync('hourMoney', hourMoney)
      this.setData({
        fee: hourMoney
      })
    })
  },
  async getAllData() {
    wx.removeStorageSync('collectionObj');
    let tjDataObj = await house.getTjData(1, this.data.tjfilter);
    let xzDataObj = await house.getXzData(1, this.data.xzfilter);
    let mnDataObj = await house.getMnData(1, this.data.mnfilter);
    let zgDataObj = await house.getZgData(1, this.data.zgfilter);
    if (tjDataObj.network && xzDataObj.network && mnDataObj.network && zgDataObj.network){
      this.setData({
        loadingDisplay: 'none',
        countFlag: 2,
      })
      return;
    }
    let tjData = tjDataObj.arr||[];
    let xzData = xzDataObj.arr || [];
    let mnData = mnDataObj.arr || [];
    let zgData = zgDataObj.arr||[];
    let enoughList = [];
    if (tjDataObj.tjCount > -1) { enoughList.push({ key: 'tj',name:'途家', value: tjDataObj.tjCount})}
    if (xzDataObj.xzCount > -1) { enoughList.push({ key: 'xz', name: '小猪',value: xzDataObj.xzCount }) }
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
      zgData,
      type:1
    })

    if (houseData.allCount > 0 && houseData.allData.length>0) {
      this.setData({
        countFlag: 1
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
      enoughBottom: false,
      monitorBottom: false,
      },
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
      enoughList: this.data.enoughList,
      tjFilterCount: this.data.tjIdData,
      xzFilterCount: this.data.xzIdData,
      mnFilterCount: this.data.mnIdData,
      zgFilterCount: this.data.zgIdData,
      ddCoin: this.data.ddCoin,
      bindPhone: this.data.bindPhone,
      bindPublic: this.data.bindPublic,
      isBack: false,
      sortType: this.data.sortType
    };
    wx.navigateTo({
      url: '../statistics/statistics?rentType=1'
    });
  },

  /**
   * 房源收藏
   */
  goToCollection(e) {
    let num = wx.getStorageSync('collectionNum');
    let index = e.detail.index;
    let pId = this.data.allData[index].platformId;
    let proId = this.data.allData[index].productId;
    house.houseCollection(pId, proId)
    let item = 'allData[' + index + '].collection';
    this.setData({
      [item]: !this.data.allData[index].collection
    });
    if(!num){
      this.setData({
        collectDisplay: 'block',
      });
    }
  },
  /**
   * 房源充足，到底和查看更多弹窗隐藏
  */
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay:e.detail
    });
  },

  getPublicEvent(e) {
    this.setData({
      monitorDisplay: 'block',
      publicDisplay: e.detail
    });
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
    let count = this.data.allCount;
    let app = getApp()
    if (count > 50) {
      this.setData({
        monitorenoughDisplay:'block',
        dialogTitle:'房源充足',
        dialogText: '已帮您甄选' + this.data.allOriginalData.length + '套房源，若想查看更多房源，请点击前往各平台查看',
        dialogBtn:'知道了'
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
        monitorTitle: '房源监控确认',
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
    let app = getApp()
    if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
      // 数据绑定手机号，如果未绑定，跳转到手机号绑定页面
      wx.navigateTo({
        url: '../bindPhone/bindPhone'
      });
      return;
    }
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
    wx.showLoading({
      title: '正在添加监控...',
      mask: true
    });
    monitorApi.addMonitor(data).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      app.switchRent = 1;
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
  preventTouchMove(){}
});