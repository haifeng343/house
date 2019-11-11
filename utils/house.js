const houseApi = require('../api/houseApi.js');
const util = require('../utils/util.js')
const longrent = require('../api/longrent');
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
        tjCount: -1 // -1 表示不查询该平台数据
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
        }else{
          resolve({
            network: true
          })
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
        xzCount: -1 // -1 表示不查询该平台数据
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
          network: true
        })
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
        mnCount: -1 // -1 表示不查询该平台数据
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
        if(res){
          return houseApi.getMnList(data2);
        }
        if(!res){
          resolve({
            network: true
          })
        }
      })
      .then(res => {
        if (res) {
          arr2.push.apply(arr2, res.data.rooms.list);
        }
        if (res&&arr2.length == 0){
          mnCount = Number(res.data.rooms.page.record_count)
        }
        if (res) {
          return houseApi.getMnList(data3);
        }
        if(!res){
          let arr = arr2.slice(0, 50);
          resolve({
            arr,
            mnCount
          });
        }
      })
      .then(res => {
        if (res) {
          arr2.push.apply(arr2, res.data.rooms.list);
        }
        if (res &&arr2.length == 0) {
          mnCount = Number(res.data.rooms.page.record_count)
        }
        if(res){
          return houseApi.getMnList(data4);
        }
        if (!res) {
          let arr = arr2.slice(0, 50);
          resolve({
            arr,
            mnCount
          });
        }
      })
      .then(res => {
        if (res) {
          arr2.push.apply(arr2, res.data.rooms.list);
        }
        if (res &&arr2.length == 0) {
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
        xzCount: -1 // -1 表示不查询该平台数据
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
          network: true
        })
      }
    });
  });
}
/**
 * 获取我爱我家平台数据
 * type 1 房源列表；2监控详情
 */
const getWiwjData = (type, wiwjfilter) =>{
  let wiwjCount = 0;
  return new Promise((resolve, reject) => {
    longrent.wiwj.rentSearch({ "city": 1, "page": { "num": 1, "size": 50 }, "filter": {} }).then(res=>{
      if (res) {
        wiwjCount = res.data.count
        resolve({
          arr: res.data.list.slice(0, 50),
          wiwjCount
        });
      } else {
        resolve({
          network: true
        })
      }
    })
  })
}

/**
 * 获取链家平台数据
 * type 1 房源列表；2监控详情
 */
const getLianjiaData = (type, lianjiafilter) => {
  let lianjiaCount = 0;
  return new Promise((resolve, reject) => {
    longrent.lianjia.rentSearch({ "city": 110000, "page": { "num": 1, "size": 50 }, "filter": {} }).then(res => {
      if (res) {
        lianjiaCount = res.data.total
        resolve({
          arr: res.data.list.slice(0, 50),
          lianjiaCount
        });
      } else {
        resolve({
          network: true
        })
      }
    })
  })
}

/**
 * 获取房天下平台数据
 * type 1 房源列表；2监控详情
 */
const getFangtianxiaData = (type, fangtianxiafilter) => {
  let fangtianxiaCount = 0;
  return new Promise((resolve, reject) => {
    longrent.fangtianxia.rentSearch({ "city": "北京", "page": { "num": 1, "size": 50 }, "filter": {} }).then(res => {
      if (res) {
        fangtianxiaCount = Number(res.houses.housecount.text)
        resolve({
          arr: res.houses.houseinfo.slice(0, 50),
          fangtianxiaCount
        });
      } else {
        resolve({
          network: true
        })
      }
    })
  })
}

/**
 * 获取58同城平台数据
 * type 1 房源列表；2监控详情
 */
