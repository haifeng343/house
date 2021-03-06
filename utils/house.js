const houseApi = require("../api/houseApi.js");
const util = require("../utils/util.js");
const longrent = require("../api/longrent.js");
import { getNearbyGCJ } from "./longSetSearchData.js";
/**
 * 获取途家平台数据
 * type 1 房源列表；2监控详情
 */
const getTjData = (type, tjfilter) => {
  let app = getApp();
  let arr = [];
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
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
      if (y.areaId.hasOwnProperty("tj") && !y.areaId.tj) {
        tjCount = 0;
        resolve({
          arr: [],
          tjCount
        });
        return;
      }
    }
    let data = {
      platform: "tj",
      cityId: y.cityId.tj,
      page: {
        size: 30,
        num: 1
      },
      filter: tjfilter
    };
    let data2 = {
      platform: "tj",
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
            tjCount = 0;
            resolve({
              arr: [],
              tjCount
            });
          } else {
            tjCount = Number(res.data.totalCount);
            return houseApi.getTjList(data2);
          }
        } else {
          resolve({
            network: true
          });
        }
      })
      .then(res => {
        if (res) {
          arr.push.apply(arr, res.data.items || []);
        }
        resolve({
          arr: arr,
          tjCount
        });
      });
  });
};
/**
 * 获取小猪平台数据
 * type 1 房源列表；2监控详情
 */
const getXzData = (type, xzfilter) => {
  let app = getApp();
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
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
    if (
      equipment.indexOf("4") > -1 ||
      equipment.indexOf("5") > -1 ||
      equipment.indexOf("7") > -1
    ) {
      xzCount = 0;
      resolve({
        arr: [],
        xzCount
      });
      return;
    }
    if (y.areaType && y.area) {
      if (y.areaId.hasOwnProperty("xz") && !y.areaId.xz) {
        xzCount = 0;
        resolve({
          arr: [],
          xzCount
        });
        return;
      }
    }
    let data = {
      platform: "xz",
      cityId: y.cityId.xz,
      page: {
        size: 50,
        num: 1
      },
      filter: xzfilter
    };
    houseApi.getXzList(data).then(res => {
      if (res) {
        xzCount = Number(res.data.count);
        resolve({
          arr: res.data.item||[],
          xzCount
        });
      } else {
        resolve({
          network: true
        });
      }
    });
  });
};

/**
 * 获取木鸟平台数据
 * type 1 房源列表；2监控详情
 */

const getMnData = (type, mnfilter) => {
  let arr2 = [];
  let mnCount = 0;
  return new Promise((resolve, reject) => {
    Promise.all([getMnData1(type, mnfilter), getMnData2(type, mnfilter), getMnData3(type, mnfilter), getMnData4(type, mnfilter)])
      .then(res => {
        if (!res[0] && !res[1] && !res[2] && !res[3]) {
          resolve({
            network: true
          });
        }
        if (res[0]) {
          arr2.push.apply(arr2, res[0].arr);
          mnCount = res[0].mnCount
        }
        if (res[1]) {
          arr2.push.apply(arr2, res[1].arr);
          mnCount = res[1].mnCount
        }
        if (res[2]) {
          arr2.push.apply(arr2, res[2].arr);
          mnCount = res[2].mnCount
        }
        if (res[3]) {
          arr2.push.apply(arr2, res[3].arr);
          mnCount = res[3].mnCount
        }
        resolve({
          arr: arr2,
          mnCount
        });
      })
  })
}
const getMnData1 = (type, mnfilter) => {
  let app = getApp();
  let mnCount = 0;
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let s = app.globalData.mnSwitch;
  let data1 = {
    platform: "mn",
    cityId: y.cityId.mn,
    page: {
      size: 15,
      num: 1
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
      if (y.areaId.hasOwnProperty("mn") && !y.areaId.mn) {
        mnCount = 0;
        resolve({
          arr: [],
          mnCount
        });
        return;
      }
    }
    houseApi
      .getMnList(data1)
      .then(res => {
        if (res) {
          resolve({
            arr: res.data.rooms.list||[],
            mnCount: Number(res.data.rooms.page.record_count)
          });
        }
        if (!res) {
          resolve(false);
        }
      })
  })
}
const getMnData2 = (type, mnfilter) => {
  let app = getApp();
  let mnCount = 0;
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let s = app.globalData.mnSwitch;
  let data2 = {
    platform: "mn",
    cityId: y.cityId.mn,
    page: {
      size: 15,
      num: 2
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
      if (y.areaId.hasOwnProperty("mn") && !y.areaId.mn) {
        mnCount = 0;
        resolve({
          arr: [],
          mnCount
        });
        return;
      }
    }
    houseApi
      .getMnList(data2)
      .then(res => {
        if (res) {
          resolve({
            arr: res.data.rooms.list || [],
            mnCount: Number(res.data.rooms.page.record_count)
          });
        }
        if (!res) {
          resolve(false);
        }
      })
  })
}
const getMnData3 = (type, mnfilter) => {
  let app = getApp();
  let mnCount = 0;
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let s = app.globalData.mnSwitch;
  let data3 = {
    platform: "mn",
    cityId: y.cityId.mn,
    page: {
      size: 15,
      num: 3
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
      if (y.areaId.hasOwnProperty("mn") && !y.areaId.mn) {
        mnCount = 0;
        resolve({
          arr: [],
          mnCount
        });
        return;
      }
    }
    houseApi
      .getMnList(data3)
      .then(res => {
        if (res) {
          resolve({
            arr: res.data.rooms.list || [],
            mnCount: Number(res.data.rooms.page.record_count)
          });
        }
        if (!res) {
          resolve(false);
        }
      })
  })
}
const getMnData4 = (type, mnfilter) => {
  let app = getApp();
  let mnCount = 0;
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let s = app.globalData.mnSwitch;
  let data4 = {
    platform: "mn",
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
      if (y.areaId.hasOwnProperty("mn") && !y.areaId.mn) {
        mnCount = 0;
        resolve({
          arr: [],
          mnCount
        });
        return;
      }
    }
    houseApi
      .getMnList(data4)
      .then(res => {
        if (res) {
          resolve({
            arr: res.data.rooms.list || [],
            mnCount: Number(res.data.rooms.page.record_count)
          });
        }
        if (!res) {
          resolve(false);
        }
      })
  })
}
/**
 * 获取榛果平台数据
 * type 1 房源列表；2监控详情
 */
const getZgData = (type, zgfilter) => {
  let zgarr = []
  let arr1 = []
  let arr2 = []
  let zgCount = 0
  let zgMinPrice = 100
  let zgMaxPrice = 9999900
  console.log(zgfilter)
  if (zgfilter.minPrice === 100 && zgfilter.maxPrice === 9999900) {
    zgarr = [getZgData2(type, zgfilter)]
  } else if (zgfilter.minPrice !== 100 && zgfilter.maxPrice === 9999900) {
    let zgfilter1 = JSON.parse(JSON.stringify(zgfilter))
    let zgfilter2 = JSON.parse(JSON.stringify(zgfilter))
    zgMinPrice = zgfilter1['minPrice']
    zgMaxPrice = zgfilter1['minPrice'] + 10000
    zgfilter1['tagIds'] = [30, 138, 31]
    zgfilter1['minPrice'] = zgfilter1['minPrice'] + 100 + 10000
    zgfilter1['maxPrice'] = 9999900
    zgfilter2['minPrice'] = zgfilter2['minPrice']
    zgfilter2['maxPrice'] = zgfilter2['minPrice'] + 10000
    zgarr = [getZgData1(type, zgfilter1), getZgData2(type, zgfilter2)]
  } else {
    let zgfilter1 = JSON.parse(JSON.stringify(zgfilter))
    zgMinPrice = zgfilter1['minPrice']
    zgMaxPrice = zgfilter1['maxPrice']
    zgfilter1['tagIds'] = [30, 138, 31]
    zgfilter1['minPrice'] = zgfilter1['maxPrice'] + 100
    zgfilter1['maxPrice'] = 9999900
    zgarr = [getZgData1(type, zgfilter1), getZgData2(type, zgfilter)]
  }
  return new Promise((resolve, reject) => {
    Promise.all(zgarr)
      .then(res => {
        if (res.length === 1) {
          if (!res[0]) {
            resolve({
              network: true
            });
          }
          if (res[0]) {
            arr2.push.apply(arr2, res[0].arr);
            zgCount = res[0].zgCount
          }
          resolve({
            arr: arr2,
            zgCount
          });
        } else {
          if (!res[0] && !res[1]) {
            resolve({
              network: true
            });
          }
          let _arr1 = []
          let _arr2 = []
          //有特殊条件的 连住 早鸟 新房
          res[0].arr.map((item, index) => {
            _arr1.push(Object.assign({}, item, { _price: item.discountPrice ? item.discountPrice : item.price }))
          })
          //无特殊条件
          res[1].arr.map((item, index) => {
            _arr2.push(Object.assign({}, item, { _price: item.discountPrice ? item.discountPrice : item.price }))
          })
          //有特殊条件的 连住 早鸟 新房
          let s_arr1 = _arr1.filter(item => {
            return item._price >= zgMinPrice && item._price <= zgMaxPrice;
          });
          //无特殊条件
          let s_arr2 = _arr2.filter(item => {
            return item._price >= zgMinPrice && item._price <= zgMaxPrice;
          });
          if (res[1].zgCount >= 50) {
            zgCount = res[1].zgCount
          } else {
            zgCount = s_arr1.length + s_arr2.length
          }
          arr2.push.apply(arr2, s_arr1);
          arr2.push.apply(arr2, s_arr2);
          if (zgfilter.sortType === 2) {
            arr2.sort(util.compareSort("_price", "asc"));
            arr1 = arr2
          } else {
            arr1 = arr2
          }
          resolve({
            arr: arr1,
            zgCount
          });
        }
      })
  })
}
const getZgData1 = (type, zgfilter) => {
  let app = getApp();
  let zgCount = 0;
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
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
    if (equipment.indexOf("5") > -1 || equipment.indexOf("6") > -1) {
      zgCount = 0;
      resolve({
        arr: [],
        zgCount
      });
      return;
    }
    if (y.areaType && y.area) {
      if (y.areaId.hasOwnProperty("zg") && !y.areaId.zg) {
        zgCount = 0;
        resolve({
          arr: [],
          zgCount
        });
        return;
      }
    }
    let data = {
      platform: "zg",
      cityId: y.cityId.zg,
      page: {
        size: 50,
        num: 1
      },
      filter: zgfilter
    };
    houseApi.getZgList(data).then(res => {
      if (res) {
        zgCount = Number(res.data.count);
        resolve({
          arr: res.data.list || [],
          zgCount
        });
      } else {
        resolve(false);
      }
    });
  });
};
const getZgData2 = (type, zgfilter) => {
  let app = getApp();
  let zgCount = 0;
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
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
    if (equipment.indexOf("5") > -1 || equipment.indexOf("6") > -1) {
      zgCount = 0;
      resolve({
        arr: [],
        zgCount
      });
      return;
    }
    if (y.areaType && y.area) {
      if (y.areaId.hasOwnProperty("zg") && !y.areaId.zg) {
        zgCount = 0;
        resolve({
          arr: [],
          zgCount
        });
        return;
      }
    }
    let data = {
      platform: "zg",
      cityId: y.cityId.zg,
      page: {
        size: 50,
        num: 1
      },
      filter: zgfilter
    };
    houseApi.getZgList(data).then(res => {
      if (res) {
        zgCount = Number(res.data.count);
        resolve({
          arr: res.data.list || [],
          zgCount
        });
      } else {
        resolve(false);
      }
    });
  });
};
/**
 * 获取我爱我家平台数据
 * type 1 房源列表；2监控详情
 */
const getWiwjData = (type, wiwjfilter = {}) => {
  let app = getApp();
  let wiwjCount = 0;
  let y =
    type == 1 ?
    app.globalData.searchLongData :
    app.globalData.monitorSearchLongData;
  return new Promise((resolve, reject) => {
    if (wiwjfilter.keyswordFlag) {
      wiwjCount = 0;
      resolve({
        arr: [],
        wiwjCount
      });
      return;
    }
    longrent.wiwj
      .rentSearch({
        city: y.cityId.wiwj,
        page: {
          num: 1,
          size: 50
        },
        filter: wiwjfilter
      })
      .then(res => {
        if (res) {
          wiwjCount = res.data.count;
          resolve({
            arr: res.data.list ||[],
            wiwjCount
          });
        }
      })
      .catch(e => {
        resolve({
          network: true
        });
      });
  });
};
const getSecondWiwjData = (type, wiwjfilter = {}) => {
  let app = getApp();
  let wiwjCount = 0;
  let y =
    type == 1
      ? app.globalData.secondSearchData
      : app.globalData.monitorSecondSearchData;
  return new Promise((resolve, reject) => {
    if (wiwjfilter.keyswordFlag) {
      wiwjCount = 0;
      resolve({
        arr: [],
        wiwjCount
      });
      return;
    }
    longrent.wiwj.ershouSearch({
      "city": y.cityId.wiwj,
      "page": {
        "size": 50,
        "num": 1
      },
      "filter": wiwjfilter
    }).then(res => {
      if (res) {
        wiwjCount = res.data.count;
        resolve({
          arr: res.data.list || [],
          wiwjCount
        })
      }
    }).catch(e => {
      resolve({
        network: true
      });
    })
  })
};
/**
 * 获取链家平台数据
 * type 1 房源列表；2监控详情
 */
const getLianjiaData = (type, lianjiafilter = []) => {
  let app = getApp();
  let lianjiaCount = 0;
  let y =
    type == 1 ?
    app.globalData.searchLongData :
    app.globalData.monitorSearchLongData;
  return new Promise((resolve, reject) => {
    if (lianjiafilter.length && lianjiafilter[0].keyswordFlag) {
      lianjiaCount = 0;
      resolve({
        arr: [],
        lianjiaCount
      });
      return;
    }
    longrent.lianjia
      .rentSearch({
        city: y.cityId.lj,
        page: {
          num: 1,
          size: 50
        },
        filterList: lianjiafilter
      })
      .then(res => {
        if (res) {
          lianjiaCount = res.data.total;
          resolve({
            arr: res.data.list||[],
            lianjiaCount
          });
        }
      })
      .catch(e => {
        resolve({
          network: true
        });
      });
  });
};

const getSecondLianjiaData = (type, lianjiafilter = []) => {
  let app = getApp();
  let lianjiaCount = 0;
  let y =
    type == 1
      ? app.globalData.secondSearchData
      : app.globalData.monitorSecondSearchData;
  return new Promise((resolve, reject) => {
    if (lianjiafilter.length&&lianjiafilter[0].keyswordFlag) {
      lianjiaCount = 0;
      resolve({
        arr: [],
        lianjiaCount
      });
      return;
    }
    longrent.lianjia.ershouSearch({
      "city": y.cityId.lj,
      "page": {
        "size": 50,
        "num": 1
      },
      "filterList": lianjiafilter
    }).then(res => {
        if(res){
          lianjiaCount = res.total_count;
          resolve({
            arr: res.list||[],
            lianjiaCount
          });
        }
    })
    .catch(e => {
      resolve({
        network: true
      });
    });
  })
};

