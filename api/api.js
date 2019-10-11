//房源本地地址 http://192.168.1.53:3001
//房源测试地址 https://fytest.bangdingding.cn
const api_address = 'https://fytest.bangdingding.cn';

//本地地址：http://192.168.1.109:9001
// 开发环境: http://fddserver.pdd.develop
// 测试环境: http://fddserver.pdd.test
// 正式环境: https://piao.bangdingding.cn
//测试环境https://fangtest.bangdingding.cn


const default_address = 'https://fangtest.bangdingding.cn'; 
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
  postApiMonitorForm: postApiMonitorForm
}