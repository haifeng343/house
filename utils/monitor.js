const api = require('../api/api.js');
import MD5 from "../utils/md5.js";
import { wiwj_address, lianjia_address1, fangtianxia_address3, wbtc_address4} from "./httpAddress.js"
const encrySign = 'cd02613a5cfaf7ad91e565d668b6056c'
const setDate = date => {
  let d = date.split(" ")[0];
  let dd = d.split("-");
  return dd[1] + '-' + dd[2]
}

const setDay = time => {
  return parseInt(time / 24)
}
const setHour = time => {
  if (parseInt(time / 24) === 0) {
    return time
  } else {
    return time % 24
  }
}

const startTimeName = startTime => {
  let date = startTime.split(" ")[0];
  let time = startTime.split(" ")[1];
  let m = date.split("-")[1]
  let d = date.split("-")[2]
  let h = time.split(":")[0]
  let min = time.split(":")[1]
  return m + '月' + d + '日' + h + '时' + min + '分'
}

const taskTime = (monitorTime, minutes) => {
  if (monitorTime || monitorTime == 0 && !minutes && minutes != 0) {
    if (~~(monitorTime / 24) === 0) {
      return monitorTime + '小时'
    } else {
      return ~~(monitorTime / 24) + "天" + monitorTime % 24 + "小时"
    }
  }
  if (minutes || minutes == 0) {
    return minutes + '分钟'
  }
}

const checkDate = date=>{
  if(!date){
    return '--.--'
  }
  let d = date.split(" ")[0];
  let dateTime = d.split("-")[1] + "." +d.split("-")[2]
  return dateTime
}

const json2Form = json => {
  var str = [];
  for (var p in json) {
    if (typeof (json[p]) == 'object') {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(json[p])));
    } else {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }

  }
  return str.join("&");
}

const navigateToMiniProgram = (plateform, productid, beginDate, endDate) => {
  if (plateform == 'tj') {
    wx.navigateToMiniProgram({
      appId: 'wx5df0be7c6bb02397',
      // path: productid ? 'pages/unitDetails_v2/unitDetails?unitId=' + productid : ''
      path: productid ? 'pages/unitDetails_v2/unitDetails?unitId=' + productid + '&beginDate=' + beginDate + '&endDate=' + endDate : ''
    })
  }
  if (plateform == 'xz') {
    wx.navigateToMiniProgram({
      appId: 'wx2aad75253d80f302',
      // path: productid ? 'moduleDetail/pages/details/details?luId=' + productid : ''
      path: productid ? 'moduleDetail/pages/details/details?luId=' + productid + '&startDate=' + beginDate + '&endDate=' + endDate : ''
    })
  }
  if (plateform == 'mn') {
    wx.navigateToMiniProgram({
      appId: 'wx5048ec7260c49991',
      //path: productid ? 'pages/room/room?id=' + productid : ''
      path: productid ? 'pages/room/room?id=' + productid + '&starttime=' + beginDate + '&endtime=' + endDate : ''
    })
  }
  if (plateform == 'zg') {
    wx.navigateToMiniProgram({
      appId: 'wxc147016e2b3bf9d6',
      //path: productid ? 'pages/product/product?productId=' + productid : ''
      path: productid ? 'pages/product/product?productId=' + productid + '&startDate=' + beginDate.replace(/-/g, '') + '&endDate=' + endDate.replace(/-/g, '') : ''
    })
  }
}

