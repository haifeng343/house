const monitorApi = require('../../api/monitorApi.js')
const util = require('../../utils/util.js')
Page({
  data: {
    allCount: 0,
    showCount: 0,
    averagePrice: 0,
    lowPrice: 0,
    lowPriceData: '',
    tjFilterCount: [],
    xzFilterCount: [],
    mnFilterCount: [],
    zgFilterCount: [],
    isMonitorHouse: 0, //1;不可收藏；0；可收藏
    stopDisplay: 'none',
    bottomType: 0,
    monitorenoughDisplay: 'none',
    monitorDisplay: 'none',
    publicDisplay:'none',
    updateMonitorDisplay: 'none',
    updateLongDisplay: 'none',
    fee: 0,
    sort: false,
    enoughList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const app = getApp(); //rentType  1短租 2长租
    if (options.rentType == 1){
      wx.setNavigationBarTitle({
        title: '短租-统计信息'
      })
      let data = app.globalData.houseListData;
      let fee = 1;
      if(data.fee){
        fee = data.fee
      }else{
        fee = wx.getStorageSync('hourMoney') || 1
      }
      for (let i = 0; i < data.enoughList.length; i++) {
        if (data.enoughList[i].key == 'tj') {
          data.enoughList[i]['selectCount'] = data.tjFilterCount.length
          data.enoughList[i]['lowPriceData'] = data.tjLowPriceData
        }
        if (data.enoughList[i].key == 'xz') {
          data.enoughList[i]['selectCount'] = data.xzFilterCount.length
          data.enoughList[i]['lowPriceData'] = data.xzLowPriceData
        }
        if (data.enoughList[i].key == 'mn') {
          data.enoughList[i]['selectCount'] = data.mnFilterCount.length
          data.enoughList[i]['lowPriceData'] = data.mnLowPriceData
        }
        if (data.enoughList[i].key == 'zg') {
          data.enoughList[i]['selectCount'] = data.zgFilterCount.length
          data.enoughList[i]['lowPriceData'] = data.zgLowPriceData
        }
      }
      this.setData({
        allCount: data.allCount,
        showCount: data.showCount,
        averagePrice: data.averagePrice,
        lowPrice: data.lowPrice,
        lowPriceData: data.lowPriceData,
        enoughList: data.enoughList,
        tjFilterCount: data.tjFilterCount,
        xzFilterCount: data.xzFilterCount,
        mnFilterCount: data.mnFilterCount,
        zgFilterCount: data.zgFilterCount,
        ddCoin: data.ddCoin || 0,
        bindPhone: data.bindPhone || false,
        bindPublic: data.bindPublic || false,
        isMonitorHouse: data.isMonitorHouse || 0,
        bottomType: data.bottomType || 0,
        taskTime: data.taskTime || '',
        startTimeName: data.startTimeName || '',
        monitorId: data.monitorId || '',
        totalFee: data.totalFee || '', //消耗盯盯币
        defaultBeginDate: app.globalData.monitorDefaultData.beginDate,
        defaultEndDate: app.globalData.monitorDefaultData.endDate,
        defaultCityName: app.globalData.monitorDefaultData.city,
        defaultLocationName: app.globalData.monitorDefaultData.area || '--',
        defaultMInPrice: app.globalData.monitorDefaultData.minPrice,
        defaultMaxPrice: app.globalData.monitorDefaultData.maxPrice,
        beginDate: app.globalData.monitorSearchData.beginDate,
        endDate: app.globalData.monitorSearchData.endDate,
        cityName: app.globalData.monitorSearchData.city,
        locationName: app.globalData.monitorSearchData.area || '--',
        updateMinPrice: app.globalData.monitorSearchData.minPrice,
        updateMaxPrice: app.globalData.monitorSearchData.maxPrice,
        sort: data.sortType == 2 ? false : true,
        fee,
        rentType:1 //1：短租 2：长租
      })
    }
    if (options.rentType == 2){
      wx.setNavigationBarTitle({
        title: '长租-统计信息'
      })
      let data = app.globalData.houseListData
      let fee = 2;
      if (data.fee) {
        fee = data.fee
      } else {
        fee = wx.getStorageSync('hourLongMoney') || 2
      }
      for (let i = 0; i < data.enoughList.length; i++) {
        if (data.chooseType == 1){
          if (data.enoughList[i].key == 'wiwj') {
            data.enoughList[i]['selectCount'] = data.wiwjFilterCount.length
            data.enoughList[i]['lowPriceData'] = data.wiwjLowPriceData
          }
          if (data.enoughList[i].key == 'lj') {
            data.enoughList[i]['selectCount'] = data.lianjiaFilterCount.length
            data.enoughList[i]['lowPriceData'] = data.lianjiaLowPriceData
          }
        }
        if (data.chooseType == 2) {
          if (data.enoughList[i].key == 'ftx') {
            data.enoughList[i]['selectCount'] = data.fangtianxiaFilterCount.length
            data.enoughList[i]['lowPriceData'] = data.fangtianxiaLowPriceData
          }
          if (data.enoughList[i].key == 'tc') {
            data.enoughList[i]['selectCount'] = data.wbtcFilterCount.length
            data.enoughList[i]['lowPriceData'] = data.wbtcLowPriceData
          }
        }
      }
      this.setData({
        allCount: data.allCount,
        showCount: data.showCount,
        averagePrice: data.averagePrice,
        lowPrice: data.lowPrice,
        lowPriceData: data.lowPriceData,
        highAreaData: data.highAreaData,
        enoughList: data.enoughList,
        wiwjIdData: data.wiwjFilterCount,
        lianjiaIdData: data.lianjiaFilterCount,
        fangtianxiaIdData: data.fangtianxiaFilterCount,
        wbtcIdData: data.wbtcFilterCount,
        ddCoin: data.ddCoin || 0,
        bindPhone: data.bindPhone || false,
        bindPublic: data.bindPublic || false,
        isMonitorHouse: data.isMonitorHouse || 0,
        bottomType: data.bottomType || 0,
        taskTime: data.taskTime || '',
        startTimeName: data.startTimeName || '',
        monitorId: data.monitorId || '',
        totalFee: data.totalFee || '', //消耗盯盯币
        sort: data.sortType == 1 ? false : true,
        rentType: 2, //1：短租 2：长租
        fee,
        type: (data.bottomType == 1 || data.bottomType == 2)?2:1
      })
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 立即开始----开启监控
   */
  getUserInfoFun: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        that.getDdCoin()
      },
      fail: function(res) {
      }
    })
  },
  /**
   * 立即开始----开启监控
   */
  startMonitor() {
    let count = this.data.allCount
    if (count >= 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '房源充足',
        dialogText: '符合条件的房源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体房源。',
        dialogBtn: '知道了',
      })
    } else {
      const app = getApp()
      if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
        wx.navigateTo({
          url: '../bindPhone/bindPhone'
        })
        return;
      }
      this.setData({
        monitorDisplay: 'block',
        monitorTitle: '房源监控确认',
      })
    }
  },
  /**
   * 立即开始----开启监控取消
   */
  getMonitorEvent(e) {
    this.setData({
      monitorDisplay: e.detail,
    })
  },
  /**
   * 立即开始----开启监控确认
   */
  getmonitorConfirmEvent(e) {
    this.setData({
      monitorDisplay: e.detail.show,
    })
    if (this.data.rentType == 1){
      this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect)
    }
    if (this.data.rentType == 2) {
      this.getStartLongMonitor(e.detail.noteSelect, e.detail.publicSelect)
    }
    
  },
  /**
   * 立即开始----开启监控--未关注公众号时
   */
  getMonitorPublicEvent(e) {
    this.setData({
      monitorDisplay: 'none',
      publicDisplay: e.detail
    })
  },
  /**
   * 公众号隐藏
   */
  getPublicEvent(e) {
    this.setData({
      publicDisplay: e.detail,
      monitorDisplay:'block'
    })
  },
  getPublicConfrimEvent(e) {
    this.setData({
      publicDisplay: e.detail,
    })
    wx.navigateTo({
      url: '../public/public',
    })
  },
  /**
   * 添加监控，开启监控
   */
  getStartMonitor(noteSelect, publicSelect) {
    const app = getApp()
    let data = {
      beginDate: app.globalData.searchData.beginDate, //入住日期
      endDate: app.globalData.searchData.endDate,    //离开日期
      cityType: 0, //城市类型，0-国内城市，1-国际城市
      cityName: app.globalData.searchData.city,//城市名称
      //locationName: '',//位置名称
      //locationType: 11,//位置类型11景区，12高校，13机场，14医院，15商圈，16行政区，17地铁 ，18车站
      peopleNum: app.globalData.searchData.gueseNumber,
      rentType: app.globalData.searchData.leaseType, //出租类型,2单间出租，1整套出租 不选择 '' 
      //layoutRoom 户型
      //facilities 配套设备
      minPrice: Number(app.globalData.searchData.minPrice),
      maxPrice: Number(app.globalData.searchData.maxPrice),
      sortType: app.globalData.searchData.sort,
      //notice 
      //fddShortRentBlock 
    }
    if (app.globalData.searchData.area) {
      data.locationName = app.globalData.searchData.area
    }
    if (app.globalData.searchData.areaType) {
      data.locationType = app.globalData.searchData.areaType
    }
    //通知方式
    let notice = []
    if (noteSelect) {
      notice.push(2)
    }
    if (publicSelect) {
      notice.push(1)
    }
    data.notice = notice.join(',')
    //户型
    let layoutRoom = [];
    if (app.globalData.searchData.houseType && app.globalData.searchData.houseType.length) {
      data.layoutRoom = app.globalData.searchData.houseType.join(',')
    }
    //配套设施
    if (app.globalData.searchData.equipment && app.globalData.searchData.equipment.length) {
      data.facilities = app.globalData.searchData.equipment.join(',')
    }
    let tjId = [...this.data.tjFilterCount]
    let xzId = [...this.data.xzFilterCount]
    let mnId = [...this.data.mnFilterCount]
    let zgId = [...this.data.zgFilterCount]
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
    wx.showLoading({
      title: '',
      mask: true
    });
    monitorApi.addMonitor(data).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      })
      app.switchRent = 1;
      wx.switchTab({
        url: '../monitor/monitor'
      })
    })
  },
  getStartLongMonitor(noteSelect, publicSelect) {
    let app = getApp();
    let y = app.globalData.searchLongData
    let data = {
      houseSource: y.chooseType,//房来源:1品牌中介，2个人房源
      cityName: y.city,//城市名称
      searchJson: y.areaJson,//搜索参数拼接
      buildArea: y.longBuildAreas,//面积
      minPrice: y.minPrice,
      maxPrice: y.maxPrice == 10000 ? 99999 : y.maxPrice,
      areaJson: JSON.stringify(y.areaId)
    }
    if (y.longSortTypes) {
      data['sortType'] = y.longSortTypes
    }
    if (y.areaType) { //位置ID
      data['locationType'] = y.areaType
    }
    if (y.areaType == 50) {//地铁
      if (y.areaId.subwaysLine) { data['parentName '] = y.areaId.subwaysLine }
    } 
    if (y.areaType == 60) { //附近
      data['longitude'] = y.areaId.longitude
      data['latitude'] = y.areaId.latitude
      data['nearby'] = y.areaId.nearby
    }
    if (y.area) { //位置名称
      data['locationName'] = y.area
    }
    if (y.longFloorTypes.length) { //楼层
      data['floorType'] = y.longFloorTypes.join(',');
    }
    if (y.longRentTypes) { //房源类型
      data['rentType'] = y.longRentTypes
    }
    if (y.longHeadings.length) {//朝向
      data['heading'] = y.longHeadings.join(',');
    }
    if (y.longHouseTags.length) {//房源亮点
      data['houseTags'] = y.longHouseTags.join(',');
    }
    if (y.longLayouts.length) {//户型
      data['layoutRoom'] = y.longLayouts.join(',');
    }
    //通知方式
    let notice = [];
    if (noteSelect) { notice.push(2) }
    if (publicSelect) { notice.push(1) }
    data['notice'] = notice.join(',');
    let obj = wx.getStorageSync('collectionObj') || {};
    let fddShortRentBlock = {};
    if (y.chooseType == 1) {
      let wiwjId = [...this.data.wiwjIdData];
      let ljId = [...this.data.lianjiaIdData];
      if (obj && obj['wiwj'] && obj['wiwj'].length) {
        for (let i = 0; i < obj['wiwj'].length; i++) {
          let index = wiwjId.indexOf(obj['wiwj'][i]);
          wiwjId.splice(index, 1);
        }
      }
      if (obj && obj['lj'] && obj['lj'].length) {
        for (let i = 0; i < obj['lj'].length; i++) {
          let index = ljId.indexOf(obj['lj'][i]);
          ljId.splice(index, 1);
        }
      }
      fddShortRentBlock['wiwj'] = wiwjId
      fddShortRentBlock['lj'] = ljId
    } else {
      let ftxId = [...this.data.fangtianxiaIdData];
      let tcId = [...this.data.wbtcIdData];
      if (obj && obj['ftx'] && obj['ftx'].length) {
        for (let i = 0; i < obj['ftx'].length; i++) {
          let index = ftxId.indexOf(obj['ftx'][i]);
          ftxId.splice(index, 1);
        }
      }
      if (obj && obj['tc'] && obj['tc'].length) {
        for (let i = 0; i < obj['tc'].length; i++) {
          let index = tcId.indexOf(obj['tc'][i]);
          tcId.splice(index, 1);
        }
      }
      fddShortRentBlock['ftx'] = ftxId
      fddShortRentBlock['tc'] = tcId
    }
    data['fddShortRentBlock'] = fddShortRentBlock;
    wx.showLoading({
      title: '',
      mask: true
    });
    monitorApi.addLongMonitor(data).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
      app.switchRent = 2;
      wx.switchTab({
        url: '../monitor/monitor'
      });
    });
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
    if (this.data.rentType == 1){
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
            delta: 2
          })
        }
      })
    }

    if (this.data.rentType == 2){
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
            delta: 2
          })
        }
      })
    }
    
  },
  goBack() {
    //返回到监控列表页面
    wx.navigateBack({
      delta: 2
    })
  },
  //保存修改
  goSave() {
    let app = getApp()
    let count = this.data.allCount
    if (count >= 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '房源充足',
        dialogText: '符合条件的房源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体房源。',
        dialogBtn: '知道了'
      })
    } else {
      if(this.data.rentType == 1){
        this.setData({
          updateMonitorDisplay: 'block',
        })
      }
      if (this.data.rentType == 2) {
        this.setData({
          updateLongDisplay: 'block',
          updateData: app.globalData.monitorSearchLongData,
          defalutData: app.globalData.monitorDefaultSearchLongData
        })
      }
    }
    

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
    let tjId = [...this.data.tjFilterCount]
    let xzId = [...this.data.xzFilterCount]
    let mnId = [...this.data.mnFilterCount]
    let zgId = [...this.data.zgFilterCount]
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
        delta: 2
      })
    })
  },
  getLongUpdateCancelEvent(e){
    this.setData({
      updateLongDisplay: e.detail,
    })
  },
  getLongUpdateConfrimEvent(e) {
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
        delta: 2
      })
    });
  },
  getEnoughEvent(e) {
    this.setData({
      monitorenoughDisplay: e.detail,
    })
  },

})