/**
 * 获取房天下平台数据
 * type 1 房源列表；2监控详情
 */
const getFangtianxiaData = (type, fangtianxiafilter = {}) => {
  let app = getApp();
  let fangtianxiaCount = 0;
  let y =
    type == 1 ?
    app.globalData.searchLongData :
    app.globalData.monitorSearchLongData;
  return new Promise((resolve, reject) => {
    if (fangtianxiafilter.keyswordFlag) {
      fangtianxiaCount = 0;
      resolve({
        arr: [],
        fangtianxiaCount
      });
      return;
    }
    longrent.fangtianxia
      .rentSearch({
        city: y.cityId.ftx,
        page: {
          num: 1,
          size: 50
        },
        filter: fangtianxiafilter
      })
      .then(res => {
        if (res) {
          fangtianxiaCount = Number(res.houses.housecount);
          resolve({
            arr: res.houses.houseinfo && Array.isArray(res.houses.houseinfo) ?
              res.houses.houseinfo||[] :
              [res.houses.houseinfo],
            fangtianxiaCount
          });
        }
      })
      .catch(e => {
        resolve({
          network: true
        });
      });
  });
};

/**
 * 获取58同城平台数据
 * type 1 房源列表；2监控详情
 */
const getWbtcData = (type, wbtcfilter = {}) => {
  let app = getApp();
  let wbtcCount = 0;
  let arr = [];
  let y =
    type == 1 ?
    app.globalData.searchLongData :
    app.globalData.monitorSearchLongData;
  return new Promise((resolve, reject) => {
    if (wbtcfilter.keyswordFlag) {
      wbtcCount = 0;
      resolve({
        arr: [],
        wbtcCount
      });
      return;
    }
    longrent.wbtc
      .rentSearch({
        city: y.cityId.tc,
        page: {
          num: 1,
          size: 50
        },
        filter: wbtcfilter
      })
      .then(res => {
        // if (
        //   res.result.getListInfo.infolist && res.result.getListInfo.infolist.length > 0 &&
        //   res.result.getListInfo.infolist[0]["itemtype"] === "listTangram"
        // ) {
        //   res.result.getListInfo.infolist.shift();
        // }
        wbtcCount = res.result.getListInfo.searchNum;
        arr = res.result.getListInfo.infolist || [];
        if (arr.length > wbtcCount) {
          wbtcCount = arr.length;
        }
        if (res && arr.length < 50 && arr.length < wbtcCount) {
          return longrent.wbtc.rentSearch2({
            city: y.cityId.tc,
            page: {
              num: 2,
              size: 50
            },
            filter: wbtcfilter
          });
        } else {
          resolve({
            arr: arr,
            wbtcCount
          });
        }
      })
      .catch(e => {
        resolve({
          network: true
        });
      })
      .then(res => {
        if (res) {
          arr.push.apply(arr, res.result.getListInfo.infolist || []);
        }
        if (arr.length > wbtcCount) {
          wbtcCount = arr.length;
        }
        resolve({
          arr: arr,
          wbtcCount
        });
      });
  });
};

const tjScreenParam = type => {
  let app = getApp();
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
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
    tjgueseNumber = 500 + Number(y.gueseNumber);
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
  if (y.leaseType == 2) {
    tjconditions.push({
      gType: 1,
      type: 6,
      value: 902
    });
  }
  if (y.leaseType == 1) {
    tjconditions.push({
      gType: 1,
      type: 6,
      value: 901
    });
  }
  //配套设施
  if (y.equipment.length) {
    for (let i = 0; i < y.equipment.length; i++) {
      let e = y.equipment[i] + "";
      switch (e) {
        case "1":
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 201
          });
          break;
        case "2":
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 206
          });
          break;
        case "3":
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 205
          });
          break;
        case "4":
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 204
          });
          break;
        case "5":
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 207
          });
          break;
        case "6":
          tjconditions.push({
            gType: 1,
            type: 6,
            value: 203
          });
          break;
        case "7":
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
    value: minPrice + "," + maxPrice
  });
  return {
    beginDate: y.beginDate,
    endDate: y.endDate,
    conditions: tjconditions
  };
};

const xzScreenParam = type => {
  let app = getApp();
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  //排序方式  推荐recommend 低价zuipianyi
  let xzOrderBy = "recommend";
  if (y.sort == 1) {
    xzOrderBy = "recommend";
  } else {
    xzOrderBy = "zuipianyi";
  }
  //价格区间
  let minPrice = y.minPrice == 0 ? 1 : Number(y.minPrice);
  let maxPrice = Number(y.maxPrice);

  //出租类型（whole：整租，room：单间）
  let xzLeaseType = "whole";
  if (y.leaseType == 2) {
    xzLeaseType = "room";
  }
  if (y.leaseType == 1) {
    xzLeaseType = "whole";
  }
  //配套设施
  let xzFacilitys = [];
  if (y.equipment.length) {
    for (let i = 0; i < y.equipment.length; i++) {
      let e = y.equipment[i] + "";
      switch (e) {
        case "1":
          xzFacilitys.push("facility_Netword");
          break;
        case "2":
          xzFacilitys.push("facility_AirCondition");
          break;
        case "3":
          xzFacilitys.push("facility_Tv");
          break;
        case "4":
          break;
        case "5":
          break;
        case "6":
          xzFacilitys.push("facility_Shower");
          break;
        case "7":
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
    xzfilterObj.huXing = y.houseType.join(",");
  }
  //入住人数
  if (y.gueseNumber != -1) {
    xzfilterObj.guestNum = y.gueseNumber;
  }
  //出租类型（whole：整租，room：单间）
  if (y.leaseType != "" && y.leaseType != "undefined") {
    xzfilterObj.leaseType = xzLeaseType;
  }
  //配套设施
  if (xzFacilitys.length > 0) {
    xzfilterObj.facilitys = xzFacilitys.join("|");
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
  return xzfilterObj;
};

const mnScreenPara = type => {
  let app = getApp();
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
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
  if (y.leaseType == 2) {
    mnrentType = [2];
  }
  if (y.leaseType == 1) {
    mnrentType = [1];
  }
  //配套设施
  let mnSupport = [];
  if (y.equipment.length) {
    for (let i = 0; i < y.equipment.length; i++) {
      let e = y.equipment[i] + "";
      switch (e) {
        case "1":
          mnSupport.push(2);
          break;
        case "2":
          mnSupport.push(5);
          break;
        case "3":
          mnSupport.push(3);
          break;
        case "4":
          mnSupport.push(7);
          break;
        case "5":
          mnSupport.push(8);
          break;
        case "6":
          mnSupport.push(9);
          break;
        case "7":
          mnSupport.push(17);
          break;
      }
    }
  }

  //价格区间
  let minPrice = y.minPrice == 0 ? 1 : Number(y.minPrice);
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
        mnfilterObj.lat = y.ltude.mn.split(",")[0];
        mnfilterObj.lng = y.ltude.mn.split(",")[1];
      }
    }
  } else {
    //手动定位的不管
  }
  //入住人数
  if (y.gueseNumber != -1) {
    mnfilterObj.guestNum = y.gueseNumber;
  }

  return mnfilterObj;
};

