const houseApi = require('../api/houseApi.js');
const util = require('../utils/util.js')
/**
 * 获取途家平台数据
 * type 1 房源列表；2监控详情
 */
const getTjData = (type, tjfilter) => {
  let app = getApp();
  let arr = [];
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let tjCount = 0;
  let s = app.globalData.tjSwitch;
  return new Promise((resolve, reject) => {
    if (!s) {
      resolve({
        arr: [],
        tjCount: 0 // -1 表示不查询该平台数据
      });
      return;
    }
    if (y.areaType && y.area) {
      if (y.areaId.hasOwnProperty('tj') && !y.areaId.tj) {
        tjCount = 0
        resolve({
          arr: [],
          tjCount
        });
        return;
      }
    }
    let data = {
      platform: 'tj',
      cityId: y.cityId.tj,
      page: {
        size: 30,
        num: 1
      },
      filter: tjfilter
    };
    let data2 = {
      platform: 'tj',
      cityId: y.cityId.tj,
      page: {
        size: 30,
        num: 2
      },
      filter: tjfilter
    };
    houseApi
      .getTjList(data)
      .then(res => {
        if (res) {
          arr = res.data.items || [];
          if (arr.length == 0) {
            tjCount = 0
            resolve({
              arr: [],
              tjCount
            });
          } else {
            tjCount = Number(res.data.totalCount)
            return houseApi.getTjList(data2);
          }
        }
      })
      .then(res => {
        if (res) {
          arr.push.apply(arr, res.data.items || []);
        }
        resolve({
          arr: arr.slice(0, 50),
          tjCount
        });
      });
  });
}
/**
 * 获取小猪平台数据
 * type 1 房源列表；2监控详情
 */
const getXzData = (type, xzfilter) => {
  let app = getApp();
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let xzCount = 0;
  let s = app.globalData.xzSwitch;
  return new Promise((resolve, reject) => {
    let equipment = y.equipment;
    if (!s) {
      resolve({
        arr: [],
        xzCount: 0 // -1 表示不查询该平台数据
      });
      return;
    }
    if (equipment.indexOf('4') > -1 || equipment.indexOf('5') > -1 || equipment.indexOf('7') > -1) {
      xzCount = 0;
      resolve({
        arr: [],
        xzCount
      });
      return;
    }
    if (y.areaType && y.area) {
      if (y.areaId.hasOwnProperty('xz') && !y.areaId.xz) {
        xzCount = 0;
        resolve({
          arr: [],
          xzCount
        });
        return;
      }
    }
    let data = {
      platform: 'xz',
      cityId: y.cityId.xz,
      page: {
        size: 50,
        num: 1
      },
      filter: xzfilter
    };
    houseApi.getXzList(data).then(res => {
      if (res) {
        xzCount = Number(res.data.count)
        resolve({
          arr: res.data.item,
          xzCount
        });
      } else {
        resolve({
          arr: [],
          xzCount
        });
      }
    });
  });
}

/**
 * 获取木鸟平台数据
 * type 1 房源列表；2监控详情
 */
const getMnData = (type, mnfilter) => {
  let app = getApp();
  let arr2 = [];
  let mnCount = 0;
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let s = app.globalData.mnSwitch;
  let data = {
    platform: 'mn',
    cityId: y.cityId.mn,
    page: {
      size: 15,
      num: 1
    },
    filter: mnfilter
  };
  let data2 = {
    platform: 'mn',
    cityId: y.cityId.mn,
    page: {
      size: 15,
      num: 2
    },
    filter: mnfilter
  };
  let data3 = {
    platform: 'mn',
    cityId: y.cityId.mn,
    page: {
      size: 15,
      num: 3
    },
    filter: mnfilter
  };
  let data4 = {
    platform: 'mn',
    cityId: y.cityId.mn,
    page: {
      size: 15,
      num: 4
    },
    filter: mnfilter
  };
  return new Promise((resolve, reject) => {
    if (!s) {
      resolve({
        arr: [],
        mnCount: 0 // -1 表示不查询该平台数据
      });
      return;
    }
    if (y.areaType && y.area) {
      if (y.areaId.hasOwnProperty('mn') && !y.areaId.mn) {
        mnCount = 0
        resolve({
          arr: [],
          mnCount
        });
        return;
      }
    }
    houseApi.getMnList(data).then(res => {
        if (res) {
          arr2 = res.data.rooms.list;
          mnCount = Number(res.data.rooms.page.record_count)
        }
        return houseApi.getMnList(data2);
      })
      .then(res => {
        if (res) {
          arr2.push.apply(arr2, res.data.rooms.list);
          mnCount = Number(res.data.rooms.page.record_count)
        }
        return houseApi.getMnList(data3);
      })
      .then(res => {
        if (res) {
          arr2.push.apply(arr2, res.data.rooms.list);
          mnCount = Number(res.data.rooms.page.record_count)
        }
        return houseApi.getMnList(data4);
      })
      .then(res => {
        if (res) {
          arr2.push.apply(arr2, res.data.rooms.list);
          mnCount = Number(res.data.rooms.page.record_count)
        }
        let arr = arr2.slice(0, 50);
        resolve({
          arr,
          mnCount
        });
      });
  });
}
/**
 * 获取榛果平台数据
 * type 1 房源列表；2监控详情
 */
