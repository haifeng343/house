Page({
  /**
   * 页面的初始数据
   */
  data: { fundData: null, isLoaded: false },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const app = getApp();
    const { fundData } = app;
    this.setData({ fundData, isLoaded: true });
  },
});
