const house = require('../../utils/house.js');
const monitor = require('../../utils/monitor.js');
const monitorApi = require('../../api/monitorApi.js')
const regeneratorRuntime = require('../../lib/runtime.js');
const util = require('../../utils/util.js');
const userApi = require('../../api/userApi.js');
import positionService from "../positionLongSelect/service";
import {
  SearchSecondMonitorDataSubject
} from "../../utils/searchSecondDataStream";
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
    wiwjFilterData: [],
    lianjiaFilterData: [],
    rowData: [],
    wiwjCount: 0,
    lianjiaCount: 0,
    stopDisplay: 'none',
    loadingDisplay: 'block',
    monitorenoughDisplay: 'none',
    followDisplay: 'none',
    updateMonitorDisplay: 'none',
    enoughBottom: false,
    monitorBottom: false,
    wiwjfilter: {},
    ljfilter: {},
    ftxfilter: {},
    tcfilter: {},
    editFlag: false,
    selectAllFlag: false,
    indexArr: [],
    mSelect: 1, //1全部 2新上 3价格
    isMtype: false
  },
  onLoad: function (options) {
    let data = app.globalData.monitorSecondData
    this.setData({
      monitorId: data.item.id,
    })
    this.getMonitorData();
  },
  onShow: function () {
    this.getUserInfo();
  },
  onHouseShow() {
    let x = app.globalData.monitorSecondSearchData
    let wiwjfilter = house.wiwjSecondScreenParam(2);
    console.log(wiwjfilter)
    let ljfilter = house.ljSecondScreenParam(2);
    this.setData({
      listSortType: 1,
      wiwjfilter,
      ljfilter,
      mSelect: 1
    }, () => {
        this.getAllBrandData();
    })
  },
  submit(e) {
    //把改变的值重新
    let allArr = [...this.data.allOriginalData]
    let arr = Object.keys(e.detail);
    if (arr.length) {
      if (arr.length == 1 && arr[0] == 'advSort') {
        app.globalData.monitorSecondSearchData['advSort'] = e.detail['advSort'];
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
          app.globalData.monitorSecondSearchData[key] = e.detail[key]
        }
        SearchSecondMonitorDataSubject.next()
        this.setData({
          loadingDisplay: 'block',
          countFlag: '',
          allData: [],
          editFlag: false,
          selectAllFlag: false,
          updateData: Object.assign({}, app.globalData.monitorSecondSearchData),
        });
        if (util.objectDiff(app.globalData.monitorSecondSearchData, app.globalData.monitorDefaultSearchSecondData)) {
          this.onLoad()
        } else {
          this.onHouseShow()
        }

      }
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
            if (this.data.editFlag) {
              return
            }
            this.setData({
              monitorenoughDisplay: 'block',
              dialogTitle: '哎呀，到底了',
              dialogText: '已看完筛选出的' + this.data.allOriginalData.length + '套房源，各平台 还有更多房源可供选择, 您可以前往继续 查询。',
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
  getMonitorData(detail) {
    let data = {
      monitorId: this.data.monitorId,
    };
    monitorApi.monitorSecondDetail(data).then(res => {
      if (!res) {
        this.setData({
          loadingDisplay: 'none',
          countFlag: 3,
          countBack: true
        })
        return;
      }
      console.log(res)
      let houseList = res.data.data.houseList; //监控房源
      let monitorDetail = res.data.data.monitorDetail; //监控条件
      let monitorCount = res.data.data.monitorCount; //监控计算
      let monitorCityId = {}
      let cityList = JSON.parse(monitorDetail.cityJson || '{}')
      wx.setNavigationBarTitle({
        title: '二手房-' + (monitorDetail.cityName.length > 4 ? monitorDetail.cityName.slice(0, 4) + '...' : monitorDetail.cityName)
      })
      for (let key in cityList) {
        if (key === 'wiwj') {
          monitorCityId.wiwj = cityList.wiwj.code
        } else if (key === 'lj') {
          monitorCityId.lj = cityList.lj.city_id
        }
      }
     
      app.globalData.monitorSecondSearchData = {
        city: monitorDetail.cityName, //城市名
        cityId: monitorCityId, //城市ID
        cityJson: monitorDetail.cityJson,
        area: monitorDetail.locationName || '', // 地点
        areaId: JSON.parse(monitorDetail.areaJson || {}), //地点标识
        areaType: monitorDetail.locationType || 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线50：地铁站 60：附近
        areaJson: monitorDetail.searchJson, //json
        minPrice: monitorDetail.minPrice, //最低价
        maxPrice: monitorDetail.maxPrice === 99999 ? 151 : monitorDetail.maxPrice, //最高价 不限"99999"
        placeholderMinPrice: monitorDetail.actualPrice || 0, //城市最低价格
        placeholderMaxPrice: (monitorDetail.cityName == '北京' || monitorDetail.cityName == '北京')?500:300, //城市最高价格
        minArea: monitorDetail.minArea, //最低面积
        maxArea: monitorDetail.maxArea, //最高面积 上限150
        
        secondHouseDecorationMap: monitorDetail.decorate || '', //装修  1: 毛坯房 2: 普通装修 3: 精装修
        secondHouseTagMap: monitorDetail.houseTags ? monitorDetail.houseTags.split(',').map(item => +item) : [], //房源特色 1: 满二 2: 满五 3: 近地铁 4: 随时看房 5: VR房源 6: 新上房源
        secondHeadingMap: monitorDetail.heading ? monitorDetail.heading.split(',').map(item => +item) : [], //朝向 1: 朝东 2: 朝西 3: 朝南 4: 朝北 10: 南北通透
        secondFloorTypeMap: monitorDetail.floorType ? monitorDetail.floorType.split(',').map(item => +item) : [], //楼层 1: 低楼层 2: 中楼层 3: 高楼层
        secondHouseUseMap: monitorDetail.purpose ? monitorDetail.purpose.split(',').map(item => +item) : [], //用途 1: 普通住宅 2: 别墅 3: 其他
        secondBuildingAgeMap: monitorDetail.towerAge || '', //楼龄 1: 5年以内 2: 10年以内 3: 15年以内 4: 20年以内 5: 20年以上
        secondLayoutMap: monitorDetail.layoutRoom ? monitorDetail.layoutRoom.split(',').map(item => +item) : [], //户型 1: 一室 2: 二室 3: 三室 4: 四室 5: 四室以上
        secondSortTypeMap: monitorDetail.sortType || 0, //房源偏好 1: 低总价优先 2: 低单价优先
      }
      app.globalData.monitorDefaultSearchSecondData = {
        city: monitorDetail.cityName, //城市名
        cityId: monitorCityId, //城市ID
        cityJson: monitorDetail.cityJson,
        area: monitorDetail.locationName || '', // 地点
        areaId: JSON.parse(monitorDetail.areaJson || {}), //地点标识
        areaType: monitorDetail.locationType || 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线50：地铁站 60：附近
        areaJson: monitorDetail.searchJson, //json
        minPrice: monitorDetail.minPrice, //最低价
        maxPrice: monitorDetail.maxPrice === 99999 ? 151 : monitorDetail.maxPrice, //最高价 不限"99999"
        placeholderMinPrice: monitorDetail.actualPrice || 0, //城市最低价格
        placeholderMaxPrice: (monitorDetail.cityName == '北京' || monitorDetail.cityName == '北京') ? 500 : 300, //城市最高价格
        minArea: monitorDetail.minArea, //最低面积
        maxArea: monitorDetail.maxArea, //最高面积 上限150
        secondHouseDecorationMap: monitorDetail.decorate || '', //装修  1: 毛坯房 2: 普通装修 3: 精装修
        secondHouseTagMap: monitorDetail.houseTags ? monitorDetail.houseTags.split(',').map(item => +item) : [], //房源特色 1: 满二 2: 满五 3: 近地铁 4: 随时看房 5: VR房源 6: 新上房源
        secondHeadingMap: monitorDetail.heading ? monitorDetail.heading.split(',').map(item => +item) : [], //朝向 1: 朝东 2: 朝西 3: 朝南 4: 朝北 10: 南北通透
        secondFloorTypeMap: monitorDetail.floorType ? monitorDetail.floorType.split(',').map(item => +item) : [], //楼层 1: 低楼层 2: 中楼层 3: 高楼层
        secondHouseUseMap: monitorDetail.purpose ? monitorDetail.purpose.split(',').map(item => +item) : [], //用途 1: 普通住宅 2: 别墅 3: 其他
        secondBuildingAgeMap: monitorDetail.towerAge || '', //楼龄 1: 5年以内 2: 10年以内 3: 15年以内 4: 20年以内 5: 20年以上
        secondLayoutMap: monitorDetail.layoutRoom ? monitorDetail.layoutRoom.split(',').map(item => +item) : [], //户型 1: 一室 2: 二室 3: 三室 4: 四室 5: 四室以上
        secondSortTypeMap: monitorDetail.sortType || 0, //房源偏好 1: 低总价优先 2: 低单价优先
      }
      let x = app.globalData.monitorSecondSearchData
      new positionService().getSearchHoset(x.city, 1).then(resp => {
        const positionData = resp.data;
        this.setData({ positionData });
      });
      if (!monitorCount || !monitorCount.allTotal || monitorCount.allTotal == 0 || !houseList || houseList.length == 0) {
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
          updateData: Object.assign({}, app.globalData.monitorSecondSearchData),
          defalutData: Object.assign({}, app.globalData.monitorDefaultSearchSecondData),
          editFlag: false,
          mSelect: detail ? detail : this.data.mSelect
        })
        return;
      }
      if (!this.data.isMtype) {
        let mType = house.getMonitorHouseType(houseList);
        this.setData({
          mSelect: mType,
          isMtype: true
        })
      }
      wx.hideLoading()
      let monitorHouseData = house.getMonitorSecondHouseData(houseList, detail ? detail : this.data.mSelect); //监控房源列表
      console.log(monitorHouseData)
      if (monitorHouseData.allData.length == 0) {
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
          updateData: Object.assign({}, app.globalData.monitorSecondSearchData),
          defalutData: Object.assign({}, app.globalData.monitorDefaultSearchSecondData),
          editFlag: false,
          mSelect: detail ? detail : this.data.mSelect
        })
        return;
      }
      let enoughList = [];
      if (monitorCount.wiwjTotal > -1) {
        enoughList.push({
          key: 'wiwj',
          name: '我爱我家',
          value: monitorCount.wiwjTotal
        })
      }
      if (monitorCount.ljTotal > -1) {
        enoughList.push({
          key: 'lj',
          name: '贝壳',
          value: monitorCount.ljTotal
        })
      }
      enoughList.sort(util.compareSort('value', 'desc'));
      this.setData({
        allOriginalData: monitorHouseData.allData,
        allData: monitorHouseData.allData.slice(0, 5),
        allCount: monitorCount.allTotal,
        averagePrice: monitorHouseData.averageunitPrice,
        lowPrice: monitorHouseData.lowPrice,
        highAreaData: monitorHouseData.highAreaData,
        lowPriceData: monitorHouseData.lowPriceData,
        wiwjLowPriceData: monitorHouseData.wiwjLowPriceData,
        lianjiaLowPriceData: monitorHouseData.ljLowPriceData,
        enoughList,
        wiwjCount: monitorCount.wiwjTotal || 0,
        lianjiaCount: monitorCount.ljTotal || 0,
        wiwjFilterData: monitorHouseData.wiwjFilterData || [],
        lianjiaFilterData: monitorHouseData.ljFilterData || [],
        isMonitorHouse: 1, //1;不可收藏；0；可收藏
        taskTime: monitor.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
        startTimeName: monitor.startTimeName(monitorDetail.startTime),
        fee: monitorDetail.fee,
        monitorId: monitorDetail.id,
        totalFee: monitorDetail.totalFee, //消耗盯盯币
        bottomType: 1, //0:房源列表；1监控详情房源列表；2监控详情修改之后
        loadingDisplay: 'none',
        countFlag: 1,
        longSortTypes: monitorDetail.sortType || '',
        updateData: Object.assign({}, app.globalData.monitorSecondSearchData),
        defalutData: Object.assign({}, app.globalData.monitorDefaultSearchSecondData),
        mSelect: detail ? detail : this.data.mSelect
      })
    })
  },
  async getAllBrandData() {
    wx.removeStorageSync('fddShortRentBlock');
    let enoughList = [];
    let wiwjDataObj = await house.getSecondWiwjData(2, this.data.wiwjfilter);
    let lianjiaDataObj = await house.getSecondLianjiaData(2, this.data.ljfilter)
    if (wiwjDataObj.network && lianjiaDataObj.network) {
      this.setData({
        loadingDisplay: 'none',
        countFlag: 2,
        countBack: false,
        bottomType: ''
      })
      return;
    }
    let wiwjData = wiwjDataObj.arr || [];
    let lianjiaData = lianjiaDataObj.arr || [];
    if (wiwjDataObj.wiwjCount > -1) {
      enoughList.push({
        key: 'wiwj',
        name: '我爱我家',
        value: wiwjDataObj.wiwjCount
      })
    }
    if (lianjiaDataObj.lianjiaCount > -1) {
      enoughList.push({
        key: 'lj',
        name: '贝壳',
        value: lianjiaDataObj.lianjiaCount
      })
    }
    enoughList.sort(util.compareSort('value', 'desc'));
    let houseData = house.getBrandSecondHouseData({
      wiwjCount: wiwjDataObj.wiwjCount,
      lianjiaCount: lianjiaDataObj.lianjiaCount,
      wiwjData,
      lianjiaData,
      type: 2
    })
    if (houseData.allCount > 0 && houseData.allData.length > 0) {
      console.log(houseData)
      this.setData({
        countFlag: 1,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount,
        averagePrice: houseData.averageunitPrice,
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
        loadingDisplay: 'none',
        rowData: houseData.rowData,
        enoughBottom: false,
        bottomType: 2,
        isMonitorHouse: 0,
      });
    } else {
      this.setData({
        countFlag: 0,
        loadingDisplay: 'none',
        bottomType: 2,
        allOriginalData: houseData.allData,
        allData: houseData.allData.slice(0, 5),
        allCount: houseData.allCount,
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
  //跳转统计详情
  goToDetail() {
    const app = getApp();
    app.globalData.houseListData = {
      allCount: this.data.allCount,
      wiwjCount: this.data.wiwjCount,
      lianjiaCount: this.data.lianjiaCount,
      showCount: this.data.allOriginalData.length,
      averagePrice: this.data.averagePrice,//二手房单价平均价
      lowPrice: this.data.lowPrice,
      highAreaData: this.data.highAreaData,
      lowPriceData: this.data.lowPriceData,
      enoughList: this.data.enoughList,
      bottomType: this.data.bottomType, //0:房源列表；1监控详情房源列表；2监控详情修改之后,
      taskTime: this.data.taskTime,
      startTimeName: this.data.startTimeName,
      fee: this.data.fee,
      monitorId: this.data.monitorId,
      totalFee: this.data.totalFee, //消耗盯盯币
      isBack: false,
      sortType: this.data.longSortTypes,
      allOriginalData: this.data.allOriginalData,
      rowData: this.data.rowData,
    }
    app.globalData.houseListData['wiwjLowPriceData'] = this.data.wiwjLowPriceData
    app.globalData.houseListData['lianjiaLowPriceData'] = this.data.lianjiaLowPriceData
    app.globalData.houseListData['wiwjFilterData'] = this.data.wiwjFilterData
    app.globalData.houseListData['lianjiaFilterData'] = this.data.lianjiaFilterData
    this.setData({
      editFlag: false,
      selectAllFlag: true
    })
    this.goToSelectAll()
    wx.navigateTo({
      url: '../statistics/statistics?rentType=3',
    })
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
  goTocheckAll(e) {
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
    })
    if (!this.data.editFlag) {
      this.setData({
        selectAllFlag: true
      })
      this.goToSelectAll()
    }
  },
  //不再关注
  deleteItem(e) {
    let num = wx.getStorageSync('followNum');
    let index = e.detail.index;
    if (!num) {
      this.setData({
        followText: '屏蔽房源后，该房源将不会在后续监控中出现！',
        followType: 1,
        followDisplay: 'block',
        followIndex: index
      })
    } else {
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
    let indexArr = this.data.indexArr
    if (indexArr.length == 0) {
      this.setData({
        editFlag: false
      })
      return;
    }
    this.setData({
      followText: '即将屏蔽' + this.data.selectNum + '套房源，屏蔽后本次监控将不再获取该房源信息',
      followType: 2,
      followDisplay: 'block'
    })
  },
  //不再关注弹窗隐藏
  followKnowEvent(e) {
    wx.setStorageSync('followNum', 1)
    let index = this.data.followIndex
    if (this.data.bottomType == 1) {
      let item = this.data.allData[index]
      let data = {
        uniqueId: item.housesid,
        monitorId: this.data.monitorId,
        platform: item.platformId
      }
      monitorApi.addSecondBatchAddBlacklist(data).then(res => {
        if (res.data.success) {
          this.setData({
            followDisplay: 'none',
            allData: []
          })
          this.getMonitorData()
        }
      })
      return;
    }
    let proId = this.data.allOriginalData[index].productId
    let plaId = this.data.allOriginalData[index].platformId
    let allData = [...this.data.allOriginalData]
    //allData 不再关注之后 遗留的房源数据,b不再关注的房源，添加黑名单
    let b = allData.splice(index, 1)
    let short = wx.getStorageSync('fddShortRentBlock') || [];
    let shortBlock = short.concat(b)
    wx.setStorageSync('fddShortRentBlock', shortBlock)

    let houseData = house.houseLongFilter(allData, 1)
    this.setData({
      allOriginalData: [],
      allData: []
    })
    if (allData.length > 0) {
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
      allData: allData.slice(0, 5),
      averagePrice: houseData.averageunitPrice,
      lowPrice: houseData.lowPrice,
      lowPriceData: houseData.lowPriceData,
      highAreaData: houseData.highAreaData,
      wiwjLowPriceData: houseData.wiwjLowPriceData,
      lianjiaLowPriceData: houseData.ljLowPriceData,
      wiwjFilterData: houseData.wiwjFilterData,
      lianjiaFilterData: houseData.ljFilterData,
      followDisplay: e.detail.show
    })
  },
  followCancelEvent(e) {
    if (e.detail.followType == 1) {
      wx.setStorageSync('followNum', 1)
    }
    this.setData({
      followDisplay: e.detail.show
    })
  },
  //批量不再关注弹窗确认
  followConfirmEvent(e) {
    let indexArr = this.data.indexArr
    let arr = [...this.data.allOriginalData]
    //a 不再关注之后 遗留的房源数据
    let a = arr.filter((item, index) => {
      return indexArr.indexOf(index) == -1
    })
    //b 不再关注的房源，添加黑名单
    let b = arr.filter((item, index) => {
      return indexArr.indexOf(index) > -1
    })
    if (this.data.bottomType == 1) {
      let wiwjId = [],
        ljId = [],
        ftxId = [],
        tcId = []
      for (let i = 0; i < b.length; i++) {
        if (b[i].platformId == 'wiwj') {
          wiwjId.push(b[i].housesid)
        }
        if (b[i].platformId == 'lj') {
          ljId.push(b[i].housesid)
        }
      }
      let data = {
        monitorId: this.data.monitorId,
      }
      data.blockData = {
        wiwj: wiwjId,
        lj: ljId
      }
      
      monitorApi.addSecondBatchAddBlacklist(data).then(res => {
        this.setData({
          followDisplay: e.detail.show,
          editFlag: false,
          allData: []
        })
        this.getMonitorData()
      });
      return
    }
    let short = wx.getStorageSync('fddShortRentBlock') || [];
    let shortBlock = short.concat(b)
    wx.setStorageSync('fddShortRentBlock', shortBlock)

    let houseData = house.houseLongFilter(a, 1)
    this.setData({
      allOriginalData: [],
      allData: []
    })
    if (a.length > 0) {
      this.setData({
        countFlag: 1
      });
    } else {
      this.setData({
        countFlag: 0,
      });
    }
    this.setData({
      allOriginalData: a,
      allData: a.slice(0, 5),
      averagePrice: houseData.averageunitPrice,
      lowPrice: houseData.lowPrice,
      lowPriceData: houseData.lowPriceData,
      highAreaData: houseData.highAreaData,
      wiwjLowPriceData: houseData.wiwjLowPriceData,
      lianjiaLowPriceData: houseData.ljLowPriceData,
      wiwjFilterData: houseData.wiwjFilterData,
      lianjiaFilterData: houseData.ljFilterData,
      editFlag: false,
      selectNum: 0,
      followDisplay: e.detail.show
    })
  },
  goToSelect(e) {
    let num = 0
    let indexArr = []
    let index = e.detail.index;
    let item = 'allData[' + index + '].collection';
    let items = 'allOriginalData[' + index + '].collection';
    let a = [...this.data.allOriginalData]
    this.setData({
      [item]: !this.data.allData[index].collection,
      [items]: !this.data.allOriginalData[index].collection
    });
    for (let i = 0; i < a.length; i++) {
      if (a[i]['collection']) {
        num++
        indexArr.push(i)
      }
    }
    if (num == this.data.allOriginalData.length) {
      this.setData({
        selectAllFlag: true,
        selectNum: num,
        indexArr
      })
    } else {
      this.setData({
        selectAllFlag: false,
        selectNum: num,
        indexArr
      })
    }
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
    monitorApi.endSecondMonitor(data).then(res => {
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
      wiwjCount: this.data.wiwjCount,
      lianjiaCount: this.data.lianjiaCount,
    }
    let addData = house.updateSecondMonitorData(data)
    wx.showLoading({
      title: '正在修改监控...',
      mask: true
    });
    
    monitorApi.updateSecondMonitor(addData).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
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
})