const navigateToLongMiniProgram = (plateform, productid,city) => {
  if (plateform == 'wiwj') {
    if (productid){
      wiwjDetail(productid, city.wiwj).then(res=>{
        wx.navigateToMiniProgram({
          appId: 'wxaf705dee544e08d9',
          path: 'pages/zufang_detail/zufang_detail?houseId=' + productid + '&cityId=' + city.wiwj
        })
      }).catch(res=>{
        wx.showToast({
          title: '该房源仅可在app中查看，具体详情请前往对应平台app查询',
          icon: 'none',
          mask: true
        })
      })
    }else{
      wx.navigateToMiniProgram({
        appId: 'wxaf705dee544e08d9',
      })
    }
  }
  if (plateform == 'lj') {
    if (productid){
      ljDetail(productid).then(res => {
        if (/^\d+$/.test(productid)){
          wx.navigateToMiniProgram({
            appId: 'wxcfd8224218167d98',
            path: 'subpackages/rent/pages/apartment/layout/index.html?share=1&layout_id=' + productid
          })
        }else{
          wx.navigateToMiniProgram({
            appId: 'wxcfd8224218167d98',
            path: 'subpackages/rent/pages/detail/index?city_id=' + city.lj + '&house_code=' + productid
          })
        }
      }).catch(res => {
        wx.showToast({
          title: '该房源仅可在app中查看，具体详情请前往对应平台app查询',
          icon: 'none',
          mask: true
        })
      })
    }else{
      wx.navigateToMiniProgram({
        appId: 'wxcfd8224218167d98',
      })
    }
    
  }
  if (plateform == 'ftx') {
    if (productid){
      ftxDetail(productid, city.ftx).then(res=>{
        wx.navigateToMiniProgram({
          appId: 'wxffbb41ec9b99a969',
          path: 'pages/zf/detail/grdetail?houseid=' + productid + '&cityname=' + city.ftx
        })
      }).catch(res=>{
        wx.showToast({
          title: '该房源仅可在app中查看，具体详情请前往对应平台app查询',
          icon: 'none',
          mask: true
        })
      })
    }else{
      wx.navigateToMiniProgram({
        appId: 'wxffbb41ec9b99a969',
      })
    }
  }
  if (plateform == 'tc') {
    if (productid){
      tcDetail(productid).then(res=>{
        wx.navigateToMiniProgram({
          appId: 'wxc97b21c63d084d92',
          path:  'pages/houseplugin/__plugin__/wxaea78830c7829f80/zufang/pages/rent-detail/index?infoId=' + productid
        })
      }).catch(res=>{
        wx.showToast({
          title: '该房源仅可在app中查看，具体详情请前往对应平台app查询',
          icon:'none',
          mask: true
        })
      })
    }else{
      wx.navigateToMiniProgram({
        appId: 'wxc97b21c63d084d92',
      })
    }
  }
}

const wiwjDetail = function (id,cityId){
  let data = { hid: id}
  return new Promise((resolve, reject) => {
    api.postApiUrl(data, wiwj_address + '/appapi/rent/' + cityId+'/v1/allinfo').then(res => {
      console.log(res)
      if (res && res.data && typeof (res.data.data) == 'object' && res.data.data.houseinfo) {
        resolve(true)
      } else {
        reject(false)
      }
    }).catch(res => {
      reject(false)
    })
  })
}

const ljDetail = function (id) {
  let ts = new Date().valueOf() / 1000
  let data = {
    house_code:id,
    ts: ts
  }
  let signStr = encrypt('v1/house/detail', { house_code: id, ts:ts });
  let sign = MD5(signStr);
  let headers={
    'rent-sign': sign,
    'rent-app-id': 'rent-xcx'
  }
  return new Promise((resolve, reject) => {
    api.getApiUrl(data, lianjia_address1+'/v1/house/detail', headers).then(res => {
      console.log(res)
      if (res && res.data && typeof (res.data.data) == 'object' && res.data.data.base_info) {
        resolve(true)
      } else {
        reject(false)
      }
    }).catch(res => {
      reject(false)
    })
  })
}

const ftxDetail = function (id,city) {
  let data = { 
    c:'wechat500Public',
    a:'zfJxAGTDetail',
    globalid:'bce6b8806e84433f',
    appname:'fangx',
    houseid: id,
    cityname:city
  }
  return new Promise((resolve, reject) => {
    api.getApiUrl(data, fangtianxia_address3+'/public').then(res => {
      console.log(res)
      if (res && res.data && typeof (res.data) == 'object' && res.data.houseid){
        resolve(true)
      }else{
        reject(false)
      }
    }).catch(res => {
      reject(false)
    })
  })
}

const tcDetail = function (id) {
  let data = {
    infoId:id,
    signature: MD5(id +'HOUSEWECHAT')
  }
  return new Promise((resolve, reject) => {
    api.getApiUrl(data, wbtc_address4+'/house/Api_get_zufang_detail').then(res => {
      console.log(res)
      if (res && res.data && typeof (res.data.data) == 'object' && res.data.data.houseInfo) {
        resolve(true)
      } else {
        reject(false)
      }
    }).catch(res => {
      reject(false)
    })
  })
}
function fixedEncodeURIComponent(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g,
    function (e) {
      return "%" + e.charCodeAt(0).toString(16).toUpperCase()
    })
}
function encrypt(url, data = {}) {
  let n = Object.keys(data).map(function (e) {
    return e + "=" + fixedEncodeURIComponent(data[e])
  }).join("&");
  n = encrySign + (n = n.split("&").sort(function (e, n) {
    return e.localeCompare(n);
  }).join(""));
  n += url;
  return n;
}
module.exports = {
  setDate: setDate,
  setDay: setDay,
  setHour: setHour,
  startTimeName: startTimeName,
  taskTime: taskTime,
  checkDate: checkDate,
  json2Form: json2Form,
  navigateToMiniProgram: navigateToMiniProgram,
  navigateToLongMiniProgram
}