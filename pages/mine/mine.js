// pages/mine/mine.js
import { authSubject } from "../../utils/auth";
import { getSessionKey } from "../../utils/wx";
import MineService from "./service";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    mobile: "",
    headPortrait: "",
    useCoin: 0,
    totalMoney: 0,
    isAuth: false,
    showAuthDialog: false,
    submitFlag: false,
    showShareCard: false,
    showTipDialog: false,
    shareDesc: "",
    couponList: [],
    showCouponDialog: false
  },
  service: new MineService(),
  action: "",
  submitFlag: false,
  authSubscription: null,
  shareFlag: false,
  isFirstShare: false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.authSubscription = authSubject.subscribe(isAuth => {
      console.log("isAuth=" + isAuth);
      if (isAuth) {
        this.service
          .getUserInfo()
          .then(userInfo => {
            this.setData(userInfo);
            this.setData({ isAuth });
            if (this.action) {
              this.handleAction();
            }
          })
          .catch(error => {
            wx.showToast({
              title: `获取用户信息失败!${error.message}`,
              icon: "none"
            });
          });
      }
    });

    this.service.checkFirstShare().then(resp => {
      const { isFirstShare } = resp;
      this.isFirstShare = isFirstShare;
      this.setData({
        shareDesc: isFirstShare ? "可获得兑换券" : ""
      });
    });
  },
  handleGotoDeposit(event) {
    var type = event.currentTarget.dataset.type;
    if (this.data.isAuth) {
      wx.navigateTo({
        url: `/pages/deposit/deposit?type=${type}`
      });
    } else {
      this.action = "gotodeposit";
      this.showAuthDialog();
    }
  },

  handleShowTipDialog() {
    this.setData({ showTipDialog: true });
  },

  handleCloseTipDialog() {
    this.setData({ showTipDialog: false });
  },

  handleGotoCoupon() {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: "/pages/coupon/coupon"
      });
    } else {
      this.action = "gotocoupon";
      this.showAuthDialog();
    }
  },

  handleGotoHistory() {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: "/pages/monitorhistory/monitorhistory"
      });
    } else {
      this.action = "gotohistory";
      this.showAuthDialog();
    }
  },
  handleGotoContact() {
    wx.navigateTo({
      url: `/pages/contact/index`
    });
  },
  handleGotoFund() {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: "/pages/fund/fund"
      });
    } else {
      this.action = "gotofund";
      this.showAuthDialog();
    }
  },
  handleAction() {
    const { action } = this;
    this.action = "";

    switch (action) {
      case "gotodeposit":
        this.handleGotoDeposit();
        break;

      case "gotofund":
        this.handleGotoFund();
        break;

      case "gotohistory":
        this.handleGotoHistory();
        break;

      case "share":
        this.handleGotoHistory();
        break;

      case "gotocoupon":
        this.handleGotoCoupon();
        break;
    }
  },
  handleAuth() {
    this.action = "";
    this.showAuthDialog();
  },

  handleCloseAuthDialog() {
    wx.showToast({
      title: "为了更好的使用效果，请同意用户信息授权",
      icon: "none"
    });
    this.setData({
      showAuthDialog: false
    });
  },
  handleCloseCouponDialog() {
    this.setData({ showCouponDialog: false });
  },
  showAuthDialog() {
    wx.showLoading({
      title: "获取登录授权中",
      mask: true
    });

    getSessionKey()
      .then(() => {
        wx.hideLoading();
        this.setData({ showAuthDialog: true });
      })
      .catch(() => {
        wx.hideLoading();
        wx.showToast({
          title: "获取登录授权失败",
          icon: "none"
        });
      });
  },

  handleShare() {
    this.setData({ showShareCard: true });
  },

  handleCloseShareCard() {
    this.setData({ showShareCard: false });
  },

  handleGetUserInfo(e) {
    const userInfo = e.detail.userInfo.detail;
    const { iv, encryptedData } = userInfo;

    if (!iv || !encryptedData) {
      wx.showToast({
        title: "为了更好的使用效果，请同意用户信息授权",
        icon: "none"
      });
      return;
    }

    if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: "获取授权信息...",
        mask: true
      });
      this.setData({ showAuthDialog: false });
      getSessionKey().then(sessionKey => {
        const data = {
          session_key: sessionKey,
          iv,
          encryptedData
        };
        this.auth(data);
      });
    }
  },
  auth(data) {
    this.service
      .auth(data)
      .then(() => {
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: "登录成功"
        });
      })
      .catch(error => {
        console.error(error);
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: "登录失败，请稍后重试",
          icon: "none"
        });
      });
  },

  onShow() {
    if (this.data.isAuth) {
      this.service
        .getUserInfo()
        .then(userInfo => {
          this.setData(userInfo);
        })
        .catch(error => {
          wx.showToast({
            title: `获取用户信息失败!${error.message}`,
            icon: "none"
          });
        });
    }

    if (this.shareFlag === true) {
      this.requestShare();
    }
  },

  onUnload() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  },

  requestShare() {
    if (this.isFirstShare === false) {
      return;
    }
    wx.showLoading({
      title: "请稍候...",
      mask: true
    });
    this.service
      .requestShare()
      .then(couponList => {
        console.log(couponList);
        wx.hideLoading();
        this.isFirstShare = false;
        this.setData({ shareDesc: "", showCouponDialog: true, couponList });
      })
      .catch(error => {
        console.error(error);
        wx.hideLoading();
        wx.showToast({
          title: error.message,
          icon: "none"
        });
      });
  },

  onShareAppMessage() {
    this.shareFlag = true;
    this.setData({ showShareCard: false });

    return {
      title: "房盯盯-实时监控全网低价折扣房源",
      path: "pages/search/search",
      imageUrl:
        "https://piaodingding.oss-cn-hangzhou.aliyuncs.com/images/wechat/fdd/share.png"
    };
  }
});
