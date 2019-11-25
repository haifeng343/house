const api = require('./api.js');
const monitor = require('../utils/monitor.js')
const app = getApp();
/**
 * 添加监控-短租
*/
const addMonitor = data =>{
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data), '/fdd/shortMonitor/addMonitor.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 添加监控-长租
*/
const addLongMonitor = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data), '/fdd/longRentMonitor/addMonitor.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 开启监控-短租
*/
const startMonitor = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data), '/fdd/shortMonitor/startMonitor.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 开启监控-长租
*/
const startLongMonitor = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data), '/fdd/longRentMonitor/startMonitor.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 修改监控-短租
*/
const updateMonitor = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data), '/fdd/shortMonitor/updateMonitor.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 修改监控-长租
*/
const updateLongMonitor = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data), '/fdd/longRentMonitor/updateMonitor.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 结束监控-短租
*/
const endMonitor = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data),'/fdd/shortMonitor/endMonitor.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 结束监控-长租
*/
const endLongMonitor = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.getApiMonitor(data, '/fdd/longRentMonitor/endLongRentMonitor.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 监控列表-短租
*/
const getMonitorList = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.getApiMonitor(data, '/fdd/shortMonitor/getMonitorList.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 监控列表-长租
*/
const getMonitorLongList = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.getApiMonitor(data, '/fdd/longRentMonitor/getLongRentMonitorList.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 监控详情-短租
*/
const monitorDetail = data =>{
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.getApiMonitor(data, '/fdd/shortMonitor/getDetailsById.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        resolve(false)
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 监控详情-长租
*/
const monitorLongDetail = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.getApiMonitor(data, '/fdd/longRentMonitor/getLongRentDetailById.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        resolve(false)
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 不再关注，添加黑名单-短租
*/
const addFddShortRentBlock = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data), '/fdd/shortMonitor/addFddShortRentBlock.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
/**
 * 不再关注，添加黑名单-长租
*/
const addFddLongRentBlock = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    api.postApiMonitorForm(monitor.json2Form(data), '/fdd/longRentMonitor/addBlacklist.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
const throwErrorResponse = (data)=>{
  wx.showToast({
    title: data.resultMsg,
    icon: 'none',
    duration: 2000
  })
}
module.exports = {
  addMonitor:addMonitor,
  startMonitor: startMonitor,
  updateMonitor: updateMonitor,
  endMonitor: endMonitor,
  monitorDetail: monitorDetail,
  addFddShortRentBlock: addFddShortRentBlock,
  getMonitorList: getMonitorList,
  addLongMonitor,
  startLongMonitor,
  updateLongMonitor,
  endLongMonitor,
  getMonitorLongList,
  monitorLongDetail,
  addFddLongRentBlock 
}