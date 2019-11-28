import { api_address, default_address } from '../utils/httpAddress.js'
const postApi = data => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api_address+'/rent/search',
      method: 'POST',
      data: data,
      success: res => {
        resolve(res)
      },
      fail:res=>{
        resolve(false)
        throwErrorResponse()
      }
    })
  })
}

const postApiMonitor = (data,url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: default_address + url,
      method: 'POST',
      data: data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        throwErrorResponse()
      }
    })
  })
}
const postApiMonitorForm = (data, url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: default_address + url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        throwErrorResponse()
      }
    })
  })
}
const getApiMonitor = (data, url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: default_address + url,
      data: data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        resolve(false)
        throwErrorResponse()
      }
    })
  })
}
const getApi = (data, url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: default_address + url,
      data: data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        throwErrorResponse()
      }
    })
  })
}

const postApiUrl = (data, url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
        throwErrorResponse()
      }
    })
  })
}

const getApiUrl = (data, url, headers ={}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      header: headers,
      data: data,
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
        throwErrorResponse()
      }
    })
  })
}

const throwErrorResponse = (data) => {
  wx.showToast({
    title: '网络连接异常，请检查网络状态！',
    icon: 'none',
    duration: 2000
  })
}
module.exports = {
  postApi: postApi,
  postApiMonitor: postApiMonitor,
  getApi: getApi,
  getApiMonitor: getApiMonitor,
  postApiMonitorForm: postApiMonitorForm,
  postApiUrl,
  getApiUrl
}