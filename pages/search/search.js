import { getLocationSetting, getLocation, getSessionKey } from '../../utils/wx';
import { authSubject } from '../../utils/auth';
import { SearchDataSubject } from '../../utils/searchDataStream';
import { getLocationInfo } from '../../utils/map';
import searchService from './service';
import fecha from '../../utils/fecha';
import { searchDataStorage } from "../../utils/searchDataStorage"
import getIndexHouseData from "../../utils/indexHoseData"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        url: '../../assets/image/index/banner.png',
        id: 0
      }
    ],
    hotCity: '',
    hotarea: '',
    hotareaType: '',
    spread: false,
    cityText: '手动定位',
    houseType: {},
    leaseType: {},
    priceType: {
      '0': 0,
      '1': 200,
      '2': 300,
      '3': 400,
      '4': 500,
      '5': 600,
      '6': 99999
    },
    equipments: {},
    sortType: {},
    submitFlag: false,
    showAuthDialog: false,
    isAuth: false,
    priceText: '不限',
    beginDate: '',
    endDate: '',
    showPriceBlock: false,
    searchData: {
      cityType: '',
      area: '',
      areaId: {},
      ltude: {},
      areaType: '',
      city: '', //城市名
      cityId: {}, //城市ID
      beginDate: '', //开始日期
      endDate: '', //离开日期
      dayCount: 0,
      gueseNumber: -1, //入住人数
      leaseType: '', //房间类型  1单间 2整租 不选择''
      houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0, //最低价
      maxPrice: 99999, //最高价s
      sort: 1, //搜索方式 1推荐 2低价有限
      equipment: []
    },
    needOnShow: false
  },

  service: new searchService(),
  submitFlag: false,
  searchDataSubscription: null,
  authSubscription: null,

  goCitySelect() {
    wx.navigateTo({
      url: '../citySelect/citySelect'
    });
  },
  goDays() {
    wx.navigateTo({
      url: '../days/days'
    });
  },
  goPeopleNumber() {
    wx.navigateTo({
      url: '../peopleNumber/peopleNumber'
    });
  },
  goPositionSelect() {
    wx.navigateTo({
      url: '../positionSelect/positionSelect?city=' + this.data.searchData.city
    });
  },
  changeSort() {
    var sort = this.data.searchData.sort;
    this.data.searchData.sort = sort == 1 ? 2 : 1;
    this.setData({
      searchData: this.data.searchData
    });
  },
  selectLeaseType(event) {
    let index = event.currentTarget.dataset.index;
    let searchData = this.data.searchData;
    if (searchData.leaseType == index) {
      searchData.leaseType = '';
    } else {
      searchData.leaseType = Number(index);
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
    let priceText = '';
    if (price.detail.min === 0 && price.detail.max >= length - 1) {
      priceText = '不限';
    } else if (price.detail.min !== 0 && price.detail.max === length - 1) {
      priceText = '￥' + this.data.priceType[price.detail.min] + '以上';
    } else if (price.detail.min === 0 && price.detail.max !== length - 1) {
      priceText = '￥' + this.data.priceType[price.detail.max] + '以下';
    } else if (price.detail.min !== 0 && price.detail.max !== length - 1) {
      priceText =
        '￥' +
        this.data.priceType[price.detail.min] +
        '-' +
        '￥' +
        this.data.priceType[price.detail.max];
    }
    this.setData({
      searchData,
      priceText
    });
  },
  handleRepos() {
    if (this.data.cityText !== '手动定位') {
      return;
    }
    this.setData({ cityText: '定位中...' });
    this.getUserLocation();
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
    if (location) {
      getLocationInfo(location).then(resp => {
        const city = resp.result.address_component.city;
        if (city) {
          this.service.getCityList(city).then(rslt => {
            var data = rslt.data[0];
            let json = JSON.parse(data.json);
            let searchData = this.data.searchData;
            searchData.city = data.name;
            searchData.area = '';
            searchData.areaType = '';
            searchData.cityId = {
              tj: json.tj && json.tj.id,
              mn: json.mn && json.mn.city_id,
              zg: json.zg && json.zg.id,
              xz: json.xz && json.xz.cityId
            };
            searchData.ltude = {
              tj: resp.result.location.lat + ',' + resp.result.location.lng,
              mn: resp.result.location.lat + ',' + resp.result.location.lng,
              zg: resp.result.location.lat + ',' + resp.result.location.lng,
              xz: resp.result.location.lat + ',' + resp.result.location.lng
            };
            this.setData(
              {
                searchData,
                cityText: '手动定位'
              },
              () => {
                const app = getApp();
                app.globalData.searchData = this.data.searchData;
                this.getHotPosition(this.data.searchData.city);
              }
            );
          });
        }
      });
    } else {
      this.setData({
        cityText: '手动定位'
      });
    }
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
      title: '暂未开启，敬请期待',
      icon: 'none'
    });
  },

  searchSubmit() {
    const app = getApp()
    app.globalData.searchData = this.data.searchData
    if (
      fecha.parse(app.globalData.searchData.beginDate, 'YYYY-MM-DD') -
      fecha.parse(app.globalData.searchData.endDate, 'YYYY-MM-DD') >
      0
    ) {
      wx.showToast({
        title: '入住日期不能大于离开日期，请重新选择',
        icon: 'none'
      });
      return;
    } else if (fecha.parse(app.globalData.searchData.beginDate, 'YYYY-MM-DD') - fecha.parse(fecha.format(new Date(), 'YYYY-MM-DD'), 'YYYY-MM-DD') < 0) {

      wx.showToast({
        title: '日期已过期，请修改后重新尝试',
        icon: 'none'
      });
      return;
    }
    if (this.data.isAuth) {
      wx.navigateTo({
        url: '../houseList/houseList'
      });
    } else {
      this.showAuthDialog();
      wx.showLoading({
        title: '获取登录授权中',
        mask: true
      });
    }
  },
  getHouseTypeAndEqu() {
    this.searchDataStorage = searchDataStorage.subscribe(hasSearchData => {
      console.log('hasSearchData=' + hasSearchData);
      if (hasSearchData) {
        this.setData({
          houseType: wx.getStorageSync('houseType'),
          equipments: wx.getStorageSync('equipments'),
          numberList: wx.getStorageSync('numberList'),
          leaseType: wx.getStorageSync('leaseType')
        });
      }
    });
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
          title: '获取登录授权失败',
          icon: 'none'
        });
      });
  },

  handleGetUserInfo(e) {
    const userInfo = e.detail.userInfo.detail;
    const { iv, encryptedData } = userInfo;

    if (!iv || !encryptedData) {
      wx.showToast({
        title: '为了更好的使用效果，请同意用户信息授权',
        icon: 'none'
      });
      return;
    }

    if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: '获取授权信息...',
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
          title: '登录成功'
        });

        wx.navigateTo({
          url: '../houseList/houseList'
        });
      })
      .catch(() => {
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        });
      });
  },
  handleCloseAuthDialog() {
    wx.showToast({
      title: '为了更好的使用效果，请同意用户信息授权',
      icon: 'none'
    });
    this.setData({
      showAuthDialog: false
    });
  },
  getHotCity() {
    this.service.indexParam().then(resp => {
      let hotCity = resp.data.fddHotCity.split(',');
      let searchData = this.data.searchData;
      const app = getApp();

      if (
        app.globalData.searchData.city &&
        app.globalData.searchData.city != ''
      ) {
        searchData.city = app.globalData.searchData.city;
      } else {
        searchData.city = hotCity[0];
      }

      this.setData(
        {
          searchData
        },
        () => {
          this.getCityInfo(searchData.city);
          this.getHotPosition(searchData.city);
        }
      );
    });
  },
  getHotPosition(city) {
    let cityname = city
    const app = getApp()
    this.service.getHotPosition(cityname).then(rslt => {
      let searchData = this.data.searchData
      let data = rslt.data
      let hotarea = ''
      let hotareatype = ''
      let index = Math.floor(Math.random() * data.length)
      hotarea = data[index].name || cityname
      hotareatype = data[index].type || ''
      if (searchData.area == '') {
        this.setData({
          hotarea,
          hotareatype
        });
      }
      // 热门地点存起来，地点搜索页面使用
      app.globalData.hotPosition = data
    })
  },
  getSearchDataFromGlobal() {
    const app = getApp();
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
      gueseNumber
    } = app.globalData.searchData;
    let searchData = this.data.searchData;
    searchData.gueseNumber = selectedNumber || -1;
    searchData.beginDate = beginDate || fecha.format(new Date(), 'YYYY-MM-DD');
    searchData.endDate =
      endDate ||
      fecha.format(new Date().getTime() + 24 * 60 * 60 * 1000, 'YYYY-MM-DD');
    searchData.dayCount = dayCount || 1;
    searchData.area = area || '';
    searchData.areaType = areaType || '';
    searchData.areaId = areaId || {};
    searchData.ltude = ltude || {};
    searchData.cityId = cityId || {};
    searchData.city = city || searchData.city;
    searchData.cityType = cityType || 0;
    searchData.leaseType = leaseType || '';
    searchData.sort = sort || 2;
    searchData.minPrice = minPrice || 0;
    searchData.maxPrice = maxPrice || 99999;
    searchData.gueseNumber = gueseNumber || 1;
    searchData.equipment = app.globalData.searchData.equipment || []
    this.setData(
      {
        searchData,
        showPriceBlock: true,
        beginDate: fecha.format(
          fecha.parse(searchData.beginDate, 'YYYY-MM-DD'),
          'MM[月]DD[日]'
        ),
        endDate: fecha.format(
          fecha.parse(searchData.endDate, 'YYYY-MM-DD'),
          'MM[月]DD[日]'
        )
      },
      () => {
        this.getHotCity();
        let min = 0,
          max = 0;
        for (const key in this.data.priceType) {
          const item = this.data.priceType[key];
          if (item == searchData.minPrice) {
            min = key;
          } else if (item == searchData.maxPrice) {
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
  getbanner() {
    this.service.getBanner().then(resp => {
      let data = resp.list;
      if (data.length > 0) {
        let imgArr = [];
        data.map(item => {
          imgArr.push({
            url: item.imagePath || '../../assets/image/index/banner.png',
            id: item.id
          });
        });
        this.setData({
          imgUrls: imgArr
        });
      }
    });
  },
  init() {
    this.getHouseTypeAndEqu();
    this.getbanner();
  },
  onShow() {
    this.searchDataStorage = searchDataStorage.subscribe(hasSearchData => {
      console.log('hasSearchData=' + hasSearchData);
      if (!hasSearchData) {
        const app = getApp()
        getIndexHouseData(app)
      }
    })
    if (this.data.needOnShow) {
      this.getSearchDataFromGlobal();
    }
  },
  onLoad() {
    this.init();
    this.searchDataSubscription = SearchDataSubject.subscribe(() => {
      this.setData({ showPriceBlock: false });
      setTimeout(() => {
        this.getSearchDataFromGlobal();
        this.setData({ needOnShow: true })
      }, 1000);
    });
    this.authSubscription = authSubject.subscribe(isAuth => {
      console.log('isAuth=' + isAuth);
      if (isAuth) {
        this.setData({ isAuth });
      }
    });
  }
});
