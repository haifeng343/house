import Http from './http';
import { getLocationInfo } from './map';

const getPositionInfoByName=(positionKey, cityName, type)=> {
  return Http.post('/long/positionDetail.json', { positionKey, cityName, type });
}

// 设置搜索历史
// 数据，城市名，房源类型（品牌中介，个人房源）
const longSetSearchData = (data, city, type) => {
  console.log('设置搜索历史')
  console.log(data,city,type)
  let item = chooseSlectData(data)
  console.log(item)
  let history = [].concat(wx.getStorageSync('longSearchHistory_' + city + '_' + type)||[])
  for(let index = 0; index < history.length; index++) {
    if (history[index].area == item.area && history[index].areaType == item.areaType) {
      history = history.splice(index+1,1)
      break
    }
  }
  history.unshift(item) 
  if (history.length > 10) {
    history = history.slice(0, 10);
  }
  wx.setStorageSync('longSearchHistory_' + city + '_' + type, history);
}

//选择长租地点列表数据处理
const chooseArea = (fullname, city, chooseType)=> {
  return getPositionInfoByName(fullname, city, chooseType).then(resp => {
    let type = fullname.split('_')[1]
    let result = { areaId:{}}
    let data = resp.data;
    let info = JSON.parse(resp.data.json);
    // console.log(data, info)
    result.area = info.name
    // result.areaJson = resp.data.json
    let areaJson = {}
    if (type == 10) {//行政区
      result.areaType = 10
      if (info.wiwj && info.wiwj[0]) {
        result.areaId.wiwj = info.wiwj[0].id
        areaJson.wiwj = {
          districtids: info.wiwj[0].id
        }
      }
      if (info.lj && info.lj[0]) {
        result.areaId.lj = info.lj[0].district_quanpin
        areaJson.lj = {
          bizcircle_quanpin: info.lj[0].district_quanpin
        }
      }
      if (info.ftx && info.ftx[0]) {
        result.areaId.ftx = info.ftx[0].name
        areaJson.ftx = {
          district: info.ftx[0].name
        }
      }
      if (info.tc && info.tc[0]) {
        result.areaId.tc = info.tc[0].dirname
        areaJson.tc = {
          filterArea: info.tc[0].dirname
        }
      }
    } else {
      result.areaType = 50
      result.areaId.subwaysLine = resp.data.subwaysLine
      if (info.wiwj) {
        result.areaId.wiwj = {
          id: info.wiwj.id,
          lineid: info.wiwj.lineid
        }
        areaJson.wiwj = {
          lineid: info.wiwj.lineid,
          stationid: info.wiwj.id
        }
      }
      if (info.lj) {
        let pData = JSON.parse(resp.data.pjson)
        result.areaId.lj = {
          id: info.lj.subway_station_id,
          lineid: pData.lj[0].subway_line_id
        }
        areaJson.lj = {
          subway_station_id: info.lj.subway_station_id,
          subway_line_id: pData.lj[0].subway_line_id
        }
      }
      if (info.ftx) {
        result.areaId.ftx = {
          id: info.ftx.name
        }
        areaJson.ftx = {
          search_text: info.ftx.name
        }
      }
      if (info.tc) {
        let pData = JSON.parse(resp.data.pjson)
        result.areaId.tc = {
          id: info.tc.siteid,
          lineid: pData.tc.lineid
        }
        areaJson.tc = {
          param12557: info.tc.siteid,
          ditieId: pData.tc.lineid
        }
      }
    }
    result.areaJson = JSON.stringify(areaJson)
    return Promise.resolve(result)
  })
}

//搜索列表数据处理
const chooseSlectData = (data)=> {
  let type = data.type
  let result = {areaId: {}}
  result.areaType = type
  result.area = data.name
  // result.areaJson = JSON.stringify(data)
  let areaJson = {}
  if (type == 10) {
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId
      areaJson.wiwj = {
        districtids: data.wiwj.searchId
      }
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri.replace(/\//ig, '')
      areaJson.lj = {
        bizcircle_quanpin: data.lianjia.uri.replace(/\//ig, '')
      }
    }
  }
  if (type == 20) {
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId
      areaJson.wiwj = {
        sqids: data.wiwj.searchId
      }
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri
      areaJson.lj = {
        bizcircle_quanpin: data.lianjia.uri
      }
    }
    if (data.ftx) {
      result.areaId.ftx = {
        district: data.ftx.district.text,
        comarea: data.ftx.word.text
      }
      areaJson.ftx = {
        district: data.ftx.district.text,
        comarea: data.ftx.word.text
      }
    }
  }
  if (type == 30) {
    if (data.wiwj) {
      result.areaId.wiwj = {
        id: data.wiwj.searchId,
        name: data.wiwj.searchName
      }
      areaJson.wiwj = {
        communityid: data.wiwj.searchId,
        zn: data.wiwj.searchName
      }
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri
      areaJson.lj = {
        uri: data.wiwj.searchId
      }
    }
  }
  if (type == 40) {
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId
      areaJson.wiwj = {
        lineid: data.wiwj.searchId
      }
    }
  }
  if (type == 50) {
    if (data.wiwj) {
      result.areaId.wiwj = {
        id: data.wiwj.searchId,
        lineid: data.wiwj.parentId
      }
      areaJson.wiwj = {
        id: data.wiwj.searchId,
        lineid: data.wiwj.parentId
      }
    }
    if (data.lianjia) {
      let list = data.lianjia.uri.split('s')
      result.areaId.lj = {
        id: list[1].replace(/[^0-9]/ig, ''),
        lineid: list[0].replace(/[^0-9]/ig, '')
      }
      areaJson.wiwj = {
        subway_station_id: list[1].replace(/[^0-9]/ig, ''),
        subway_line_id: list[0].replace(/[^0-9]/ig, '')
      }
    }
  }
  result.areaJson = JSON.stringify(areaJson)
  return result
}


//高德坐标转百度（传入经度、纬度）
const bd_encrypt = (gg_lng, gg_lat)=> {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = gg_lng, y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    latitude: bd_lat,
    longitude: bd_lng
  };
}

//判断是否显示附近
const isShowNearby = (city)=> {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        getLocationInfo(res).then(resp => {
          const cityName = resp.result.address_component.city;
          console.log(cityName, res)
          if (cityName && (cityName.indexOf(city) > -1)) {
            let result = bd_encrypt(res.longitude, res.latitude)
            return resolve(result)
          } else {
            return resolve(false)
          }
        }).catch(()=>{
          return resolve(false)
        });
      },
      fail: function (res) {
        return resolve(false)
      }
    })
  })
}

// 存附近
const nearByData =(data,index)=> {
  let area = ''
  let nearby = 0
  if (index == 1) {
    area = '附近 1km'
    nearby = 1
  } else if (index == 2) {
    area = '附近 2km'
    nearby = 2
  } else {
    area = '附近 3km'
    nearby =3
  }
  let result = {
    area: area,
    areaId: {
      nearby: nearby,
      latitude: data.latitude,
      longitude: data.longitude
    },
    areaType: 60,
    areaJson: ''
  }
  return result
}

export {
  longSetSearchData,
  chooseArea,
  chooseSlectData,
  isShowNearby,
  nearByData
}