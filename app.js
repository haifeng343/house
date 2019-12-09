import Http from "./utils/http";
import getIndexHouseData from "./utils/indexHouseData";
import getIndexLongHouseData from "./utils/indexLongHouseData";
import getIndexSecondHouseData from "./utils/indexSecondHouseData";
import { authSubject } from "./utils/auth";
import { doWechatLogin } from "./utils/wx";
import fecha from "./utils/fecha";
//app.js
App({
  onLaunch: function() {
    console.log("onLaunch啦");
    doWechatLogin()
      .then(resp => {
        console.log("登录成功啦");
        const token = resp.data.token;
        this.globalData.isAuth = true;
        wx.setStorageSync("token", token);
        // 注意: 不要把这代码段放在存储token之前
        authSubject.next(true);
        // 注意: 不要把这代码段放在存储token之前
        Http.get("/fdd/user/userInfo.json", { token }).then(resp => {
          this.globalData.isUserBindPhone = !!resp.data.userBase.mobile;
          this.globalData.isUserBindPublic = !!resp.data.publicOpenId;
        });
      })
      .catch(error => {
        console.error(error);
        console.error("登录失败啦!789");
        this.globalData.isAuth = false;
      });

    Http.get("/fdd/common/getHolidays.json").then(resp => {
      const holidays = JSON.parse(resp.data);
      const holidaysObj = {};
      for (const [key, value] of holidays) {
        holidaysObj[key] = value;
      }
      wx.setStorageSync("holidays", JSON.stringify(holidaysObj));
    });

    getIndexHouseData(this);
    getIndexLongHouseData();
    getIndexSecondHouseData();
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
      cityType: "",
      area: "",
      areaId: {},
      ltude: {},
      areaType: "",
      city: "", //城市名
      cityId: {}, //城市ID
      beginDate: fecha.format(new Date(), "YYYY-MM-DD"), //开始日期
      endDate: fecha.format(
        new Date().getTime() + 24 * 60 * 60 * 1000,
        "YYYY-MM-DD"
      ), //离开日期
      dayCount: 0,
      gueseNumber: -1, //入住人数
      leaseType: "", //房间类型  2单间 1整租
      houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0, //最低价
      maxPrice: 99999, //最高价
      sort: 1, //搜索方式 1推荐 2低价有限
      equipment: ["1", "2"],
      advSort:1,//2 从低到高 3高到底
    },
    monitorSearchData: {
      cityType: "",
      area: "",
      areaId: {}, //存各个平台数据信息
      areaType: "",
      city: "", //城市名
      cityId: {}, //城市ID
      cityJson: "",
      positionJson: "",
      beginDate: "", //开始日期
      endDate: "", //离开日期
      dayCount: 0,
      gueseNumber: 1, //入住人数
      leaseType: "", //房间类型  2单间 1整租
      houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0, //最低价
      maxPrice: 99999, //最高价
      sort: 2, //搜索方式 1推荐 2低价有限
      equipment: [],
      advSort: 1,//2 从低到高 3高到底
    },
    monitorDefaultData: {
      cityType: "",
      area: "",
      areaId: {},
      ltude: {},
      areaType: "",
      city: "", //城市名
      cityId: {}, //城市ID
      cityJson: "",
      positionJson: "",
      beginDate: "", //开始日期
      endDate: "", //离开日期
      dayCount: 0,
      gueseNumber: 1, //入住人数
      leaseType: "", //房间类型  2单间 1整租
      houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0, //最低价
      maxPrice: 99999, //最高价
      sort: 2, //搜索方式 1推荐 2低价有限
      equipment: [],
      advSort: 1,//2 从低到高 3高到底
    },
    searchLongData: {
      chooseType: 1, //1品牌中介，2个人房源
      city: "", //城市名
      cityId: {}, //城市ID
      cityJson: "",
      area: "", // 地点
      areaId: {}, //地点标识
      areaType: 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
      areaJson: "", //json
      longBuildAreas: -1, //0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
      longFloorTypes: [], //1: 低楼层, 2: 中楼层, 3: 高楼层
      longHeadings: [], //{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
      longHouseTags: [], //1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
      longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
      longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
      longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
      minPrice: 0, //最低价
      maxPrice: 5500, //最高价 不限99999,
      advSort: 0,//1 价格从低到高 2面积高到底 11 价格从高到低 21 面积从低到高 
    },
    monitorSearchLongData: {
      chooseType: 1, //1品牌中介，2个人房源
      city: "", //城市名
      cityId: {}, //城市ID
      cityJson: "",
      area: "", // 地点
      areaId: {}, //地点标识
      areaType: 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
      areaJson: "", //json
      longBuildAreas: -1, //0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
      longFloorTypes: [], //1: 低楼层, 2: 中楼层, 3: 高楼层
      longHeadings: [], //{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
      longHouseTags: [], //1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
      longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
      longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
      longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
      minPrice: 0, //最低价
      maxPrice: 5500, //最高价 不限99999
      advSort: 0,//1 价格从低到高 2面积高到底 11 价格从高到低 21 面积从低到高 
    },
    monitorDefaultSearchLongData: {
      chooseType: 1, //1品牌中介，2个人房源
      city: "", //城市名
      cityId: {}, //城市ID
      cityJson: "",
      area: "", // 地点
      areaId: {}, //地点标识
      areaType: 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
      areaJson: "", //json
      longBuildAreas: -1, //0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
      longFloorTypes: [], //1: 低楼层, 2: 中楼层, 3: 高楼层
      longHeadings: [], //{1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
      longHouseTags: [], //1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
      longLayouts: [], //1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
      longRentTypes: 0, //1: 整租, 2: 合租 3: 主卧, 4: 次卧
      longSortTypes: 0, //1: 低价优先, 2: 空间优先, 3: 最新发布
      minPrice: 0, //最低价
      maxPrice: 5500, //最高价 不限99999
      advSort: 0,//1 价格从低到高 2面积高到底 11 价格从高到低 21 面积从低到高 
    },
    secondSearchData:{
      city: "", //城市名
      cityId: {}, //城市ID
      cityJson: "",
      area: "", // 地点
      areaId: {}, //地点标识
      areaType: 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
      areaJson: "", //json
      minPrice: "", //最低价
      maxPrice: "", //最高价 不限"9999"
      placeholderMinPrice: "100", //城市最低价格
      placeholderMaxPrice: "200", //城市最高价格
      minArea: 0, //最低面积
      maxArea: 90, //最高面积 上限150
      secondHouseDecorationMap: [], //装修  1: 毛坯房 2: 普通装修 3: 精装修
      secondHouseTagMap:[], //房源特色 1: 满二 2: 满五 3: 近地铁 4: 随时看房 5: VR房源 6: 新上房源
      secondHeadingMap:[], //朝向 1: 朝东 2: 朝西 3: 朝南 4: 朝北 10: 南北通透
      secondFloorTypeMap:[], //楼层 1: 低楼层 2: 中楼层 3: 高楼层
      secondHouseUseMap:[], //用途 1: 普通住宅 2: 别墅 3: 其他
      secondBuildingAgeMap:0, //楼龄 1: 5年以内 2: 10年以内 3: 15年以内 4: 20年以内 10: 20年以上
      secondLayoutMap:[], //户型 1: 一室 2: 二室 3: 三室 4: 四室 12: 四室以上
      secondSortTypeMap: 0, //房源偏好 1: 低总价优先 2: 低单价优先
    },
    hotPosition: []
  }
});
