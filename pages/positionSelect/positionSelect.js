import positionService from './service';

const typeEnum = {
  11: "secnic",
  12: "highschool",
  13: "airport",
  14: "hospital",
  15: "buiness",
  16: "area",
  17: "subway",
  18: "airport",
};
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
    list: {
      area: {
        data: [],
        name: '行政',
        type:1
      },
      secnic: {
        data: [],
        name: '景点',
        type:2
      },
      airport: {
        data: [],
        name: '机场/车站',
        type:3
      },
      hospital: {
        data: [],
        name: '医院',
        type:4
      },
      subway: {
        data: [],
        name: '地铁',
        type:5
      },
      highschool: {
        data: [],
        name: '高校',
        type:5
      },
      buiness: {
        data: [],
        name: '商圈',
        type:6
      }
    },
    isScroll: false,
    singleItemHeight: 0,
  },
  service: new positionService(),

  clearHistory() {
    wx.setStorageSync('positionSearchHistory', [])
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

  handleSelectCityHistory(event) {
    let isCity = event.currentTarget.dataset.item.isCity;
    if (isCity) {
      this.handleSelectCityByName(event);
    } else {
      this.handleSelectCityByPosition(event);
    }
  },

  handleSelectCityByName(event) {
    let data = event.currentTarget.dataset;
    let name = data.item.name;
    const type = specialCity.includes(name) ? 1 : 0;
    const app = getApp()
    this.service.getCityInfo(name, type).then(resp => {
      var cityItem = resp.data[0];
      let cityJson = JSON.parse(cityItem.json)
      app.globalData.searchData.city = cityJson.name;
      app.globalData.searchData.cityId = {};
      app.globalData.searchData.cityType = type;
      app.globalData.searchData.area = '';
      app.globalData.searchData.areaId = {};
      app.globalData.searchData.areaType = type;
      app.globalData.monitorSearchData.city = cityJson.name;
      app.globalData.monitorSearchData.cityId = {};
      app.globalData.monitorSearchData.cityType = type;
      app.globalData.monitorSearchData.area = '';
      app.globalData.monitorSearchData.areaId = {};
      app.globalData.monitorSearchData.areaType = '';
      for (const key in cityJson) {
        if (key === 'mn') {
          app.globalData.searchData.cityId[key] = cityJson[key].city_id
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].city_id
        } else if (key === 'xz') {
          app.globalData.searchData.cityId[key] = cityJson[key].cityId
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].cityId
        } else if (key === 'tj') {
          app.globalData.searchData.cityId[key] = cityJson[key].id
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].id
        } else if (key === 'zg') {
          app.globalData.searchData.cityId[key] = cityJson[key].id
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].id
        }
      }
    }).catch(error => {
      console.error(error);
    });

  },
  handleSelectCityByPosition(event) {

    let position = event.currentTarget.dataset.item.name;
    let cityName = event.currentTarget.dataset.item.cityName;
    let type = event.currentTarget.dataset.item.type;
    let fullName = `${cityName}_${position}_${type}`;
    const app = getApp();
    this.service.getPositionInfoByName(fullName).then(resp => {
      let data = resp.data;
      let info = JSON.parse(resp.data.json);
      if (type == 16) {//行政区  只有areaid
        app.globalData.searchData.areaId = {
          mn: info.mn && info.mn.area_id,
          tj: info.tj && info.tj.value,
          xz: info.xz && info.xz.id,
          zg: info.zg && info.zg.id
        }
        app.globalData.monitorSearchData.areaId = {
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
        app.globalData.monitorSearchData.ltude = {
          mn: info.mn && (info.mn.lat + ',' + info.mn.lng),
          tj: info.tj && (info.tj.latitude + ',' + info.tj.longitude),
          xz: info.xz && (info.xz.latitude + ',' + info.xz.longitude),
          zg: info.zg && (info.zg.latitude + ',' + info.zg.longitude)
        }
        app.globalData.monitorSearchData.areaId = {
          mn: info.mn && (info.mn.id),
          tj: info.tj && (info.tj.value),
          xz: info.xz && (info.xz.id),
          zg: info.zg && (info.zg.id)
        }
      }
      app.globalData.searchData.area = info.name;
      app.globalData.searchData.areaType = type;
      app.globalData.monitorSearchData.area = info.name;
      app.globalData.monitorSearchData.areaType = type;
    }).then(() => {
      const type = specialCity.includes(cityName) ? 1 : 0;
      this.service.getCityInfo(cityName, type).then(resp => {
        var cityItem = resp.data[0];
        let cityJson = JSON.parse(cityItem.json)
        app.globalData.searchData.city = cityJson.name;
        app.globalData.searchData.cityId = {};
        app.globalData.searchData.cityType = type;
        app.globalData.monitorSearchData.city = cityJson.name;
        app.globalData.monitorSearchData.cityId = {};
        app.globalData.monitorSearchData.cityType = type;
        for (const key in cityJson) {
          if (key === 'mn') {
            app.globalData.searchData.cityId[key] = cityJson[key].city_id
            app.globalData.monitorSearchData.cityId[key] = cityJson[key].city_id
          } else if (key === 'xz') {
            app.globalData.searchData.cityId[key] = cityJson[key].cityId
            app.globalData.monitorSearchData.cityId[key] = cityJson[key].cityId
          } else if (key === 'tj') {
            app.globalData.searchData.cityId[key] = cityJson[key].id
            app.globalData.monitorSearchData.cityId[key] = cityJson[key].id
          } else if (key === 'zg') {
            app.globalData.searchData.cityId[key] = cityJson[key].id
            app.globalData.monitorSearchData.cityId[key] = cityJson[key].id
          }
        }

        wx.navigateBack({ delta: 1 });
      });
    }).catch(error => {
      console.error(error);
    });

  },
  gotoSearch() {
    wx.navigateTo({
      url: '../housingSearch/housingSearch'
    })
  },
  onLoad: function (options) {
    const { city } = options;
    let history = wx.getStorageSync('positionSearchHistory') || [];
    this.setData({
      history: history.reverse()
    });
    let list = this.data.list
    this.service.getPositionList(city).then(resp => {
      let data = resp.data;
      for (const item of data) {
        let info = item.split('_');
        let name = info[1];
        let type = info[2];
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
  }
})