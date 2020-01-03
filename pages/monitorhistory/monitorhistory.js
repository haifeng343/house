import MonitorHistroyService from './service';

Page({
  data: {
    monitorList: [],
    isLoaded: false,
    showDialog: false,
    monitorEndDisplay: 'none',
    fundListType: 1,
  },

  service: new MonitorHistroyService(),

  submitFlag: false,

  targetMonitorId: -1,

  onLoad() {
    wx.showLoading({
      mask: true
    });
    this.getShortHistory()
  },
  getShortHistory(){
    this.service
      .getMonitorList()
      .then(monitorList => {
        wx.hideLoading();
        wx.showToast({title:'',icon:'none',duration:0});
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
  getLongHistory(){
    this.service
      .getMonitorLongList()
      .then(monitorList => {
        wx.hideLoading();
        wx.showToast({title:'',icon:'none',duration:0});
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
  getSecondHistory(){
    this.service
      .getMonitorSecondList()
      .then(monitorList => {
        wx.hideLoading();
        wx.showToast({title:'',icon:'none',duration:0});
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
  handleFundTypeChange(event) {
    const fundListType = +event.currentTarget.dataset.value;
    if (this.data.fundListType !== fundListType) {
      wx.showLoading({
        title: '获取历史数据...',
        mask: true
      });
      this.setData(
        {
          fundListType,
          isLoaded: false,
          monitorList: [],
        },
        () => {
          if (fundListType === 1) {
            this.getShortHistory();
          } else if(fundListType === 2) {
            this.getLongHistory();
          } else if (fundListType === 3) {
            this.getSecondHistory();
          }else {
            
          }
        }
      );
    }
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
      if (this.data.fundListType ==1){
        this.service
          .removeHistoryMonitor(this.targetMonitorId)
          .then(monitorList => {
            wx.hideLoading();
            this.submitFlag = false;
            this.setData({ monitorList, monitorEndDisplay: 'none' });
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
      if (this.data.fundListType == 2) {
        this.service
          .removeLongHistoryMonitor(this.targetMonitorId)
          .then(monitorList => {
            wx.hideLoading();
            this.submitFlag = false;
            this.setData({ monitorList, monitorEndDisplay: 'none' });
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
      if (this.data.fundListType == 3) {
        this.service
          .removeSecondHistoryMonitor(this.targetMonitorId)
          .then(monitorList => {
            wx.hideLoading();
            this.submitFlag = false;
            this.setData({ monitorList, monitorEndDisplay: 'none' });
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
  }
});