const getZgData = (type, zgfilter) => {
  let app = getApp();
  let zgCount = 0;
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let s = app.globalData.zgSwitch;
  return new Promise((resolve, reject) => {
    let equipment = y.equipment;
    if (!s) {
      resolve({
        arr: [],
        xzCount: 0 // -1 表示不查询该平台数据
      });
      return;
    }
    if (equipment.indexOf('5') > -1 || equipment.indexOf('6') > -1) {
      zgCount = 0;
      resolve({
        arr: [],
        zgCount
      });
      return;
    }
    if (y.areaType && y.area) {
      if (y.areaId.hasOwnProperty('zg') && !y.areaId.zg) {
        zgCount = 0;
        resolve({
          arr: [],
          zgCount
        });
        return;
      }
    }
    let data = {
      platform: 'zg',
      cityId: y.cityId.zg,
      page: {
        size: 50,
        num: 1
      },
      filter: zgfilter
    };
    houseApi.getZgList(data).then(res => {
      if (res) {
        zgCount = Number(res.data.count)
        resolve({
          arr: res.data.list,
          zgCount
        });
      } else {
        resolve({
          arr: [],
          zgCount
        });
      }
    });
  });
}

const houseCollection = (pId, proId) => {
  let num = wx.getStorageSync('collectionNum');
  let obj = wx.getStorageSync('collectionObj') || {};
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
  if (num) {
    num++;
    wx.setStorageSync('collectionNum', num);
  } else {
    wx.setStorageSync('collectionNum', 1);
  }
}

const tjScreenParam = type => {
  let app = getApp();
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let tjconditions = [];
  //排序方式 1推荐 2低价优先
  if (y.sort == 1) {
    tjconditions.push({
      gType: 4,
      type: 4,
      value: 1
    });
  } else {
    tjconditions.push({
      gType: 4,
      type: 4,
      value: 2
    });
  }
  //入住人数
  let tjgueseNumber = 1;
  if (y.gueseNumber != -1) {
    tjgueseNumber = 500 + Number(y.gueseNumber)
    tjconditions.push({
      gType: 1,
      type: 6,
      value: tjgueseNumber
    });
  }
  //行政区域
  if (y.areaType && y.area) {
    if (y.areaId.tj) {
      tjconditions.push({
        gType: 2,
        type: 5,
        value: y.areaId.tj
      });
    }
  } else {
    //手动定位的不管
  }
  //户型
  if (y.houseType.length) {
    for (let i = 0; i < y.houseType.length; i++) {
      tjconditions.push({
        gType: 1,
        type: 6,
        value: Number(y.houseType[i])
      });
    }
  }
  // 出租类型 2单间 1整租 不选择''
  if (y.leaseType === 2) {
    tjconditions.push({
      gType: 1,
      type: 6,
      value: 902
    });
  }
  if (y.leaseType === 1) {
    tjconditions.push({
      gType: 1,
      type: 6,
      value: 901
    });
  }
  //配套设施
  if (y.equipment.length) {
    for (let i = 0; i < y.equipment.length; i++) {
      let e = y.equipment[i] + '';
      switch (e) {
        case '1':
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 201
          });
          break;
        case '2':
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 206
          });
          break;
        case '3':
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 205
          });
          break;
        case '4':
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 204
          });
          break;
        case '5':
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 207
          });
          mnSupport.push(8);
          break;
        case '6':
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 203
          });
          break;
        case '7':
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 202
          });
          break;
      }
    }
  }

  //价格区间
  let minPrice = y.minPrice == 0 ? 1 : Number(y.minPrice);
  let maxPrice = Number(y.maxPrice);
  tjconditions.push({
    gType: 1,
    type: 7,
    value: minPrice + ',' + maxPrice
  });
  return {
    beginDate: y.beginDate,
    endDate: y.endDate,
    conditions: tjconditions
  }

}

