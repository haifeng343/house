import Http from "./http";
import { getLocationInfo } from "./map";

const getPositionInfoByName = (positionKey, cityName, type=1) => {
  return Http.post("/long/positionDetail.json", {
    positionKey,
    cityName,
    type
  });
};

// 设置搜索历史
// 数据，城市名，房源类型（品牌中介，个人房源）
const longSetSearchData = (data, city, type, isSecond = false) => {
  console.log("设置搜索历史");
  console.log(data, city, type);
  let item = chooseSlectData(data, isSecond);
  console.log(item);
  let history = []
  if (!isSecond) {
    history = [].concat(
      wx.getStorageSync("longSearchHistory_" + city + "_" + type) || []
    );
  } else {
    history = [].concat(
      wx.getStorageSync("searchSecondHistory_" + city) || []
    );
  }
  for (let index = 0; index < history.length; index++) {
    if (
      history[index].area == item.area &&
      history[index].areaType == item.areaType
    ) {
      history.splice(index, 1);
      break;
    }
  }
  history.unshift(item);
  if (history.length > 10) {
    history = history.slice(0, 10);
  }
  if (!isSecond) {
    wx.setStorageSync("longSearchHistory_" + city + "_" + type, history)
  } else {
    wx.setStorageSync("searchSecondHistory_" + city, history)
  }
};

//选择长租地点列表数据处理
const chooseArea = (fullname, city, chooseType, isSecond = false) => {
  return getPositionInfoByName(fullname, city, chooseType).then(resp => {
    let type = fullname.split("_")[1];
    let result = { areaId: {} };
    let data = resp.data;
    let info = JSON.parse(resp.data.json);
    // console.log(data, info)
    result.area = info.name;
    // result.areaJson = resp.data.json
    let areaJson = {};
    if (type == 10) {
      //行政区
      result.areaType = 10;
      if (info.wiwj && info.wiwj[0]) {
        result.areaId.wiwj = info.wiwj[0].id;
        if (!isSecond) {
          areaJson.wiwj = {
            districtids: info.wiwj[0].id
          };
        } else {
          areaJson.wiwj = {
            districtid: info.wiwj[0].id
          };
        }
      }
      if (info.lj && info.lj[0]) {
        result.areaId.lj = info.lj[0].district_quanpin;
        if (!isSecond) {
          areaJson.lj = {
            bizcircle_quanpin: info.lj[0].district_quanpin
          };
        } else {
          areaJson.lj = {
            district_id: info.lj[0].district_quanpin
          };
        }
      }
      if (info.ftx && info.ftx[0]) {
        result.areaId.ftx = info.ftx[0].name;
        areaJson.ftx = {
          district: info.ftx[0].name
        };
      }
      if (info.tc && info.tc[0]) {
        result.areaId.tc = info.tc[0].dirname;
        areaJson.tc = {
          filterArea: info.tc[0].dirname
        };
      }
    } else {
      result.areaType = 50;
      result.areaId.subwaysLine = resp.data.subwaysLine;
      if (info.wiwj) {
        result.areaId.wiwj = {
          id: info.wiwj.id,
          lineid: info.wiwj.lineid
        };
        areaJson.wiwj = {
          lineid: info.wiwj.lineid,
          stationid: info.wiwj.id
        };
      }
      if (info.lj) {
        let pData = JSON.parse(resp.data.pjson);
        result.areaId.lj = {
          id: info.lj.subway_station_id,
          lineid: pData.lj[0].subway_line_id
        };
        areaJson.lj = {
          subway_station_id: info.lj.subway_station_id,
          subway_line_id: pData.lj[0].subway_line_id
        };
      }
      if (info.ftx) {
        result.areaId.ftx = {
          id: info.ftx.name
        };
        areaJson.ftx = {
          search_text: info.ftx.name
        };
      }
      if (info.tc) {
        let pData = JSON.parse(resp.data.pjson);
        result.areaId.tc = {
          id: info.tc.siteid,
          lineid: pData.tc.lineid
        };
        areaJson.tc = {
          param12557: info.tc.siteid,
          ditieId: pData.tc.lineid
        };
      }
    }
    result.areaJson = JSON.stringify(areaJson);
    return Promise.resolve(result);
  });
};

