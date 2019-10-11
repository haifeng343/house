//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    startDate: '',
    endData: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  selectDate(value) {
    console.log(value)
  },
  onShow() {
    if (this.data.type === 'monitor') {

      const { beginDate, endDate } = app.globalData.monitorSearchData
      this.setData({
        startDate: beginDate,
        endDate: endDate
      })
    } else {

      const { beginDate, endDate } = app.globalData.searchData
      this.setData({
        startDate: beginDate,
        endDate: endDate
      })
    }
  },
  onLoad: function (options) {
    const { type } = options;
    this.setData({
      type
    })
  },
})
