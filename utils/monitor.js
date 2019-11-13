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
    wx.navigateToMiniProgram({
      appId: 'wxaf705dee544e08d9',
      path: productid?'pages/zufang_detail/zufang_detail?houseId=' + productid + '&cityId' + city.wiwj:''
    })
  }
  if (plateform == 'lj') {
    wx.navigateToMiniProgram({
      appId: 'wxcfd8224218167d98',
      path: productid ? 'subpackages/rent/pages/detail/index?city_id=' + city.lj + '&house_code=' + productid : ''
    })
  }
  if (plateform == 'ftx') {
    wx.navigateToMiniProgram({
      appId: 'wxffbb41ec9b99a969',
      path: productid ? 'pages/zf/detail/grdetail?houseid=' + productid + '&cityname' + city.ftx : ''
    })
  }
  if (plateform == 'tc') {
    wx.navigateToMiniProgram({
      appId: 'wxc97b21c63d084d92',
      path: productid ? 'pages/houseplugin/__plugin__/wxaea78830c7829f80/zufang/pages/rent-detail/index?infoId=' + productid : ''
    })
  }
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