const zgScreenPara = type => {
  let app = getApp();
  let y =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
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
  if (y.leaseType == 2) {
    zgrentTypeList = [1];
  }
  if (y.leaseType == 1) {
    zgrentTypeList = [0];
  }
  //配套设施
  let zgfacilities = [];
  if (y.equipment.length) {
    for (let i = 0; i < y.equipment.length; i++) {
      let e = y.equipment[i] + "";
      switch (e) {
        case "1":
          zgfacilities.push(1);
          break;
        case "2":
          zgfacilities.push(10);
          break;
        case "3":
          zgfacilities.push(8);
          break;
        case "4":
          zgfacilities.push(14);
          break;
        case "5":
          break;
        case "6":
          break;
        case "7":
          zgfacilities.push(4);
          break;
      }
    }
  }
  //价格区间
  let minPrice = y.minPrice == 0 ? 1 : Number(y.minPrice);
  let maxPrice = Number(y.maxPrice);
  //榛果筛选
  let zgfilterObj = {
    dateBegin: y.beginDate.replace(/-/g, ""),
    dateEnd: y.endDate.replace(/-/g, ""),
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
    let type = y.areaType + "";
    if (y.areaId.zg) {
      zgfilterObj.locationId = y.areaId.zg;
      if (y.areaType != 16) {
        zgfilterObj.locationLatitude = y.ltude.zg.split(",")[0];
        zgfilterObj.locationLongitude = y.ltude.zg.split(",")[1];
      }
      switch (type) {
        case "11":
          zgfilterObj.locationCategoryId = 1;
          break;
        case "12":
          zgfilterObj.locationCategoryId = 2;
          break;
        case "13":
          zgfilterObj.locationCategoryId = -4;
          break;
        case "14":
          zgfilterObj.locationCategoryId = 4;
          break;
        case "15":
          zgfilterObj.locationCategoryId = 5;
          break;
        case "16":
          zgfilterObj.locationCategoryId = 6;
          break;
        case "17":
          zgfilterObj.locationCategoryId = -4;
          break;
        case "18":
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

  return zgfilterObj;
};

const getHouseData = data => {
  let app = getApp();
  let tjFilterData = [],
    xzFilterData = [],
    mnFilterData = [],
    zgFilterData = [];
  let maxTotal = 50;
  let allData = [];
  let rowData = [];
  let y = data.type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  let tjData = data.tjData.filter(item => {
    let _price = Number(item.finalPrice)
    return item.allowBooking && _price > 0 && _price <= y.maxPrice && _price >= y.minPrice;
  });
  let xzData = data.xzData.filter(item => {
    let _price = Number(item.showPriceV2.showPrice || item.luPrice)
    return _price > 0 && _price <= y.maxPrice && _price >= y.minPrice;
  });
  let mnData = data.mnData.filter(item => {
    let _price = Number(item.sale_price)
    return _price > 0 && _price <= y.maxPrice && _price >= y.minPrice;
  });
  let zgData = data.zgData.filter(item => {
    let _price = item.discountPrice ? item.discountPrice / 100 : item.price / 100
    return _price > 0 && _price <= y.maxPrice && _price >= y.minPrice;;
  });
  for (let i = 0; i < maxTotal; i++) {
    if (data.tjCount > 0) {
      let tj = addPlatfromData(allData, tjData, i);
      if (tj == 0) {
        break;
      }
      if (tj == 1) {
        let tjObjs = {};
        let tjObj = tjData[i];
        tjObjs.platformId = "tj";
        tjObjs.curIndex = 1;
        tjObjs.finishLoadFlag = false;
        tjObjs.collection = false;
        tjObjs.unitName = tjObj.unitName;
        tjObjs.logoUrl = tjObj.logoUrl;
        tjObjs.pictureList = tjObj.pictureList.slice(0, 1);
        tjObjs.pictureAllList = tjObj.pictureList;
        tjObjs.preloadDetail =
          tjObj.preloadDetail.baseBrief[0].title +
          "/" +
          tjObj.preloadDetail.baseBrief[1].title +
          "/" +
          tjObj.preloadDetail.baseBrief[2].title;
        tjObjs.finalPrice = Number(tjObj.finalPrice);
        tjObjs.productId = tjObj.unitId;
        tjObjs.priceTag = util.arrFilter(tjObj.priceTags, "type", 6);
        tjFilterData.push(tjObjs);
        allData.push(tjObjs);
        rowData.push({
          "data": tjObj,
          "newLevel": 0,
          "platform": "tj",
          "priceDownLevel": 0
        })
      }
    }
    if (data.xzCount > 0) {
      let xz = addPlatfromData(allData, xzData, i);
      if (xz == 0) {
        break;
      }
      if (xz == 1) {
        let xzObjs = {};
        let xzObj = xzData[i];
        xzObjs.platformId = "xz";
        xzObjs.curIndex = 1;
        xzObjs.finishLoadFlag = false;
        xzObjs.collection = false;
        xzObjs.unitName = xzObj.luTitle;
        xzObjs.logoUrl = xzObj.landlordheadimgurl;
        xzObjs.pictureList = xzObj.coverImages.slice(0, 1);
        xzObjs.pictureAllList = xzObj.coverImages;
        xzObjs.preloadDetail =
          xzObj.luLeaseType + "/" + xzObj.houseTypeInfo + "/" + xzObj.guestnum;
        xzObjs.finalPrice = Number(
          xzObj.showPriceV2.showPrice || xzObj.luPrice
        );
        xzObjs.productId = xzObj.luId;
        xzObjs.priceTag = util.arrFilter(
          xzObj.lodgeUnitNewTags,
          "title",
          "长租优惠"
        );
        xzObjs.oriPrice = xzObj.luPrice
        if (
          xzObj.showPriceV2.showPrice &&
          xzObj.luPrice &&
          Number(xzObj.showPriceV2.showPrice) < Number(xzObj.luPrice)
        ) {
          xzObjs.discount =
            "已优惠" +
            (Number(xzObj.luPrice) - Number(xzObj.showPriceV2.showPrice)) +
            "元";
        }
        xzFilterData.push(xzObjs);
        allData.push(xzObjs);
        rowData.push({
          "data": xzObj,
          "newLevel": 0,
          "platform": "xz",
          "priceDownLevel": 0
        })
      }
    }
    if (data.mnCount > 0) {
      let mn = addPlatfromData(allData, mnData, i);
      if (mn == 0) {
        break;
      }
      if (mn == 1) {
        let mnObjs = {};
        let mnObj = mnData[i];
        mnObjs.platformId = "mn";
        mnObjs.curIndex = 1;
        mnObjs.finishLoadFlag = false;
        mnObjs.collection = false;
        mnObjs.unitName = mnObj.title;
        mnObjs.logoUrl = mnObj.image_host;
        mnObjs.pictureList = mnObj.image_list.slice(0, 1);
        mnObjs.pictureAllList = mnObj.image_list;
        mnObjs.preloadDetail =
          mnObj.rent_type + "/" + mnObj.source_type + "/宜住" + mnObj.max_num;
        mnObjs.finalPrice = Number(mnObj.sale_price);
        mnObjs.productId = mnObj.room_id;
        mnFilterData.push(mnObjs);
        allData.push(mnObjs);
        rowData.push({
          "data": mnObj,
          "newLevel": 0,
          "platform": "mn",
          "priceDownLevel": 0
        })
      }
    }
    if (data.zgCount > 0) {
      let zg = addPlatfromData(allData, zgData, i);
      if (zg == 0) {
        break;
      }
      if (zg == 1) {
        let zgObjs = {};
        let zgObj = zgData[i];
        zgObjs.platformId = "zg";
        zgObjs.curIndex = 1;
        zgObjs.finishLoadFlag = false;
        zgObjs.collection = false;
        zgObjs.unitName = zgObj.title.replace(/\n/g, " ");
        zgObjs.logoUrl = zgObj.hostAvatarUrl;
        zgObjs.pictureList = zgObj.productImages.slice(0, 1);
        zgObjs.pictureAllList = zgObj.productImages;
        zgObjs.preloadDetail =
          zgObj.rentLayoutDesc + "/" + zgObj.guestNumberDesc;
        zgObjs.finalPrice = zgObj.discountPrice ?
          zgObj.discountPrice / 100 :
          zgObj.price / 100;
        zgObjs.productId = zgObj.productId;
        zgObjs.priceTag = util.arrFilter(zgObj.productTagList, "tagId", 30);
        zgObjs.oriPrice = zgObj.price / 100
        if (
          zgObj.price &&
          zgObj.discountPrice &&
          Number(zgObj.discountPrice) < Number(zgObj.price)
        ) {
          zgObjs.discount =
            "已优惠" + (zgObj.price / 100 - zgObj.discountPrice / 100) + "元";
        }
        zgFilterData.push(zgObjs);
        allData.push(zgObjs);
        rowData.push({
          "data": zgObj,
          "newLevel": 0,
          "platform": "zg",
          "priceDownLevel": 0
        })
      }
    }
  }
  //总房源数量
  let allCount = 0;
  if (data.tjCount > -1) {
    allCount += data.tjCount;
  }
  if (data.xzCount > -1) {
    allCount += data.xzCount;
  }
  if (data.mnCount > -1) {
    allCount += data.mnCount;
  }
  if (data.zgCount > -1) {
    allCount += data.zgCount;
  }

  //平均价
  let average =allData.length > 0
      ? allData.reduce((sum, { finalPrice }) => sum + finalPrice, 0) /
      allData.length
      : 0;
    allData.length > 0 ?
    allData.reduce((sum, {
      finalPrice
    }) => sum + finalPrice, 0) /
    allData.length :
    0;
  let sortArr = [...allData];
  let tjSortArr = [...tjFilterData];
  let xzSortArr = [...xzFilterData];
  let mnSortArr = [...mnFilterData];
  let zgSortArr = [...zgFilterData];

  //所有最低价
  let lowPrice = allData.length > 0
      ? Math.min.apply(
        Math,
        allData.map(function (o) {
          return o.finalPrice;
        })
      )
      : 0;
    allData.length > 0 ?
    Math.min.apply(
      Math,
      allData.map(function(o) {
        return o.finalPrice;
      })
    ) :
    0;

  //所有房源最低价格的数据
  sortArr.sort(util.compareSort("finalPrice", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";

  // let y = data.type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  if (y.advSort == 2) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("finalPrice", "asc"));
    allData = allArr
  }
  if (y.advSort == 3) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("finalPrice", "desc"));
    allData = allArr
  }
  //途家最低价格数据
  tjSortArr.sort(util.compareSort("finalPrice", "asc"));
  let tjLowPriceData = tjSortArr.length > 0 ? tjSortArr[0] : "";
  //小猪最低价格数据
  xzSortArr.sort(util.compareSort("finalPrice", "asc"));
  let xzLowPriceData = xzSortArr.length > 0 ? xzSortArr[0] : "";
  //木鸟最低价格数据
  mnSortArr.sort(util.compareSort("finalPrice", "asc"));
  let mnLowPriceData = mnSortArr.length > 0 ? mnSortArr[0] : "";
  //榛果最低价格数据
  zgSortArr.sort(util.compareSort("finalPrice", "asc"));
  let zgLowPriceData = zgSortArr.length > 0 ? zgSortArr[0] : "";

  return {
    allData,
    allCount,
    averagePrice: parseInt(average),
    lowPrice,
    lowPriceData,
    tjLowPriceData,
    xzLowPriceData,
    mnLowPriceData,
    zgLowPriceData,
    tjFilterData,
    xzFilterData,
    mnFilterData,
    zgFilterData,
    rowData
  };
};

const getMonitorHouseData = (list, mSelect) => {
  let app = getApp()
  let allData = []; //监控房源列表
  let tjFilterData = []; //监控途家房源
  let xzFilterData = []; //监控小猪房源
  let mnFilterData = []; //监控木鸟房源
  let zgFilterData = []; //监控榛果房源
  let houseList = monitorFilter(list, mSelect)
  for (let i = 0; i < houseList.length; i++) {
    if (houseList[i].platform == "tj") {
      let tjObj = {
        platformId: houseList[i].platform,
        curIndex: 1,
        finishLoadFlag: false,
        unitName: houseList[i].data.unitName,
        logoUrl: houseList[i].data.logoUrl,
        pictureList: houseList[i].data.pictureList.slice(0, 1),
        pictureAllList: houseList[i].data.pictureList,
        preloadDetail: houseList[i].data.preloadDetail.baseBrief[0].title +
          "/" +
          houseList[i].data.preloadDetail.baseBrief[1].title +
          "/" +
          houseList[i].data.preloadDetail.baseBrief[2].title,
        finalPrice: Number(houseList[i].data.finalPrice),
        productId: houseList[i].data.unitId,
        priceTag: util.arrFilter(houseList[i].data.priceTags, "type", 6),
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
      };
      allData.push(tjObj);
      tjFilterData.push(tjObj);
    }

    if (houseList[i].platform == "xz") {
      let xzObj = {
        platformId: houseList[i].platform,
        curIndex: 1,
        finishLoadFlag: false,
        unitName: houseList[i].data.luTitle,
        logoUrl: houseList[i].data.landlordheadimgurl,
        pictureList: houseList[i].data.coverImages.slice(0, 1),
        pictureAllList: houseList[i].data.coverImages,
        preloadDetail: houseList[i].data.luLeaseType +
          "/" +
          houseList[i].data.houseTypeInfo +
          "/" +
          houseList[i].data.guestnum,
        finalPrice: Number(
          houseList[i].data.showPriceV2.showPrice || houseList[i].data.luPrice
        ),
        productId: houseList[i].data.luId,
        priceTag: util.arrFilter(
          houseList[i].data.lodgeUnitNewTags,
          "title",
          "长租优惠"
        ),
        oriPrice: houseList[i].data.luPrice,
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
      };
      if (
        houseList[i].data.showPriceV2.showPrice &&
        houseList[i].data.luPrice &&
        Number(houseList[i].data.showPriceV2.showPrice) <
        Number(houseList[i].data.luPrice)
      ) {
        xzObj.discount =
          "已优惠" +
          (Number(houseList[i].data.luPrice) -
            Number(houseList[i].data.showPriceV2.showPrice)) +
          "元";
      }
      allData.push(xzObj);
      xzFilterData.push(xzObj);
    }

    if (houseList[i].platform == "mn") {
      let mnObj = {
        platformId: houseList[i].platform,
        curIndex: 1,
        finishLoadFlag: false,
        unitName: houseList[i].data.title,
        logoUrl: houseList[i].data.image_host,
        pictureList: houseList[i].data.image_list.slice(0, 1),
        pictureAllList: houseList[i].data.image_list,
        preloadDetail: houseList[i].data.rent_type +
          "/" +
          houseList[i].data.source_type +
          "/宜住" +
          houseList[i].data.max_num,
        finalPrice: Number(houseList[i].data.sale_price),
        productId: houseList[i].data.room_id,
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
      };
      allData.push(mnObj);
      mnFilterData.push(mnObj);
    }

    if (houseList[i].platform == "zg") {
      let zgObj = {
        platformId: "zg",
        curIndex: 1,
        finishLoadFlag: false,
        unitName: houseList[i].data.title.replace(/\n/g, " "),
        logoUrl: houseList[i].data.hostAvatarUrl,
        pictureList: houseList[i].data.productImages.slice(0, 1),
        pictureAllList: houseList[i].data.productImages,
        preloadDetail: houseList[i].data.rentLayoutDesc +
          "/" +
          houseList[i].data.guestNumberDesc,
        finalPrice: houseList[i].data.discountPrice ?
          houseList[i].data.discountPrice / 100 :
          houseList[i].data.price / 100,
        productId: houseList[i].data.productId,
        priceTag: util.arrFilter(houseList[i].data.productTagList, "tagId", 30),
        oriPrice: houseList[i].data.price / 100,
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
      };
      if (
        houseList[i].data.discountPrice &&
        houseList[i].data.price &&
        houseList[i].data.discountPrice < houseList[i].data.price
      ) {
        zgObj.discount =
          "已优惠" +
          (houseList[i].data.price / 100 -
            houseList[i].data.discountPrice / 100) +
          "元";
      }
      allData.push(zgObj);
      zgFilterData.push(zgObj);
    }
  }
  //平均价
  let average =allData.length > 0
      ? allData.reduce((sum, { finalPrice }) => sum + finalPrice, 0) /
      allData.length
      : 0;
    allData.length > 0 ?
    allData.reduce((sum, {
      finalPrice
    }) => sum + finalPrice, 0) /
    allData.length :
    0;
  let sortArr = [...allData];
  let tjSortArr = [...tjFilterData];
  let xzSortArr = [...xzFilterData];
  let mnSortArr = [...mnFilterData];
  let zgSortArr = [...zgFilterData];

  //所有最低价
  let lowPrice =allData.length > 0
      ? Math.min.apply(
        Math,
        allData.map(function (o) {
          return o.finalPrice;
        })
      )
      : 0;
    allData.length > 0 ?
    Math.min.apply(
      Math,
      allData.map(function(o) {
        return o.finalPrice;
      })
    ) :
    0;

  //所有房源最低价格的数据
  sortArr.sort(util.compareSort("finalPrice", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";

  let y = app.globalData.monitorSearchData;
  if (y.advSort == 2) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("finalPrice", "asc"));
    allData = allArr
  }
  if (y.advSort == 3) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("finalPrice", "desc"));
    allData = allArr
  }
  //途家最低价格数据
  tjSortArr.sort(util.compareSort("finalPrice", "asc"));
  let tjLowPriceData = tjSortArr.length > 0 ? tjSortArr[0] : "";
  //小猪最低价格数据
  xzSortArr.sort(util.compareSort("finalPrice", "asc"));
  let xzLowPriceData = xzSortArr.length > 0 ? xzSortArr[0] : "";
  //木鸟最低价格数据
  mnSortArr.sort(util.compareSort("finalPrice", "asc"));
  let mnLowPriceData = mnSortArr.length > 0 ? mnSortArr[0] : "";
  //榛果最低价格数据
  zgSortArr.sort(util.compareSort("finalPrice", "asc"));
  let zgLowPriceData = zgSortArr.length > 0 ? zgSortArr[0] : "";
  return {
    allData,
    averagePrice: parseInt(average),
    lowPrice,
    lowPriceData,
    tjLowPriceData,
    xzLowPriceData,
    mnLowPriceData,
    zgLowPriceData,
    tjFilterData,
    xzFilterData,
    mnFilterData,
    zgFilterData
  };
};
const getMonitorHouseType = list => {
  let newLevelNum = 0
  let priceDownLevelNum = 0
  for (let i = 0; i < list.length; i++) {
    if (list[i].newLevel > 0) {
      newLevelNum++
    }
    if (list[i].priceDownLevel > 0) {
      priceDownLevelNum++
    }
  }
  if (newLevelNum > 0) {
    return 2
  }
  if (newLevelNum == 0 && priceDownLevelNum > 0) {
    return 3
  }
  if (newLevelNum == 0 && priceDownLevelNum == 0) {
    return 1
  }
}
const houseShortFilter = allData => {
  let tjFilterData = [],
    xzFilterData = [],
    mnFilterData = [],
    zgFilterData = [];
  //平均价
  let average = allData.length > 0 ? allData.reduce((sum, { finalPrice }) => sum + finalPrice, 0) / allData.length : 0;
  //所有最低价
  let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) { return o.finalPrice; })) : 0;
  //所有房源最低价格的数据
  let sortArr = [...allData];
  sortArr.sort(util.compareSort("finalPrice", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";

  for (let i = 0; i < allData.length; i++) {
    if (allData[i].platformId == 'tj') {
      tjFilterData.push(allData[i])
    }
    if (allData[i].platformId == 'xz') {
      xzFilterData.push(allData[i])
    }
    if (allData[i].platformId == 'mn') {
      mnFilterData.push(allData[i])
    }
    if (allData[i].platformId == 'zg') {
      zgFilterData.push(allData[i])
    }
  }
  //途家最低价格数据
  tjFilterData.sort(util.compareSort("finalPrice", "asc"));
  let tjLowPriceData = tjFilterData.length > 0 ? tjFilterData[0] : "";
  //小猪最低价格数据
  xzFilterData.sort(util.compareSort("finalPrice", "asc"));
  let xzLowPriceData = xzFilterData.length > 0 ? xzFilterData[0] : "";
  //木鸟最低价格数据
  mnFilterData.sort(util.compareSort("finalPrice", "asc"));
  let mnLowPriceData = mnFilterData.length > 0 ? mnFilterData[0] : "";
  //榛果最低价格数据
  zgFilterData.sort(util.compareSort("finalPrice", "asc"));
  let zgLowPriceData = zgFilterData.length > 0 ? zgFilterData[0] : "";
  return {
    averagePrice: parseInt(average),
    lowPrice,
    lowPriceData,
    tjLowPriceData,
    xzLowPriceData,
    mnLowPriceData,
    zgLowPriceData,
    tjFilterData,
    xzFilterData,
    mnFilterData,
    zgFilterData
  };
}

const getBrandHouseData = data => {
  let app = getApp();
  let allCount = 0;
  let wiwjFilterData = [],
    lianjiaFilterData = [];
  let maxTotal = 50;
  let allData = [];
  let rowData = [];
  let wiwjData = data.wiwjData;
  // let lianjiaData = lianjianFilter(data.lianjiaData);
  let lianjiaData = data.lianjiaData;
  for (let i = 0; i < maxTotal; i++) {
    if (data.wiwjCount > 0) {
      let wiwj = addPlatfromData(allData, wiwjData, i);
      if (wiwj == 0) {
        break;
      }
      if (wiwj == 1) {
        let wiwjObjs = {
          platformId: "wiwj",
          collection: false,
          housesid: wiwjData[i].housesid,
          imgurl: wiwjData[i].imgurl,
          price: Number(wiwjData[i].price),
          housetitle: wiwjData[i].housetitle,
          introduce: wiwjData[i].BaseDetail.area +
            "㎡/" +
            wiwjData[i].BaseDetail.floorStr +
            "/" +
            wiwjData[i].BaseDetail.heading,
          address: wiwjData[i].qyname ? (wiwjData[i].qyname + "·" + wiwjData[i].sqname) : wiwjData[i].communityname,
          tagwall: wiwjData[i].tagwall,
          area: Number(wiwjData[i].BaseDetail.area)
        };
        wiwjFilterData.push(wiwjObjs);
        allData.push(wiwjObjs);
        rowData.push({
          "data": wiwjData[i],
          "newLevel": 0,
          "platform": "wiwj",
          "priceDownLevel": 0
        })
      }
    }
    if (data.lianjiaCount > 0) {
      let lianjia = addPlatfromData(allData, lianjiaData, i);
      if (lianjia == 0) {
        break;
      }
      if (lianjia == 1) {
        let lianjiaObjs = {
          platformId: "lj",
          collection: false,
          housesid: lianjiaData[i].house_code,
          imgurl: lianjiaData[i].list_picture,
          price: Number(lianjiaData[i].rent_price_listing),
          housetitle: lianjiaData[i].house_title,
          introduce: lianjiaData[i].rent_area +
            "㎡/" +
            lianjiaData[i].layout +
            "/" +
            lianjiaData[i].frame_orientation,
          address: lianjiaData[i].district_name + "." + lianjiaData[i].bizcircle_name,
          tagwall: lianjiaTagwall(lianjiaData[i].house_tags),
          area: Number(lianjiaData[i].rent_area)
        };
        lianjiaFilterData.push(lianjiaObjs);
        allData.push(lianjiaObjs);
        rowData.push({
          "data": lianjiaData[i],
          "newLevel": 0,
          "platform": "lj",
          "priceDownLevel": 0
        })
      }
    }
  }
  if (data.wiwjCount > -1) {
    allCount += data.wiwjCount;
  }
  if (data.lianjiaCount > -1) {
    allCount += data.lianjiaCount;
  }
  //平均价
  let average =
    allData.length > 0 ?
    allData.reduce((sum, {
      price
    }) => sum + price, 0) / allData.length :
    0;
  let sortArr = [...allData];
  let areasortArr = [...allData];
  let wiwjSortArr = [...wiwjFilterData];
  let lianjiaSortArr = [...lianjiaFilterData];
  //所有最低价
  let lowPrice =allData.length > 0
      ? Math.min.apply(
        Math,
        allData.map(function (o) {
          return o.price;
        })
      )
      : 0;
    allData.length > 0 ?
    Math.min.apply(
      Math,
      allData.map(function(o) {
        return o.price;
      })
    ) :
    0;

  //所有房源最低价格的数据
  sortArr.sort(util.compareSort("price", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";
  let y = data.type == 1 ? app.globalData.searchLongData : app.globalData.monitorSearchLongData;
  if (y.advSort == 1) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "asc"));
    allData = allArr
  }
  if (y.advSort == 11) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "desc"));
    allData = allArr
  }
  if (y.advSort == 2) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("area", "desc"));
    allData = allArr
  }
  if (y.advSort == 21) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("area", "asc"));
    allData = allArr
  }
  //所有房源面积最大
  areasortArr.sort(util.compareSort("area", "desc"));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : "";
  //我爱我家最低价格数据
  wiwjSortArr.sort(util.compareSort("price", "asc"));
  let wiwjLowPriceData = wiwjSortArr.length > 0 ? wiwjSortArr[0] : "";
  //链家最低价格数据
  lianjiaSortArr.sort(util.compareSort("price", "asc"));
  let lianjiaLowPriceData = lianjiaSortArr.length > 0 ? lianjiaSortArr[0] : "";

  return {
    allData,
    allCount,
    averagePrice: parseInt(average),
    lowPrice,
    lowPriceData,
    highAreaData,
    wiwjLowPriceData,
    lianjiaLowPriceData,
    wiwjFilterData,
    lianjiaFilterData,
    rowData
  };
};
//二手房数据格式转化
const getBrandSecondHouseData = data => {
  let app = getApp();
  let allCount = 0;
  let wiwjFilterData = [],
    lianjiaFilterData = [];
  let maxTotal = 50;
  let allData = [];
  let rowData = [];
  let wiwjData = data.wiwjData;
  let lianjiaData = lianjianSecondFilter(data.lianjiaData);
  for (let i = 0; i < maxTotal; i++) {
    if (data.wiwjCount > 0) {
      let wiwj = addPlatfromData(allData, wiwjData, i);
      if (wiwj == 0) {
        break;
      }
      if (wiwj == 1) {
        let wiwjObjs = {
          platformId: "wiwj",
          collection: false,
          housesid: wiwjData[i].housesid,
          imgurl: wiwjData[i].imgurl,
          price: Number(wiwjData[i].price),
          housetitle: wiwjData[i].BaseDetail.housetitle,
          introduce: wiwjData[i].bedroom +'室'+
            wiwjData[i].livingroom+'厅' +
            "/" +
            wiwjData[i].buildarea +
            "㎡/" +
            wiwjData[i].heading,
          address: wiwjData[i].qyname ? (wiwjData[i].qyname + "·" + wiwjData[i].sqname) : wiwjData[i].communityname,
          tagwall: wiwjData[i].tagwall,
          area: Number(wiwjData[i].buildarea),
          unit_price: Number(wiwjData[i].unitprice),
        };
        wiwjFilterData.push(wiwjObjs);
        allData.push(wiwjObjs);
        rowData.push({
          "data": wiwjData[i],
          "newLevel": 0,
          "platform": "wiwj",
          "priceDownLevel": 0
        })
      }
    }
    if (data.lianjiaCount > 0) {
      let lianjia = addPlatfromData(allData, lianjiaData, i);
      if (lianjia == 0) {
        break;
      }
      if (lianjia == 1) {
        let lianjiaObjs = {
          platformId: "lj",
          collection: false,
          housesid: lianjiaData[i].house_code,
          imgurl: lianjiaData[i].cover_pic,
          price: Number(lianjiaData[i].price_str),
          housetitle: lianjiaData[i].title,
          introduce: lianjiaData[i].desc_abtest,
          address: lianjiaData[i].community_name ? lianjiaData[i].community_name: third_desc,
          tagwall: lianjiaSecondTagwall(lianjiaData[i].color_tags),
          area: Number(lianjiaData[i].area),
          unit_price: Number(lianjiaData[i].unit_price),
        };
        lianjiaFilterData.push(lianjiaObjs);
        allData.push(lianjiaObjs);
        rowData.push({
          "data": lianjiaData[i],
          "newLevel": 0,
          "platform": "lj",
          "priceDownLevel": 0
        })
      }
    }
  }
  if (data.wiwjCount > -1) {
    allCount += data.wiwjCount;
  }
  if (data.lianjiaCount > -1) {
    allCount += data.lianjiaCount;
  }
  //平均价
  let average =
    allData.length > 0 ?
    allData.reduce((sum, {
      price
    }) => sum + price, 0) / allData.length :
    0;
  //单价平均价
  let averageunitPrice =
    allData.length > 0 ?
    allData.reduce((sum, {
        unit_price
    }) => sum + unit_price, 0) / allData.length :
    0;
  let sortArr = [...allData];
  let areasortArr = [...allData];
  let wiwjSortArr = [...wiwjFilterData];
  let lianjiaSortArr = [...lianjiaFilterData];
  //所有最低价
  let lowPrice =
    allData.length > 0 ?
    Math.min.apply(
      Math,
      allData.map(function(o) {
        return o.price;
      })
    ) :
    0;
  //所有最低单价
  let lowUnitPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) {
    return o.unit_price;
  })) : 0;

  //所有房源最低价格的数据
  sortArr.sort(util.compareSort("price", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";
  let y = data.type == 1 ? app.globalData.secondSearchData : app.globalData.monitorSecondSearchData;
  if (y.advSort == 1) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "asc"));
    allData = allArr
  }
  if (y.advSort == 11) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "desc"));
    allData = allArr
  }
  if (y.advSort == 2) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("unit_price", "asc"));
    allData = allArr
  }
  if (y.advSort == 21) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("unit_price", "desc"));
    allData = allArr
  }
  if (y.advSort == 31) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("area", "desc"));
    allData = allArr
  }
  //所有房源面积最大
  areasortArr.sort(util.compareSort("area", "desc"));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : "";
  //我爱我家最低价格数据
  wiwjSortArr.sort(util.compareSort("price", "asc"));
  let wiwjLowPriceData = wiwjSortArr.length > 0 ? wiwjSortArr[0] : "";
  //链家最低价格数据
  lianjiaSortArr.sort(util.compareSort("price", "asc"));
  let lianjiaLowPriceData = lianjiaSortArr.length > 0 ? lianjiaSortArr[0] : "";

  return {
    allData,
    allCount,
    averagePrice: parseInt(average),
    lowPrice,
    averageunitPrice: parseInt(averageunitPrice),
    lowUnitPrice: parseInt(lowUnitPrice),
    lowPriceData,
    highAreaData,
    wiwjLowPriceData,
    lianjiaLowPriceData,
    wiwjFilterData,
    lianjiaFilterData,
    rowData
  };
};
const getPersonalHouseData = data => {
  let app = getApp();
  let allCount = 0;
  let fangtianxiaFilterData = [],
    wbtcFilterData = [];
  let maxTotal = 50;
  let allData = [];
  let rowData = [];
  let fangtianxiaData = data.fangtianxiaData;
  let wbtcData = wbtcFilter(data.wbtcData);
  for (let i = 0; i < maxTotal; i++) {
    if (data.fangtianxiaCount > 0) {
      let fangtianxia = addPlatfromData(allData, fangtianxiaData, i);
      if (fangtianxia == 0) {
        break;
      }
      if (fangtianxia == 1) {
        let fangtianxiaObjs = {
          platformId: "ftx",
          collection: false,
          housesid: fangtianxiaData[i].houseid,
          imgurl: fangtianxiaData[i].titleimage,
          price: Number(fangtianxiaData[i].price),
          housetitle: fangtianxiaData[i].title,
          introduce: fangtianxiaData[i].buildarea +
            "㎡/" +
            fangtianxiaData[i].rentway +
            " " +
            fangtianxiaData[i].room +
            "室",
          address: fangtianxiaData[i].district +
            "." +
            fangtianxiaData[i].comarea,
          tagwall: fangtianxiaData[i].tags ?
            fangtianxiaData[i].tags.split(" ") :
            [],
          area: Number(fangtianxiaData[i].buildarea)
        };
        fangtianxiaFilterData.push(fangtianxiaObjs);
        allData.push(fangtianxiaObjs);
        rowData.push({
          "data": fangtianxiaData[i],
          "newLevel": 0,
          "platform": "ftx",
          "priceDownLevel": 0
        })
      }
    }
    if (data.wbtcCount > 0) {
      let wbtc = addPlatfromData(allData, wbtcData, i);
      if (wbtc == 0) {
        break;
      }
      if (wbtc == 1) {
        let wbtcObjs = {
          platformId: "tc",
          collection: false,
          housesid: wbtcData[i].infoID,
          imgurl: wbtcData[i].picUrl,
          price: Number(wbtcData[i].priceDict.p),
          housetitle: wbtcData[i].title,
          introduce: wbtcData[i].area.split("㎡")[0] + "㎡/" + wbtcData[i].huxing,
          address: wbtcData[i].lastLocal || wbtcData[i].rightLabel,
          tagwall: wbtcData[i].usedTages ?
            wbtcData[i].usedTages.split(",") :
            [],
          area: Number(wbtcData[i].area.split("㎡")[0])
        };
        wbtcFilterData.push(wbtcObjs);
        allData.push(wbtcObjs);
        rowData.push({
          "data": wbtcData[i],
          "newLevel": 0,
          "platform": "tc",
          "priceDownLevel": 0
        })
      }
    }
  }
  if (data.fangtianxiaCount > -1) {
    allCount += data.fangtianxiaCount;
  }
  if (data.wbtcCount > -1) {
    allCount += data.wbtcCount;
  }
  //平均价
  let average =
    allData.length > 0 ?
    allData.reduce((sum, {
      price
    }) => sum + price, 0) / allData.length :
    0;
  let sortArr = [...allData];
  let areasortArr = [...allData];
  let fangtianxiaSortArr = [...fangtianxiaFilterData];
  let wbtcSortArr = [...wbtcFilterData];
  //所有最低价
  let lowPrice =allData.length > 0
      ? Math.min.apply(
        Math,
        allData.map(function (o) {
          return o.price;
        })
      )
      : 0;
    allData.length > 0 ?
    Math.min.apply(
      Math,
      allData.map(function(o) {
        return o.price;
      })
    ) :
    0;

  //所有房源最低价格的数据
  sortArr.sort(util.compareSort("price", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";
  let y = data.type == 1 ? app.globalData.searchLongData : app.globalData.monitorSearchLongData;
  if (y.advSort == 1) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "asc"));
    allData = allArr
  }
  if (y.advSort == 11) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "desc"));
    allData = allArr
  }
  if (y.advSort == 2) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("area", "desc"));
    allData = allArr
  }
  if (y.advSort == 21) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("area", "asc"));
    allData = allArr
  }
  //所有房源面积最大
  areasortArr.sort(util.compareSort("area", "desc"));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : "";
  //房天下最低价格数据
  fangtianxiaSortArr.sort(util.compareSort("price", "asc"));
  let fangtianxiaLowPriceData =
    fangtianxiaSortArr.length > 0 ? fangtianxiaSortArr[0] : "";
  //58同城最低价格数据
  wbtcSortArr.sort(util.compareSort("price", "asc"));
  let wbtcLowPriceData = wbtcSortArr.length > 0 ? wbtcSortArr[0] : "";

  return {
    allData,
    allCount,
    averagePrice: parseInt(average),
    lowPrice,
    lowPriceData,
    highAreaData,
    fangtianxiaLowPriceData,
    wbtcLowPriceData,
    fangtianxiaFilterData,
    wbtcFilterData,
    rowData
  };
};

