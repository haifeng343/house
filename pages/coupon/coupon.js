import CouponService from "./service";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    currentTabValue: null,
    couponList: [],
    isLoaded: false,
    userCouponId: -1,
    showActionDialog: false,
    currentCouponValue: 0
  },

  service: new CouponService(),

  submitFlag: false,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.showLoading({
      title: "",
      mask: true
    });
    this.getCouponList().then(_ => {
      wx.hideLoading();
    });
  },

  getCouponList() {
    return this.service
      .getData(this.data.currentTabValue)
      .then(resp => {
        const { couponList, tabList } = resp;
        this.setData({ isLoaded: true, couponList });
        if (tabList) {
          this.setData({ tabList, currentTabValue: tabList[0].value });
        }
      })
      .catch(error => {
        console.error(error);
        wx.hideLoading();
        wx.showToast({
          title: `获取卡券数据失败!请联系客服!${error.message}`,
          icon: "none"
        });
      });
  },

  handleTabChange(event) {
    const tabValue = event.currentTarget.dataset.value;
    if (tabValue === this.data.currentTabValue) {
      return;
    }
    this.setData(
      { currentTabValue: tabValue, isLoaded: false, couponList: [] },
      () => {
        wx.showLoading({
          title: "",
          mask: true
        });
        this.getCouponList().then(_ => {
          wx.hideLoading();
        });
      }
    );
  },

  handleUseCoupon(event) {
    const { item } = event.currentTarget.dataset;

    if (item.type === 3) {
      if (this.submitFlag === false) {
        this.submitFlag = true;
        wx.showLoading({
          title: "",
          mask: true
        });
        this.service
          .exchangeCoupon(item.id)
          .then(_ => {
            this.submitFlag = false;
            wx.hideLoading();
            wx.showToast({
              title: `成功兑换${item.day}盯盯币!`,
              icon: "none"
            });
            this.getCouponList();
          })
          .catch(error => {
            console.error(error);
            this.submitFlag = false;
            wx.hideLoading();
            wx.showToast({
              title: `兑换盯盯币失败!请联系客服!${error.message}`,
              icon: "none"
            });
          });
      }
    } else {
      this.setData({ showActionDialog: true });
    }
  },

  handleActionCancel() {
    this.setData({ showActionDialog: false });
  },

  handleActionConfirm() {
    this.setData({ showActionDialog: false });
    wx.navigateToMiniProgram({
      appId: "wx11970e278167bf3b",
      path: "pages/home/index"
    });
  }
});
