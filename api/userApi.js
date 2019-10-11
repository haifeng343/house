const api = require('./api.js');
/**
 * 获取用户信息
*/
const userInfo = data => {
  return new Promise((resolve, reject) => {
    data.token = wx.getStorageSync('token')
    //data.token = 'a0cc7cf5d87a19070c9181980d312d2d'
    api.getApi(data, '/fdd/user/userInfo.json').then(res => {
      if (res.statusCode == 200 && res.data.success) {
        resolve(res)
      } else {
        throwErrorResponse(res.data)
      }
    })
  })
}
const throwErrorResponse = (data) => {
  wx.showToast({
    title: data.resultMsg,
    icon: 'none',
    duration: 2000
  })
}
module.exports = {
  userInfo: userInfo,
}