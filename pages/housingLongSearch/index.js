// pages/housingLongSearch/index.js
import SearchService from "./service";
const service = new SearchService();
const longRentTip = require("../../utils/longRentTip");
import getHeightStrArray from "../../utils/getHeightStrArray";
import {
  longSetSearchData,
  chooseSlectData
} from "../../utils/longSetSearchData";

const specialCity = [];

const areaTagMap = {
  "0": "未选择",
  "10": "行政区",
  "20": "商圈",
  "30": "小区",
  "40": "地铁线",
  "50": "地铁站",
  "60": "附近"
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    history: [],
    type: "",
    value: "",
    resultLength: 0,
    hasAsked: false,
    isfocus: false
  },
  service: new SearchService(),
  inputSearch(event) {
    this.setData(
      {
        value: event.detail.value
      },
      () => {
        this.handleSearch();
      }
    );
  },
  handleSearch() {
    var app = getApp();

    this.setData({
      hasAsked: false
    });

    let searchLongData = app.globalData.searchLongData;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.promiseVersion += 1;
      if (searchLongData.chooseType === 1) {
        longRentTip
          .getIntermediaryData(
            searchLongData.cityId,
            this.data.value,
            this.promiseVersion
          )
          .then(resp => {
            const { result, promiseVersion } = resp;
            if (this.promiseVersion === promiseVersion) {
              const length = result.length;
              this.setData({
                hasAsked: true,
                resultLength: length,
                result: result.map(item =>
                  Object.assign(
                    {
                      label: getHeightStrArray(item.name, this.data.value),
                      tag: areaTagMap[item.type]
                    },
                    item
                  )
                )
              });
            }
          })
          .catch(error => {
            console.error(error);
            wx.showToast({
              title: "网络异常",
              icon: "none"
            });
          });
      } else {
        longRentTip
          .getPersonalData(
            searchLongData.cityId,
            this.data.value,
            this.promiseVersion
          )
          .then(resp => {
            console.log('resp',resp);
            const { result, promiseVersion } = resp;
            if (this.promiseVersion === promiseVersion) {
              let length = result.length;
              this.setData({
                hasAsked: true,
                resultLength: length,
                result: result.map(item =>
                  Object.assign(
                    {
                      label: getHeightStrArray(item.name, this.data.value),
                      tag: areaTagMap[item.type]
                    },
                    item
                  )
                )
              });
            }
          })
          .catch(error => {
            console.error(error);
            wx.showToast({
              title: "网络异常",
              icon: "none"
            });
          });
      }
    }, 200);
  },
  handleSelect(event) {
    let data = event.currentTarget.dataset.item;
    const app = getApp();
    let searchLongData = app.globalData.searchLongData;
    app.globalData.searchLongData = Object.assign(
      app.globalData.searchLongData,
      chooseSlectData(data)
    );

    longSetSearchData(data, searchLongData.city, searchLongData.chooseType);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 3]; //上一个页面
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData(
      {
        isBack: true
      },
      () => {
        wx.navigateBack({
          delta: 2
        });
      }
    );
  },

  /**返回上一级 */
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  clearInput() {
    this.setData(
      {
        isfocus: false
      },
      () => {
        this.setData({ value: "", hasAsked: false });
      }
    );
  },

  onLoad: function() {},

  onReady: function() {
    this.promiseVersion = 0;
  },

  onShow: function() {
    let history = wx.getStorageSync("positionSearchHistory") || [];
    this.setData({
      history
    });
  },

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function() {}
});
