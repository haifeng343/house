const houseApi = require('../../api/houseApi.js');
const userApi = require('../../api/userApi.js');
const monitorApi = require('../../api/monitorApi.js');
const util = require('../../utils/util.js');
const monitor = require('../../utils/monitor.js');
const house = require('../../utils/house.js');
const regeneratorRuntime = require('../../lib/runtime.js');
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
    scrollDetail: 0,
    enoughDisplay: 'none',
    enoughBottomDisplay: 'none',
    monitorDisplay: 'none',
    monitorBottomDisplay: 'none',
    collectDisplay: 'none',
    ddCoin: 0,
    sIndex: 1,
    loadingDisplay: 'block',
    countFlag: '',
    checkInDate: '--', //入住日期
    checkOutDate: '--', //退日期
    cityName: '--',
    locationName: '全城',
    publicDisplay: 'none',
    isBack: false,
    listSortType: 1, //列表排序，1 低到高；2高到低
    showUI: true,
    y: 0,
    containerHeight: 9999,
    canScroll: true
  },
  topFlag: false,
  cardHeight: 0,
  scrollFlag: true,
  clickSelectItem(e) {
    var type = e.detail.type;
    if (type) {
      this.setData({
        showAdvance: true,
        showAdvanceType: type,
        canScroll: false
      });
    } else {
      this.setData({
        showAdvance: false,
        showAdvanceType: 0,
        canScroll: true
      });
    }
  },
  submitAdvance() {
    var houseSelect = this.selectComponent('#houseSelect');
    houseSelect.reSetData();
    console.log('查询完毕');
    this.scrollFlag = false;
    this.setData({
      showAdvance: false,
      canScroll: true,
      loadingDisplay: 'block',
      countFlag: '',
      allData: [],
      y: 0,
      containerHeight: 9999,
      showUI: true
    });
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //排序方式
    let tjconditions = [];
    let xzOrderBy = 'recommend';
    let mnSort = 0;
    let zgsortType = 0;
    if (app.globalData.searchData.sort == 1) {
      //1推荐 2低价优先
      tjconditions.push({
        gType: 4,
        type: 4,
        value: 1
      });
      xzOrderBy = 'recommend';
      mnSort = 0;
      zgsortType = 0;
    } else {
      tjconditions.push({
        gType: 4,
        type: 4,
        value: 2
      });
      xzOrderBy = 'zuipianyi';
      mnSort = 2;
      zgsortType = 2;
    }

    //入住人数 gueseNumber
    let tjgueseNumber = 1;
    if (app.globalData.searchData.gueseNumber != -1) {
      // 不限人数
      tjgueseNumber = Number('50' + app.globalData.searchData.gueseNumber);
      tjconditions.push({
        gType: 1,
        type: 6,
        value: tjgueseNumber
      });
    }

    //行政区域 途家

    if (app.globalData.searchData.areaType && app.globalData.searchData.area) {
      if (app.globalData.searchData.areaId.tj) {
        tjconditions.push({
          gType: 2,
          type: 5,
          value: app.globalData.searchData.areaId.tj
        });
      }
    } else {
      //手动定位的不管
    }

    //户型
    let mnroomNum = [];
    let zglayoutRoomList = [];
    if (app.globalData.searchData.houseType.length) {
      for (let i = 0; i < app.globalData.searchData.houseType.length; i++) {
        tjconditions.push({
          gType: 1,
          type: 6,
          value: Number(app.globalData.searchData.houseType[i])
        });
        mnroomNum.push(Number(app.globalData.searchData.houseType[i]));
        zglayoutRoomList.push(Number(app.globalData.searchData.houseType[i]));
      }
    }
    //出租类型
    let xzLeaseType = 'whole';
    let mnrentType = [];
    let zgrentTypeList = [];
    if (app.globalData.searchData.leaseType === 2) {
      //2单间 1整租 不选择''
      tjconditions.push({
        gType: 1,
        type: 6,
        value: 902
      });
      xzLeaseType = 'room';
      mnrentType = [2];
      zgrentTypeList = [1];
    }
    if (app.globalData.searchData.leaseType === 1) {
      tjconditions.push({
        gType: 1,
        type: 6,
        value: 901
      });
      xzLeaseType = 'whole';
      mnrentType = [1];
      zgrentTypeList = [0];
    }
    //配套设施
    let xzFacilitys = [];
    let mnSupport = [];
    let zgfacilities = [];
    if (app.globalData.searchData.equipment.length) {
      for (let i = 0; i < app.globalData.searchData.equipment.length; i++) {
        let e = app.globalData.searchData.equipment[i] + '';
        switch (e) {
          case '1':
            tjconditions.push({
              gType: 1,
              type: 6,
              value: 201
            });
            xzFacilitys.push('facility_Netword');
            mnSupport.push(2);
            zgfacilities.push(1);
            break;
          case '2':
            tjconditions.push({
              gType: 1,
              type: 6,
              value: 206
            });
            xzFacilitys.push('facility_AirCondition');
            mnSupport.push(5);
            zgfacilities.push(10);
            break;
          case '3':
            tjconditions.push({
              gType: 1,
              type: 6,
              value: 205
            });
            xzFacilitys.push('facility_Tv');
            mnSupport.push(3);
            zgfacilities.push(8);
            break;
          case '4':
            tjconditions.push({
              gType: 1,
              type: 6,
              value: 204
            });
            //xzFacilitys.push('洗衣机')
            mnSupport.push(7);
            zgfacilities.push(14);
            break;
          case '5':
            tjconditions.push({
              gType: 1,
              type: 6,
              value: 207
            });
            //xzFacilitys.push('冰箱')
            mnSupport.push(8);
            //zgfacilities.push('冰箱)
            break;
          case '6':
            tjconditions.push({
              gType: 1,
              type: 6,
              value: 203
            });
            xzFacilitys.push('facility_Shower');
            mnSupport.push(9);
            //zgfacilities.push('全天热水')
            break;
          case '7':
            tjconditions.push({
              gType: 1,
              type: 6,
              value: 202
            });
            //xzFacilitys.push('电梯')
            mnSupport.push(17);
            zgfacilities.push(4);
            break;
        }
      }
    }
    //价格区间
    let minPrice =
      app.globalData.searchData.minPrice == 0 ?
      1 :
      Number(app.globalData.searchData.minPrice);
    let maxPrice = Number(app.globalData.searchData.maxPrice);
    tjconditions.push({
      gType: 1,
      type: 7,
      value: minPrice + ',' + maxPrice
    });

    //小猪筛选
    let xzfilterObj = {
      checkInDay: app.globalData.searchData.beginDate,
      checkOutDay: app.globalData.searchData.endDate,
      orderBy: xzOrderBy,
      //leaseType: xzLeaseType,
      minPrice: minPrice,
      maxPrice: maxPrice
    };
    if (
      app.globalData.searchData.leaseType != '' &&
      app.globalData.searchData.leaseType != 'undefined'
    ) {
      xzfilterObj.leaseType = xzLeaseType;
    }
    if (app.globalData.searchData.houseType.length > 0) {
      xzfilterObj.huXing = app.globalData.searchData.houseType.join(',');
    }
    if (xzFacilitys.length > 0) {
      xzfilterObj.facilitys = xzFacilitys.join('|');
    }
    //行政区域 小猪
    if (app.globalData.searchData.areaType && app.globalData.searchData.area) {
      if (app.globalData.searchData.areaType == 16) {
        if (app.globalData.searchData.areaId.xz) {
          xzfilterObj.distId = app.globalData.searchData.areaId.xz;
        }
      } else {
        if (app.globalData.searchData.areaId.xz) {
          xzfilterObj.locId = app.globalData.searchData.areaId.xz;
        }
      }
    } else {
      //手动定位的不管
    }

    //木鸟筛选
    let mnfilterObj = {
      beginDate: app.globalData.searchData.beginDate,
      endDate: app.globalData.searchData.endDate,
      sort: mnSort,
      //rentType: mnrentType,
      priceMax: maxPrice,
      priceMin: minPrice
    };
    if (mnrentType.length > 0) {
      mnfilterObj.rentType = mnrentType;
    }
    if (mnroomNum.length > 0) {
      mnfilterObj.roomNum = mnroomNum;
    }
    if (mnSupport.length > 0) {
      mnfilterObj.support = mnSupport;
    }
    //行政区域 木鸟
    if (app.globalData.searchData.areaType && app.globalData.searchData.area) {
      if (app.globalData.searchData.areaType == 16) {
        if (app.globalData.searchData.areaId.mn) {
          mnfilterObj.areaId = app.globalData.searchData.areaId.mn;
        }
      } else {
        if (app.globalData.searchData.areaId.mn) {
          mnfilterObj.landmarkId = app.globalData.searchData.areaId.mn;
          mnfilterObj.lat = app.globalData.searchData.ltude.mn.split(',')[0];
          mnfilterObj.lng = app.globalData.searchData.ltude.mn.split(',')[1];
        }
      }
    } else {
      //手动定位的不管
    }
    //榛果筛选
    let zgfilterObj = {
      dateBegin: app.globalData.searchData.beginDate.replace(/-/g, ''),
      dateEnd: app.globalData.searchData.endDate.replace(/-/g, ''),
      minPrice: minPrice * 100,
      maxPrice: maxPrice * 100,
      //rentTypeList: zgrentTypeList,
      sortType: zgsortType
    };
    if (zgrentTypeList.length > 0) {
      zgfilterObj.rentTypeList = zgrentTypeList;
    }
    if (zglayoutRoomList.length > 0) {
      zgfilterObj.layoutRoomList = zglayoutRoomList;
    }
    if (zgfacilities.length > 0) {
      zgfilterObj.facilities = zgfacilities;
    }
    //行政区域 榛果
    if (app.globalData.searchData.areaType && app.globalData.searchData.area) {
      zgfilterObj.locationId = -4;
      zgfilterObj.locationCategoryId = -4;
      let type = app.globalData.searchData.areaType + '';
      if (app.globalData.searchData.areaId.zg) {
        zgfilterObj.locationId = app.globalData.searchData.areaId.zg;
        if (app.globalData.searchData.areaType != 16) {
          zgfilterObj.locationLatitude = app.globalData.searchData.ltude.zg.split(
            ','
          )[0];
          zgfilterObj.locationLongitude = app.globalData.searchData.ltude.zg.split(
            ','
          )[1];
        }
        switch (type) {
          case '11':
            zgfilterObj.locationCategoryId = 1;
            break;
          case '12':
            zgfilterObj.locationCategoryId = 2;
            break;
          case '13':
            zgfilterObj.locationCategoryId = -4;
            break;
          case '14':
            zgfilterObj.locationCategoryId = 4;
            break;
          case '15':
            zgfilterObj.locationCategoryId = 5;
            break;
          case '16':
            zgfilterObj.locationCategoryId = 6;
            break;
          case '17':
            zgfilterObj.locationCategoryId = -4;
            break;
          case '18':
            zgfilterObj.locationCategoryId = -4;
            break;
        }
      }
    } else {
      //手动定位不管
    }

    if (app.globalData.searchData.gueseNumber != -1) {
      xzfilterObj.guestNum = app.globalData.searchData.gueseNumber;
      mnfilterObj.guestNum = app.globalData.searchData.gueseNumber;
    }
    if (app.globalData.searchData.gueseNumber != -1) {
      if (app.globalData.searchData.gueseNumber == 10) {
        zgfilterObj.minCheckInNumber = 10;
      } else {
        zgfilterObj.minCheckInNumber = app.globalData.searchData.gueseNumber;
        zgfilterObj.maxCheckInNumber = app.globalData.searchData.gueseNumber;
      }
    }
    this.setData({
      tjfilter: {
        beginDate: app.globalData.searchData.beginDate,
        endDate: app.globalData.searchData.endDate,
        conditions: tjconditions
      },
      xzfilter: xzfilterObj,
      mnfilter: mnfilterObj,
      zgfilter: zgfilterObj,
      checkInDate: app.globalData.searchData.beginDate.split('-')[1] +
        '.' +
        app.globalData.searchData.beginDate.split('-')[2],
      checkOutDate: app.globalData.searchData.endDate.split('-')[1] +
        '.' +
        app.globalData.searchData.endDate.split('-')[2],
      cityName: app.globalData.searchData.city,
      locationName: app.globalData.searchData.area || '全城',
      listSortType: 1
    });
    this.getAllData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo();
    this.setData({
      showAdvance: false,
      showAdvanceType: 0,
      canScroll: true
    });
    if (this.data.isBack) {
      this.setData({
        loadingDisplay: 'block',
        countFlag: '',
        allData: [],
        y: 0,
        showUI: true,
        containerHeight: 9999
      });
      this.onLoad();
    }
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
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function(res) {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  goTop() {
    this.topFlag = true;
    this.setData({
      y: 0,
      showUI: true,
      showScrollTop: false
    });
  },
  goSort() {
    let arr = [...this.data.allOriginalData];
    if (this.data.listSortType == 2) {
      arr.sort(util.compareSort('finalPrice', 'asc'));
      wx.showToast({
        title: '已按最低价排序',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 1
      });
    } else {
      arr.sort(util.compareSort('finalPrice', 'desc'));
      wx.showToast({
        title: '已按最高价排序',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        allData: [],
        loadingDisplay: 'block',
        listSortType: 2
      });
    }
    this.scrollFlag = false;
    this.setData({
      allOriginalData: arr,
      allData: arr.slice(0, 10),
      loadingDisplay: 'none',
      canScroll: true,
      y: 0,
    });
  },

  async getAllData() {
    wx.removeStorageSync('collectionObj');
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
      if (this.data.tjCount >0) {
        let tj = this.addPlatfromData(allData, tjData, i);
        if (tj == 0) {
          break;
        }
        if (tj == 1) {
          let tjObjs = {};
          let tjObj = tjData[i];
          tjObjs.platformId = 'tj';
          tjObjs.curIndex = 1;
          tjObjs.finishLoadFlag = false;
          tjObjs.collection = false;
          tjObjs.unitName = tjObj.unitName;
          tjObjs.logoUrl = tjObj.logoUrl;
          tjObjs.pictureList = tjObj.pictureList;
          tjObjs.preloadDetail =
            tjObj.preloadDetail.baseBrief[0].title +
            '/' +
            tjObj.preloadDetail.baseBrief[1].title +
            '/' +
            tjObj.preloadDetail.baseBrief[2].title;
          tjObjs.finalPrice = Number(tjObj.finalPrice);
          tjObjs.productId = tjObj.unitId;
          tjFilterData.push(tjObjs);
          tjId.push(tjObj.unitId);
          allData.push(tjObjs);
        }
      }
      if (this.data.xzCount > 0) {
        let xz = this.addPlatfromData(allData, xzData, i);
        if (xz == 0) {
          break;
        }
        if (xz == 1) {
          let xzObjs = {};
          let xzObj = xzData[i];
          xzObjs.platformId = 'xz';
          xzObjs.curIndex = 1;
          xzObjs.finishLoadFlag = false;
          xzObjs.collection = false;
          xzObjs.unitName = xzObj.luTitle;
          xzObjs.logoUrl = xzObj.landlordheadimgurl;
          xzObjs.pictureList = xzObj.coverImages;
          xzObjs.preloadDetail =
            xzObj.luLeaseType + '/' + xzObj.houseTypeInfo + '/' + xzObj.guestnum;
          xzObjs.finalPrice = Number(
            xzObj.showPriceV2.showPrice || xzObj.luPrice
          );
          xzObjs.productId = xzObj.luId;
          xzFilterData.push(xzObjs);
          xzId.push(xzObj.luId);
          allData.push(xzObjs);
        }
      }
      if (this.data.mnCount > 0) {
        let mn = this.addPlatfromData(allData, mnData, i);
        if (mn == 0) {
          break;
        }
        if (mn == 1) {
          let mnObjs = {};
          let mnObj = mnData[i];
          mnObjs.platformId = 'mn';
          mnObjs.curIndex = 1;
          mnObjs.finishLoadFlag = false;
          mnObjs.collection = false;
          mnObjs.unitName = mnObj.title;
          mnObjs.logoUrl = mnObj.image_host;
          mnObjs.pictureList = mnObj.image_list;
          mnObjs.preloadDetail =
            mnObj.rent_type + '/' + mnObj.source_type + '/宜住' + mnObj.max_num;
          mnObjs.finalPrice = Number(mnObj.sale_price);
          mnObjs.productId = mnObj.room_id;
          mnFilterData.push(mnObjs);
          mnId.push(mnObj.room_id);
          allData.push(mnObjs);
        }
      }
      if (this.data.zgCount > 0){
        let zg = this.addPlatfromData(allData, zgData, i);
        if (zg == 0) {
          break;
        }
        if (zg == 1) {
          let zgObjs = {};
          let zgObj = zgData[i];
          zgObjs.platformId = 'zg';
          zgObjs.curIndex = 1;
          zgObjs.finishLoadFlag = false;
          zgObjs.collection = false;
          zgObjs.unitName = zgObj.title.replace(/\n/g, ' ');
          zgObjs.logoUrl = zgObj.hostAvatarUrl;
          zgObjs.pictureList = zgObj.productImages;
          zgObjs.preloadDetail =
            zgObj.rentLayoutDesc + '/' + zgObj.guestNumberDesc;
          zgObjs.finalPrice = zgObj.discountPrice ?
            zgObj.discountPrice / 100 :
            zgObj.price / 100;
          zgObjs.productId = zgObj.productId;
          zgFilterData.push(zgObjs);
          zgId.push(zgObj.productId);
          allData.push(zgObjs);
        }
      }
    }
    //总房源数量
    let allCount = 0
    if (this.data.tjCount>-1){
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
    let average =allData.length > 0 ?allData.reduce((sum, {finalPrice}) => sum + finalPrice, 0) /allData.length :0;
    let sortArr = [...allData];
    let tjSortArr = [...tjFilterData];
    let xzSortArr = [...xzFilterData];
    let mnSortArr = [...mnFilterData];
    let zgSortArr = [...zgFilterData];

    //所有最低价
    let lowPrice =allData.length > 0 ?Math.min.apply(Math,allData.map(function(o) {return o.finalPrice;})) :0;

    //所有房源最低价格的数据
    sortArr.sort(util.compareSort('finalPrice', 'asc'));
    let lowPriceData = sortArr.length > 0 ? sortArr[0] : '';

    allData = sortArr;
    //途家最低价格数据
    tjSortArr.sort(util.compareSort('finalPrice', 'asc'));
    let tjLowPriceData = tjSortArr.length > 0 ? tjSortArr[0] : '';
    //小猪最低价格数据
    xzSortArr.sort(util.compareSort('finalPrice', 'asc'));
    let xzLowPriceData = xzSortArr.length > 0 ? xzSortArr[0] : '';
    //木鸟最低价格数据
    mnSortArr.sort(util.compareSort('finalPrice', 'asc'));
    let mnLowPriceData = mnSortArr.length > 0 ? mnSortArr[0] : '';
    //榛果最低价格数据
    zgSortArr.sort(util.compareSort('finalPrice', 'asc'));
    let zgLowPriceData = zgSortArr.length > 0 ? zgSortArr[0] : '';
    if (allCount > 0) {
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
        allData: allData.slice(0, 10),
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
        isBack: false,
        canScroll: true,
        y: 0,
        showUI: true
      },
      () => {
        this.scrollFlag = false;
        if (allData.length > 0) {
          wx.createSelectorQuery()
            .select(`.house_card`)
            .boundingClientRect(rect => {
              this.cardHeight = rect.height + 20; // 高度外加20个像素的margin-bottom
              this.setData({
                containerHeight: this.cardHeight * allData.length + 100
              });
            })
            .exec();
        }
      }
    );
  },
  addPlatfromData(allData, PlatfromData, index) {
    if (index < PlatfromData.length) {
      //是否已满
      if (allData.length >= 50) {
        return 0; //总已满
      } else {
        return 1; //总的未满
      }
    } else {
      return 2; //某个平台满
    }
  },
  goToPlatformDetail(e) {
    let platform = e.currentTarget.dataset.platform;
    let productid = e.currentTarget.dataset.productid;
    monitor.navigateToMiniProgram(
      platform,
      productid,
      app.globalData.searchData.beginDate,
      app.globalData.searchData.endDate
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
      tjCount: this.data.tjCount,
      xzCount: this.data.xzCount,
      mnCount: this.data.mnCount,
      zgCount: this.data.zgCount,
      tjFilterCount: this.data.tjIdData,
      xzFilterCount: this.data.xzIdData,
      mnFilterCount: this.data.mnIdData,
      zgFilterCount: this.data.zgIdData,
      ddCoin: this.data.ddCoin,
      bindPhone: this.data.bindPhone,
      bindPublic: this.data.bindPublic,
      isBack: false
    };
    wx.navigateTo({
      url: '../statistics/statistics'
    });
  },

  /**
   * 收藏
   */
  goToCollection(e) {
    //开启收藏
    let num = wx.getStorageSync('collectionNum');
    let obj = wx.getStorageSync('collectionObj') || {};
    let pId = this.data.allData[e.currentTarget.dataset.index].platformId;
    let proId = this.data.allData[e.currentTarget.dataset.index].productId;

    if (!obj[pId]) {
      obj[pId] = [];
      obj[pId].push(proId);
    } else {
      if (obj[pId].indexOf(proId) == -1) {
        obj[pId].push(proId);
      } else {
        obj[pId] && obj[pId].splice(obj[pId].indexOf(proId), 1);
      }
    }

    wx.setStorageSync('collectionObj', obj);
    let item = 'allData[' + e.currentTarget.dataset.index + '].collection';
    this.setData({
      [item]: !e.currentTarget.dataset.collection
    });
    if (num) {
      num++;
      wx.setStorageSync('collectionNum', num);
    } else {
      wx.setStorageSync('collectionNum', 1);
      this.setData({
        collectDisplay: 'block',
      });
    }
  },
  getEnoughEvent(e) {
    this.setData({
      enoughDisplay: e.detail,
      canScroll: true
    });
  },
  getBottomEnoughEvent(e) {
    this.setData({
      enoughBottomDisplay: e.detail,
      canScroll: true
    });
  },
  getPublicEvent(e) {
    if (this.data.publicType == 1) {
      this.setData({
        monitorDisplay: 'block',
        publicDisplay: e.detail
      });
    } else {
      this.setData({
        monitorBottomDisplay: 'block',
        publicDisplay: e.detail
      });
    }
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
    let count = this.data.allOriginalData.length;
    if (count >= 50) {
      this.setData({
        enoughDisplay: 'block',
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
      publicType: 1 //1开始监控 2拉底监控
    });
  },
  /**
   * 底部开启监控取消
   */
  getMonitorBottomEvent(e) {
    this.setData({
      monitorBottomDisplay: e.detail,
      canScroll: true
    });
  },
  /**
   * 底部开启监控确认
   */
  getmonitorBottomConfirmEvent(e) {
    this.setData({
      monitorBottomDisplay: e.detail.show,
      canScroll: true
    });
    this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect);
  },
  /**
   * 底部开启监控--未关注公众号时
   */
  getMonitorrBottomPublicEvent(e) {
    this.setData({
      monitorBottomDisplay: 'none',
      publicDisplay: e.detail,
      publicType: 2 //1开始监控 2拉底监控
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
    monitorApi.addMonitor(data).then(res => {
      wx.showToast({
        title: res.data.resultMsg,
        duration: 2000
      });
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
  swiperChange(e) {
    let item = 'allData[' + e.currentTarget.dataset.index + '].curIndex';
    this.setData({
      [item]: e.detail.current + 1
    });
  },
});