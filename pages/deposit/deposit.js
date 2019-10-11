import DepositService from './service.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pay: [
      {
        disabled: false,
        label: 2,
        value: 200,
        coin: 200
      },
      {
        disabled: false,
        label: 5,
        value: 500,
        coin: 500
      },
      {
        disabled: false,
        label: 10,
        value: 1000,
        coin: 1000
      },
      {
        disabled: false,
        label: 20,
        value: 2000,
        coin: 2000
      },
      {
        disabled: false,
        label: 30,
        value: 3000,
        coin: 5000
      },
      {
        disabled: false,
        label: 50,
        value: 5000,
        coin: 5000
      },
      {
        disabled: true,
        label: 0.01,
        value: 1,
        coin: 1
      }
    ],
    money: 500,
    moneyText: '5.00',
    coin: 500,
    showType: false,
    exchangeAmount: '',
    userMoney: '0.00',
    showConfirmDialog: false
  },
  service: new DepositService(),
  submitFlag: false,
  exchangeAll() {
    this.setData({
      exchangeAmount: ~~this.data.userMoney
    });
  },
  changeTab() {
    let showType = this.data.showType;
    this.setData({
      showType: !showType
    });
  },
  handleExchange() {
    const exchangeAmount = ~~this.data.exchangeAmount;
    if (!exchangeAmount) {
      wx.showToast({
        title: '请输入要兑换金额',
        icon: 'none'
      });
    } else if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: '正在兑换...',
        mask: true
      });
      this.service
        .doExchangeCion(exchangeAmount)
        .then(resp => {
          this.submitFlag = false;
          wx.showToast({
            title: '兑换成功!'
          });
          this.setData({
            userMoney: this.data.userMoney - exchangeAmount
          });
          setTimeout(() => {
            wx.navigateBack({ delta: 1 });
          }, 1000);
        })
        .catch(error => {
          this.submitFlag = false;
          wx.hideLoading();
          wx.showToast({
            title: `兑换盯盯币失败,请联系客服!${error.message}`,
            icon: 'none'
          });
        });
    }
  },
  handleSelect(event) {
    const { money, coin } = event.currentTarget.dataset;
    this.setData({ money, coin, moneyText: (money / 100).toFixed(2) });
  },
  handleExchangeAmountChange(event) {
    const value = +event.detail.value;
    if (value) {
      if (value > +this.data.userMoney) {
        this.setData({ exchangeAmount: ~~this.data.userMoney });
        wx.showToast({
          title: `最多可以兑换${~~this.data.userMoney}元`,
          icon: 'none'
        });
      } else {
        this.setData({ exchangeAmount: value });
      }
    } else if (!Number.isNaN(value)) {
      this.setData({ exchangeAmount: '' });
    } else {
      this.setData({ exchangeAmount: this.data.exchangeAmount });
    }
  },
  handlePay() {
    if (this.data.coin === 0) {
      wx.showToast({
        title: `请先选择要充值的数量`,
        icon: 'none'
      });
      return;
    }
    if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: '创建支付订单...',
        mask: true
      });
      this.service
        .createOrder(this.data.money, this.data.coin)
        .then(params => {
          wx.hideLoading();
          wx.requestPayment({
            timeStamp: params.timeStamp,
            nonceStr: params.nonceStr,
            package: params.packageIs,
            signType: 'MD5',
            paySign: params.paySign,
            success: () => {
              this.submitFlag = false;
              wx.showToast({
                title: '支付成功!'
              });
              setTimeout(() => {
                wx.navigateBack({ delta: 1 });
              }, 1000);
            },
            fail: () => {
              this.submitFlag = false;
              wx.hideLoading();
              wx.showToast({
                title: '支付失败，请稍后重试',
                icon: 'none'
              });
            }
          });
        })
        .catch(error => {
          this.submitFlag = false;
          wx.hideLoading();
          wx.showToast({
            title: `创建支付订单失败,请联系客服!${error.message}`,
            icon: 'none'
          });
        });
    }
  },

  handleShowConfirmdialog() {
    const exchangeAmount = ~~this.data.exchangeAmount;
    if (!exchangeAmount) {
      wx.showToast({
        title: '请输入要兑换金额',
        icon: 'none'
      });
    } else {
      this.setData({ showConfirmDialog: true });
    }
  },

  getmonitorEndEvent() {
    this.setData({ showConfirmDialog: false });
  },

  getmonitorEndConfirmEvent() {
    this.setData({ showConfirmDialog: false });
    this.handleExchange();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.service.getUserInfo().then(userInfo => {
      const { useMoney } = userInfo.userAccount;
      this.setData({ userMoney: useMoney.toFixed(2) });
    });
    const { type } = options;
    this.setData(
      {
        showType: !!parseInt(type)
      },
      () => {
        console.log(this.data.showType);
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