const getWbtcData = (type, wbtcfilter) => {
  let wbtcCount = 0;
  let arr = [];
  return new Promise((resolve, reject) => {
    longrent.wbtc.rentSearch({ "city": "bj", "page": { "num": 1, "size": 50 }, "filter": {} }).then(res => {
      res.result.getListInfo.infolist.shift()
      let wbtcCount = res.result.getListInfo.searchNum
      arr = res.result.getListInfo.infolist
      if (res && arr.length < 50 && arr.length < wbtcCount){
        return longrent.wbtc.rentSearch({ "city": "bj", "page": { "num": 2, "size": 50 }, "filter": {} });
      }else{
        resolve({
          arr: arr.slice(0, 50),
          wbtcCount
        });
      }
      if (!res) {
        resolve({
          network: true
        })
      }
    }).then(res=>{
      if (res) {
        arr.push.apply(arr, res.result.getListInfo.infolist);
      }
      resolve({
        arr: arr.slice(0, 50),
        wbtcCount
      });
    })
  })
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
  let app = getApp();
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

  let tjData = data.tjData.filter(item=>{
    return item.allowBooking && Number(item.finalPrice)>0
  })
  let xzData = data.xzData.filter(item => {
    return Number(item.showPriceV2.showPrice || item.luPrice) > 0
  })
  let mnData = data.mnData.filter(item => {
    return Number(item.sale_price) > 0
  })
  let zgData = data.zgData.filter(item => {
    return (item.discountPrice ? item.discountPrice / 100 : item.price / 100) > 0
  })
  for (let i = 0; i < maxTotal; i++) {
    if (data.tjCount > 0) {
      let tj = addPlatfromData(allData, tjData, i);
      if (tj == 0) {
        break;
      }
      if (tj == 1) {
        let tjObjs = {};
        let tjObj = tjData[i];
        tjObjs.platformId = 'tj';
        tjObjs.curIndex = 1
        tjObjs.finishLoadFlag = false
        tjObjs.collection = false
        tjObjs.unitName = tjObj.unitName;
        tjObjs.logoUrl = tjObj.logoUrl;
        tjObjs.pictureList = tjObj.pictureList.slice(0, 1);
        tjObjs.pictureAllList = tjObj.pictureList;
        tjObjs.preloadDetail = tjObj.preloadDetail.baseBrief[0].title + '/' + tjObj.preloadDetail.baseBrief[1].title + '/' + tjObj.preloadDetail.baseBrief[2].title
        tjObjs.finalPrice = Number(tjObj.finalPrice)
        tjObjs.productId = tjObj.unitId
        tjObjs.priceTag = util.arrFilter(tjObj.priceTags,'type',6)
        tjFilterData.push(tjObjs)
        tjId.push(tjObj.unitId)
        allData.push(tjObjs)
      }
    }
    if (data.xzCount > 0) {
      let xz = addPlatfromData(allData, xzData, i);
      if (xz == 0) {
        break;
      }
      if (xz == 1) {
        let xzObjs = {}
        let xzObj = xzData[i];
        xzObjs.platformId = 'xz'
        xzObjs.curIndex = 1
        xzObjs.finishLoadFlag = false
        xzObjs.collection = false
        xzObjs.unitName = xzObj.luTitle
        xzObjs.logoUrl = xzObj.landlordheadimgurl
        xzObjs.pictureList = xzObj.coverImages.slice(0, 1);
        xzObjs.pictureAllList = xzObj.coverImages;
        xzObjs.preloadDetail = xzObj.luLeaseType + '/' + xzObj.houseTypeInfo + '/' + xzObj.guestnum
        xzObjs.finalPrice = Number(xzObj.showPriceV2.showPrice || xzObj.luPrice)
        xzObjs.productId = xzObj.luId
        xzObjs.priceTag = util.arrFilter(xzObj.lodgeUnitNewTags, 'title', '长租优惠')
        if (xzObj.showPriceV2.showPrice && xzObj.luPrice && Number(xzObj.showPriceV2.showPrice) < Number(xzObj.luPrice)){
          xzObjs.discount = '已优惠' + (Number(xzObj.luPrice) - Number(xzObj.showPriceV2.showPrice))+'元'
        }
        xzFilterData.push(xzObjs)
        xzId.push(xzObj.luId)
        allData.push(xzObjs)
      }
    }
    if (data.mnCount > 0) {
      let mn = addPlatfromData(allData, mnData, i);
      if (mn == 0) {
        break;
      }
      if (mn == 1) {
        let mnObjs = {}
        let mnObj = mnData[i]
        mnObjs.platformId = 'mn'
        mnObjs.curIndex = 1
        mnObjs.finishLoadFlag = false
        mnObjs.collection = false
        mnObjs.unitName = mnObj.title
        mnObjs.logoUrl = mnObj.image_host
        mnObjs.pictureList = mnObj.image_list.slice(0, 1);
        mnObjs.pictureAllList = mnObj.image_list;
        mnObjs.preloadDetail = mnObj.rent_type + '/' + mnObj.source_type + '/宜住' + mnObj.max_num
        mnObjs.finalPrice = Number(mnObj.sale_price)
        mnObjs.productId = mnObj.room_id
        mnFilterData.push(mnObjs)
        mnId.push(mnObj.room_id)
        allData.push(mnObjs)
      }
    }
    if (data.zgCount > 0) {
      let zg = addPlatfromData(allData, zgData, i);
      if (zg == 0) {
        break;
      }
      if (zg == 1) {
        let zgObjs = {}
        let zgObj = zgData[i]
        zgObjs.platformId = 'zg'
        zgObjs.curIndex = 1
        zgObjs.finishLoadFlag = false
        zgObjs.collection = false
        zgObjs.unitName = zgObj.title.replace(/\n/g, " ")
        zgObjs.logoUrl = zgObj.hostAvatarUrl
        zgObjs.pictureList = zgObj.productImages.slice(0, 1);
        zgObjs.pictureAllList = zgObj.productImages;
        zgObjs.preloadDetail = zgObj.rentLayoutDesc + '/' + zgObj.guestNumberDesc
        zgObjs.finalPrice = zgObj.discountPrice ? zgObj.discountPrice / 100 : zgObj.price / 100
        zgObjs.productId = zgObj.productId
        zgObjs.priceTag = util.arrFilter(zgObj.productTagList, 'tagId', 30)
        if (zgObj.price && zgObj.discountPrice && Number(zgObj.discountPrice) < Number(zgObj.price)) {
          zgObjs.discount = '已优惠' + (zgObj.price / 100 - zgObj.discountPrice / 100) + '元'
        }
        zgFilterData.push(zgObjs)
        zgId.push(zgObj.productId)
        allData.push(zgObjs)
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

  let y = data.type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  if (y.sort == 2){
    allData = sortArr;
  }
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

const getMonitorHouseData = houseList=>{
  let allData = []; //监控房源列表
  let tjFilterData = []; //监控途家房源
  let xzFilterData = []; //监控小猪房源
  let mnFilterData = []; //监控木鸟房源
  let zgFilterData = []; //监控榛果房源
  let tjId = [],
    xzId = [],
    mnId = [],
    zgId = [];
  for (let i = 0; i < houseList.length; i++) {
    if (houseList[i].platform == 'tj') {
      let tjObj = {
        platformId: houseList[i].platform,
        curIndex: 1,
        finishLoadFlag: false,
        unitName: houseList[i].data.unitName,
        logoUrl: houseList[i].data.logoUrl,
        pictureList: houseList[i].data.pictureList.slice(0, 1),
        pictureAllList: houseList[i].data.pictureList,
        preloadDetail: houseList[i].data.preloadDetail.baseBrief[0].title + '/' + houseList[i].data.preloadDetail.baseBrief[1].title + '/' + houseList[i].data.preloadDetail.baseBrief[2].title,
        finalPrice: Number(houseList[i].data.finalPrice),
        productId: houseList[i].data.unitId,
        priceTag: util.arrFilter(houseList[i].data.priceTags, 'type', 6)
      }
      allData.push(tjObj)
      tjFilterData.push(tjObj)
      tjId.push(houseList[i].data.unitId)
    }

    if (houseList[i].platform == 'xz') {
      let xzObj = {
        platformId: houseList[i].platform,
        curIndex: 1,
        finishLoadFlag: false,
        unitName: houseList[i].data.luTitle,
        logoUrl: houseList[i].data.landlordheadimgurl,
        pictureList: houseList[i].data.coverImages.slice(0, 1),
        pictureAllList: houseList[i].data.coverImages,
        preloadDetail: houseList[i].data.luLeaseType + '/' + houseList[i].data.houseTypeInfo + '/' + houseList[i].data.guestnum,
        finalPrice: Number(houseList[i].data.showPriceV2.showPrice || houseList[i].data.luPrice),
        productId: houseList[i].data.luId,
        priceTag: util.arrFilter(houseList[i].data.lodgeUnitNewTags, 'title', '长租优惠')
      }
      if (houseList[i].data.showPriceV2.showPrice && houseList[i].data.luPrice && Number(houseList[i].data.showPriceV2.showPrice) < Number(houseList[i].data.luPrice)){
        xzObj.discount = '已优惠' + (Number(houseList[i].data.luPrice) - Number(houseList[i].data.showPriceV2.showPrice))+'元'
      }
      allData.push(xzObj)
      xzFilterData.push(xzObj)
      xzId.push(houseList[i].data.luId)
    }

    if (houseList[i].platform == 'mn') {
      let mnObj = {
        platformId: houseList[i].platform,
        curIndex: 1,
        finishLoadFlag: false,
        unitName: houseList[i].data.title,
        logoUrl: houseList[i].data.image_host,
        pictureList: houseList[i].data.image_list.slice(0, 1),
        pictureAllList: houseList[i].data.image_list,
        preloadDetail: houseList[i].data.rent_type + '/' + houseList[i].data.source_type + '/宜住' + houseList[i].data.max_num,
        finalPrice: Number(houseList[i].data.sale_price),
        productId: houseList[i].data.room_id
      }
      allData.push(mnObj)
      mnFilterData.push(mnObj)
      mnId.push(houseList[i].data.room_id)
    }

    if (houseList[i].platform == 'zg') {
      let zgObj = {
        platformId: 'zg',
        curIndex: 1,
        finishLoadFlag: false,
        unitName: houseList[i].data.title.replace(/\n/g, " "),
        logoUrl: houseList[i].data.hostAvatarUrl,
        pictureList: houseList[i].data.productImages.slice(0, 1),
        pictureAllList: houseList[i].data.productImages,
        preloadDetail: houseList[i].data.rentLayoutDesc + '/' + houseList[i].data.guestNumberDesc,
        finalPrice: houseList[i].data.discountPrice ? houseList[i].data.discountPrice / 100 : houseList[i].data.price / 100,
        productId: houseList[i].data.productId,
        priceTag : util.arrFilter(houseList[i].data.productTagList, 'tagId', 30)
      }
      if (houseList[i].data.discountPrice && houseList[i].data.price && houseList[i].data.discountPrice < houseList[i].data.price){
        zgObj.discount = '已优惠' + (houseList[i].data.price / 100 - houseList[i].data.discountPrice / 100)+'元'
      }
      allData.push(zgObj)
      zgFilterData.push(zgObj)
      zgId.push(houseList[i].data.productId)
    }
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
  return ({
    allData,
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

const getBrandHouseData = (data)=>{
  let app = getApp();
  let allCount = 0;
  let wiwjFilterData = [],lianjiaFilterData = [];
  let wiwjId = [],lianjiaId = [];
  let maxTotal = 50;
  let allData = [];
  let wiwjData = data.wiwjData;
  let lianjiaData = data.lianjiaData;
  for (let i = 0; i < maxTotal; i++) {
    if (data.wiwjCount > 0) {
      let wiwj = addPlatfromData(allData, wiwjData, i);
      if (wiwj == 0) {
        break;
      }
      if (wiwj == 1) {
        let wiwjObjs = {
          platformId:'wiwj',
          collection:false,
          sqid: wiwjData[i].sqid,
          imgurl: wiwjData[i].imgurl,
          price: Number(wiwjData[i].price),
          housetitle: wiwjData[i].housetitle,
          introduce: wiwjData[i].BaseDetail.area + 'm2/' + wiwjData[i].BaseDetail.floorStr + '/' + wiwjData[i].BaseDetail.heading,
          address: wiwjData[i].qyname + '.' + wiwjData[i].sqname,
          tagwall: wiwjData[i].tagwall,
          area: Number(wiwjData[i].BaseDetail.area)
        };
        wiwjFilterData.push(wiwjObjs)
        wiwjId.push(wiwjObjs.sqid)
        allData.push(wiwjObjs)
      }
    }
    if (data.lianjiaCount > 0) {
      let lianjia = addPlatfromData(allData, lianjiaData, i);
      if (lianjia == 0) {
        break;
      }
      if (lianjia == 1) {
        let lianjiaObjs = {
          platformId: 'lianjia',
          collection: false,
          sqid: lianjiaData[i].house_code,
          imgurl: lianjiaData[i].list_picture,
          price: Number(lianjiaData[i].rent_price_listing),
          housetitle: lianjiaData[i].house_title,
          introduce: lianjiaData[i].rent_area + 'm2/' + lianjiaData[i].layout + '/' + lianjiaData[i].frame_orientation,
          address: lianjiaData[i].district_name + '.' + lianjiaData[i].bizcircle_name,
          tagwall: lianjiaTagwall(lianjiaData[i].house_tags),
          area: Number(lianjiaData[i].rent_area)
        };
        lianjiaFilterData.push(lianjiaObjs)
        lianjiaId.push(lianjiaObjs.sqid)
        allData.push(lianjiaObjs)
      }
    }
  }
  if (data.wiwjCount > -1) {
    allCount += data.wiwjCount
  }
  if (data.lianjiaCount > -1) {
    allCount += data.lianjiaCount
  }
  //平均价
  let average = allData.length > 0 ? allData.reduce((sum, { price }) => sum + price, 0) / allData.length : 0;
  let sortArr = [...allData];
  let areasortArr = [...allData];
  let wiwjSortArr = [...wiwjFilterData];
  let lianjiaSortArr = [...lianjiaFilterData];
  //所有最低价
  let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) { return o.price; })) : 0;

  //所有房源最低价格的数据
  sortArr.sort(util.compareSort('price', 'asc'));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : '';
  let y = data.type == 1 ? app.globalData.searchLongData : app.globalData.monitorSearchLongData;
  if (y.longSortTypes == 1) {
    allData = sortArr;
  }
  //所有房源面积最大
  areasortArr.sort(util.compareSort('area', 'desc'));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : '';
  //我爱我家最低价格数据
  wiwjSortArr.sort(util.compareSort('price', 'asc'));
  let wiwjLowPriceData = wiwjSortArr.length > 0 ? wiwjSortArr[0] : '';
  //链家最低价格数据
  lianjiaSortArr.sort(util.compareSort('price', 'asc'));
  let lianjiaLowPriceData = lianjiaSortArr.length > 0 ? lianjiaSortArr[0] : '';

  return ({
    allData,
    allCount,
    averagePrice: parseInt(average),
    lowPrice,
    lowPriceData,
    highAreaData,
    wiwjLowPriceData,
    lianjiaLowPriceData,
    wiwjId,
    lianjiaId,
  })
}
const getPersonalHouseData = (data) => {
  let app = getApp();
  let allCount = 0;
  let fangtianxiaFilterData = [], wbtcFilterData = [];
  let fangtianxiaId = [], wbtcId = [];
  let maxTotal = 50;
  let allData = [];
  let fangtianxiaData = data.fangtianxiaData;
  let wbtcData = data.wbtcData;
  for (let i = 0; i < maxTotal; i++) {
    if (data.fangtianxiaCount > 0) {
      let fangtianxia = addPlatfromData(allData, fangtianxiaData, i);
      if (fangtianxia == 0) {
        break;
      }
      if (fangtianxia == 1) {
        let fangtianxiaObjs = {
          platformId: 'fangtianxia',
          collection: false,
          sqid: fangtianxiaData[i].houseid.text,
          imgurl: fangtianxiaData[i].titleimage.text,
          price: Number(fangtianxiaData[i].price.text),
          housetitle: fangtianxiaData[i].title.text,
          introduce: fangtianxiaData[i].buildarea.text + 'm2/' + fangtianxiaData[i].rentway.text + ' ' + fangtianxiaData[i].room.text+'室',
          address: fangtianxiaData[i].district.text + '.' + fangtianxiaData[i].comarea.text,
          tagwall: fangtianxiaData[i].tags.text?fangtianxiaData[i].tags.text.split(" "):[],
          area: Number(fangtianxiaData[i].buildarea.text)
        };
        fangtianxiaFilterData.push(fangtianxiaObjs)
        fangtianxiaId.push(fangtianxiaObjs.sqid)
        allData.push(fangtianxiaObjs)
      }
    }
    if (data.wbtcCount > 0) {
      let wbtc = addPlatfromData(allData, wbtcData, i);
      if (wbtc == 0) {
        break;
      }
      if (wbtc == 1) {
        let wbtcObjs = {
          platformId: 'wbtc',
          collection: false,
          sqid: wbtcData[i].infoID,
          imgurl: wbtcData[i].picUrl,
          price: Number(wbtcData[i].priceDict.p),
          housetitle: wbtcData[i].title,
          introduce: wbtcData[i].area.split('㎡')[0] + 'm2/' + wbtcData[i].huxing,
          address: wbtcData[i].lastLocal,
          tagwall: wbtcData[i].usedTages?wbtcData[i].usedTages.split(','):[],
          area: Number(wbtcData[i].area.split('㎡')[0])
        };
        wbtcFilterData.push(wbtcObjs)
        wbtcId.push(wbtcObjs.sqid)
        allData.push(wbtcObjs)
      }
    }
  }
  if (data.fangtianxiaCount > -1) {
    allCount += data.fangtianxiaCount
  }
  if (data.wbtcCount > -1) {
    allCount += data.wbtcCount
  }
  //平均价
  let average = allData.length > 0 ? allData.reduce((sum, { price }) => sum + price, 0) / allData.length : 0;
  let sortArr = [...allData];
  let areasortArr = [...allData];
  let fangtianxiaSortArr = [...fangtianxiaFilterData];
  let wbtcSortArr = [...wbtcFilterData];
  //所有最低价
  let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) { return o.price; })) : 0;

  //所有房源最低价格的数据
  sortArr.sort(util.compareSort('price', 'asc'));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : '';
  let y = data.type == 1 ? app.globalData.searchLongData : app.globalData.monitorSearchLongData;
  if (y.longSortTypes == 1) {
    allData = sortArr;
  }
  //所有房源面积最大
  areasortArr.sort(util.compareSort('area', 'desc'));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : '';
  //房天下最低价格数据
  fangtianxiaSortArr.sort(util.compareSort('price', 'asc'));
  let fangtianxiaLowPriceData = fangtianxiaSortArr.length > 0 ? fangtianxiaSortArr[0] : '';
  //58同城最低价格数据
  wbtcSortArr.sort(util.compareSort('price', 'asc'));
  let wbtcLowPriceData = wbtcSortArr.length > 0 ? wbtcSortArr[0] : '';

  return ({
    allData,
    allCount,
    averagePrice: parseInt(average),
    lowPrice,
    lowPriceData,
    highAreaData,
    fangtianxiaLowPriceData,
    wbtcLowPriceData,
    fangtianxiaId,
    wbtcId,
  })
}
const sort = (arr,sortType,key='finalPrice') => {
  if (sortType == 2) {
    arr.sort(util.compareSort(key, 'asc'))
    sortType = 1
    wx.showToast({
      title: '已按最低价排序',
      icon: 'none',
      duration: 2000
    })
  } else {
    arr.sort(util.compareSort(key, 'desc'))
    sortType = 2
    wx.showToast({
      title: '已按最高价排序',
      icon: 'none',
      duration: 2000
    })
  }

  return {
    arr,
    sortType
  }
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

function lianjiaTagwall(tags){
  let t = [];
  for(let i=0;i<tags.length;i++){
    t.push(tags[i].name)
  }
  return t
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
  getHouseData,
  getMonitorHouseData,
  sort,
  getWiwjData,
  getLianjiaData,
  getFangtianxiaData,
  getWbtcData,
  getBrandHouseData,
  getPersonalHouseData
}