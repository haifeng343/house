const api = require('./api.js');
const monitor = require('../utils/monitor.js')
const app = getApp();
/**
 * 添加监控
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
 * 开启监控
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
 * 修改监控
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
 * 结束监控
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
 * 监控列表
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
 * 监控详情
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
 * 不再关注，添加黑名单
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
}