//搜索列表数据处理
const chooseSlectData = (data, isSecond = false) => {
  let type = data.type;
  let result = { areaId: {} };
  result.areaType = type;
  result.area = data.name;
  // result.areaJson = JSON.stringify(data)
  let areaJson = {
    isHistory: true
  };
  if (type == 10) {
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId;
      if (!isSecond) {
        areaJson.wiwj = {
          districtids: data.wiwj.searchId
        }
      } else {
        areaJson.wiwj = {
          districtid: data.wiwj.searchId
        }
      }
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri.replace(/\//gi, "");
      if (!isSecond) {
        areaJson.lj = {
          bizcircle_quanpin: data.lianjia.uri.replace(/\//gi, "")
        }
      } else {
        areaJson.lj = {
          district_id: data.lianjia.uri.replace(/\//gi, "")
        }
      }
    }
  }
  if (type == 20) {
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId;
      if (!isSecond) {
        areaJson.wiwj = {
          sqids: data.wiwj.searchId
        }
      } else {
        areaJson.wiwj = {
          sqid: data.wiwj.searchId
        }
      }
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri;
      if (!isSecond) {
        areaJson.lj = {
          bizcircle_quanpin: data.lianjia.uri
        }
      } else {
        areaJson.lj = {
          bizcircle_id: data.lianjia.uri
        }
      }
    }
    if (data.ftx) {
      result.areaId.ftx = {
        district: data.ftx.district,
        comarea: data.ftx.word
      };
      areaJson.ftx = {
        district: data.ftx.district,
        comarea: data.ftx.word
      };
    }
  }
  if (type == 30) {
    if (data.wiwj) {
      result.areaId.wiwj = {
        id: data.wiwj.searchId,
        name: data.wiwj.searchName
      };
      if(!isSecond) {
        areaJson.wiwj = {
          communityid: data.wiwj.searchId,
          zn: data.wiwj.searchName
        };
      } else {
        areaJson.wiwj = {
          conmmunityid: data.wiwj.searchId,
          zn: data.wiwj.searchName
        };
      }
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri
      if(!isSecond) {
        areaJson.lj = {
          uri: data.lianjia.uri
        }
      } else {
        areaJson.lj = {
          community_id: data.lianjia.uri
        }
      }
    }
  }
  if (type == 40) {
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId;
      areaJson.wiwj = {
        lineid: data.wiwj.searchId
      };
    }
  }
  if (type == 50) {
    if (data.wiwj) {
      result.areaId.wiwj = {
        id: data.wiwj.searchId,
        lineid: data.wiwj.parentId
      };
      if (!isSecond) {
        areaJson.wiwj = {
          id: data.wiwj.searchId,
          lineid: data.wiwj.parentId
        };
      } else {
        areaJson.wiwj = {
          stationid: data.wiwj.searchId,
          lineid: data.wiwj.parentId
        };
      }
    }
    if (data.lianjia) {
      let list = data.lianjia.uri.split("s");
      result.areaId.lj = {
        id: list[1].replace(/[^0-9]/gi, ""),
        lineid: list[0].replace(/[^0-9]/gi, "")
      };
      areaJson.lianjia = {
        subway_station_id: list[1].replace(/[^0-9]/gi, ""),
        subway_line_id: list[0].replace(/[^0-9]/gi, "")
      };
    }
  }
  result.areaJson = JSON.stringify(areaJson);
  return result;
};

//高德坐标转百度（传入经度、纬度）
const bd_encrypt = (gg_lng, gg_lat) => {
  var X_PI = (Math.PI * 3000.0) / 180.0;
  var x = gg_lng,
    y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    latitude: bd_lat,
    longitude: bd_lng
  };
};

