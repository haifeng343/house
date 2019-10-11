const houseApi = require('../api/houseApi.js');
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
const getZgData = (type, zgfilter)=> {
  let app = getApp();
  let zgCount = 0;
  let y = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let s = app.globalData.zgSwitch;
  return new Promise((resolve, reject) => {
    let equipment = y.equipment;
    if(!s){
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
    if (y.areaType &&y.area) {
      if (y.areaId.hasOwnProperty('zg') &&!y.areaId.zg) {
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
      page: { size: 50, num: 1 },
      filter: zgfilter
    };
    houseApi.getZgList(data).then(res => {
      if (res) {
        zgCount=Number(res.data.count)
        resolve({ arr: res.data.list, zgCount});
      } else {
        resolve({
          arr: [],
          zgCount
        });
      }
    });
  });
}
module.exports = {
  getTjData,
  getXzData,
  getMnData,
  getZgData
}