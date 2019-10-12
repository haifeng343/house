
import Http from "./utils/http";
import { authSubject } from "./utils/auth";
import { doWechatLogin } from "./utils/wx";
import fecha from './utils/fecha';
//app.js
App({
  onLaunch: function () {

    console.log('onLaunch啦');
    doWechatLogin().then(resp => {
      console.log('登录成功啦');
      const token = resp.data.token;
      this.globalData.isAuth = true;
      wx.setStorageSync('token', token);
      // 注意: 不要把这代码段放在存储token之前
      authSubject.next(true);
      // 注意: 不要把这代码段放在存储token之前
      Http.get('/fdd/user/userInfo.json', { token }).then(resp => {
        this.globalData.isUserBindPhone = !!resp.data.userBase.mobile;
        this.globalData.isUserBindPublic = !!resp.data.publicOpenId;
      });
    }).catch(error => {
      console.error(error);
      console.error('登录失败啦!789');
      this.globalData.isAuth = false;
    });

    Http.get('/fdd/common/getHolidays.json').then(resp => {
      const holidays = JSON.parse(resp.data);
      const holidaysObj = {};
      for (const [key, value] of holidays) {
        holidaysObj[key] = value;
      }
      wx.setStorageSync('holidays', JSON.stringify(holidaysObj));
    });

    Http.get('/indexHose.json').then(resp => {
      const houseType = resp.data.shortLayout
      const equipments = resp.data.shortFacilities
      const numberList = resp.data.shortPeople
      const leaseType = resp.data.shortRentType
      const hourMoney = resp.data.hourMoney
      const fddRequestPlatformName = resp.data.fddRequestPlatformName
      if (fddRequestPlatformName.indexOf('tj')>-1){
        this.globalData.tjSwitch = true
      }
      if (fddRequestPlatformName.indexOf('xz') > -1) {
        this.globalData.xzSwitch = true
      }
      if (fddRequestPlatformName.indexOf('mn') > -1) {
        this.globalData.mnSwitch = true
      }
      if (fddRequestPlatformName.indexOf('zg') > -1) {
        this.globalData.zgSwitch = true
      }
      wx.setStorageSync('houseType', houseType)
      wx.setStorageSync('equipments', equipments)
      wx.setStorageSync('numberList', numberList)
      wx.setStorageSync('leaseType', leaseType)
      wx.setStorageSync('hourMoney', hourMoney)
    });

    // Http.get('/indexParam.json').then(resp => {
    //   wx.setStorageSync("hotCity", resp.data.fddHotCity.split(","))
    // })

  },
  globalData: {
    tjSwitch: false, //途家查询控制开关
    xzSwitch: false,
    mnSwitch: false,
    zgSwitch: false,
    searchData: {
      cityType: '',
      area: '',
      areaId: {},
      ltude: {},
      areaType: '',
      city: '',//城市名
      cityId: {},//城市ID
      beginDate: fecha.format(new Date(), 'YYYY-MM-DD'),//开始日期
      endDate: fecha.format(new Date().getTime() + (24 * 60 * 60 * 1000), 'YYYY-MM-DD'),//离开日期
      dayCount: 0,
      gueseNumber: -1,//入住人数
      leaseType: '',//房间类型  2单间 1整租
      houseType: [],//户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0,//最低价
      maxPrice: 99999,//最高价
      sort: 2,//搜索方式 1推荐 2低价有限
      equipment: []
    },
    monitorSearchData: {
      cityType: '',
      area: '',
      areaId: {},
      ltude: {},
      areaType: '',
      city: '',//城市名
      cityId: {},//城市ID
      cityJson:'',
      positionJson: '',
      beginDate: '',//开始日期
      endDate: '',//离开日期
      dayCount: 0,
      gueseNumber: 1,//入住人数
      leaseType: '',//房间类型  2单间 1整租
      houseType: [],//户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0,//最低价
      maxPrice: 99999,//最高价
      sort: 2,//搜索方式 1推荐 2低价有限
      equipment: []
    },
    monitorDefaultData: {
      cityType: '',
      area: '',
      areaId: {},
      ltude: {},
      areaType: '',
      city: '',//城市名
      cityId: {},//城市ID
      cityJson: '',
      positionJson: '',
      beginDate: '',//开始日期
      endDate: '',//离开日期
      dayCount: 0,
      gueseNumber: 1,//入住人数
      leaseType: '',//房间类型  2单间 1整租
      houseType: [],//户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0,//最低价
      maxPrice: 99999,//最高价
      sort: 2,//搜索方式 1推荐 2低价有限
      equipment: []
    },
    hotPosition:[]
  }
})