const xzScreenParam = type => {
  let app = getApp();
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  //排序方式  推荐recommend 低价zuipianyi
  let xzOrderBy = 'recommend';
  if (y.sort == 1) {
    xzOrderBy = 'recommend';
  } else {
    xzOrderBy = 'zuipianyi';
  }
  //价格区间
  let minPrice =
    y.minPrice == 0 ?
    1 :
    Number(y.minPrice);
  let maxPrice = Number(y.maxPrice);

  //出租类型（whole：整租，room：单间）
  let xzLeaseType = 'whole';
  if (y.leaseType === 2) {
    xzLeaseType = 'room';
  }
  if (y.leaseType === 1) {
    xzLeaseType = 'whole';
  }
  //配套设施
  let xzFacilitys = [];
  if (y.equipment.length) {
    for (let i = 0; i < y.equipment.length; i++) {
      let e = y.equipment[i] + '';
      switch (e) {
        case '1':
          xzFacilitys.push('facility_Netword');
          break;
        case '2':
          xzFacilitys.push('facility_AirCondition');
          break;
        case '3':
          xzFacilitys.push('facility_Tv');
          break;
        case '4':
          break;
        case '5':
          break;
        case '6':
          xzFacilitys.push('facility_Shower');
          break;
        case '7':
          break;
      }
    }
  }
  let xzfilterObj = {
    checkInDay: y.beginDate,
    checkOutDay: y.endDate,
    orderBy: xzOrderBy,
    minPrice: minPrice,
    maxPrice: maxPrice
  };
  //  户型
  if (y.houseType.length > 0) {
    xzfilterObj.huXing = y.houseType.join(',');
  }
  //入住人数
  if (y.gueseNumber != -1) {
    xzfilterObj.guestNum = y.gueseNumber;
  }
  //出租类型（whole：整租，room：单间）
  if (
    y.leaseType != '' &&
    y.leaseType != 'undefined'
  ) {
    xzfilterObj.leaseType = xzLeaseType;
  }
  //配套设施
  if (xzFacilitys.length > 0) {
    xzfilterObj.facilitys = xzFacilitys.join('|');
  }
  //行政区域 小猪
  if (y.areaType && y.area) {
    if (y.areaType == 16) {
      if (y.areaId.xz) {
        xzfilterObj.distId = y.areaId.xz;
      }
    } else {
      if (y.areaId.xz) {
        xzfilterObj.locId = y.areaId.xz;
      }
    }
  } else {
    //手动定位的不管
  }
  return xzfilterObj
}

