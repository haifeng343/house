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

//选择长租地点列表数据处理
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
      searchLongData.areaId.subwaysLine = resp.data.subwaysLine
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

//搜索列表数据处理
const chooseSlectData = (data)=> {
  let type = data.type
  let result = {areaId: {}}
  result.areaType = type
  result.area = data.name
  result.areaJson = JSON.stringify(data)
  if (type == 10) {
    result.areaId = {}
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri.replace(/\//ig, '')
    }
  }
  if (type == 20) {
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri
    }
    if (data.ftx) {
      result.areaId.ftx = {
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
    }
    if (data.lianjia) {
      result.areaId.lj = data.lianjia.uri
    }
  }
  if (type == 40) {
    if (data.wiwj) {
      result.areaId.wiwj = data.wiwj.searchId
    }
  }
  if (type == 50) {
    result.areaId = {}
    if (data.wiwj) {
      result.areaId.wiwj = {
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
    }
  }
  return result
}

export {
  longSetSearchData,
  chooseArea,
  chooseSlectData
}