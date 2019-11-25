import positionService from './service';
import { isShowNearby, nearByData, changeHistoryStorage } from '../../utils/longSetSearchData.js'

const typeEnum = {
  10: "area",
  20: "subway"
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    type: '',
    history: [],
    list: {
      area: {
        data: [],
        name: '行政',
        type:1
      },
      subway: {
        data: [],
        name: '地铁',
        type:5
      }
    },
    isScroll: false,
    singleItemHeight: 0,
    nearby: false,// 是否显示附近
    nearbyData: { // 经纬度
      latitude: '',
      longitude: ''
    }
  },
  service: new positionService(),

  clearHistory() {
    wx.setStorageSync('longSearchHistory_' + this.data.city + '_' + this.data.type, [])
    this.setData({ history: [] })
  },
  changeTab(event) {
    this.setData({ isScroll: true }, () => {
      let item = event.currentTarget.dataset.item;
      let scrollTop = this.data.scrollTop;
      scrollTop[item] = scrollTop[item] + 148;
      this.setData({
        scrollTop, isScroll: false
      })
    })
  },
  scrollToLower(event) {
    let item = event.currentTarget.dataset.item;
    let scrollTop = this.data.scrollTop;
    scrollTop[item] = 0;
    this.setData({
      scrollTop
    })
  },
  scrollItem(event) {
    console.log(1)
  },
  spreadItem(event) {
    let item = event.currentTarget.dataset.item;
    let length = parseInt(event.currentTarget.dataset.length);
    if (length > 20) {
      let showAll = this.data.showAll;
      let showAllItem = showAll[item]
      showAll[item] = !showAllItem;
      this.setData({
        showAll
      })
    } else {

      let spread = this.data.spread;
      let spreadItem = spread[item]
      spread[item] = !spreadItem;
      this.setData({
        spread
      })
    }
  },
  handleSelectHistory(event) {
    let item = event.currentTarget.dataset.item
    const app = getApp()
    app.globalData.searchLongData = Object.assign(app.globalData.searchLongData,item)
    changeHistoryStorage(app.globalData.searchLongData)
    wx.navigateBack({ delta: 1 });
  },
  handleSelectNearBy(event) {
    let index = event.currentTarget.dataset.index
    let result = nearByData(this.data.nearbyData, index)
    const app = getApp()
    app.globalData.searchLongData = Object.assign(app.globalData.searchLongData,result)
    wx.navigateBack({ delta: 1 });
  },
  gotoSearch() {
    wx.navigateTo({
      url: '../housingLongSearch/index'
    })
  },
  onLoad: function (options) {
    const { city } = options;
    const app = getApp()
    let type = app.globalData.searchLongData.chooseType
    let history = wx.getStorageSync('longSearchHistory_' + city + '_' + type) || [];
    this.setData({
      city,
      type,
      history
    });
    let list = this.data.list
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    //获取列表数据
    this.service.getSearchHoset(city, app.globalData.searchLongData.chooseType || 1).then(resp => {
      wx.hideLoading();
      let data = resp.data;
      for (const item of data) {
        let info = item.split('_');
        let name = info[0];
        let type = info[1];
        list[typeEnum[type]].data.push({
          name,
          fullname: item,
          type: type
        })
      }
      console.log(list)
      this.setData({
        list
      })
    }).catch(error => {
      console.error(error);
    });
    // 判断时候显示附近
    isShowNearby(city).then(resp=>{
      console.log(resp)
      // return
      if(resp) {
        this.setData({
          nearby: true,
          nearbyData: resp
        })
      }
    })
  }
})