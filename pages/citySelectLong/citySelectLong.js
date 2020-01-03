// pages/citySelect/citySelect.js
import { getLocationSetting, getLocation } from '../../utils/wx';
import { getLocationInfo } from '../../utils/map';
import CitySelectService from './service';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    userCity: {
      name: '定位中...',
      item:{}
    },
    isSecond: false, //是否为二手房 ，true为是
  },
  service: new CitySelectService(),
  getCityList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    return this.service.getCityList().then(resp => {
      wx.hideLoading();
      wx.showToast({title:'',icon:'none',duration:1});
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
    if (!cityItem.name) {
      return
    }
    const app = getApp()
    let data = {}
    let name = cityItem.name
    let cityJson = JSON.parse(cityItem.json)
    let cityId = {}
    data.city = cityItem.name
    data.cityJson = cityItem.json
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
    data.cityId = cityId
    data.area = ''
    data.areaId = {}
    data.areaType = 0
    data.areaJson = ''
    app.globalData.searchLongData = { ...app.globalData.searchLongData, ...data}
    app.globalData.secondSearchData = { ...app.globalData.secondSearchData, ...data}

    //搜索城市历史(长租)
    let history = {}
    history.city = data.city
    history.cityId = data.cityId
    history.cityJson = data.cityJson
    wx.setStorageSync('searchLongCityHistory', history)

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
  onLoad: function(options) {
    this.getCityList();
    if (options.isSecond) {
      this.setData({
        isSecond: true
      })
      wx.setNavigationBarTitle({
        title: '二手房-城市选择'
      })
    }
  }
});
