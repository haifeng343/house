// pages/housingSearch/housingSearch.js

import SearchService from './service';


const service = new SearchService();

const specialCity = [
];

const typeEnum = {
  11: "景区",
  12: "高校",
  13: "机场",
  14: "医院",
  15: "商圈",
  16: "行政区",
  17: "地铁",
  18: "车站",
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: {},
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
    console.log(event);
    this.setData({
      value: event.detail.value
    })
    if (event.detail.value.length > 1) {
      this.handleSearch()
    }
  },
  handleSearch() {
    var app = getApp();
    console.log('app',app);
    this.setData({
      hasAsked: false
    })
    if (this.data.value.length < 2) {
      this.setData({
        result: {},
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
    this.service.doSearch(this.data.value, app.globalData.searchData.city||'').then(result => {
      wx.hideLoading();
      this.formatResult(result.data)
      let length = Object.keys(result.data).length
      this.setData({
        hasAsked: true,
        resultLength: length
      })
    }).then(() => {
      this.submitFlag = false;
      wx.hideLoading();
    }).catch(error => {
      this.submitFlag = false;
      wx.showToast({
        title: '网络异常',
        icon: 'none'
      });
    });
  },

  handleSelectCity(event) {
    let cityItem = event.currentTarget.dataset.item;
    if (cityItem.canSelect === false) {
      return;
    }
    const app = getApp();
    const { name } = cityItem;
    const type = specialCity.includes(name) || cityItem.isForeign === true ? 1 : 0;
    this.service.getCityInfo(name, type).then(resp => {
      var cityItem = resp.data[0];
      if (!cityItem) {
        wx.showToast('')
      }
      let cityJson = JSON.parse(cityItem.json)
      let searchData = app.globalData.searchData
      searchData.city = cityJson.name
      searchData.cityId = {}
      searchData.cityType = type
      searchData.area = ''
      searchData.areaId = {}
      searchData.areaType = type
      for (const key in cityJson) {
        if (key === 'mn') {
          searchData.cityId[key] = cityJson[key].city_id
        } else if (key === 'xz') {
          searchData.cityId[key] = cityJson[key].cityId
        } else if (key === 'tj') {
          searchData.cityId[key] = cityJson[key].id
        } else if (key === 'zg') {
          searchData.cityId[key] = cityJson[key].id
        }
      }
      let hasDiff = false;
      this.data.history.map((item) => {
        if (item.name === name && item.type === type) {
          hasDiff = true;
        }
      });
      if (!hasDiff) {
        this.data.history.push({
          isCity: 1,
          type: type,
          name: name,
          cityName: name
        });
      }
      this.setData({
        history: this.data.history
      }, () => {
        let history = [];
        if (this.data.history.length > 10) {
          history = this.data.history.slice(length - 10, length - 1);
        } else {
          history = this.data.history;
        }
        
        wx.setStorageSync('positionSearchHistory', history);
 
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
      })
    });

  },
  handleSelectCityPosition(event) {
    let position = event.currentTarget.dataset.item;
    let tempArray = position.split('_')
    if (tempArray[2]=='17') {
      let itemArray = tempArray[1].split('(')
      position = tempArray[0] + '_' + itemArray[0] + '_' + tempArray[2]
      if (itemArray[1]) {
        position += '_' + itemArray[1].split(')')[0]
      }
    }
    if (position.canSelect === false) {
      return;
    }
    const app = getApp();
    this.service.getPositionInfoByName(position).then(resp => {
      let data = resp.data;
      let info = JSON.parse(resp.data.json);
      let type = position.split("_")[2];
      let cityName = position.split("_")[0];
      let line = position.split("_")[3]
      if (type == 16) {//行政区  只有areaid
        app.globalData.searchData.areaId = {
          mn: info.mn && info.mn.area_id,
          tj: info.tj && info.tj.value,
          xz: info.xz && info.xz.id,
          zg: info.zg && info.zg.id
        }
      } else {
        app.globalData.searchData.ltude = {
          mn: info.mn && (info.mn.lat + ',' + info.mn.lng),
          tj: info.tj && (info.tj.latitude + ',' + info.tj.longitude),
          xz: info.xz && (info.xz.latitude + ',' + info.xz.longitude),
          zg: info.zg && (info.zg.latitude + ',' + info.zg.longitude)
        }
        app.globalData.searchData.areaId = {
          mn: info.mn && (info.mn.id),
          tj: info.tj && (info.tj.value),
          xz: info.xz && (info.xz.id),
          zg: info.zg && (info.zg.id)
        }
      }
      app.globalData.searchData.area = info.name
      app.globalData.searchData.areaType = type
      let hasDiff = false;
      this.data.history.map((item) => {
        if (item.name === info.name && item.type === type && item.cityName === cityName && !!item.line == !!line) {
          hasDiff = true;
        }
      });
      if (!hasDiff) {
        this.data.history.push({
          isCity: 0,
          type: type,
          name: info.name,
          cityName,
          line
        });
      }
      this.setData({
        history: this.data.history
      }, () => {
        let history = [];
        if (this.data.history.length > 10) {
          history = this.data.history.slice(0, 9);
        } else {
          history = this.data.history;
        }

        wx.setStorageSync('positionSearchHistory', history);
      
      });
    }).then(() => {
      let city = position.split("_")[0];
      const type = specialCity.includes(city) ? 1 : 0;;
      this.service.getCityInfo(city, type).then(resp => {
        var cityItem = resp.data[0];
        let cityJson = JSON.parse(cityItem.json)
        app.globalData.searchData.city = cityJson.name
        app.globalData.searchData.cityId = {}
        app.globalData.searchData.cityType = type
        for (const key in cityJson) {
          if (key === 'mn') {
            app.globalData.searchData.cityId[key] = cityJson[key].city_id
          } else if (key === 'xz') {
            app.globalData.searchData.cityId[key] = cityJson[key].cityId
          } else if (key === 'tj') {
            app.globalData.searchData.cityId[key] = cityJson[key].id
          } else if (key === 'zg') {
            app.globalData.searchData.cityId[key] = cityJson[key].id
          }
        }
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
      });
    })

  },
  formatResult(data) {
    let result = {}
    for (const item of data) {
      let info = item.split('_');
      let cityName = info[0];
      let position = info[1];
      let type = info[2];
      let lineName = info[3];
      if (!result[cityName]) {
        result[cityName] = {}
        result[cityName].typeName = '城市';
        result[cityName].name = cityName;
        result[cityName].children = [];
      }
      if (lineName && type == 17) {
        position = `${position}(${lineName})`;
      }
      result[cityName].children.push({
        typeName: typeEnum[type],
        position,
        type: type
      });
    }
    this.setData({ result })
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

  onShow: function () {
    let history = wx.getStorageSync('positionSearchHistory') || [];
    this.setData({
      history
    })
  }
})