const houseLongFilter = (allData, xType) => {
  let wiwjFilterData = [],
    ljFilterData = [],
    ftxFilterData = [],
    tcFilterData = [];
  //平均价
  let average = allData.length > 0 ? allData.reduce((sum, {
    price
  }) => sum + price, 0) / allData.length : 0;
  //所有最低价
  let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function(o) {
    return o.price;
  })) : 0;
  //所有房源最低价格的数据
  let sortArr = [...allData];
  let areasortArr = [...allData];
  sortArr.sort(util.compareSort("price", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";
  //所有房源面积最大
  areasortArr.sort(util.compareSort("area", "desc"));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : "";
  if (xType == 1) {
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].platformId == 'wiwj') {
        wiwjFilterData.push(allData[i])
      }
      if (allData[i].platformId == 'lj') {
        ljFilterData.push(allData[i])
      }
    }
    //我爱我家最低价格数据
    wiwjFilterData.sort(util.compareSort("price", "asc"));
    let wiwjLowPriceData = wiwjFilterData.length > 0 ? wiwjFilterData[0] : "";
    //链家最低价格数据
    ljFilterData.sort(util.compareSort("price", "asc"));
    let ljLowPriceData = ljFilterData.length > 0 ? ljFilterData[0] : "";
    return ({
      averagePrice: parseInt(average),
      lowPrice,
      lowPriceData,
      highAreaData,
      wiwjLowPriceData,
      ljLowPriceData,
      wiwjFilterData,
      ljFilterData
    })
  }

  if (xType == 2) {
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].platformId == 'ftx') {
        ftxFilterData.push(allData[i])
      }
      if (allData[i].platformId == 'tc') {
        tcFilterData.push(allData[i])
      }
    }
    //房天下最低价格数据
    ftxFilterData.sort(util.compareSort("price", "asc"));
    let ftxLowPriceData = ftxFilterData.length > 0 ? ftxFilterData[0] : "";
    //同城最低价格数据
    tcFilterData.sort(util.compareSort("price", "asc"));
    let tcLowPriceData = tcFilterData.length > 0 ? tcFilterData[0] : "";

    return ({
      averagePrice: parseInt(average),
      lowPrice,
      lowPriceData,
      highAreaData,
      ftxLowPriceData,
      tcLowPriceData,
      ftxFilterData,
      tcFilterData
    })
  }
}
const houseSecondFilter = allData => {
  let wiwjFilterData = [],
    ljFilterData = [];
  //平均价
  let average = allData.length > 0 ? allData.reduce((sum, {
    price
  }) => sum + price, 0) / allData.length : 0;
  let averageunitPrice =
    allData.length > 0 ?
      allData.reduce((sum, {
        unit_price
      }) => sum + unit_price, 0) / allData.length :
      0;
  //所有最低价
  let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) { return o.price; })) : 0;
  //所有最低单价
  let lowUnitPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) {
    return o.unit_price;
  })) : 0;
  //所有房源最低价格的数据
  let sortArr = [...allData];
  let areasortArr = [...allData];
  sortArr.sort(util.compareSort("price", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";
  //所有房源面积最大
  areasortArr.sort(util.compareSort("area", "desc"));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : "";
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].platformId == 'wiwj') {
      wiwjFilterData.push(allData[i])
    }
    if (allData[i].platformId == 'lj') {
      ljFilterData.push(allData[i])
    }
  }
  //我爱我家最低价格数据
  wiwjFilterData.sort(util.compareSort("price", "asc"));
  let wiwjLowPriceData = wiwjFilterData.length > 0 ? wiwjFilterData[0] : "";
  //链家最低价格数据
  ljFilterData.sort(util.compareSort("price", "asc"));
  let ljLowPriceData = ljFilterData.length > 0 ? ljFilterData[0] : "";

  return {
    allData,
    averagePrice: parseInt(average),
    averageunitPrice: parseInt(averageunitPrice),
    lowPrice,
    lowUnitPrice,
    highAreaData,
    lowPriceData,
    wiwjLowPriceData,
    ljLowPriceData,
    wiwjFilterData,
    ljFilterData,
  };
}
const getMonitorLongHouseData = (list, mSelect) => {
  let app = getApp();
  let allData = []; //监控房源列表
  let wiwjFilterData = []; //监控我爱我家房源
  let ljFilterData = []; //监控链家房源
  let ftxFilterData = []; //监控房天下房源
  let wbtcFilterData = []; //监控58同城房源

  let houseList = monitorFilter(list, mSelect)
  for (let i = 0; i < houseList.length; i++) {
    if (houseList[i].platform == "wiwj") {
      let wiwjObjs = {
        platformId: "wiwj",
        collection: false,
        housesid: houseList[i].data.housesid,
        imgurl: houseList[i].data.imgurl,
        price: Number(houseList[i].data.price),
        housetitle: houseList[i].data.housetitle,
        introduce: houseList[i].data.BaseDetail.area +
          "㎡/" +
          houseList[i].data.BaseDetail.floorStr +
          "/" +
          houseList[i].data.BaseDetail.heading,
        address: houseList[i].data.qyname ? (houseList[i].data.qyname + "·" + houseList[i].data.sqname) : houseList[i].data.communityname,
        tagwall: houseList[i].data.tagwall,
        area: Number(houseList[i].data.BaseDetail.area),
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
      };
      wiwjFilterData.push(wiwjObjs);
      allData.push(wiwjObjs);
    }
    if (houseList[i].platform == "lj") {
      let lianjiaObjs = {
        platformId: "lj",
        collection: false,
        housesid: houseList[i].data.house_code,
        imgurl: houseList[i].data.list_picture,
        price: Number(houseList[i].data.rent_price_listing),
        housetitle: houseList[i].data.house_title,
        introduce: houseList[i].data.rent_area +
          "㎡/" +
          houseList[i].data.layout +
          "/" +
          houseList[i].data.frame_orientation,
        address: houseList[i].data.district_name +
          "." +
          houseList[i].data.bizcircle_name,
        tagwall: lianjiaTagwall(houseList[i].data.house_tags),
        area: Number(houseList[i].data.rent_area),
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
      };
      ljFilterData.push(lianjiaObjs);
      allData.push(lianjiaObjs);
    }
    if (houseList[i].platform == "ftx") {
      let fangtianxiaObjs = {
        platformId: "ftx",
        housesid: houseList[i].data.houseid,
        imgurl: houseList[i].data.titleimage,
        price: Number(houseList[i].data.price),
        housetitle: houseList[i].data.title,
        introduce: houseList[i].data.buildarea +
          "㎡/" +
          houseList[i].data.rentway +
          " " +
          houseList[i].data.room +
          "室",
        address: houseList[i].data.district + "." + houseList[i].data.comarea,
        tagwall: houseList[i].data.tags ?
          houseList[i].data.tags.split(" ") :
          [],
        area: Number(houseList[i].data.buildarea),
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
      };
      ftxFilterData.push(fangtianxiaObjs);
      allData.push(fangtianxiaObjs);
    }
    if (houseList[i].platform == "tc") {
      let wbtcObjs = {
        platformId: "tc",
        collection: false,
        housesid: houseList[i].data.infoID,
        imgurl: houseList[i].data.picUrl,
        price: Number(houseList[i].data.priceDict.p),
        housetitle: houseList[i].data.title,
        introduce: houseList[i].data.area.split("㎡")[0] +
          "㎡/" +
          houseList[i].data.huxing,
        address: houseList[i].data.lastLocal || houseList[i].rightLabel,
        tagwall: houseList[i].data.usedTages ?
          houseList[i].data.usedTages.split(",") :
          [],
        area: Number(houseList[i].data.area.split("㎡")[0]),
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
      };
      wbtcFilterData.push(wbtcObjs);
      allData.push(wbtcObjs);
    }
  }

  //平均价
  let average =
    allData.length > 0 ?
    allData.reduce((sum, {
      price
    }) => sum + price, 0) / allData.length :
    0;
  let sortArr = [...allData];
  let areasortArr = [...allData];
  let wiwjSortArr = [...wiwjFilterData];
  let ljSortArr = [...ljFilterData];
  let ftxSortArr = [...ftxFilterData];
  let wbtcSortArr = [...wbtcFilterData];

  //所有最低价
  let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) { return o.price; })) : 0;
  //所有房源最低价格的数据
  sortArr.sort(util.compareSort("price", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";

  let y = app.globalData.monitorSearchLongData;
  if (y.advSort == 1) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "asc"));
    allData = allArr
  }
  if (y.advSort == 11) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "desc"));
    allData = allArr
  }
  if (y.advSort == 2) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("area", "desc"));
    allData = allArr
  }
  if (y.advSort == 21) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("area", "asc"));
    allData = allArr
  }

  //所有房源面积最大
  areasortArr.sort(util.compareSort("area", "desc"));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : "";
  //allData = sortArr;
  //我爱我家最低价格数据
  wiwjSortArr.sort(util.compareSort("price", "asc"));
  let wiwjLowPriceData = wiwjSortArr.length > 0 ? wiwjSortArr[0] : "";
  //链家最低价格数据
  ljSortArr.sort(util.compareSort("price", "asc"));
  let ljLowPriceData = ljSortArr.length > 0 ? ljSortArr[0] : "";
  //房天下最低价格数据
  ftxSortArr.sort(util.compareSort("price", "asc"));
  let ftxLowPriceData = ftxSortArr.length > 0 ? ftxSortArr[0] : "";
  //58同城最低价格数据
  wbtcSortArr.sort(util.compareSort("price", "asc"));
  let wbtcLowPriceData = wbtcSortArr.length > 0 ? wbtcSortArr[0] : "";
  return {
    allData,
    averagePrice: parseInt(average),
    lowPrice,
    highAreaData,
    lowPriceData,
    wiwjLowPriceData,
    ljLowPriceData,
    ftxLowPriceData,
    wbtcLowPriceData,
    wiwjFilterData,
    ljFilterData,
    ftxFilterData,
    wbtcFilterData
  };
};

