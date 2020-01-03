import UserFeedBackServie from './service';

Page({
  data: {
    feedbackList: []
  },

  service: new UserFeedBackServie(),

  submitFlag: false,

  onLoad() {
    wx.showLoading({
      title: '请稍候...',
      mask: true
    });
    this.service
      .getUserFeedBackList()
      .then(feedbackList => {
        wx.hideLoading();
        wx.showToast({title:'',icon:'none',duration:1});
        this.setData({ feedbackList });
        if (feedbackList.length === 0) {
          wx.showToast({
            icon: 'none',
            title: '暂无反馈数据!'
          });
          setTimeout(() => {
            wx.navigateBack({ delta: 1 });
          }, 1000);
        }
      })
      .catch(error => {
        console.error(error);
        wx.hideLoading();
        wx.showToast({
          title: `获取反馈数据失败!${error.message}`,
          icon: 'none'
        });
      });
  }
});
