// pages/housingLongSearch/index.js
import SearchService from './service';
const service = new SearchService();
const longRentTip = require('../../utils/longRentTip')
import { longSetSearchData } from '../../utils/longSetSearchData'

const specialCity = [
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    history: [],
    type: '',
    value: '',
    resultLength: 0,
    hasAsked: false,
    isfocus: false
  },
  submitFlag: false,
  service: new SearchService(),
  inputSearch(event) {
    // console.log(event);
    this.setData({
      value: event.detail.value
    })
    if (event.detail.value.length > 1) {
      this.handleSearch()
    }
  },
  handleSearch() {
    var app = getApp();
    // console.log('app',app);
    this.setData({
      hasAsked: false
    })
    if (this.data.value.length < 2) {
      this.setData({
        result: [],
        hasAsked: true,
        resultLength: -1
      })
      return;
    }

    if (this.submitFlag) {
      return
    }
    this.submitFlag = true;
    wx.showLoading({
      title: '搜索中...',
      mask: true
    });
    let searchLongData = app.globalData.searchLongData
    if(searchLongData.chooseType==1) {
      longRentTip.getIntermediaryData(searchLongData.cityId, this.data.value).then(res => {
        wx.hideLoading();
        this.submitFlag = false;
        if (res) {
          // console.log(res)
          let length = res.length
          this.setData({
            hasAsked: true,
            resultLength: length,
            result: res
          })
        } else {
          // wx.showToast({
          //   title: '网络异常',
          //   icon: 'none'
          // });
        }
      }).catch(()=>{
        wx.hideLoading();
        this.submitFlag = false;
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
      })
    } else {
      longRentTip.getPersonalData(searchLongData.cityId, this.data.value).then(res => {
        wx.hideLoading();
        this.submitFlag = false;
        if (res) {
          // console.log(res)
          let length = res.length
          this.setData({
            hasAsked: true,
            resultLength: length,
            result: res
          })
        } else {
          // wx.showToast({
          //   title: '网络异常',
          //   icon: 'none'
          // });
        }
      }).catch(() => {
        wx.hideLoading();
        this.submitFlag = false;
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
      })
    }
  },
  handleSelect(event) {
    let data = event.currentTarget.dataset.item
    let type = data.type
    // console.log(event, data, type)
    const app = getApp()
    let searchLongData = app.globalData.searchLongData
    searchLongData.areaType = type
    searchLongData.area = data.name
    searchLongData.areaJson = JSON.stringify(data)
    if(type == 10) {
      searchLongData.areaId = {}
      if(data.wiwj) {
        searchLongData.areaId.wiwj = data.wiwj.searchId
      }
      if (data.lianjia) {
        searchLongData.areaId.lj = data.lianjia.uri.replace(/\//ig,'')
      }
    }
    if (type == 20) {
      if (data.wiwj) {
        searchLongData.areaId.wiwj = data.wiwj.searchId
      }
      if (data.lianjia) {
        searchLongData.areaId.lj = data.lianjia.uri
      }
      if (data.ftx) {
        searchLongData.areaId.ftx = {
          district: data.ftx.district.text,
          comarea: data.ftx.word.text
        }
      }
    }
    if (type == 30) {
      if (data.wiwj) {
        searchLongData.areaId.wiwj = data.wiwj.searchId
      }
      if (data.lianjia) {
        searchLongData.areaId.lj = data.lianjia.uri
      }
    }
    if (type == 40) {
      if (data.wiwj) {
        searchLongData.areaId.wiwj = data.wiwj.searchId
      }
    }
    if (type == 50) {
      searchLongData.areaId = {}
      if (data.wiwj) {
        searchLongData.areaId.wiwj = {
          id:data.wiwj.searchId,
          lineid: data.wiwj.parentId
        }
      }
      if (data.lianjia) {
        let list = data.lianjia.uri.split('s')
        searchLongData.areaId.lj = {
          id: list[1].replace(/[^0-9]/ig,''),
          lineid: list[0].replace(/[^0-9]/ig, '')
        }
      }
    }
    // console.log(searchLongData)
    longSetSearchData(data, searchLongData.city, searchLongData.chooseType)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 3]; //上一个页面
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    // prevPage.setData(
    //   {
    //     isBack: true
    //   },
    //   () => {
    //     wx.navigateBack({
    //       delta: 2
    //     });
    //   }
    // );
  },

  /**返回上一级 */
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  clearInput() {
    this.setData({
      isfocus: false,
    },()=>{
      this.setData({ value: '', hasAsked: false })
    })
  },

  onLoad: function () {

  },

  onReady: function () {

  },

  onShow: function () {
    let history = wx.getStorageSync('positionSearchHistory') || [];
    this.setData({
      history
    })
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})