//判断是否显示附近
const isShowNearby = city => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        getLocationInfo(res)
          .then(resp => {
            const cityName = resp.result.address_component.city;
            console.log(cityName, res);
            if (cityName && cityName.indexOf(city) > -1) {
              let result = bd_encrypt(res.longitude, res.latitude);
              return resolve(result);
            } else {
              return resolve(false);
            }
          })
          .catch(() => {
            return resolve(false);
          });
      },
      fail: function(res) {
        return resolve(false);
      }
    });
  });
};

// 存附近
const nearByData = (data, index) => {
  let area = "";
  let nearby = 0;
  if (index == 1) {
    area = "附近 1km";
    nearby = 1;
  } else if (index == 2) {
    area = "附近 2km";
    nearby = 2;
  } else {
    area = "附近 3km";
    nearby = 3;
  }
  let result = {
    area: area,
    areaId: {
      nearby: nearby,
      latitude: data.latitude,
      longitude: data.longitude
    },
    areaType: 60,
    areaJson: ""
  };
  return result;
};

const changeHistoryStorage = (data, isSecond = false) => {
  // console.log("changeHistoryStorage");
  let city = data.city;
  let type = 1
  if(!isSecond) {
    type = data.chooseType;
  }
  let item = data;
  if (!item.areaJson.includes('"isHistory":true')) {
    return;
  }
  let temp = "";
  let tempIndex = 0;
  let history = []
  if(!isSecond) {
    history = [].concat(
      wx.getStorageSync("longSearchHistory_" + city + "_" + type) || []
    );
  } else {
    history = [].concat(
      wx.getStorageSync("searchSecondHistory_" + city) || []
    );
  }
  for (let index = 0; index < history.length; index++) {
    if (
      history[index].area == item.area &&
      history[index].areaType == item.areaType
    ) {
      temp = history[index];
      tempIndex = index;
      if (index) {
        history.splice(index, 1);
      }
      break;
    }
  }
  if (!tempIndex) {
    return;
  }
  history.unshift(temp);
  if (history.length > 10) {
    history = history.slice(0, 10);
  }
  if(!isSecond) {
    wx.setStorageSync("longSearchHistory_" + city + "_" + type, history);
  } else {
    wx.setStorageSync("searchSecondHistory_" + city, history);
  }
};

//定点的经纬度和特定距离取范围
//传入{longitude:120.140594,latitude: 30.282918, nearby:2 }
//输出{minLongitude: 120.11978873062212, minlatitude: 30.26495169431761, maxLongitude: 120.16139926937787, maxLatitude: 30.30088430568239}
const getNearbyGCJ = ({ longitude, latitude, nearby})=> {
  let EARTH_RADIUS = 6378.137
  // 求东西两侧的的范围边界。在haversin公式中令φ1 = φ2(维度相同),传入的距离为 米，转换为千米
  let dlng = 2 * Math.asin(Math.sin((nearby) / (2 * EARTH_RADIUS)) / Math.cos(latitude * Math.PI / 180));
  // 弧度转换成角度
  dlng = dlng * 180.0 / Math.PI

  let dlat = nearby / EARTH_RADIUS;
  // 弧度转换成角度
  dlat = dlat * 180.0 / Math.PI

  let min_longitude = +((longitude - dlng).toFixed(14));
  let min_latitude = +((latitude - dlat).toFixed(14));
  let max_longitude = +((longitude + dlng).toFixed(14));
  let max_latitude = +((latitude + dlat).toFixed(14));
  return {
    min_longitude,
    min_latitude,
    max_longitude,
    max_latitude
  };
};

export {
  longSetSearchData,
  chooseArea,
  chooseSlectData,
  isShowNearby,
  nearByData,
  changeHistoryStorage,
  getNearbyGCJ
};