const mnScreenPara = type =>{
  let app = getApp();
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  //排序方式
  let mnSort = 0;
  if (y.sort == 1) {
    mnSort = 0;
  } else {
    mnSort = 2;
  }
  //户型
  let mnroomNum = [];
  if (y.houseType.length) {
    for (let i = 0; i < y.houseType.length; i++) {
      mnroomNum.push(Number(y.houseType[i]));
    }
  }
  //出租类型
  let mnrentType = [];
  if (y.leaseType === 2) {
    mnrentType = [2];
  }
  if (y.leaseType === 1) {
    mnrentType = [1];
  }
  //配套设施
  let mnSupport = [];
  if (y.equipment.length) {
    for (let i = 0; i < y.equipment.length; i++) {
      let e = y.equipment[i] + '';
      switch (e) {
        case '1':
          mnSupport.push(2);
          break;
        case '2':
          mnSupport.push(5);
          break;
        case '3':
          mnSupport.push(3);
          break;
        case '4':
          mnSupport.push(7);
          break;
        case '5':
          mnSupport.push(8);
          break;
        case '6':
          mnSupport.push(9);
          break;
        case '7':
          mnSupport.push(17);
          break;
      }
    }
  }

  //价格区间
  let minPrice =y.minPrice == 0 ?1 :Number(y.minPrice);
  let maxPrice = Number(y.maxPrice);
  //木鸟筛选
  let mnfilterObj = {
    beginDate: y.beginDate,
    endDate: y.endDate,
    sort: mnSort,
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
  if (y.areaType && y.area) {
    if (y.areaType == 16) {
      if (y.areaId.mn) {
        mnfilterObj.areaId = y.areaId.mn;
      }
    } else {
      if (y.areaId.mn) {
        mnfilterObj.landmarkId = y.areaId.mn;
        mnfilterObj.lat = y.ltude.mn.split(',')[0];
        mnfilterObj.lng = y.ltude.mn.split(',')[1];
      }
    }
  } else {
    //手动定位的不管
  }
  //入住人数
  if (y.gueseNumber != -1) {
    mnfilterObj.guestNum = y.gueseNumber;
  }

  return mnfilterObj
}

const zgScreenPara = type=>{
  let app = getApp();
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  //排序方式
  let zgsortType = 0;
  if (y.sort == 1) {
    zgsortType = 0;
  } else {
    zgsortType = 2;
  }
  //户型
  let zglayoutRoomList = [];
  if (y.houseType.length) {
    for (let i = 0; i < y.houseType.length; i++) {
      zglayoutRoomList.push(Number(y.houseType[i]));
    }
  }
  //出租类型
  let zgrentTypeList = [];
  if (y.leaseType === 2) {
    zgrentTypeList = [1];
  }
  if (y.leaseType === 1) {
    zgrentTypeList = [0];
  }
  //配套设施
  let zgfacilities = [];
  if (y.equipment.length) {
    for (let i = 0; i < y.equipment.length; i++) {
      let e = y.equipment[i] + '';
      switch (e) {
        case '1':
          zgfacilities.push(1);
          break;
        case '2':
          zgfacilities.push(10);
          break;
        case '3':
          zgfacilities.push(8);
          break;
        case '4':
          zgfacilities.push(14);
          break;
        case '5':
          break;
        case '6':
          break;
        case '7':
          zgfacilities.push(4);
          break;
      }
    }
  }
  //价格区间
  let minPrice =y.minPrice == 0 ? 1 : Number(y.minPrice);
  let maxPrice = Number(y.maxPrice);
  //榛果筛选
  let zgfilterObj = {
    dateBegin: y.beginDate.replace(/-/g, ''),
    dateEnd: y.endDate.replace(/-/g, ''),
    minPrice: minPrice * 100,
    maxPrice: maxPrice * 100,
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
  if (y.areaType && y.area) {
    zgfilterObj.locationId = -4;
    zgfilterObj.locationCategoryId = -4;
    let type = y.areaType + '';
    if (y.areaId.zg) {
      zgfilterObj.locationId = y.areaId.zg;
      if (y.areaType != 16) {
        zgfilterObj.locationLatitude = y.ltude.zg.split(',')[0];
        zgfilterObj.locationLongitude = y.ltude.zg.split(',')[1];
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

  if (y.gueseNumber != -1) {
    if (y.gueseNumber == 10) {
      zgfilterObj.minCheckInNumber = 10;
    } else {
      zgfilterObj.minCheckInNumber = y.gueseNumber;
      zgfilterObj.maxCheckInNumber = y.gueseNumber;
    }
  }

  return zgfilterObj
}

const getHouseData = (data)=>{
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
    if (data.tjCount > 0) {
      let tj = addPlatfromData(allData, data.tjData, i);
      if (tj == 0) {
        break;
      }
      if (tj == 1 && data.tjData[i].allowBooking) {
        let tjObjs = {};
        let tjObj = data.tjData[i];
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
    if (data.xzCount > 0) {
      let xz = addPlatfromData(allData, data.xzData, i);
      if (xz == 0) {
        break;
      }
      if (xz == 1) {
        let xzObjs = {}
        let xzObj = data.xzData[i];
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
    if (data.mnCount > 0) {
      let mn = addPlatfromData(allData, data.mnData, i);
      if (mn == 0) {
        break;
      }
      if (mn == 1) {
        let mnObjs = {}
        let mnObj = data.mnData[i]
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
    if (data.zgCount > 0) {
      let zg = addPlatfromData(allData, data.zgData, i);
      if (zg == 0) {
        break;
      }
      if (zg == 1) {
        let zgObjs = {}
        let zgObj = data.zgData[i]
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
  if (data.tjCount > -1) {
    allCount += data.tjCount
  }
  if (data.xzCount > -1) {
    allCount += data.xzCount
  }
  if (data.mnCount > -1) {
    allCount += data.mnCount
  }
  if (data.zgCount > -1) {
    allCount += data.zgCount
  }

  //平均价
  let average = allData.length > 0 ? allData.reduce((sum, { finalPrice }) => sum + finalPrice, 0) / allData.length : 0;
  let sortArr = [...allData];
  let tjSortArr = [...tjFilterData];
  let xzSortArr = [...xzFilterData];
  let mnSortArr = [...mnFilterData];
  let zgSortArr = [...zgFilterData];

  //所有最低价
  let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) { return o.finalPrice; })) : 0;

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

  return({
    allData,
    allCount,
    averagePrice: parseInt(average),
    lowPrice,
    lowPriceData,
    tjLowPriceData,
    xzLowPriceData,
    mnLowPriceData,
    zgLowPriceData,
    tjId,
    xzId,
    mnId,
    zgId,
  })
}

function addPlatfromData(allData, PlatfromData, index) {
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
}

module.exports = {
  getTjData,
  getXzData,
  getMnData,
  getZgData,
  houseCollection,
  tjScreenParam,
  xzScreenParam,
  mnScreenPara,
  zgScreenPara,
  getHouseData
}