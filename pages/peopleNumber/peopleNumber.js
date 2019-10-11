// pages/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedNumber: 1,
    numberList: {
      "1": "1人",
      "2": "2人",
      "3": "3人",
      "4": "4人",
      "5": "5人",
      "6": "6人",
      "7": "7人",
      "8": "8人",
      "9": "9人",
      "10": "10人及以上",
      "-1": "不限"
    }
  },
  chooseNumber(event) {
    let number = event.currentTarget.dataset.number;

    const app = getApp();
    app.globalData.searchData.gueseNumber = number;
    this.setData({
      selectedNumber: number
    });
    wx.navigateBack({ delta: 1 });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let numberList = wx.getStorageSync("numberList");
    if (numberList) {
      this.setData({
        numberList
      });
    }
    const app = getApp();
    const { gueseNumber } = app.globalData.searchData;
    if (gueseNumber) {
      this.setData({
        selectedNumber: gueseNumber
      });
    }
  },

})