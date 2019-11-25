// pages/citySelect/citySelect.js
import { getLocationSetting, getLocation } from "../../utils/wx";
import { getLocationInfo } from "../../utils/map";
import CitySelectService from "./service";

const specialCity = [
  "香港",
  "澳门",
  "台北",
  "高雄",
  "台中",
  "花莲",
  "台南",
  "马祖"
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
        label: "国内",
        value: 0
      },
      {
        label: "海外",
        value: 1
      }
    ],
    userCity: {
      name: "定位中...",
      code: ""
    },
    viewIndex: "",
    indexList: [
      "#",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "W",
      "X",
      "Y",
      "Z"
    ]
  },
  service: new CitySelectService(),
  clearHistory() {
    wx.setStorageSync("citySearchHistory", []);
    this.setData({ history: [] });
  },
  getCityList() {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    this.service.indexParam().then(resp => {
      let data = resp.data.fddHotCity.split(",");
      let hot = [];
      data.map(item => {
        hot.push({
          name: item
        });
      });
      this.setData({ hot });
    });
    if (this.data.currentTabValue === 0) {
      return this.service.getCityList().then(resp => {
        wx.hideLoading();
        this.formatData(resp.data);
      });
    } else {
      return this.service.getForeignCityList().then(resp => {
        wx.hideLoading();
        this.formatData(resp.data);
      });
    }
  },
  formatData(data) {
    var pl = [];
    this.data.indexList.forEach((item, index) => {
      if (item != "#") {
        pl.push({
          p: item,
          cl: []
        });
      }
    });
    for (const item of data) {
      let firstLetter = item.pyName[0].toUpperCase();
      for (const py of pl) {
        if (py.p == firstLetter) {
          py.cl.push(item);
          break;
        }
      }
    }

    this.setData({ data: pl }, () => {
      this.getUserLocation();
      this.setData({
        viewIndex: ""
      });
    });
  },
  handleSelectCityByName(event) {
    let data = event.currentTarget.dataset;
    let name = data.name || data.item.name;
    if (!name || name == "定位失败") {
      return;
    }
    const type = specialCity.includes(name) ? 1 : this.data.currentTabValue;
    const app = getApp();
    this.service.getCityInfo(name, type).then(resp => {
      var cityItem = resp.data[0];
      let cityJson = JSON.parse(cityItem.json);
      app.globalData.searchData.city = cityJson.name;
      app.globalData.searchData.cityId = {};
      app.globalData.searchData.cityType = type;
      app.globalData.searchData.area = "";
      app.globalData.searchData.areaId = {};
      app.globalData.searchData.areaType = type;
      app.globalData.monitorSearchData.city = cityJson.name;
      app.globalData.monitorSearchData.cityId = {};
      app.globalData.monitorSearchData.cityType = type;
      app.globalData.monitorSearchData.area = "";
      app.globalData.monitorSearchData.areaId = {};
      app.globalData.monitorSearchData.areaType = "";
      for (const key in cityJson) {
        if (key === "mn") {
          app.globalData.searchData.cityId[key] = cityJson[key].city_id;
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].city_id;
        } else if (key === "xz") {
          app.globalData.searchData.cityId[key] = cityJson[key].cityId;
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].cityId;
        } else if (key === "tj") {
          app.globalData.searchData.cityId[key] = cityJson[key].id;
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].id;
        } else if (key === "zg") {
          app.globalData.searchData.cityId[key] = cityJson[key].id;
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].id;
        }
      }
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面

      //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
      prevPage.setData(
        {
          isBack: true
        },
        () => {
          wx.navigateBack({
            delta: 1
          });
        }
      );
    });
  },
  handleSelectCityByPosition(event) {
    let position = event.currentTarget.dataset.item.name;
    let cityName = event.currentTarget.dataset.item.cityName;
    let type = event.currentTarget.dataset.item.type;
    let line = event.currentTarget.dataset.item.line;
    let fullName = `${cityName}_${position}_${type}`;
    if (line) {
      fullName += `_${line}`;
    }
    const app = getApp();
    this.service
      .getPositionInfoByName(fullName)
      .then(resp => {
        let data = resp.data || "";
        // 已隐藏
        if (!data) {
          return true;
        }
        let info = JSON.parse(resp.data.json);
        if (type == 16) {
          //行政区  只有areaid
          app.globalData.searchData.areaId = {
            mn: info.mn && info.mn.area_id,
            tj: info.tj && info.tj.value,
            xz: info.xz && info.xz.id,
            zg: info.zg && info.zg.id
          };
          app.globalData.monitorSearchData.areaId = {
            mn: info.mn && info.mn.area_id,
            tj: info.tj && info.tj.value,
            xz: info.xz && info.xz.id,
            zg: info.zg && info.zg.id
          };
        } else {
          app.globalData.searchData.ltude = {
            mn: info.mn && info.mn.lat + "," + info.mn.lng,
            tj: info.tj && info.tj.latitude + "," + info.tj.longitude,
            xz: info.xz && info.xz.latitude + "," + info.xz.longitude,
            zg: info.zg && info.zg.latitude + "," + info.zg.longitude
          };
          app.globalData.searchData.areaId = {
            mn: info.mn && info.mn.id,
            tj: info.tj && info.tj.value,
            xz: info.xz && info.xz.id,
            zg: info.zg && info.zg.id
          };
          app.globalData.monitorSearchData.ltude = {
            mn: info.mn && info.mn.lat + "," + info.mn.lng,
            tj: info.tj && info.tj.latitude + "," + info.tj.longitude,
            xz: info.xz && info.xz.latitude + "," + info.xz.longitude,
            zg: info.zg && info.zg.latitude + "," + info.zg.longitude
          };
          app.globalData.monitorSearchData.areaId = {
            mn: info.mn && info.mn.id,
            tj: info.tj && info.tj.value,
            xz: info.xz && info.xz.id,
            zg: info.zg && info.zg.id
          };
        }
        app.globalData.searchData.area = info.name;
        app.globalData.searchData.areaType = type;
        app.globalData.monitorSearchData.area = info.name;
        app.globalData.monitorSearchData.areaType = type;
      })
      .then(msg => {
        if (msg) {
          console.log("该数据已隐藏", position);
          var history = this.data.history;
          for (var index = 0; index < history.length; index++) {
            if (history[index].name == position) {
              history.splice(index, 1);
              break;
            }
          }
          this.setData({ history });
          var positionSearchHistory = wx.getStorageSync(
            "positionSearchHistory"
          );
          for (var temp = 0; temp < positionSearchHistory.length; temp++) {
            if (positionSearchHistory[temp].name == position) {
              positionSearchHistory.splice(temp, 1);
              break;
            }
          }
          wx.setStorageSync("positionSearchHistory", positionSearchHistory);
          var citySearchHistory = wx.getStorageSync("citySearchHistory");
          for (var temp2 = 0; temp2 < citySearchHistory.length; temp2++) {
            if (citySearchHistory[temp2].name == position) {
              citySearchHistory.splice(temp2, 1);
              break;
            }
          }
          wx.setStorageSync("citySearchHistory", citySearchHistory);
          wx.showToast({
            title: "该地点已不存在",
            icon: "none",
            duration: 2000
          });
          return;
        }
        const type = specialCity.includes(cityName) ? 1 : 0;
        this.service.getCityInfo(cityName, type).then(resp => {
          var cityItem = resp.data[0];
          let cityJson = JSON.parse(cityItem.json);
          app.globalData.searchData.city = cityJson.name;
          app.globalData.searchData.cityId = {};
          app.globalData.searchData.cityType = type;
          app.globalData.monitorSearchData.city = cityJson.name;
          app.globalData.monitorSearchData.cityId = {};
          app.globalData.monitorSearchData.cityType = type;
          for (const key in cityJson) {
            if (key === "mn") {
              app.globalData.searchData.cityId[key] = cityJson[key].city_id;
              app.globalData.monitorSearchData.cityId[key] =
                cityJson[key].city_id;
            } else if (key === "xz") {
              app.globalData.searchData.cityId[key] = cityJson[key].cityId;
              app.globalData.monitorSearchData.cityId[key] =
                cityJson[key].cityId;
            } else if (key === "tj") {
              app.globalData.searchData.cityId[key] = cityJson[key].id;
              app.globalData.monitorSearchData.cityId[key] = cityJson[key].id;
            } else if (key === "zg") {
              app.globalData.searchData.cityId[key] = cityJson[key].id;
              app.globalData.monitorSearchData.cityId[key] = cityJson[key].id;
            }
          }

          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面

          //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
          prevPage.setData(
            {
              isBack: true
            },
            () => {
              wx.navigateBack({
                delta: 1
              });
            }
          );
        });
      });
  },

  handleSelectCity(event) {
    const cityName = event.currentTarget.dataset.name;
    const app = getApp();
    const type = specialCity.includes(cityName) ? 1 : this.data.currentTabValue;
    this.service.getCityInfo(cityName, type).then(resp => {
      var cityItem = resp.data[0];
      let cityJson = JSON.parse(cityItem.json);
      if (app.globalData.searchData.city !== cityItem.name) {
        app.globalData.searchData.areaId = undefined;
        app.globalData.searchData.ltude = undefined;
        app.globalData.searchData.area = undefined;
        app.globalData.searchData.areaType = undefined;
      }
      if (app.globalData.monitorSearchData.city !== cityItem.name) {
        app.globalData.monitorSearchData.areaId = undefined;
        app.globalData.monitorSearchData.ltude = undefined;
        app.globalData.monitorSearchData.area = undefined;
        app.globalData.monitorSearchData.areaType = undefined;
      }
      app.globalData.searchData.city = cityItem.name;
      app.globalData.searchData.cityId = {};
      app.globalData.searchData.citytype = type;
      app.globalData.monitorSearchData.city = cityItem.name;
      app.globalData.monitorSearchData.cityId = {};
      app.globalData.monitorSearchData.citytype = type;
      for (const key in cityJson) {
        if (key === "mn") {
          app.globalData.searchData.cityId[key] = cityJson[key].city_id;
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].city_id;
        } else if (key === "xz") {
          app.globalData.searchData.cityId[key] = cityJson[key].cityId;
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].cityId;
        } else if (key === "tj") {
          app.globalData.searchData.cityId[key] = cityJson[key].id;
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].id;
        } else if (key === "zg") {
          app.globalData.searchData.cityId[key] = cityJson[key].id;
          app.globalData.monitorSearchData.cityId[key] = cityJson[key].id;
        }
      }

      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面

      //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
      prevPage.setData(
        {
          isBack: true
        },
        () => {
          wx.navigateBack({
            delta: 1
          });
        }
      );
    });
  },
  handleSelectCityHistory(event) {
    let isCity = event.currentTarget.dataset.item.isCity;
    if (isCity) {
      this.handleSelectCityByName(event);
    } else {
      this.handleSelectCityByPosition(event);
    }
  },

  handleChangeTab(event) {
    let tabItem = event.currentTarget.dataset.item;

    this.setData({ currentTabValue: tabItem.value }, () => {
      this.getCityList();
    });
  },

  getUserLocation() {
    getLocationSetting()
      .then(_ => getLocation())
      .then(location => this.calcCityByLocation(location))
      .catch(_ => {
        console.error("获取定位授权失败啦~");
        wx.showToast({
          title: "为了更好的使用效果，请同意地理位置信息授权",
          icon: "none"
        });
        this.calcCityByLocation();
      });
  },

  calcCityByLocation(location) {
    const userCity = {
      name: "定位失败",
      code: ""
    };
    if (location) {
      getLocationInfo(location).then(resp => {
        const city = resp.result.address_component.city;
        if (city) {
          for (const pl of this.data.data) {
            const cityInfo = pl.cl.find(cl => city.includes(cl.name));
            if (cityInfo) {
              userCity.name = cityInfo.name;
              userCity.code = cityInfo.pyName.toUpperCase();
              this.setData({ userCity });
              break;
            }
          }
        }
      });
    } else {
      this.setData({ userCity });
    }
  },

  handleRepos() {
    this.setData({
      userCity: {
        name: "定位中...",
        code: ""
      }
    });
    this.getUserLocation();
  },

  handleScrollToIndex(event) {
    let item = event.currentTarget.dataset.item;
    if (item === "#") {
      this.setData({ viewIndex: "topview" });
    } else {
      this.setData({ viewIndex: `city${item}` });
    }
  },

  gotoSearch() {
    wx.navigateTo({
      url: "../citySearch/citySearch?type=city"
    });
  },
  onLoad: function() {
    this.getCityList();
    let history = wx.getStorageSync("citySearchHistory") || [];
    this.setData({
      history: history.reverse()
    });
  }
});
