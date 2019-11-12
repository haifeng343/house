// pages/citySelect/citySelect.js
import { getLocationSetting, getLocation } from '../../utils/wx';
import { getLocationInfo } from '../../utils/map';
import CitySelectService from './service';

const specialCity = [
  '香港',
  '澳门',
  '台北',
  '高雄',
  '台中',
  '花莲',
  '台南',
  '马祖'
];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    data: [],
    hot: [],
    searchList: [],
    currentTabValue: 0,
    tabList: [
      {
        label: '国内',
        value: 0
      },
      {
        label: '海外',
        value: 1
      }
    ],
    userCity: {
      name: '定位中...',
      item:{}
    }
  },
  service: new CitySelectService(),
  getCityList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    return this.service.getCityList().then(resp => {
      wx.hideLoading();
      this.formatData(resp.data);
    });
  },
  formatData(data) {
    this.setData({ data: data }, () => {
      this.getUserLocation();
    });
  },

  handleSelectCity(event) {
    let cityItem = event.currentTarget.dataset.item
    const app = getApp()
    let searchLongData = app.globalData.searchLongData
    let name = cityItem.name
    let cityJson = JSON.parse(cityItem.json)
    let cityId = {}
    searchLongData.city = cityItem.name
    searchLongData.cityJson = cityItem.json
    for (const key in cityJson) {
      if (key === 'wiwj') {
        cityId[key] = cityJson[key].id
      } else if (key === 'tc') {
        cityId[key] = cityJson[key].dirname
      } else if (key === 'lj') {
        cityId[key] = cityJson[key].city_id
      } else if (key === 'ftx') {
        cityId[key] = cityJson[key]
      }
    }
    searchLongData.cityId = cityId
    wx.navigateBack({
      delta: 1
    });
  },

  getUserLocation() {
    getLocationSetting()
      .then(_ => getLocation())
      .then(location => this.calcCityByLocation(location))
      .catch(_ => {
        console.error('获取定位授权失败啦~');
        wx.showToast({
          title: '为了更好的使用效果，请同意地理位置信息授权',
          icon: 'none'
        });
        this.calcCityByLocation();
      });
  },

  calcCityByLocation(location) {
    const userCity = {
      name: '定位失败',
      item:{}
    };
    if (location) {
      getLocationInfo(location).then(resp => {
        const city = resp.result.address_component.city;
        if (city) {
          for (const pl of this.data.data) {
            const cityInfo = city.indexOf(pl.name)
            if (cityInfo>-1) {
              userCity.name = pl.name
              userCity.item = pl
              this.setData({ userCity });
              return;
            }
          }
          userCity.name = '定位城市暂无服务'
          userCity.item = {}
          this.setData({ userCity });
        }
      });
    } else {
      this.setData({ userCity });
    }
  },

  handleRepos() {
    this.setData({
      userCity: {
        name: '定位中...',
        item:{}
      }
    });
    this.getUserLocation();
  },
  onLoad: function() {
    this.getCityList();
    let history = wx.getStorageSync('citySearchHistory') || [];
    this.setData({
      history: history.reverse()
    });
  }
});
