
import FeedBackService from './service';

Page({
  data: {
    count: 0
  },

  service: new FeedBackService(),

  submitFlag: false,

  feedBackText: '',

  handleFeedBackChange(event) {
    const value = event.detail.value;
    this.feedBackText = value;
    this.setData({ count: value.length });
  },

  handleSubmitFeedBack() {
    const { length } = this.feedBackText;
    if (length < 8 || length > 100) {
      wx.showToast({
        title: '为了更好的为您服务，请至少输入8字以上。',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '提交中...',
      mask: true
    });

    if (this.submitFlag === false) {
      this.submitFlag = true;
      this.service
        .submitFeedBack(this.feedBackText)
        .then(() => {
          this.submitFlag = false;
          wx.hideLoading();
          wx.showToast({
            title: '提交成功!'
          });
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/userfeedback/index' });
          }, 1000);
        })
        .catch(error => {
          this.submitFlag = false;
          console.error(error);
          wx.hideLoading();
          wx.showToast({
            title: `提交失败!${error.message}`,
            icon: 'none'
          });
        });
    }
  },

  handleGotoUserFeedBack() {
    wx.navigateTo({ url: '/pages/userfeedback/index' });
  },
});
