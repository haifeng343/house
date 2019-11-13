
import Http from "./utils/http";
import getIndexHouseData from "./utils/indexHouseData"
import getIndexLongHouseData from "./utils/indexLongHouseData"
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

    getIndexHouseData(this)
    getIndexLongHouseData()

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
      sort: 1,//搜索方式 1推荐 2低价有限
      equipment: ['1','2']
    },
    monitorSearchData: {
      cityType: '',
      area: '',
      areaId: {},//存各个平台数据信息
      areaType: 0,//0:未选择 1：行政区 2：地铁 3：附近 4：小区 5：线路 6：商圈
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
    searchLongData: {
      chooseType: 1, //1品牌中介，2个人房源
      city: '',//城市名
      cityId: {},//城市ID
      cityJson: '',
      area:'',// 地点
      areaId: {},//地点标识
      areaType: '',//地点类型
      ltude:{},//经纬度
      longBuildAreas: -1,//0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
      longFloorTypes: [],//1: 低楼层, 2: 中楼层, 3: 高楼层
      longHeadings: [],//{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
      longHouseTags: [],//1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
      longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
      longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
      longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
      minPrice: 0,//最低价
      maxPrice: 5500,//最高价 不限99999
    },
    monitorSearchLongData: {
      chooseType: 1, //1品牌中介，2个人房源
      city: '',//城市名
      cityId: {},//城市ID
      cityJson: '',
      longBuildAreas: -1,//0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
      longFloorTypes: [],//1: 低楼层, 2: 中楼层, 3: 高楼层
      longHeadings: [],//{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
      longHouseTags: [],//1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
      longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
      longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
      longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
      minPrice: 0,//最低价
      maxPrice: 5500,//最高价 不限99999
    },
    monitorDefaultSearchLongData: {
      chooseType: 1, //1品牌中介，2个人房源
      city: '',//城市名
      cityId: {},//城市ID
      cityJson: '',
      longBuildAreas: -1,//0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
      longFloorTypes: [],//1: 低楼层, 2: 中楼层, 3: 高楼层
      longHeadings: [],//{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
      longHouseTags: [],//1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
      longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
      longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
      longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
      minPrice: 0,//最低价
      maxPrice: 5500,//最高价 不限99999
    },
    hotPosition:[]
  }
})