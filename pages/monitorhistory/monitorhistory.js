import MonitorHistroyService from './service';

Page({
  data: {
    monitorList: [],
    isLoaded: false,
    showDialog: false,
    monitorEndDisplay: 'none'
  },

  service: new MonitorHistroyService(),

  submitFlag: false,

  targetMonitorId: -1,

  onLoad() {
    wx.showLoading({
      mask: true
    });
    this.service
      .getMonitorList()
      .then(monitorList => {
        wx.hideLoading();
        this.setData({ isLoaded: true, monitorList });
      })
      .catch(error => {
        this.setData({ isLoaded: false, monitorList: [] });
        console.error(error);
        wx.hideLoading();
        wx.showToast({
          title: `获取历史监控数据失败!${error.message}`,
          icon: 'none'
        });
      });
  },

  getmonitorEndEvent(e) {
    this.setData({
      monitorEndDisplay: e.detail,
    })
  },

  handleRemove(event) {
    const monitorId = event.detail;
    this.targetMonitorId = monitorId;
    this.setData({
      monitorEndDisplay:'block'
    })
  },
  getmonitorEndConfirmEvent(){
    this.handleDialogConfirm();
  },
  handleDialogClose() {
    const showDialog = false;
    this.setData({ showDialog });
  },

  handleDialogConfirm() {
    if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: '请稍候...',
        mask: true
      });
      this.service
        .removeHistoryMonitor(this.targetMonitorId)
        .then(monitorList => {
          wx.hideLoading();
          this.submitFlag = false;
          this.setData({ monitorList, monitorEndDisplay:'none' });
          wx.showToast({ title: '操作成功!' });
        })
        .catch(error => {
          wx.hideLoading();
          this.submitFlag = false;
          wx.showToast({
            title: `结束监控失败!${error.message}`,
            icon: 'none'
          });
        });
    }
  }
});
