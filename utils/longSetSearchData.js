import Http from './http';

const getPositionInfoByName=(positionKey, cityName, type)=> {
  return Http.post('/long/positionDetail.json', { positionKey, cityName, type });
}

// 设置搜索历史
// 数据，城市名，房源类型（品牌中介，个人房源）
const longSetSearchData = (data, city, type) => {
  console.log('设置搜索历史')
  console.log(data,city,type)
}

const chooseArea = (fullname, city, chooseType)=> {
  return getPositionInfoByName(fullname, city, chooseType).then(resp => {
    let type = fullname.split('_')[1]
    let result = { areaId:{}}
    let data = resp.data;
    let info = JSON.parse(resp.data.json);
    // console.log(data, info)
    result.area = info.name
    result.areaJson = resp.data.json
    if (type == 10) {//行政区
      result.areaType = 10
      if (info.wiwj && info.wiwj[0]) {
        result.areaId.wiwj = info.wiwj[0].id
      }
      if (info.lj && info.lj[0]) {
        result.areaId.lj = info.lj[0].district_quanpin
      }
      if (info.ftx && info.ftx[0]) {
        result.areaId.ftx = info.ftx[0].name
      }
      if (info.tc && info.tc[0]) {
        result.areaId.tc = info.tc[0].dirname
      }
    } else {
      result.areaType = 50
      if (info.wiwj) {
        result.areaId.wiwj = {
          id: info.wiwj.id,
          lineid: info.wiwj.lineid
        }
      }
      if (info.lj) {
        let pData = JSON.parse(resp.data.pjson)
        result.areaId.lj = {
          id: info.lj.subway_station_id,
          lineid: pData.lj[0].subway_line_id
        }
      }
      if (info.ftx) {
        result.areaId.ftx = {
          id: info.ftx.name
        }
      }
      if (info.tc) {
        let pData = JSON.parse(resp.data.pjson)
        result.areaId.tc = {
          id: info.tc.siteid,
          lineid: pData.tc.lineid
        }
      }
    }
    return Promise.resolve(result)
  })
}

export {
  longSetSearchData,
  chooseArea
}