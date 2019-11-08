import * as rxjs from '../../utils/rx';
import FundService from './service';
// pages/statistics/statistics.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fundList: [],
    fundTimeList: [
      {
        value: 1,
        label: '近一周'
      },
      {
        value: 2,
        label: '近一个月'
      },
      {
        value: 3,
        label: '近三个月'
      }
    ],
    coinFundTimeList: [
      {
        value: 0,
        label: '全部'
      },
      {
        value: 1,
        label: '近三天'
      },
      {
        value: 2,
        label: '近一周'
      },
      {
        value: 3,
        label: '近一个月'
      }
    ],
    fundTypeList: [
      {
        value: 0,
        label: '全部'
      },
      {
        value: 1,
        label: '充值'
      },
      {
        value: 6,
        label: '支付'
      },
      {
        value: 7,
        label: '退款'
      },
      {
        value: 8,
        label: '兑换'
      }
    ],
    coinTypeList: [
      {
        value: 0,
        label: '全部'
      },
      {
        value: 1,
        label: '充值'
      },
      {
        value: 2,
        label: '兑换'
      },
      {
        value: 3,
        label: '消耗'
      }
    ],
    timeRange: 1,
    billType: 0,
    fundListType: 1,
    isLoaded: false
  },
  service: new FundService(),
  requestFlag: false,
  handleSelectExpand(expand) {
    this.setData({ canScroll: expand === false });
  },
  handletimeRangeChange(event) {
    wx.showLoading({
      title: '获取账单数据...',
      mask: true
    });
    const timeRange = event.detail.value;
    this.setData({ timeRange, isLoaded: false, fundList: [] }, () => {
      if (this.data.fundListType === 1) {
        this.getFundList();
      } else {
        this.getCoinFundList();
      }
    });
  },

  handlebillTypeChange(event) {
    wx.showLoading({
      title: '获取账单数据...',
      mask: true
    });
    const billType = event.detail.value;
    this.setData({ billType, isLoaded: false, fundList: [] }, () => {
      if (this.data.fundListType === 1) {
        this.getFundList();
      } else {
        this.getCoinFundList();
      }
    });
  },

  handleFundTypeChange(event) {
    const fundListType = +event.currentTarget.dataset.value;
    if (this.data.fundListType !== fundListType) {
      wx.showLoading({
        title: '获取账单数据...',
        mask: true
      });
      this.setData(
        {
          fundListType,
          isLoaded: false,
          fundList: [],
          billType: 0,
          timeRange: fundListType === 1 ? 1 : 0
        },
        () => {
          if (fundListType === 1) {
            this.getFundList();
          } else {
            this.getCoinFundList();
          }
        }
      );
    }
  },

  handleGotoFundDetail(event) {
    const app = getApp();
    app.fundData = event.detail;
    wx.navigateTo({ url: '/pages/funddetail/index' });
  },

  getFundList() {
    this.service
      .getFundList(this.data.timeRange, this.data.billType)
      .then(fundList => {
        wx.hideLoading();
        this.setData({ fundList, isLoaded: true });
      })
      .catch(error => {
        console.error(error);
        wx.hideLoading();
        wx.showToast({
          title: '获取账单数据失败',
          icon: 'none'
        });
      });
  },
  getCoinFundList() {
    if (this.requestFlag === false) {
      this.requestFlag = true;
      this.service
        .getCoinFundList(this.data.timeRange, this.data.billType)
        .then(fundList => {
          this.requestFlag = false;
          wx.hideLoading();
          this.setData({ fundList, isLoaded: true });
        })
        .catch(error => {
          console.error(error);
          this.requestFlag = false;
          wx.hideLoading();
          wx.showToast({
            title: '获取账单数据失败',
            icon: 'none'
          });
        });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '获取账单数据...',
      mask: true
    });

    this.getFundList();
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
