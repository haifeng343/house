import { getLocationSetting, getLocation, getSessionKey } from "../../utils/wx";
import { authSubject } from "../../utils/auth";
import { SearchDataSubject } from "../../utils/searchDataStream";
import {
  SearchLongDataSubject,
  SearchLongMonitorDataSubject
} from "../../utils/searchLongDataStream";
import {
  SearchSecondDataSubject,
  SearchSecondMonitorDataSubject
} from "../../utils/searchSecondDataStream";
import { getLocationInfo } from "../../utils/map";
import searchService from "./service";
import fecha from "../../utils/fecha";
import { searchDataStorage } from "../../utils/searchDataStorage";
import { searchLongDataStorage } from "../../utils/searchLongDataStorage";
import { searchSecondDataStorage } from "../../utils/searchSecondDataStorage";
import getIndexHouseData from "../../utils/indexHouseData";
import getIndexLongHouseData from "../../utils/indexLongHouseData";
import getIndexSecondHouseData from "../../utils/indexSecondHouseData";
import { changeHistoryStorage } from "../../utils/longSetSearchData";
import { tujia, xiaozhu, muniao, zhenguo, wiwj, lianjia, wbtc, ftx } from "../../api/informationData.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        url: "../../assets/image/index/banner.png",
        id: 0
      }
    ],
    couponList: [],
    showCouponDialog: false,
    hotCity: "",
    hotarea: "",
    hotareaType: "",
    spread: false,
    cityText: "手动定位",
    cityText2: "手动定位",
    houseType: {},
    leaseType: {},
    priceType: {
      "0": 0,
      "1": 200,
      "2": 300,
      "3": 400,
      "4": 500,
      "5": 600,
      "6": 99999
    },
    equipments: {},
    sortType: {},
    submitFlag: false,
    showAuthDialog: false,
    isAuth: false,
    priceText: "不限",
    beginDate: "",
    endDate: "",
    showPriceBlock: false,
    showLongPriceBlock: false,
    showSecondPriceBlock: false,
    searchData: {
      cityType: "",
      area: "",
      areaId: {},
      ltude: {},
      areaType: "",
      city: "", //城市名
      cityId: {}, //城市ID
      beginDate: "", //开始日期
      endDate: "", //离开日期
      dayCount: 0,
      gueseNumber: -1, //入住人数
      leaseType: "", //房间类型  1单间 2整租 不选择''
      houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0, //最低价
      maxPrice: 99999, //最高价s
      sort: 1, //搜索方式 1推荐 2低价有限
      equipment: []
    },
    searchLongData: {
      chooseType: 1, //1品牌中介，2个人房源
      city: "", //城市名
      cityId: {}, //城市ID
      cityJson: "",
      area: "",
      areaId: {}, //地点标识
      areaType: "", //地点类型
      areaJson: {}, //经纬度
      longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
      longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
      longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
      minPrice: 0, //最低价
      maxPrice: 5500 //最高价
    },
    secondSearchData: {
      city: "", //城市名
      cityId: {}, //城市ID
      cityJson: "",
      area: "", // 地点
      areaId: {}, //地点标识
      areaType: 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
      areaJson: "", //json
      minPrice: "", //最低价
      maxPrice: "", //最高价 不限"9999"
      minArea: 0, //最低面积
      maxArea: 90, //最高面积 上限150
      secondHouseDecorationMap: [], //装修  1: 毛坯房 2: 普通装修 3: 精装修
      secondHouseTagMap: [], //房源特色 1: 满二 2: 满五 3: 近地铁 4: 随时看房 5: VR房源 6: 新上房源
      secondHouseUseMap: [], //用途 1: 普通住宅 2: 别墅 3: 其他
      secondLayoutMap: [], //户型 1: 一室 2: 二室 3: 三室 4: 四室 12: 四室以上
      secondSortTypeMap: 0, //房源偏好 1: 低总价优先 2: 低单价优先
    },
    allLongData: {
      longRentTypes: [],
      longSortTypes: []
    },
    allSecondData: {
      secondLayoutMap: [],
      secondSortTypeMap: []
    },
    searchLongList: [],
    needOnShow: false,
    tabIndex: 2, //1短租，2长租，3二手房
    secondFocus: true,
    showTipChangDialog:false,//长租的tips提示
    showTipSecondDialog:false,//长租的tips提示
  },

  service: new searchService(),
  submitFlag: false,
  searchDataSubscription: null,
  authSubscription: null,

  goCitySelect() {
    wx.navigateTo({
      url: "../citySelect/citySelect"
    });
  },
  goCitySelectLong() {
    if (this.data.tabIndex === 2) {
      wx.navigateTo({
        url: "../citySelectLong/citySelectLong"
      });
    }
    if (this.data.tabIndex === 3) {
      wx.navigateTo({
        url: "../citySelectLong/citySelectLong?isSecond=1"
      });
    }
  },
  goDays() {
    wx.navigateTo({
      url: "../days/days"
    });
  },
  goPeopleNumber() {
    wx.navigateTo({
      url: "../peopleNumber/peopleNumber"
    });
  },
  goPositionSelect() {
    if (this.data.tabIndex === 1) {
      wx.navigateTo({
        url:
          "../positionSelect/positionSelect?city=" + this.data.searchData.city
      });
    } else if (this.data.tabIndex === 2) {
      wx.navigateTo({
        url:
          "../positionLongSelect/positionLongSelect?city=" +
          this.data.searchLongData.city
      });
    } else if (this.data.tabIndex === 3) {
      wx.navigateTo({
        url:
          "../positionLongSelect/positionLongSelect?city=" +
          this.data.searchLongData.city + "&isSecond=1"
      });
    }
  },
  changeSort() {
    let searchData = this.data.searchData;
    let sort = searchData.sort;
    if(sort === 1) {
        searchData.sort = 2;
        searchData.advSort = 2;
    }else {
        searchData.sort = 1;
        searchData.advSort = 1;
    }
    this.setData({
      searchData: this.data.searchData
    });
  },
  selectLeaseType(event) {
    let index = event.currentTarget.dataset.index;
    let searchData = this.data.searchData;
    if (searchData.leaseType === index) {
      searchData.leaseType = "";
    } else {
      searchData.leaseType = index;
    }

    this.setData({
      searchData
    });
  },
  selectHouseType(event) {
    let index = event.currentTarget.dataset.index;
    let searchData = this.data.searchData;
    let isIndexOf = searchData.houseType.indexOf(index);
    if (isIndexOf >= 0) {
      searchData.houseType.splice(isIndexOf, 1);
    } else {
      searchData.houseType.push(index);
    }
    this.setData({
      searchData
    });
  },

  selectEquipments(event) {
    let index = event.currentTarget.dataset.index;
    let searchData = this.data.searchData;
    let isIndexOf = searchData.equipment.indexOf(index);
    if (isIndexOf >= 0) {
      searchData.equipment.splice(isIndexOf, 1);
    } else {
      searchData.equipment.push(index);
    }
    this.setData({
      searchData
    });
  },
  slideOption() {
    let spread = this.data.spread;
    this.setData({ spread: !spread });
  },
  changePrice(price) {
    let searchData = this.data.searchData;
    searchData.minPrice = this.data.priceType[price.detail.min];
    searchData.maxPrice = this.data.priceType[price.detail.max];
    let length = 0;
    for (const key in this.data.priceType) {
      length++;
    }
    let priceText = "";
    if (price.detail.min === 0 && price.detail.max >= length - 1) {
      priceText = "不限";
    } else if (price.detail.min !== 0 && price.detail.max === length - 1) {
      priceText = "￥" + this.data.priceType[price.detail.min] + "以上";
    } else if (price.detail.min === 0 && price.detail.max !== length - 1) {
      priceText = "￥" + this.data.priceType[price.detail.max] + "以下";
    } else if (price.detail.min !== 0 && price.detail.max !== length - 1) {
      priceText =
        "￥" +
        this.data.priceType[price.detail.min] +
        "-" +
        "￥" +
        this.data.priceType[price.detail.max];
    }
    this.setData({
      searchData,
      priceText
    });
  },
  showChangDialog(){
    this.setData({
      showTipChangDialog:true
    })
  },
  showSecondDialog(){
    this.setData({
      showTipSecondDialog:true
    })
  },
  handleRepos() {
    if (this.data.tabIndex === 1) {
      if (this.data.cityText !== "手动定位") {
        return;
      }
      this.setData({ cityText: "定位中..." });
      this.getUserLocation();
    } else {
      if (this.data.cityText2 !== "手动定位") {
        return;
      }
      this.setData({ cityText2: "定位中..." });
      this.getUserLocationLong();
    }
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

  getUserLocationLong() {
    getLocationSetting()
      .then(_ => getLocation())
      .then(location => this.calcCityByLocationLong(location))
      .catch(_ => {
        console.error("long获取定位授权失败啦~");
        wx.showToast({
          title: "为了更好的使用效果，请同意地理位置信息授权",
          icon: "none"
        });
        this.calcCityByLocationLong();
      });
  },

  calcCityByLocation(location) {
    if (location) {
      getLocationInfo(location).then(resp => {
        let city = resp.result.address_component.city;
        if (city) {
          if (city.indexOf("市") === city.length - 1) {
            city = city.substring(0, city.length - 1);
          }
          if (city === this.data.searchData.city) {
            this.setData({
              cityText: "手动定位"
            });
            this.getHotPosition(this.data.searchData.city);
          } else {
            this.service
              .getCityList(city)
              .then(rslt => {
                var data = rslt.data[0];
                let json = JSON.parse(data.json);
                let searchData = this.data.searchData;
                searchData.city = data.name;
                searchData.area = "";
                searchData.areaType = "";
                searchData.cityId = {
                  tj: json.tj && json.tj.id,
                  mn: json.mn && json.mn.city_id,
                  zg: json.zg && json.zg.id,
                  xz: json.xz && json.xz.cityId
                };
                searchData.ltude = {
                  tj: resp.result.location.lat + "," + resp.result.location.lng,
                  mn: resp.result.location.lat + "," + resp.result.location.lng,
                  zg: resp.result.location.lat + "," + resp.result.location.lng,
                  xz: resp.result.location.lat + "," + resp.result.location.lng
                };
                this.setData(
                  {
                    searchData,
                    cityText: "手动定位"
                  },
                  () => {
                    const app = getApp();
                    app.globalData.searchData = this.data.searchData;

                    //搜索城市历史
                    let searchCityHistory = {}
                    searchCityHistory.city = app.globalData.searchData.city
                    searchCityHistory.cityId = app.globalData.searchData.cityId
                    searchCityHistory.cityType = app.globalData.searchData.cityType
                    wx.setStorageSync('searchCityHistory', searchCityHistory)

                    this.getHotPosition(this.data.searchData.city);
                  }
                );
              })
              .catch(error => {
                console.error(error);
                this.setData({
                  cityText: "手动定位"
                });
              });
          }
        }
      });
    } else {
      this.setData({
        cityText: "手动定位"
      });
    }
  },

  calcCityByLocationLong(location) {
    if (location) {
      getLocationInfo(location).then(resp => {
        let city = resp.result.address_component.city
        if (city) {
          if (city.indexOf("市") === city.length - 1) {
            city = city.substring(0, city.length - 1);
          }
          if(city === this.data.searchLongData.city) {
            this.setData({
              cityText2: "手动定位"
            });
          } else if (this.data.searchLongList.length) {
            this.locationSetData(city, this.data.searchLongList)
          } else {
            this.service.getLongCityList().then(resp => {
              this.locationSetData(city, resp.data)
            }).catch(msg=> {
              this.setData({
                cityText2: "定位失败"
              });
            });
          }
        } else {
          this.setData({
            cityText2: "定位失败"
          });
        }
      });
    } else {
      this.setData({
        cityText2: "手动定位"
      });
    }
  },
  //定位数据处理
  locationSetData(city, searchLongList) {
    for (const pl of searchLongList) {
      const cityInfo = city.indexOf(pl.name)
      if (cityInfo > -1) {
        let cityItem = pl
        const app = getApp()
        let data = {}
        let searchLongData = this.data.searchLongData
        let secondSearchData = this.data.secondSearchData
        let name = cityItem.name
        let cityJson = JSON.parse(cityItem.json)
        let cityId = {}
        for (const key in cityJson) {
          if (key === "wiwj") {
            cityId[key] = cityJson[key].id
          } else if (key === "tc") {
            cityId[key] = cityJson[key].dirname
          } else if (key === "lj") {
            cityId[key] = cityJson[key].city_id
          } else if (key === "ftx") {
            cityId[key] = cityJson[key]
          }
        }
        data.city = cityItem.name
        data.cityJson = cityItem.json
        data.cityId = cityId
        data.area = ""
        data.areaId = {}
        data.areaJson = ""
        searchLongData = { ...searchLongData, ...data }
        secondSearchData = { ...secondSearchData, ...data }
        app.globalData.searchLongData = { ...app.globalData.searchLongData, ...data }
        app.globalData.secondSearchData = { ...app.globalData.secondSearchData, ...data }
        this.setSecondPrice(data.city)

        searchLongData.areaType = 0
        app.globalData.searchLongData.areaType = 0

        //搜索城市历史(长租)
        let history = {}
        history.city = data.city
        history.cityId = data.cityId
        history.cityJson = data.cityJson
        wx.setStorageSync('searchLongCityHistory', history)

        this.setData({
          searchLongData,
          secondSearchData,
          searchLongList,
          cityText2: "手动定位"
        });
        return;
      }
    }
    this.setData({
      cityText2: "定位城市暂无服务"
    });
  },
  getCityInfo(city) {
    this.service.getCityList(city).then(rslt => {
      var data = rslt.data[0];
      let json = JSON.parse(data.json);
      let searchData = this.data.searchData;
      searchData.city = data.name;
      searchData.cityId = {
        tj: json.tj && json.tj.id,
        mn: json.mn && json.mn.city_id,
        zg: json.zg && json.zg.id,
        xz: json.xz && json.xz.cityId
      };
      this.setData(
        {
          searchData
        },
        () => {
          const app = getApp();
          app.globalData.searchData = this.data.searchData;
        }
      );
    });
  },
  notOnLine() {
    wx.showToast({
      title: "暂未开启，敬请期待",
      icon: "none"
    });
  },

  getUnReadCouponList() {
    this.service.getUnReadCouponList().then(couponList => {
      this.setData({ couponList, showCouponDialog: couponList.length > 0 });
    });
  },

  searchSubmit() {
    if (this.data.tabIndex === 1) {
      const app = getApp();
      app.globalData.searchData = this.data.searchData;
      if (
        fecha.parse(app.globalData.searchData.beginDate, "YYYY-MM-DD") -
          fecha.parse(app.globalData.searchData.endDate, "YYYY-MM-DD") >
        0
      ) {
        wx.showToast({
          title: "入住日期不能大于离开日期，请重新选择",
          icon: "none"
        });
        return;
      } else if (
        fecha.parse(app.globalData.searchData.beginDate, "YYYY-MM-DD") -
          fecha.parse(fecha.format(new Date(), "YYYY-MM-DD"), "YYYY-MM-DD") <
        0
      ) {
        wx.showToast({
          title: "日期已过期，请修改后重新尝试",
          icon: "none"
        });
        return;
      }
      let searchData = this.data.searchData;
      if (!searchData.city) {
        wx.showToast({
          title: "请先选择城市",
          icon: "none"
        });
      } else if (this.data.isAuth) {
        wx.navigateTo({
          url: "../houseList/houseList?type=1"
        });
      } else {
        this.showAuthDialog();
        wx.showLoading({
          title: "获取登录授权中",
          mask: true
        });
      }
    } else if (this.data.tabIndex === 2) {
      let searchLongData = this.data.searchLongData;
      if (!searchLongData.city) {
        wx.showToast({
          title: "请先选择城市",
          icon: "none"
        });
      } else if (this.data.isAuth) {
        let searchLongData = { ...this.data.searchLongData }
        let type = searchLongData.chooseType ==1 ? 2 :3;
        wx.navigateTo({
          url: "../houseLongList/houseLongList?type="+type
        });
      } else {
        this.showAuthDialog();
        wx.showLoading({
          title: "获取登录授权中",
          mask: true
        });
      }
    } else {
      let secondSearchData = this.data.secondSearchData;
      if (!secondSearchData.city) {
        wx.showToast({
          title: "请先选择城市",
          icon: "none"
        });
      } else if (this.data.isAuth) {
        wx.navigateTo({
          url: "../secondHandHouse/secondHandHouse?type=4"
        });
      } else {
        this.showAuthDialog();
        wx.showLoading({
          title: "获取登录授权中",
          mask: true
        });
      }
      
    }
  },
  getHouseTypeAndEqu() {
    this.searchDataStorage = searchDataStorage.subscribe(hasSearchData => {
      console.log("hasSearchData=" + hasSearchData);
      if (hasSearchData) {
        this.setData({
          houseType: wx.getStorageSync("houseType"),
          equipments: wx.getStorageSync("equipments"),
          numberList: wx.getStorageSync("numberList"),
          leaseType: wx.getStorageSync("leaseType")
        });
      }
    });
    this.searchLongDataStorage = searchLongDataStorage.subscribe(
      hasSearchData => {
        console.log("hasSearchData=" + hasSearchData);
        if (hasSearchData) {
          let allLongData = this.data.allLongData;
          allLongData.longRentTypes = wx.getStorageSync("longRentTypes");
          allLongData.longSortTypes = wx.getStorageSync("longSortTypes");
          this.setData({ allLongData });
        }
      }
    );
    this.searchSecondDataStorage = searchSecondDataStorage.subscribe(
      hasSearchData => {
        console.log("hasSearchData=" + hasSearchData);
        if (hasSearchData) {
          let allSecondData = this.data.allSecondData;
          allSecondData.secondLayoutMap = wx.getStorageSync("secondLayoutMap");
          allSecondData.secondSortTypeMap = wx.getStorageSync("secondSortTypeMap");
          this.setData({ allSecondData });
        }
      }
    );
  },
  showAuthDialog() {
    getSessionKey()
      .then(() => {
        wx.hideLoading();
        this.setData({ showAuthDialog: true });
      })
      .catch(() => {
        wx.hideLoading();
        wx.showToast({
          title: "获取登录授权失败",
          icon: "none"
        });
      });
  },

  handleClearScenic() {
    const app = getApp()
    if (this.data.tabIndex === 1 && !!this.data.searchData.area) {
      this.setData({
        "searchData.area": "",
        "searchData.areaId": {},
        "searchData.ltude": {},
        "searchData.areaType": 0
      });
      app.globalData.searchData.area = ""
      app.globalData.searchData.areaId = {}
      app.globalData.searchData.ltude = {}
      app.globalData.searchData.areaType = 0
    } else if (this.data.tabIndex === 2 && !!this.data.searchLongData.area) {
      this.setData({
        "searchLongData.area": "",
        "searchLongData.areaId": {},
        "searchLongData.areaType": 0,
        "searchLongData.areaJson": ""
      });
      app.globalData.searchLongData.area = ""
      app.globalData.searchLongData.areaId = {}
      app.globalData.searchLongData.areaType = 0
      app.globalData.searchLongData.areaJson = ""
    } else if (this.data.tabIndex === 3 && !!this.data.secondSearchData.area) {
      this.setData({
        "secondSearchData.area": "",
        "secondSearchData.areaId": {},
        "secondSearchData.areaType": 0,
        "secondSearchData.areaJson": ""
      });
      app.globalData.secondSearchData.area = ""
      app.globalData.secondSearchData.areaId = {}
      app.globalData.secondSearchData.areaType = 0
      app.globalData.secondSearchData.areaJson = ""
    } else {
      this.goPositionSelect();
    }
  },

  handleGetUserInfo(e) {
    const userInfo = e.detail.userInfo.detail;
    const { iv, encryptedData } = userInfo;

    if (!iv || !encryptedData) {
      wx.showToast({
        title: "为了更好的使用效果，请同意用户信息授权",
        icon: "none"
      });
      return;
    }

    if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: "获取授权信息...",
        mask: true
      });
      this.setData({ showAuthDialog: false });
      getSessionKey().then(sessionKey => {
        const data = {
          session_key: sessionKey,
          iv,
          encryptedData
        };
        this.auth(data);
      });
    }
  },
  auth(data) {
    this.service
      .auth(data)
      .then(() => {
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: "登录成功"
        });

        this.searchSubmit();
      })
      .catch(() => {
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: "登录失败，请稍后重试",
          icon: "none"
        });
      });
  },
  handleCloseAuthDialog() {
    wx.showToast({
      title: "为了更好的使用效果，请同意用户信息授权",
      icon: "none"
    });
    this.setData({
      showAuthDialog: false
    });
  },
  getHotCity() {
    //短租
    this.service.indexParam().then(resp => {
      let hotCity = resp.data.fddHotCity.split(",");
      let searchData = this.data.searchData;
      const app = getApp();
      let searchCityHistory = wx.getStorageSync('searchCityHistory')
      let temp = false;
      let isHistory = false
      if (
        app.globalData.searchData.city &&
        app.globalData.searchData.city !== ""
      ) {
        searchData.city = app.globalData.searchData.city;
      } else if (searchCityHistory.city &&
        searchCityHistory.city !== "") {
        searchData.city = searchCityHistory.city
        searchData.cityId = searchCityHistory.cityId
        searchData.cityType = searchCityHistory.cityType
        app.globalData.searchData.city = searchCityHistory.city
        app.globalData.searchData.cityId = searchCityHistory.cityId
        app.globalData.searchData.cityType = searchCityHistory.cityType
        isHistory = true
      } else {
        searchData.city = hotCity[0];
        temp = true;
      }
      this.setData(
        {
          searchData
        },
        () => {
          !isHistory && this.getCityInfo(searchData.city);
          this.getHotPosition(searchData.city);
          // temp && this.getUserLocation();
        }
      );
    });
  },
  getHotCityLong() {
    //长租 二手房
    const app = getApp()
    let searchLongCityHistory = wx.getStorageSync('searchLongCityHistory')
    let searchLongData = { ...this.data.searchLongData }
    let secondSearchData = { ...this.data.secondSearchData }
    let data = {}
    if (app.globalData.searchLongData.city && app.globalData.searchLongData.city !== "") {
      data.city = app.globalData.searchLongData.city
      data.cityId = searchLongCityHistory.cityId
      data.cityJson = searchLongCityHistory.cityJson
      searchLongData = { ...searchLongData, ...data }
      secondSearchData = { ...secondSearchData, ...data }
      this.setData({ searchLongData, secondSearchData})
      if (this.data.secondNeedGetPrice) {
        this.setSecondPrice(data.city)
      }
    } else if (searchLongCityHistory.city && searchLongCityHistory.city !== "") {
      data.city = searchLongCityHistory.city
      data.cityId = searchLongCityHistory.cityId
      data.cityJson = searchLongCityHistory.cityJson
      searchLongData = { ...searchLongData, ...data }
      secondSearchData = { ...secondSearchData, ...data }
      app.globalData.searchLongData = { ...app.globalData.searchLongData, ...data}
      app.globalData.secondSearchData = { ...app.globalData.secondSearchData, ...data }
      this.setData({ searchLongData, secondSearchData })
      this.setSecondPrice(data.city)
    } else {
      if (this.data.searchLongList.length) {
        let cityItem = this.data.searchLongList[0]
        let name = cityItem.name
        let cityJson = JSON.parse(cityItem.json)
        let cityId = {}
        data.city = cityItem.name
        data.city = cityItem.name
        for (const key in cityJson) {
          if (key === "wiwj") {
            cityId[key] = cityJson[key].id
          } else if (key === "tc") {
            cityId[key] = cityJson[key].dirname
          } else if (key === "lj") {
            cityId[key] = cityJson[key].city_id
          } else if (key === "ftx") {
            cityId[key] = cityJson[key]
          }
        }
        data.cityId = cityId
        searchLongData = { ...searchLongData, ...data }
        secondSearchData = { ...secondSearchData, ...data }
        app.globalData.searchLongData = { ...app.globalData.searchLongData, ...data }
        app.globalData.secondSearchData = { ...app.globalData.secondSearchData, ...data }
        this.setData({ searchLongData, secondSearchData })
        this.setSecondPrice(data.city)
      } else {
        this.service.getLongCityList().then(resp => {
          let hotCity = resp.data[0] || ""
          let cityItem = hotCity
          let name = cityItem.name
          let cityJson = JSON.parse(cityItem.json)
          let cityId = {}
          data.city = cityItem.name
          data.cityJson = cityItem.json
          for (const key in cityJson) {
            if (key === "wiwj") {
              cityId[key] = cityJson[key].id
            } else if (key === "tc") {
              cityId[key] = cityJson[key].dirname
            } else if (key === "lj") {
              cityId[key] = cityJson[key].city_id
            } else if (key === "ftx") {
              cityId[key] = cityJson[key]
            }
          }
          data.cityId = cityId
          searchLongData = { ...searchLongData, ...data }
          secondSearchData = { ...secondSearchData, ...data }
          app.globalData.searchLongData = { ...app.globalData.searchLongData, ...data }
          app.globalData.secondSearchData = { ...app.globalData.secondSearchData, ...data }
          this.setData({ searchLongData, secondSearchData, searchLongList: resp.data })
          this.setSecondPrice(data.city)
        });
      }
    }   
  },
  //设置二手房预算
  setSecondPrice(city) {
    if(city) {
      this.service.getSecondCityPrice(city).then(res => {
        if(res && res.data){
          let newArray = res.data.split(',')
          if(newArray.length === 2) {
            let secondSearchData = this.data.secondSearchData
            const app = getApp()
            secondSearchData.minPrice = newArray[0]
            secondSearchData.maxPrice = newArray[1]
            app.globalData.secondSearchData.minPrice = newArray[0]
            app.globalData.secondSearchData.maxPrice = newArray[1]
            this.setData({ secondSearchData, secondNeedGetPrice: false })
          }
        }
      })
    }
  },
  handleCloseCouponDialog() {
    this.setData({ showCouponDialog: false });
  },
  getHotPosition(city) {
    let cityname = city;
    const app = getApp();
    this.service.getHotPosition(cityname).then(rslt => {
      let searchData = this.data.searchData;
      let data = rslt.data;
      let hotarea = "";
      let hotareatype = "";
      if (data.length) {
        let index = Math.floor(Math.random() * data.length);
        hotarea = data[index].name || cityname;
        hotareatype = data[index].type || "";
      } else {
        hotarea = cityname;
      }
      if (searchData.area === "") {
        this.setData({
          hotarea,
          hotareatype
        });
      }
      // 热门地点存起来，地点搜索页面使用
      app.globalData.hotPosition = data;
    });
  },
  getSearchDataFromGlobal() {
    const app = getApp();
    const searchLongData = app.globalData.searchLongData
    const secondSearchData = app.globalData.secondSearchData
    let data = { ...this.data.secondSearchData }
    let secondNeedGetPrice = false;
    if (data.city !== secondSearchData.city) {
      secondNeedGetPrice =  true
    } 
    const {
      selectedNumber,
      beginDate,
      endDate,
      dayCount,
      area,
      cityId,
      city,
      cityType,
      areaId,
      areaType,
      ltude,
      leaseType,
      sort,
      minPrice,
      maxPrice,
      gueseNumber,
      advSort
    } = app.globalData.searchData;
    let searchData = this.data.searchData;
    searchData.gueseNumber = selectedNumber || -1;
    searchData.beginDate = beginDate || fecha.format(new Date(), "YYYY-MM-DD");
    searchData.endDate =
      endDate ||
      fecha.format(new Date().getTime() + 24 * 60 * 60 * 1000, "YYYY-MM-DD");
    searchData.dayCount = dayCount || 1;
    searchData.area = area || "";
    searchData.areaType = areaType || "";
    searchData.areaId = areaId || {};
    searchData.ltude = ltude || {};
    searchData.cityId = cityId || {};
    searchData.city = city || searchData.city;
    searchData.cityType = cityType || 0;
    searchData.leaseType = leaseType || "";
    searchData.sort = sort || 2;
    searchData.minPrice = minPrice || 0;
    searchData.maxPrice = maxPrice || 99999;
    searchData.gueseNumber = gueseNumber || 1;
    searchData.equipment = app.globalData.searchData.equipment || [];
    searchData.advSort = advSort;
    this.setData(
      {
        searchData,
        searchLongData,
        secondSearchData,
        showPriceBlock: true,
        showLongPriceBlock: true,
        showSecondPriceBlock: true,
        secondNeedGetPrice: secondNeedGetPrice,
        beginDate: fecha.format(
          fecha.parse(searchData.beginDate, "YYYY-MM-DD"),
          "MM[月]DD[日]"
        ),
        endDate: fecha.format(
          fecha.parse(searchData.endDate, "YYYY-MM-DD"),
          "MM[月]DD[日]"
        )
      },
      () => {
        if (this.data.tabIndex === 1) {
          this.getHotCity();
        } else {
          this.getHotCityLong();
        }
        let min = 0,
          max = 0;
        for (const key in this.data.priceType) {
          const item = this.data.priceType[key];
          if (item === searchData.minPrice) {
            min = key;
          } else if (item === searchData.maxPrice) {
            max = key;
          } else if (searchData.maxPrice === 99999) {
            max = 4;
          }
        }
        this.changePrice({
          detail: {
            min: parseInt(min),
            max: parseInt(max)
          }
        });
      }
    );
  },

  handleCloseTipDialog1(){
    this.setData({
      showTipChangDialog:false
    })
  },
  handleCloseTipDialog2(){
    this.setData({
      showTipSecondDialog:false
    })
  },
  getbanner() {
    this.service.getBanner().then(resp => {
      let data = resp.list;
      if (data.length > 0) {
        let imgArr = [];
        data.map(item => {
          imgArr.push({
            url: item.imagePath || "../../assets/image/index/banner.png",
            id: item.id
          });
        });
        this.setData({
          imgUrls: imgArr
        });
      }
    });
  },
  bindtouchstartsort(event) {
    // console.log('bindtouchstartsort',event)
    this.shortY = event.changedTouches[0]
      ? event.changedTouches[0].pageY || 0
      : 0;
  },
  bindtouchendsort(event) {
    // console.log('bindtouchendsort', event, this.shortY)
    if (this.shortY && this.shortY > event.changedTouches[0].pageY + 50) {
      console.log("上滑事件");
      this.setData({ spread: true });
    }
  },
  //table切换
  changeTab(event) {
    let tabIndex = +event.currentTarget.dataset.index || 1
    if (tabIndex !== this.data.tabIndex) {
      wx.setStorageSync('tabIndex', tabIndex)
      this.setData({ tabIndex, spread: false })
      if (tabIndex === 1) {
        this.getHotCity()
      } else {
        this.getHotCityLong()
      }
    }
  },
  //长租切换房源
  changeLongTab(event) {
    let tabIndex = +event.currentTarget.dataset.index || 1
    let searchLongData = { ...this.data.searchLongData }
    if (tabIndex !== searchLongData.chooseType) {
      let data = {}
      data.chooseType = tabIndex
      data.longBuildAreas = -1
      data.longFloorTypes = []
      data.longHeadings = []
      data.longHouseTags = []
      data.longLayouts = []
      data.longRentTypes = 0
      data.longSortTypes = 0
      data.area = ""
      data.areaId = {}
      data.areaType = 0
      data.areaJson = ""
      const app = getApp()
      searchLongData = { ...searchLongData, ...data }
      app.globalData.searchLongData = { ...app.globalData.searchLongData, ...data }
      this.setData({ searchLongData })
    }
  },
  // 长租更换房源类型
  selectRentTypes(event) {
    let index = +event.currentTarget.dataset.index;
    let searchLongData = this.data.searchLongData;
    const app = getApp();
    let data = app.globalData.searchLongData;
    if (searchLongData.longRentTypes === index) {
      searchLongData.longRentTypes = 0;
      data.longRentTypes = 0;
    } else {
      searchLongData.longRentTypes = parseInt(index);
      data.longRentTypes = parseInt(index);
    }
    this.setData({
      searchLongData
    });
  },
  // 长租更换房源偏好
  selectSortTypes(event) {
    let index = +event.currentTarget.dataset.index;
    let searchLongData = this.data.searchLongData;
    const app = getApp();
    let data = app.globalData.searchLongData;
    if (searchLongData.longSortTypes === index) {
      searchLongData.longSortTypes = 0;
      searchLongData.advSort = 0;
      data.longSortTypes = 0;
      data.advSort = 0;
    } else {
      searchLongData.longSortTypes = parseInt(index);
      searchLongData.advSort = parseInt(index);
      data.longSortTypes = parseInt(index);
      data.advSort = parseInt(index);
      if (parseInt(index)===3) {
        searchLongData.advSort = 0;
        data.advSort = 0;
      }
    }
    this.setData({
      searchLongData
    });
  },
  //长租价格条回调
  handlePriceChange(event) {
    let searchLongData = this.data.searchLongData;
    searchLongData.minPrice = event.detail.min;
    searchLongData.maxPrice = event.detail.max;
    this.setData({ searchLongData });
    const app = getApp();
    app.globalData.searchLongData.minPrice = event.detail.min;
    app.globalData.searchLongData.maxPrice = event.detail.max;
  },
  //二手房更换用途
  selectHouseUseMap(event) {
    let index = +event.currentTarget.dataset.index
    let secondSearchData = { ...this.data.secondSearchData }
    let isIndexOf = secondSearchData.secondHouseUseMap.indexOf(index)

    if (isIndexOf >= 0) {
      secondSearchData.secondHouseUseMap.splice(isIndexOf, 1)
    } else {
      secondSearchData.secondHouseUseMap.push(index)
      secondSearchData.secondHouseUseMap.sort()
    }
    const app = getApp()
    app.globalData.secondSearchData.secondHouseUseMap = secondSearchData.secondHouseUseMap
    this.setData({ secondSearchData });
  },
  //二手房更换户型
  selectLayoutMap(event) {
    let index = +event.currentTarget.dataset.index
    let secondSearchData = { ...this.data.secondSearchData }
    let isIndexOf = secondSearchData.secondLayoutMap.indexOf(index)

    if (isIndexOf >= 0) {
      secondSearchData.secondLayoutMap.splice(isIndexOf, 1)
    } else {
      secondSearchData.secondLayoutMap.push(index)
      secondSearchData.secondLayoutMap.sort()
    }
    const app = getApp()
    app.globalData.secondSearchData.secondLayoutMap = secondSearchData.secondLayoutMap
    this.setData({ secondSearchData });
  },
  //二手房更换房源偏好
  selectSortTypeMap(event) {
    let index = +event.currentTarget.dataset.index
    let secondSearchData = { ...this.data.secondSearchData }
    const app = getApp()
    let data = app.globalData.secondSearchData
    if (secondSearchData.secondSortTypeMap === index) {
      secondSearchData.secondSortTypeMap = 0
      secondSearchData.advSort = 0
      data.secondSortTypeMap = 0
      data.advSort = 0
    } else {
      secondSearchData.secondSortTypeMap = parseInt(index)
      secondSearchData.advSort = parseInt(index)
      data.secondSortTypeMap = parseInt(index)
      data.advSort = parseInt(index)
    }
    this.setData({ secondSearchData });
  },
  // 二手房更换房源特色
  selectHouseTagMap(event) {
    let index = +event.currentTarget.dataset.index
    let secondSearchData = { ...this.data.secondSearchData }
    let isIndexOf = secondSearchData.secondHouseTagMap.indexOf(index)
    
    if (isIndexOf >= 0) {
      secondSearchData.secondHouseTagMap.splice(isIndexOf, 1)
    } else {
      secondSearchData.secondHouseTagMap.push(index)
      secondSearchData.secondHouseTagMap.sort()
    }
    const app = getApp()
    app.globalData.secondSearchData.secondHouseTagMap = secondSearchData.secondHouseTagMap
    this.setData({ secondSearchData });
  },
  // 二手房更换装修
  selectHouseDecorationMap(event) {
    let index = +event.currentTarget.dataset.index
    let secondSearchData = { ...this.data.secondSearchData }
    let isIndexOf = secondSearchData.secondHouseDecorationMap.indexOf(index)

    if (isIndexOf >= 0) {
      secondSearchData.secondHouseDecorationMap.splice(isIndexOf, 1)
    } else {
      secondSearchData.secondHouseDecorationMap.push(index)
      secondSearchData.secondHouseDecorationMap.sort()
    }
    const app = getApp()
    app.globalData.secondSearchData.secondHouseDecorationMap = secondSearchData.secondHouseDecorationMap
    this.setData({ secondSearchData });
  },
  //二手房更换价格
  changeSecondPrice(e) {
    let secondSearchData = { ...this.data.secondSearchData, ...e.detail }
    const app = getApp()
    app.globalData.secondSearchData = { ...app.globalData.secondSearchData, ...e.detail }
    this.setData({ secondSearchData })
  },
  //二手房面积
  handleSecondPriceChange(e) {
    let secondSearchData = { ...this.data.secondSearchData }
    secondSearchData.minArea = e.detail.min
    secondSearchData.maxArea = e.detail.max
    const app = getApp()
    app.globalData.secondSearchData.minArea = e.detail.min
    app.globalData.secondSearchData.maxArea = e.detail.max
    this.setData({ secondSearchData })
  },
  secondFocus(temp = false) {
    console.log(temp)
    if(temp) {
      this.setData({ secondFocus: temp.detail || false })
    } else {
      this.setData({ secondFocus: false })
    }
  },
  init() {
    this.getHouseTypeAndEqu();
    this.getbanner();
  },
  onShow() {
    const app = getApp();
    let searchData = app.globalData.searchData;
    app.globalData.searchData.advSort = 1;
    if(searchData.sort === 2) {
        searchData.advSort = 2
    } else {
        searchData.advSort = 1
    }
    app.globalData.searchData = searchData;
    //长租
    let searchLongData = app.globalData.searchLongData;
    searchLongData.longBuildAreas = -1;
    searchLongData.longFloorTypes = [];
    searchLongData.longHeadings = [];
    searchLongData.longHouseTags = [];
    searchLongData.longLayouts = [];
    searchLongData.advSort = 0;
    if (searchLongData.longSortTypes === 1) {
      searchLongData.advSort = 1;
    } else if (searchLongData.longSortTypes === 2) {
      searchLongData.advSort = 2;
    }
    app.globalData.searchLongData = searchLongData;
    //二手房
    let secondSearchData = app.globalData.secondSearchData;
    secondSearchData.advSort = 0; 
    if (secondSearchData.secondSortTypeMap === 1) {
      secondSearchData.advSort = 1;
    } else if (secondSearchData.secondSortTypeMap === 2) {
      secondSearchData.advSort = 2;
    }
    if (secondSearchData.secondHouseDecorationMap.indexOf(3) >= 0) {
      secondSearchData.secondHouseDecorationMap = [3]
    } else {
      secondSearchData.secondHouseDecorationMap = []
    }
    if (secondSearchData.secondHouseTagMap.indexOf(1) >= 0) {
      secondSearchData.secondHouseTagMap = [1]
    } else {
      secondSearchData.secondHouseTagMap = []
    }
    secondSearchData.secondHeadingMap = []
    secondSearchData.secondFloorTypeMap = []
    if (secondSearchData.secondHouseUseMap.indexOf(1) >= 0) {
      secondSearchData.secondHouseUseMap = [1]
    } else {
      secondSearchData.secondHouseUseMap = []
    }
    secondSearchData.secondBuildingAgeMap = 0
    app.globalData.secondSearchData = secondSearchData;

    this.setData({ searchData, searchLongData, secondSearchData });

    this.searchDataStorage = searchDataStorage.subscribe(hasSearchData => {
      console.log("hasSearchData=" + hasSearchData);
      if (!hasSearchData) {
        const app = getApp();
        getIndexHouseData(app);
      }
    });
    this.searchLongDataStorage = searchLongDataStorage.subscribe(
      hasLongSearchData => {
        console.log("hasLongSearchData=" + hasLongSearchData);
        if (!hasLongSearchData) {
          getIndexLongHouseData();
        }
      }
    );
    this.searchSecondDataStorage = searchSecondDataStorage.subscribe(
      hasSecondSearchData => {
        console.log("hasSecondSearchData=" + hasSecondSearchData);
        if (!hasSecondSearchData) {
          getIndexSecondHouseData();
        }
      }
    );
    if (this.data.needOnShow) {
      this.getSearchDataFromGlobal();
    }

    if (this.data.isAuth) {
      this.getUnReadCouponList();
    } else if (!this.authSubscription) {
      this.authSubscription = authSubject.subscribe(isAuth => {
        if (isAuth) {
          this.setData({ isAuth });
          this.getUnReadCouponList();
        }
      });
    }
  },
  onLoad(params) {
    // tujia.getData('22672056').then(res=>{
    //   console.log('res',res)
    // })
    // xiaozhu.getData('132403005403').then(res => {
    //   console.log('res', res)
    // })
    // muniao.getData('284145').then(res => {
    //   console.log('res', res)
    // })
    // zhenguo.getData('6487223').then(res => {
    //   console.log('res', res)
    // })
    // wiwj.getLongData({ houseId:'90332937', cityId:'2' }).then(res => {
    //   console.log('res', res)
    // })
    // lianjia.getLongData({ house_code: 'HZ2373642574210023424', city_id: 110000 }).then(res => {
    //   console.log('res', res)
    // })
    // wbtc.getLongData('41371156070425').then(res => {
    //   console.log('res', res)
    // })
    // ftx.getLongData({ houseId: 51917000, city:"杭州"}).then(res => {
    //   console.log('res', res)
    // })
    // wiwj.getHouseData({ houseId:'90333226', cityId:'2' }).then(res => {
    //   console.log('res', res)
    // })
    // lianjia.getHouseData({ house_code: 101103493167, city_id: 110000 }).then(res => {
    //   console.log('res', res)
    // })
    let tab = +params.tab;
    if(!tab) {
      tab = wx.getStorageSync('tabIndex') || 2
    } else {
      wx.setStorageSync('tabIndex', tab)
    }
    this.setData({ tabIndex: tab })
    this.init();
    this.searchDataSubscription = SearchDataSubject.subscribe(() => {
      this.setData({ showPriceBlock: false});
      setTimeout(() => {
        this.getSearchDataFromGlobal();
        this.setData({ needOnShow: true });
      }, 1000);
    });
    this.searchLongDataSubscription = SearchLongDataSubject.subscribe(() => {
      const app = getApp();
      let searchLongData = app.globalData.searchLongData;
      changeHistoryStorage(searchLongData);
      this.setData({ showLongPriceBlock: false });
    });
    this.searchLongMonitorDataSubscription = SearchLongMonitorDataSubject.subscribe(
      () => {
        const app = getApp();
        let monitorSearchLongData = app.globalData.monitorSearchLongData;
        changeHistoryStorage(monitorSearchLongData);
      }
    );
    this.searchSecondDataSubscription = SearchSecondDataSubject.subscribe(() => {
      const app = getApp();
      let secondSearchData = app.globalData.secondSearchData;
      changeHistoryStorage(secondSearchData, true);
      this.setData({ showSecondPriceBlock: false });
    });
    this.searchsecondMonitorDataSubscription = SearchSecondMonitorDataSubject.subscribe(
      () => {
        const app = getApp();
        let monitorSecondSearchData = app.globalData.monitorSecondSearchData;
        changeHistoryStorage(monitorSecondSearchData,true);
      }
    );
  }
});