const getMonitorSecondHouseData = (list, mSelect) => {
  let app = getApp();
  let allData = []; //监控房源列表
  let wiwjFilterData = []; //监控我爱我家房源
  let ljFilterData = []; //监控链家房源

  let houseList = monitorFilter(list, mSelect);
  console.log(houseList);
  for (let i = 0; i < houseList.length; i++) {
    if (houseList[i].platform == "wiwj") {
      let wiwjObjs = {
        platformId: "wiwj",
        collection: false,
        housesid: houseList[i].data.housesid,
        imgurl: houseList[i].data.imgurl,
        price: Number(houseList[i].data.price),
        housetitle: houseList[i].data.housetitle,
        introduce: houseList[i].data.bedroom + '室' +
          houseList[i].data.livingroom +'厅'+
          "/" +
          houseList[i].data.buildarea +
          "㎡/" +
          houseList[i].data.heading,
        address: houseList[i].data.qyname ? (houseList[i].data.qyname + "·" + houseList[i].data.sqname) : houseList[i].data.communityname,
        tagwall: houseList[i].data.tagwall,
        area: Number(houseList[i].data.buildarea),
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
        unit_price: Number(houseList[i].data.unitprice),
      };
      wiwjFilterData.push(wiwjObjs);
      allData.push(wiwjObjs);
    }
    if (houseList[i].platform == "lj") {
      let lianjiaObjs = {
        platformId: "lj",
        collection: false,
        housesid: houseList[i].data.house_code,
        imgurl: houseList[i].data.cover_pic,
        price: Number(houseList[i].data.price_str),
        housetitle: houseList[i].data.title,
        introduce: houseList[i].data.desc_abtest,
        address: houseList[i].data.community_name ? houseList[i].data.community_name : houseList[i].data.third_desc,
        tagwall: lianjiaTagwall1(houseList[i].data.color_tags),
        area: Number(houseList[i].data.area),
        newLevel: houseList[i].newLevel,
        priceDownLevel: houseList[i].priceDownLevel,
        priceMargin: houseList[i].priceMargin || "",
        unit_price: Number(houseList[i].data.unit_price),
      };
      ljFilterData.push(lianjiaObjs);
      allData.push(lianjiaObjs);
    }
  }

  //平均价
  let average =
    allData.length > 0 ?
    allData.reduce((sum, {
      price
    }) => sum + price, 0) / allData.length :
    0;
  let averageunitPrice =
    allData.length > 0 ?
      allData.reduce((sum, {
        unit_price
      }) => sum + unit_price, 0) / allData.length :
      0;
  let sortArr = [...allData];
  let areasortArr = [...allData];
  let wiwjSortArr = [...wiwjFilterData];
  let ljSortArr = [...ljFilterData];

  //所有最低价
  let lowPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) { return o.price; })) : 0;
  //所有最低单价
  let lowUnitPrice = allData.length > 0 ? Math.min.apply(Math, allData.map(function (o) {
     return o.unit_price; })) : 0;
  //所有房源最低价格的数据
  sortArr.sort(util.compareSort("price", "asc"));
  let lowPriceData = sortArr.length > 0 ? sortArr[0] : "";

  let y = app.globalData.monitorSecondSearchData;
  if (y.advSort == 1) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "asc"));
    allData = allArr
  }
  if (y.advSort == 11) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("price", "desc"));
    allData = allArr
  }
  if (y.advSort == 2) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("unit_price", "asc"));
    allData = allArr
  }
  if (y.advSort == 21) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("unit_price", "desc"));
    allData = allArr
  }
  if (y.advSort == 31) {
    let allArr = [...allData];
    allArr.sort(util.compareSort("area", "desc"));
    allData = allArr
  }

  //所有房源面积最大
  areasortArr.sort(util.compareSort("area", "desc"));
  let highAreaData = areasortArr.length > 0 ? areasortArr[0] : "";
  //allData = sortArr;
  //我爱我家最低价格数据
  wiwjSortArr.sort(util.compareSort("price", "asc"));
  let wiwjLowPriceData = wiwjSortArr.length > 0 ? wiwjSortArr[0] : "";
  //链家最低价格数据
  ljSortArr.sort(util.compareSort("price", "asc"));
  let ljLowPriceData = ljSortArr.length > 0 ? ljSortArr[0] : "";

  return {
    allData,
    averagePrice: parseInt(average),
    averageunitPrice: parseInt(averageunitPrice),
    lowPrice,
    lowUnitPrice,
    highAreaData,
    lowPriceData,
    wiwjLowPriceData,
    ljLowPriceData,
    wiwjFilterData,
    ljFilterData,
  };
};
const wiwjScreenParam = type => {
  const app = getApp();
  let searchData =
    type == 1 ?
    app.globalData.searchLongData :
    app.globalData.monitorSearchLongData;
  let obj = {};

  //筛选
  let areaType = searchData.areaType;
  //判断是否为关键字搜索
  let keysword = false;
  //区域
  if (areaType == 10) {
    if (searchData.areaId.wiwj) {
      obj.districtids = searchData.areaId.wiwj;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 20) {
    if (searchData.areaId.wiwj) {
      obj.sqids = searchData.areaId.wiwj;
    } else {
      keysword = true;
    }
  }
  if (areaType == 30) {
    if (searchData.areaId.wiwj) {
      obj.communityid = searchData.areaId.wiwj.id;
      obj.zn = searchData.areaId.wiwj.name;
    } else {
      keysword = true;
    }
  }
  if (areaType == 40) {
    if (searchData.areaId.wiwj) {
      obj.lineid = searchData.areaId.wiwj;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 50) {
    if (searchData.areaId.wiwj && searchData.areaId.wiwj.id) {
      obj.lineid = searchData.areaId.wiwj.lineid;
      obj.stationid = searchData.areaId.wiwj.id;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 60) {
    if (searchData.areaId.nearby) {
      obj.lng = searchData.areaId.longitude;
      obj.lat = searchData.areaId.latitude;
      obj.nearby = searchData.areaId.nearby;
    }
  }

  // 价钱
  let minPrice = searchData.minPrice;
  let maxPrice = searchData.maxPrice == 10000 ? 99999 : searchData.maxPrice;
  obj.price = minPrice + "," + maxPrice;

  // 房源偏好 低价/空间/最新
  let longSortTypes = searchData.longSortTypes;
  if (longSortTypes == 1) {
    obj.psort = 1;
  }
  if (longSortTypes == 2) {
    obj.psort = 4;
  }
  if (longSortTypes == 3) {
    obj.psort = 5;
  }

  // 房源类型 整租/合租
  let longRentTypes = searchData.longRentTypes;
  if (longRentTypes == 1) {
    obj.renttype = 1;
  }
  if (longRentTypes == 2) {
    obj.renttype = 2;
  }

  // 户型 一室、两室、三室及以上
  let longLayouts = searchData.longLayouts.concat();
  if (longLayouts.length) {
    let length = longLayouts.length;
    if (longLayouts.indexOf(11) > -1) {
      longLayouts[longLayouts.indexOf(11)] = "3,4,5,9";
    }
    let broom = "";
    for (let temp = 0; temp < length; temp++) {
      if (temp) {
        broom += ",";
      }
      broom += longLayouts[temp];
    }
    obj.broom = broom;
  }

  //朝向
  let longHeadings = searchData.longHeadings.concat();
  if (longHeadings.length) {
    let heading = "";
    if (longHeadings.indexOf(1) > -1) {
      heading = "1";
    }
    if (longHeadings.indexOf(2) > -1) {
      if (heading) {
        heading += ",";
      }
      heading += "2";
    }
    if (longHeadings.indexOf(3) > -1) {
      if (heading) {
        heading += ",";
      }
      heading += "3";
    }
    if (longHeadings.indexOf(4) > -1) {
      if (heading) {
        heading += ",";
      }
      heading += "4";
    }
    if (longHeadings.indexOf(10) > -1) {
      if (heading) {
        heading += ",";
      }
      heading += "10";
    }
    obj.heading = heading;
  }

  //房源亮点
  let longHouseTags = searchData.longHouseTags.concat();
  if (longHouseTags.length) {
    // obj.decoratetype = ''
    if (longHouseTags.indexOf(1) > -1) {
      obj.decoratetype = "3";
    }
    obj.tags = "";
    if (longHouseTags.indexOf(2) > -1) {
      obj.tags = "1";
    }
    if (longHouseTags.indexOf(3) > -1) {
      if (obj.tags) {
        obj.tags += ",";
      }
      obj.tags += "32";
    }
    if (longHouseTags.indexOf(4) > -1) {
      if (obj.tags) {
        obj.tags += ",";
      }
      obj.tags += "4";
    }
    if (longHouseTags.indexOf(5) > -1) {
      if (obj.tags) {
        obj.tags += ",";
      }
      obj.tags += "64";
    }
    if (longHouseTags.indexOf(6) > -1) {
      if (obj.tags) {
        obj.tags += ",";
      }
      obj.tags += "4103";
    }
  }

  //面积
  let longBuildAreas = searchData.longBuildAreas;
  if (longBuildAreas == 0) {
    obj.buildarea = "0,40";
  }
  if (longBuildAreas == 1) {
    obj.buildarea = "40,60";
  }
  if (longBuildAreas == 2) {
    obj.buildarea = "60,80";
  }
  if (longBuildAreas == 3) {
    obj.buildarea = "80,100";
  }
  if (longBuildAreas == 4) {
    obj.buildarea = "100,120";
  }
  if (longBuildAreas == 5) {
    obj.buildarea = "120,1000";
  }

  //楼层
  let longFloorTypes = searchData.longFloorTypes.concat();
  if (longFloorTypes.length) {
    let floortype = "";
    if (longFloorTypes.indexOf(1) > -1) {
      floortype = "-1,1";
    }
    if (longFloorTypes.indexOf(2) > -1) {
      if (floortype) {
        floortype += ",";
      }
      floortype += "2";
    }
    if (longFloorTypes.indexOf(3) > -1) {
      if (floortype) {
        floortype += ",";
      }
      floortype += "3";
    }
    obj.floortype = floortype;
  }

  if (keysword) {
    obj.keywords = searchData.area;
  }

  return obj;
};
const ljScreenParam = type => {
  const app = getApp();
  let searchData =
    type == 1 ?
    app.globalData.searchLongData :
    app.globalData.monitorSearchLongData;

  let obj = [];

  let condition = "";

  //筛选
  let areaType = searchData.areaType;
  //判断是否为关键字搜索
  let keysword = false;
  //区域
  if (areaType == 10) {
    if (searchData.areaId.lj) {
      condition = searchData.areaId.lj + "/";
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 20 || areaType == 30) {
    if (searchData.areaId.lj) {
      condition = searchData.areaId.lj;
    } else {
      keysword = true;
    }
  }
  if (areaType == 40) {
    //keysword = true;
    obj.keyswordFlag = true
  }
  if (areaType == 50) {
    if (searchData.areaId.lj && searchData.areaId.lj.id) {
      condition +=
        "li" +
        searchData.areaId.lj.lineid +
        "s" +
        searchData.areaId.lj.id +
        "/";
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 60) {
    if (searchData.areaId.nearby) {
      condition += "lon" + searchData.areaId.longitude;
      condition += "lat" + searchData.areaId.latitude;
      condition += "poi" + parseInt(searchData.areaId.nearby) * 1000;
    }
  }

  // 价钱
  let minPrice = searchData.minPrice;
  let maxPrice = searchData.maxPrice == 10000 ? 99999 : searchData.maxPrice;
  condition += "brp" + minPrice + "erp" + maxPrice;

  // 房源偏好
  let longSortTypes = searchData.longSortTypes;
  if (longSortTypes == 1) {
    condition += "rco21";
  }
  if (longSortTypes == 2) {
    condition += "rco32";
  }
  if (longSortTypes == 3) {
    condition += "rco11";
  }

  // 房源类型 整租/合租
  // 户型 一室、两室、三室及以上
  let longLayouts = searchData.longLayouts.concat();
  let longRentTypes = searchData.longRentTypes;
  if (longLayouts.length) {
    if (longRentTypes == 1) {
      if (longLayouts.indexOf(1) > -1) {
        condition += "zrn1";
      }
      if (longLayouts.indexOf(2) > -1) {
        condition += "zrn2";
      }
      if (longLayouts.indexOf(3) > -1 || longLayouts.indexOf(11) > -1) {
        condition += "zrn3";
      }
    } else if (longRentTypes == 2) {
      if (longLayouts.indexOf(2) > -1) {
        condition += "hrn2";
      }
      if (longLayouts.indexOf(3) > -1) {
        condition += "hrn3";
      }
      if (longLayouts.indexOf(12) > -1) {
        condition += "hrn4";
      }
    } else {
      if (longLayouts.indexOf(1) > -1) {
        condition += "zrn1";
      }
      if (longLayouts.indexOf(2) > -1) {
        condition += "zrn2";
        condition += "hrn2";
      }
      if (longLayouts.indexOf(3) > -1) {
        condition += "hrn3";
      }
      if (longLayouts.indexOf(11) > -1) {
        condition += "zrn3";
        condition += "hrn3";
        condition += "hrn4";
      }
      if (longLayouts.indexOf(12) > -1) {
        condition += "hrn4";
      }
    }
  } else {
    if (longRentTypes == 1) {
      condition += "zrn0";
    } else if (longRentTypes == 2) {
      condition += "hrn0";
    }
  }

  //朝向
  let longHeadings = searchData.longHeadings.concat();
  if (longHeadings.length) {
    if (longHeadings.indexOf(1) > -1) {
      condition += "f100500000001";
    }
    if (longHeadings.indexOf(2) > -1) {
      condition += "f100500000005";
    }
    if (longHeadings.indexOf(3) > -1) {
      condition += "f100500000003";
    }
    if (longHeadings.indexOf(4) > -1) {
      condition += "f100500000007";
    }
    if (longHeadings.indexOf(10) > -1) {
      condition += "f100500000009";
    }
  }

  //房源亮点
  let longHouseTags = searchData.longHouseTags.concat();
  if (longHouseTags.length) {
    if (longHouseTags.indexOf(1) > -1) {
      condition += "de1";
    }
    if (longHouseTags.indexOf(2) > -1) {
      condition += "su1";
    }
    if (longHouseTags.indexOf(3) > -1) {
      condition += "bc1";
    }
    if (longHouseTags.indexOf(4) > -1) {
      condition += "hk1";
    }
    if (longHouseTags.indexOf(5) > -1) {
      condition += "ct1";
    }
    if (longHouseTags.indexOf(6) > -1) {
      condition += "in1";
    }
  }

  //面积
  let longBuildAreas = searchData.longBuildAreas;
  if (longBuildAreas == 0) {
    condition += "ra0";
  }
  if (longBuildAreas == 1) {
    condition += "ra1";
  }
  if (longBuildAreas == 2) {
    condition += "ra2";
  }
  if (longBuildAreas == 3) {
    condition += "ra3";
  }
  if (longBuildAreas == 4) {
    condition += "ra4";
  }
  if (longBuildAreas == 5) {
    condition += "ra5";
  }

  //楼层
  let longFloorTypes = searchData.longFloorTypes.concat();
  if (longFloorTypes.length) {
    if (longFloorTypes.indexOf(1) > -1) {
      condition += "lc200500000003";
    }
    if (longFloorTypes.indexOf(2) > -1) {
      condition += "lc200500000002";
    }
    if (longFloorTypes.indexOf(3) > -1) {
      condition += "lc200500000001";
    }
  }

  if (keysword) {
    let area = searchData.area;
    area = area.replace("（", "(", "ig").replace("）", ")", "ig");
    if (area.includes("(")) {
      const formatArea = area.replace(")", "", "ig");
      const areaArr = formatArea.split("(");
      for (const a of areaArr) {
        obj.push(condition + "rs" + a);
      }
    } else {
      obj.push(condition + "rs" + area);
    }
  } else {
    obj.push(condition);
  }

  return obj;
};
const ftxScreenParam = type => {
  const app = getApp();
  let searchData =
    type == 1 ?
    app.globalData.searchLongData :
    app.globalData.monitorSearchLongData;
  let obj = {};

  //筛选
  let areaType = searchData.areaType;
  //判断是否为关键字搜索
  let keysword = false;
  //区域
  if (areaType == 10) {
    if (searchData.areaId.ftx) {
      obj.district = searchData.areaId.ftx;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 20) {
    if (searchData.areaId.ftx) {
      obj.district = searchData.areaId.ftx.district;
      obj.comarea = searchData.areaId.ftx.comarea;
    } else {
      keysword = true;
    }
  }
  if (areaType == 30) {
    keysword = true;
  }
  if (areaType == 40){
    //keysword = true;
    obj.keyswordFlag = true
  }
  if (areaType == 50) {
    if (searchData.areaId.ftx && searchData.areaId.ftx.id) {
      obj.search_text = searchData.areaId.ftx.id;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 60) {
    if (searchData.areaId.nearby) {
      obj.X1 = searchData.areaId.longitude;
      obj.Y1 = searchData.areaId.latitude;
      obj.distance = searchData.areaId.nearby;
    }
  }

  // 价钱
  let minPrice = searchData.minPrice;
  let maxPrice = searchData.maxPrice == 10000 ? 99999 : searchData.maxPrice;
  obj.pricerange = "[" + minPrice + "," + maxPrice + "]";

  // 房源偏好
  let longSortTypes = searchData.longSortTypes;
  if (longSortTypes == 1) {
    obj.orderby = 4;
  }
  if (longSortTypes == 2) {
    obj.orderby = 7;
  }
  if (longSortTypes == 3) {
    obj.orderby = 16;
  }

  // 房源类型 整租/合租
  let longRentTypes = searchData.longRentTypes;
  if (longRentTypes == 1) {
    obj.rtype = "zz";
  }
  if (longRentTypes == 2) {
    obj.rtype = "hz";
  }
  if (longRentTypes == 3) {
    obj.rtype = "hzzw";
  }
  if (longRentTypes == 4) {
    obj.rtype = "hzciwo";
  }

  // 户型 一室、两室、三室及以上
  let longLayouts = searchData.longLayouts.concat();
  if (longLayouts.length) {
    let length = longLayouts.length;
    if (longLayouts.indexOf(12) > -1) {
      longLayouts[longLayouts.indexOf(12)] = "4,5,99";
    }
    let room = "";
    for (let temp = 0; temp < length; temp++) {
      if (temp) {
        room += ",";
      }
      room += longLayouts[temp];
    }
    obj.room = room;
  }

  //朝向
  let longHeadings = searchData.longHeadings.concat();
  if (longHeadings.length) {
    let towards = "";
    if (longHeadings.indexOf(1) > -1) {
      towards = "东,东北,东南";
    }
    if (longHeadings.indexOf(2) > -1) {
      if (towards) {
        towards += ",";
      }
      towards += "西,西北,西南";
    }
    if (longHeadings.indexOf(3) > -1) {
      if (towards) {
        towards += ",";
      }
      towards += "南,东南,西南";
    }
    if (longHeadings.indexOf(4) > -1) {
      if (towards) {
        towards += ",";
      }
      towards += "北,东北,西北";
    }
    if (longHeadings.indexOf(10) > -1) {
      if (towards) {
        towards += ",";
      }
      towards += "南北";
    }
    obj.towards = towards;
  }

  // 房源亮点
  let longHouseTags = searchData.longHouseTags.concat();
  if (longHouseTags.length) {
    let tags = "";
    if (longHouseTags.indexOf(1) > -1) {
      tags += "精装修";
    }
    if (longHouseTags.indexOf(2) > -1) {
      if (tags) {
        tags += ",";
      }
      tags += "近地铁";
    }
    if (longHouseTags.indexOf(7) > -1) {
      if (tags) {
        tags += ",";
      }
      tags += "家电齐全";
    }
    if (longHouseTags.indexOf(8) > -1) {
      if (tags) {
        tags += ",";
      }
      tags += "视频看房";
    }
    obj.tags = tags;
  }

  if (keysword) {
    obj.key = searchData.area;
  }

  return obj;
};
const tcScreenParam = type => {
  const app = getApp();
  let searchData =
    type == 1 ?
    app.globalData.searchLongData :
    app.globalData.monitorSearchLongData;
  let obj = {};
  obj.filterParams = {};

  //筛选
  let areaType = searchData.areaType;
  //判断是否为关键字搜索
  let keysword = false;
  //区域
  if (areaType == 10) {
    if (searchData.areaId.tc) {
      obj.filterParams.filterArea = searchData.areaId.tc;
      obj.filterParams.filterLocal = searchData.areaId.tc;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 20 || areaType == 30 ) {
    keysword = true;
  }
  if (areaType == 40){
    //keysword = true;
    obj.keyswordFlag = true
  }
  if (areaType == 50) {
    if (searchData.areaId.tc && searchData.areaId.tc.id) {
      obj.filterParams.ditieId = searchData.areaId.tc.lineid;
      obj.filterParams.param12557 = searchData.areaId.tc.id;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 60) {
    if (searchData.areaId.nearby) {
      obj.circleLon = searchData.areaId.longitude;
      obj.circleLat = searchData.areaId.latitude;
      obj.filterParams.distance = parseInt(searchData.areaId.nearby) * 1000 + '';
    }
  }

  // 价钱
  let minPrice = searchData.minPrice;
  let maxPrice = searchData.maxPrice == 10000 ? 99999 : searchData.maxPrice;
  obj.filterParams["param1016--param1610"] = minPrice + "_" + maxPrice;

  // 房源偏好
  let longSortTypes = searchData.longSortTypes;
  if (longSortTypes == 1) {
    obj.filterParams.sort = "zufangprice_asc";
  }
  if (longSortTypes == 2) {
    obj.filterParams.sort = "zufangarea_desc";
  }
  if (longSortTypes == 3) {
    obj.filterParams.sort = "postdate_desc";
  }

  // 房源类型 整租/合租
  let longRentTypes = searchData.longRentTypes;
  if (longRentTypes == 1) {
    obj.filterParams.cateid = 8;
  }
  if (longRentTypes == 2) {
    obj.filterParams.cateid = 10;
  }
  if (longRentTypes == 3) {
    obj.filterParams["param1601--param1601"] = "00--1";
  }
  if (longRentTypes == 4) {
    obj.filterParams["param1601--param1601"] = "00--2";
  }

  // 户型 一室、两室、三室及以上
  let longLayouts = searchData.longLayouts.concat();
  if (longLayouts.length) {
    let length = longLayouts.length;
    if (longLayouts.indexOf(12) > -1) {
      longLayouts[longLayouts.indexOf(12)] = "4|5|6|7";
    }
    let broom = "";
    for (let temp = 0; temp < length; temp++) {
      if (temp) {
        broom += "|";
      }
      broom += longLayouts[temp];
    }
    obj.filterParams["param1590--param1612"] = broom;
  }

  //朝向
  let longHeadings = searchData.longHeadings.concat();
  if (longHeadings.length) {
    let heading = "";
    if (longHeadings.indexOf(1) > -1) {
      heading = "1#7#9--1#5#11";
    }
    if (longHeadings.indexOf(2) > -1) {
      if (heading) {
        heading += ",";
      }
      heading += "3#8#10--3#6#12";
    }
    if (longHeadings.indexOf(3) > -1) {
      if (heading) {
        heading += ",";
      }
      heading += "2#7#8--2#5#6";
    }
    if (longHeadings.indexOf(4) > -1) {
      if (heading) {
        heading += ",";
      }
      heading += "4#9#10--4#11#12";
    }
    if (longHeadings.indexOf(10) > -1) {
      if (heading) {
        heading += ",";
      }
      heading += "5--10";
    }
    obj.filterParams["param1021--param1058"] = heading;
  }

  //房源亮点
  let longHouseTags = searchData.longHouseTags.concat();
  if (longHouseTags.length) {
    let tags = "";
    if (longHouseTags.indexOf(1) > -1) {
      tags += "683018--9";
    }
    if (longHouseTags.indexOf(2) > -1) {
      if (tags) {
        tags += ",";
      }
      tags += "683019--5";
    }
    if (longHouseTags.indexOf(7) > -1) {
      if (tags) {
        tags += ",";
      }
      tags += "4--8";
    }
    if (longHouseTags.indexOf(8) > -1) {
      if (tags) {
        tags += ",";
      }
      tags += "param111299~~param111497..5~~1--00";
    }
    obj.filterParams["param12135--param12482"] = tags;
  }

  if (keysword) {
    obj.key = searchData.area;
  }

  return obj;
};
const wiwjSecondScreenParam = type => {
  const app = getApp();
  let searchData =
    type == 1
      ? app.globalData.secondSearchData
      : app.globalData.monitorSecondSearchData;
  let obj = {};
  //筛选
  let areaType = searchData.areaType;
  //判断是否为关键字搜索
  let keysword = false;
  //区域
  if (areaType == 10) {
    if (searchData.areaId.wiwj) {
      obj.districtid = searchData.areaId.wiwj;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 20) {
    if (searchData.areaId.wiwj) {
      obj.sqid = searchData.areaId.wiwj;
    } else {
      keysword = true;
    }
  }
  if (areaType == 30) {
    if (searchData.areaId.wiwj) {
      obj.conmmunityid = searchData.areaId.wiwj.id;
      obj.zn = searchData.areaId.wiwj.name;
    } else {
      keysword = true;
    }
  }
  if (areaType == 40) {
    if (searchData.areaId.wiwj) {
      obj.lineid = searchData.areaId.wiwj;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 50) {
    if (searchData.areaId.wiwj && searchData.areaId.wiwj.id) {
      obj.lineid = searchData.areaId.wiwj.lineid;
      obj.stationid = searchData.areaId.wiwj.id;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 60) {
    if (searchData.areaId.nearby) {
      obj.location = searchData.areaId.longitude + ',' + searchData.areaId.latitude;
      obj.nearby = searchData.areaId.nearby;
    }
  }
  // 价钱
  let minPrice = searchData.minPrice === "" ? 0 : searchData.minPrice; 
  let maxPrice = searchData.maxPrice === "" ? 99999 : searchData.maxPrice;
  obj.price = minPrice + "," + maxPrice
  // 户型 一室、两室、三室，四室，四室及以上
  let longLayouts = searchData.secondLayoutMap.concat();
  if (longLayouts.length) {
    let length = longLayouts.length;
    if (longLayouts.indexOf(5) > -1) {
      longLayouts[longLayouts.indexOf(5)] = "5,9";
    }
    let broom = "";
    for (let temp = 0; temp < length; temp++) {
      if (temp) {
        broom += ",";
      }
      broom += longLayouts[temp];
    }
    obj.broom = broom;
  }
  //建筑面积
  let minArea = searchData.minArea === '' ? 0 : searchData.minArea;
  let maxArea = searchData.maxArea === 151 ? 99999 : searchData.maxArea;
  obj.buildarea = minArea + ',' + maxArea;
  //朝向
  let headingArr = searchData.secondHeadingMap.concat()
  if (headingArr.length) {
    obj.heading = headingArr.join(",");
  }
  //楼龄
  if (searchData.secondBuildingAgeMap) {
    obj.buildage = searchData.secondBuildingAgeMap;
  }
  //楼层
  let floorTypeArr = searchData.secondFloorTypeMap.concat()
  if (floorTypeArr.length) {
    let length = floorTypeArr.length;
    if (floorTypeArr.indexOf(1) > -1) {
      floorTypeArr[floorTypeArr.indexOf(1)] = "-1,1";
    }
    if (floorTypeArr.indexOf(3) > -1) {
      floorTypeArr[floorTypeArr.indexOf(3)] = "3,999";
    }
    let floorType = "";
    for (let temp = 0; temp < length; temp++) {
      if (temp) {
        floorType += ",";
      }
      floorType += floorTypeArr[temp];
    }
    obj.floortype = floorType;
  }
  //装修
  let decoratetypeArr = searchData.secondHouseDecorationMap.concat()
  if (decoratetypeArr.length) {
    obj.decoratetype = decoratetypeArr.join(',')
  }
  //用途
  let housetypeArr = searchData.secondHouseUseMap.concat()
  if (housetypeArr.length) {
    obj.housetype = housetypeArr.join(',')
  }
  //标签
  let secondHouseTagArr = searchData.secondHouseTagMap.concat()
  if (secondHouseTagArr.length) {
    let length = secondHouseTagArr.length;
    if (secondHouseTagArr.indexOf(1) > -1) {
      secondHouseTagArr[secondHouseTagArr.indexOf(1)] = 8;
    }
    if (secondHouseTagArr.indexOf(2) > -1) {
      secondHouseTagArr[secondHouseTagArr.indexOf(2)] = 16;
    }
    if (secondHouseTagArr.indexOf(3) > -1) {
      secondHouseTagArr[secondHouseTagArr.indexOf(3)] = 1;
    }
    if (secondHouseTagArr.indexOf(5) > -1) {
      secondHouseTagArr[secondHouseTagArr.indexOf(5)] = 4097;
    }
    if (secondHouseTagArr.indexOf(6) > -1) {
      secondHouseTagArr[secondHouseTagArr.indexOf(6)] = 2;
    }

    let tags = "";
    for (let temp = 0; temp < length; temp++) {
      if (temp) {
        tags += ",";
      }
      tags += secondHouseTagArr[temp];
    }
    obj.tag = tags;
  }
  //排序
  if (searchData.secondSortTypeMap) {
    if (searchData.secondSortTypeMap === 1) {
      obj.psort = 1
    }
    if (searchData.secondSortTypeMap === 2) {
      obj.psort = 3
    }
  }
  if (keysword) {
    obj.keywords = searchData.area;
  }

  return obj;
}
const ljSecondScreenParam = type => {
  const app = getApp();
  let searchData =
    type == 1
      ? app.globalData.secondSearchData
      : app.globalData.monitorSecondSearchData;
  let arr = [];
  let obj = {}
  let condition = "";
  //筛选
  let areaType = searchData.areaType;
  //判断是否为关键字搜索
  let keysword = false;
  //区域
  if (areaType == 10) {
    if (searchData.areaId.lj) {
      condition += "d"+searchData.areaId.lj;
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 20) {
    if (searchData.areaId.lj) {
      condition += "b"+searchData.areaId.lj;
    } else {
      keysword = true;
    }
  }
  if (areaType == 30){
    if (searchData.areaId.lj) {
      condition += "c"+searchData.areaId.lj;
    } else {
      keysword = true;
    }
  }
  if (areaType == 40) {
    if (searchData.areaId.lj) {
      condition += "li"+searchData.areaId.lj
    }else{
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 50) {
    if (searchData.areaId.lj && searchData.areaId.lj.id) {
      condition +=
        "li" +
        searchData.areaId.lj.lineid +
        "s" +
        searchData.areaId.lj.id +
        "/";
    } else {
      //keysword = true;
      obj.keyswordFlag = true
    }
  }
  if (areaType == 60) {
    let d = getNearbyGCJ({ ...searchData.areaId})
    obj = { ...obj, ...d }
  }
  // 价钱
  let minPrice = searchData.minPrice === "" ? 0 : searchData.minPrice;
  let maxPrice = searchData.maxPrice === "" ? 99999 : searchData.maxPrice;
  condition += "bp" + minPrice + "ep" + maxPrice;
  // 户型 一室、两室、三室，四室，四室及以上
  let longLayouts = searchData.secondLayoutMap.concat();
  if (longLayouts.length) {
    if (longLayouts.indexOf(1) > -1) {
      condition += "l1";
    }
    if (longLayouts.indexOf(2) > -1) {
      condition += "l2";
    }
    if (longLayouts.indexOf(3) > -1) {
      condition += "l3";
    }
    if (longLayouts.indexOf(4) > -1) {
      condition += "l4";
    }
    if (longLayouts.indexOf(5) > -1) {
      condition += "l5";
    }
  }
  //建筑面积
  let minArea = searchData.minArea === '' ? 0 : searchData.minArea;
  let maxArea = searchData.maxArea === 151 ? 99999 : searchData.maxArea;
  condition += "ba" + minArea + "ea" + maxArea;
  //朝向
  let headingArr = searchData.secondHeadingMap.concat()
  if (headingArr.length) {
    if (headingArr.indexOf(1) > -1) {
      condition += "f1";
    }
    if (headingArr.indexOf(2) > -1) {
      condition += "f3";
    }
    if (headingArr.indexOf(3) > -1) {
      condition += "f2";
    }
    if (headingArr.indexOf(4) > -1) {
      condition += "f4";
    }
    if (headingArr.indexOf(10) > -1) {
      condition += "f5";
    }
  }
  //楼龄
  if (searchData.secondBuildingAgeMap) {
    condition += "y" + searchData.secondBuildingAgeMap;
  }
  //楼层
  let floorTypeArr = searchData.secondFloorTypeMap.concat()
  if (floorTypeArr.length) {
    if (floorTypeArr.indexOf(1) > -1) {
      condition += "lc1";
    }
    if (floorTypeArr.indexOf(2) > -1) {
      condition += "lc2";
    }
    if (floorTypeArr.indexOf(3) > -1) {
      condition += "lc3";
    }
  }
  //装修
  let decoratetypeArr = searchData.secondHouseDecorationMap.concat()
  if (decoratetypeArr.length) {
    if (decoratetypeArr.indexOf(1) > -1) {
      condition += "de3";
    }
    if (decoratetypeArr.indexOf(2) > -1) {
      condition += "de2";
    }
    if (decoratetypeArr.indexOf(3) > -1) {
      condition += "de1";
    }
  }
  //用途
  let housetypeArr = searchData.secondHouseUseMap.concat()
  if (housetypeArr.length) {
    if (housetypeArr.indexOf(1) > -1) {
      condition += "sf1";
    }
    if (housetypeArr.indexOf(2) > -1) {
      condition += "sf3";
    }
    if (housetypeArr.indexOf(3) > -1) {
      condition += "sf2sf4sf6sf5";
    }
  }

  //标签
  let secondHouseTagArr = searchData.secondHouseTagMap.concat();
  if (secondHouseTagArr.length) {
    if (secondHouseTagArr.indexOf(1) > -1) {
      condition += "ty1";
    }
    if (secondHouseTagArr.indexOf(2) > -1) {
      condition += "mw1";
    }
    if (secondHouseTagArr.indexOf(3) > -1) {
      condition += "su1";
    }
    if (secondHouseTagArr.indexOf(4) > -1) {
      condition += "tt4";
    }
    if (secondHouseTagArr.indexOf(5) > -1) {
      condition += "tt8";
    }
    if (secondHouseTagArr.indexOf(6) > -1) {
      condition += "tt2";
    }
  }

  if (keysword) {
    let area = searchData.area;
    area = area.replace("（", "(", "ig").replace("）", ")", "ig");
    if (area.includes("(")) {
      const formatArea = area.replace(")", "", "ig");
      const areaArr = formatArea.split("(");
      for (const a of areaArr) {
        arr.push(condition + "rs" + a);
      }
    } else {
      arr.push(condition + "rs" + area);
    }
  } else {
    arr.push(condition);
  }
  //排序
  if (searchData.secondSortTypeMap){
    if (searchData.secondSortTypeMap === 1){
      obj = { ...obj, ...{ order:'co21'} }
    }
    if (searchData.secondSortTypeMap === 2) {
      obj = { ...obj, ...{ order: 'co41' } }
    }
  }
  let test = []
  for (let index = 0; index < arr.length; index ++) {
    test.push({ ...obj, ...{ condition:arr[index] } })
  }
  return test
}
//添加开启短租监控参数
const addMonitorData = addData => {
  const app = getApp()
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
  if (addData.noteSelect) {
    notice.push(2)
  }
  if (addData.publicSelect) {
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
  //黑名单数据
  let tjId = [],
    xzId = [],
    mnId = [],
    zgId = [];
  let short = wx.getStorageSync('fddShortRentBlock') || [];
  if (short.length) {
    for (let i = 0; i < short.length; i++) {
      if (short[i].platformId == 'tj') {
        tjId.push(short[i].productId)
      }
      if (short[i].platformId == 'xz') {
        xzId.push(short[i].productId)
      }
      if (short[i].platformId == 'mn') {
        mnId.push(short[i].productId)
      }
      if (short[i].platformId == 'zg') {
        zgId.push(short[i].productId)
      }
    }
  }
  let c = util.compareArr(addData.rowData, addData.allOriginalData)
  data.fddShortRentBlock = {
    tj: tjId,
    xz: xzId,
    mn: mnId,
    zg: zgId
  };
  data.fddShortRentUsable = c
  data.actualPrice = addData.lowPrice
  data.fddShortRentCount = {
    allTotal: addData.allCount,
    tjTotal: addData.tjCount,
    xzTotal: addData.xzCount,
    mnTotal: addData.mnCount,
    zgTotal: addData.zgCount,
  }
  return data
}
//添加开启长租监控参数
const addLongMonitorData = addData => {
  let app = getApp();
  let y = app.globalData.searchLongData
  let data = {
    houseSource: y.chooseType, //房来源:1品牌中介，2个人房源
    cityName: y.city, //城市名称
    searchJson: y.areaJson, //搜索参数拼接
    buildArea: y.longBuildAreas, //面积
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
  if (y.areaType == 50) { //地铁
    if (y.areaId.subwaysLine) {
      data['parentName '] = y.areaId.subwaysLine
    }
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
  if (y.longHeadings.length) { //朝向
    data['heading'] = y.longHeadings.join(',');
  }
  if (y.longHouseTags.length) { //房源亮点
    data['houseTags'] = y.longHouseTags.join(',');
  }
  if (y.longLayouts.length) { //户型
    data['layoutRoom'] = y.longLayouts.join(',');
  }
  //通知方式
  let notice = [];
  if (addData.noteSelect) {
    notice.push(2)
  }
  if (addData.publicSelect) {
    notice.push(1)
  }
  data['notice'] = notice.join(',');
  //黑名单数据
  let wiwjId = [],
    ljId = [],
    ftxId = [],
    tcId = [];
  let short = wx.getStorageSync('fddShortRentBlock') || [];
  if (short.length) {
    for (let i = 0; i < short.length; i++) {
      if (short[i].platformId == 'wiwj') {
        wiwjId.push(short[i].housesid)
      }
      if (short[i].platformId == 'lj') {
        ljId.push(short[i].housesid)
      }
      if (short[i].platformId == 'ftx') {
        ftxId.push(short[i].housesid)
      }
      if (short[i].platformId == 'tc') {
        tcId.push(short[i].housesid)
      }
    }
  }
  let c = util.compareArr(addData.rowData, addData.allOriginalData, 'platformId', 'housesid')
  data.fddLongRentUsable = c
  data.actualPrice = addData.lowPrice
  if (y.chooseType === 1) {
    data.fddShortRentBlock = {
      wiwj: wiwjId,
      lj: ljId,
    };
    data.fddLongRentCount = {
      allTotal: addData.allCount,
      wiwjTotal: addData.wiwjCount,
      ljTotal: addData.lianjiaCount,
    }
  }
  if (y.chooseType === 2) {
    data.fddShortRentBlock = {
      ftx: ftxId,
      tc: tcId
    };
    data.fddLongRentCount = {
      allTotal: addData.allCount,
      ftxTotal: addData.fangtianxiaCount,
      tcTotal: addData.wbtcCount,
    }
  }
  return data
}

//添加二手房监控参数
const addSecondMonitorData = addData => {
  let app = getApp();
  let y = app.globalData.secondSearchData
  let data = {
    cityName: y.city, //城市名称
    searchJson: y.areaJson, //搜索参数拼接
    minPrice: y.minPrice === "" ? 0:y.minPrice,
    maxPrice: y.maxPrice === "" ? 99999 : y.maxPrice,
    areaJson: JSON.stringify(y.areaId),
    minArea: y.minArea,
    maxArea: y.maxArea === 151 ? 99999 : y.maxArea,
  }
  if (y.secondBuildingAgeMap){
    data['towerAge'] = y.secondBuildingAgeMap
  }
  if (y.secondSortTypeMap) {
    data['sortType'] = y.secondSortTypeMap
  }
  if (y.areaType) { //位置ID
    data['locationType'] = y.areaType
  }
  if (y.areaType == 50) { //地铁
    if (y.areaId.subwaysLine) {
      data['parentName '] = y.areaId.subwaysLine
    }
  }
  if (y.areaType == 60) { //附近
    data['longitude'] = y.areaId.longitude
    data['latitude'] = y.areaId.latitude
    data['nearby'] = y.areaId.nearby
  }
  if (y.area) { //位置名称
    data['locationName'] = y.area
  }
  if (y.secondFloorTypeMap.length) { //楼层
    data['floorType'] = y.secondFloorTypeMap.join(',');
  }

  if (y.secondHeadingMap.length) { //朝向
    data['heading'] = y.secondHeadingMap.join(',');
  }
  if (y.secondHouseUseMap.length) { //用途
    data['purpose'] = y.secondHouseUseMap.join(',');
  }
  if (y.secondHouseDecorationMap.length) { //装修
    data['decorate'] = y.secondHouseDecorationMap.join(',');
  }
  if (y.secondHouseTagMap.length) { //房源亮点
    data['houseTags'] = y.secondHouseTagMap.join(',');
  }
  if (y.secondLayoutMap.length) { //户型
    data['layoutRoom'] = y.secondLayoutMap.join(',');
  }
  //通知方式
  let notice = [];
  if (addData.noteSelect) {
    notice.push(2)
  }
  if (addData.publicSelect) {
    notice.push(1)
  }
  data['notice'] = notice.join(',');
  //黑名单数据
  let wiwjId = [],
    ljId = [];
  let short = wx.getStorageSync('fddShortRentBlock') || [];
  if (short.length) {
    for (let i = 0; i < short.length; i++) {
      if (short[i].platformId == 'wiwj') {
        wiwjId.push(short[i].housesid)
      }
      if (short[i].platformId == 'lj') {
        ljId.push(short[i].housesid)
      }
    }
  }
  let c = util.compareArr(addData.rowData, addData.allOriginalData, 'platformId', 'housesid')
  data.fddUsedUsable  = c
  data.actualPrice = addData.lowPrice
  data.fddUsedBlock  = {
    wiwj: wiwjId,
    lj: ljId
  };
  data.fddUsedCount  = {
    allTotal: addData.allCount,
    wiwjTotal: addData.wiwjCount,
    ljTotal: addData.lianjiaCount,
  }
  return data
}

const updateShortMonitorData = addData => {
  let app = getApp();
  let data = {
    id: addData.monitorId,
    beginDate: app.globalData.monitorSearchData.beginDate, //入住日期
    endDate: app.globalData.monitorSearchData.endDate, //离开日期
    cityType: 0, //城市类型，0-国内城市，1-国际城市
    cityName: app.globalData.monitorSearchData.city, //城市名称
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
  //黑名单数据
  let tjId = [],
    xzId = [],
    mnId = [],
    zgId = [];
  let short = wx.getStorageSync('fddShortRentBlock') || [];
  if (short.length) {
    for (let i = 0; i < short.length; i++) {
      if (short[i].platformId == 'tj') {
        tjId.push(short[i].productId)
      }
      if (short[i].platformId == 'xz') {
        xzId.push(short[i].productId)
      }
      if (short[i].platformId == 'mn') {
        mnId.push(short[i].productId)
      }
      if (short[i].platformId == 'zg') {
        zgId.push(short[i].productId)
      }
    }
  }
  let c = util.compareArr(addData.rowData, addData.allOriginalData)
  data.fddShortRentBlock = {
    tj: tjId,
    xz: xzId,
    mn: mnId,
    zg: zgId
  };
  data.fddShortRentUsable = c
  data.actualPrice = addData.lowPrice
  data.fddShortRentCount = {
    allTotal: addData.allCount,
    tjTotal: addData.tjCount,
    xzTotal: addData.xzCount,
    mnTotal: addData.mnCount,
    zgTotal: addData.zgCount,
  }

  return data
}
const updateLongMonitorData = addData => {
  let app = getApp();
  let y = app.globalData.monitorSearchLongData;
  let data = {
    //houseSource: y.chooseType, //房来源:1品牌中介，2个人房源
    //cityName: y.city, //城市名称
    id: addData.monitorId,
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
  if (y.areaType == 50) { //地铁
    if (y.areaId.subwaysLine) {
      data['parentName '] = y.areaId.subwaysLine
    }
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

  //黑名单数据
  let wiwjId = [],
    ljId = [],
    ftxId = [],
    tcId = [];
  let short = wx.getStorageSync('fddShortRentBlock') || [];
  if (short.length) {
    for (let i = 0; i < short.length; i++) {
      if (short[i].platformId == 'wiwj') {
        wiwjId.push(short[i].housesid)
      }
      if (short[i].platformId == 'lj') {
        ljId.push(short[i].housesid)
      }
      if (short[i].platformId == 'ftx') {
        ftxId.push(short[i].housesid)
      }
      if (short[i].platformId == 'tc') {
        tcId.push(short[i].housesid)
      }
    }
  }
  let c = util.compareArr(addData.rowData, addData.allOriginalData, 'platformId', 'housesid')
  data.fddLongRentUsable = c
  data.actualPrice = addData.lowPrice
  if (y.chooseType === 1) {
    data.fddShortRentBlock = {
      wiwj: wiwjId,
      lj: ljId,
    };
    data.fddLongRentCount = {
      allTotal: addData.allCount,
      wiwjTotal: addData.wiwjCount,
      ljTotal: addData.lianjiaCount,
    }
  }
  if (y.chooseType === 2) {
    data.fddShortRentBlock = {
      ftx: ftxId,
      tc: tcId
    };
    data.fddLongRentCount = {
      allTotal: addData.allCount,
      ftxTotal: addData.fangtianxiaCount,
      tcTotal: addData.wbtcCount,
    }
  }
  return data
}
//二手房
const updateSecondMonitorData = addData => {
  let app = getApp();
  let y = app.globalData.monitorSecondSearchData;
  let data = {
    id: addData.monitorId,
    cityName: y.area, //城市名称
    searchJson: y.areaJson, //搜索参数拼接
    minPrice: (y.minPrice === "") ? 0 : y.minPrice,
    maxPrice: (y.maxPrice === "") ? 99999 : y.maxPrice,
    areaJson: JSON.stringify(y.areaId),
    minArea: y.minArea === '' ? 0 : y.minArea,
    maxArea: y.maxArea === 151 ? 99999 : y.maxArea,

  }
  if (y.secondBuildingAgeMap){
    data['towerAge']=y.secondBuildingAgeMap
  }
  if (y.secondSortTypeMap) {
    data['sortType'] = y.secondSortTypeMap
  }
  if (y.areaType) { //位置ID
    data['locationType'] = y.areaType
  }
  if (y.areaType == 50) { //地铁
    if (y.areaId.subwaysLine) {
      data['parentName '] = y.areaId.subwaysLine
    }
  }
  if (y.areaType == 60) { //附近
    data['longitude'] = y.areaId.longitude
    data['latitude'] = y.areaId.latitude
    data['nearby'] = y.areaId.nearby
  }
  if (y.area) { //位置名称
    data['locationName'] = y.area
  }
  if (y.secondFloorTypeMap.length) { //楼层
    data['floorType'] = y.secondFloorTypeMap.join(',');
  }

  if (y.secondHeadingMap.length) { //朝向
    data['heading'] = y.secondHeadingMap.join(',');
  }
  if (y.secondHouseUseMap.length) { //用途
    data['purpose'] = y.secondHouseUseMap.join(',');
  }
  if (y.secondHouseDecorationMap.length) { //装修
    data['decorate'] = y.secondHouseDecorationMap.join(',');
  }
  if (y.secondHouseTagMap.length) { //房源亮点
    data['houseTags'] = y.secondHouseTagMap.join(',');
  }
  if (y.secondLayoutMap.length) { //户型
    data['layoutRoom'] = y.secondLayoutMap.join(',');
  }

  //黑名单数据
  let wiwjId = [],
    ljId = [],
    ftxId = [],
    tcId = [];
  let short = wx.getStorageSync('fddShortRentBlock') || [];
  if (short.length) {
    for (let i = 0; i < short.length; i++) {
      if (short[i].platformId == 'wiwj') {
        wiwjId.push(short[i].housesid)
      }
      if (short[i].platformId == 'lj') {
        ljId.push(short[i].housesid)
      }
    }
  }
  let c = util.compareArr(addData.rowData, addData.allOriginalData, 'platformId', 'housesid')
  data.fddUsedUsable = c;
  data.actualPrice = addData.lowPrice;
  data.fddUsedBlock = {
    wiwj: wiwjId,
    lj: ljId,
  };
  data.fddUsedCount = {
    allTotal: addData.allCount,
    wiwjTotal: addData.wiwjCount,
    ljTotal: addData.lianjiaCount,
  }
  return data
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

function lianjiaTagwall(tags=[]) {
  let t = [];
  for (let i = 0; i < tags.length; i++) {
    t.push(tags[i].name);
  }
  return t;
}
function lianjiaTagwall1(tags = []) {
  let t = [];
  for (let i = 0; i < tags.length; i++) {
    t.push(tags[i].desc);
  }
  return t;
}

function lianjiaSecondTagwall(tags=[]) {
  let b = [];
  for (let i = 0; i < tags.length; i++) {
    b.push(tags[i].desc);
  }
  return b;
}


function lianjianFilter(arr) {
  let newArr = arr.filter(item => {
    return !/^\d+$/.test(item.house_code);
  });
  return newArr;
}

function wbtcFilter(arr) {
  let newArr = arr.filter(item => {
    return !item.isApartment && item.infoID
  });
  return newArr;
}

function lianjianSecondFilter(arr){
  let newArr = arr.filter(item => {
    return item.house_code;
  });
  return newArr;
}

function monitorFilter(arr, mSelect) {
  let newArr = [];
  if (mSelect == 1) {
    newArr = arr
  }
  if (mSelect == 2) {
    newArr = arr.filter(item => {
      return item.newLevel > 0
    });
  }
  if (mSelect == 3) {
    newArr = arr.filter(item => {
      return item.priceDownLevel > 0
    });
  }
  return newArr
}


module.exports = {
  getTjData,
  getXzData,
  getMnData,
  getZgData,
  tjScreenParam,
  xzScreenParam,
  mnScreenPara,
  zgScreenPara,
  getHouseData,
  getMonitorHouseData,
  getWiwjData,
  getSecondWiwjData,
  getLianjiaData,
  getSecondLianjiaData,
  getFangtianxiaData,
  getWbtcData,
  getBrandHouseData,
  getPersonalHouseData,
  getMonitorLongHouseData,
  wiwjScreenParam,
  ljScreenParam,
  ftxScreenParam,
  tcScreenParam,
  wiwjSecondScreenParam,
  ljSecondScreenParam,
  houseShortFilter,
  houseLongFilter,
  houseSecondFilter,
  addMonitorData,
  addLongMonitorData,
  addSecondMonitorData,
  updateShortMonitorData,
  updateLongMonitorData,
  updateSecondMonitorData,
  getMonitorSecondHouseData,
  getMonitorHouseType,
  getBrandSecondHouseData
};