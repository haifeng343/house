import positionService from './service';

const typeEnum = {
  10: "area",
  20: "subway"
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
      subway: {
        data: [],
        name: '地铁',
        type:5
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

  handleSelectCityByPosition(event) {
    let position = event.currentTarget.dataset.item.name;
    let cityName = event.currentTarget.dataset.item.cityName;
    let type = event.currentTarget.dataset.item.type;
    let line = event.currentTarget.dataset.item.line;
    let fullName = `${cityName}_${position}_${type}`;
    if (line) {
      fullName += `_${line}`
    }
    const app = getApp();
    this.service.getPositionInfoByName(fullName).then(resp => {
      let data = resp.data || '';
      // 已隐藏
      if (!data) {
        return true
      }
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
    }).then((msg) => {
      if(msg) {
        console.log('该数据已隐藏', position)
        var history = this.data.history
        for(var index = 0; index < history.length; index++) {
          if (history[index].name == position) {
            history.splice(index, 1)
            break
          }
        }
        this.setData({ history })
        var positionSearchHistory = wx.getStorageSync('positionSearchHistory')
        for (var temp = 0; temp < positionSearchHistory.length; temp++) {
          if (positionSearchHistory[temp].name == position) {
            positionSearchHistory.splice(temp, 1)
            break
          }
        }
        wx.setStorageSync('positionSearchHistory', positionSearchHistory)
        var citySearchHistory = wx.getStorageSync('citySearchHistory')
        for (var temp2 = 0; temp2 < citySearchHistory.length; temp2++) {
          if (citySearchHistory[temp2].name == position) {
            citySearchHistory.splice(temp2, 1)
            break
          }
        }
        wx.setStorageSync('citySearchHistory', citySearchHistory)
        wx.showToast({
          title: '该地点已不存在',
          icon: 'none',
          duration: 2000
        })
        return
      }
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
      url: '../housingLongSearch/index'
    })
  },
  onLoad: function (options) {
    const { city } = options;
    const app = getApp()
    let history = wx.getStorageSync('positionSearchHistory') || [];
    this.setData({
      history: history.reverse()
    });
    let list = this.data.list
    wx.showLoading({
      title: '加载中',
      mask: true
    });
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
  }
})