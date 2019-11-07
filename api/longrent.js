import { api_address, wiwj_address, lianjia_address, fangtianxia_address1, fangtianxia_address2, wbtc_address } from "../utils/httpAddress.js"
const DEFAULT_PAGE = { size: 15, num: 1 };//默认分页参数
const LIAN_APP_ID = '20170324_android'
const LIAN_APP_SECRET = '93273ef46a0b880faf4466c48f74878f'
const SOUFUN_IMEI = '866135030723842';
const TONGCHENG_VER = '8.25.2';
var base64_encode = require("../utils/base64.js").base64_encode;
import { CryptoJS } from "../utils/sha1.js"
import { xml2json } from "../utils/xml2json.js"
import MD5 from "../utils/md5"

/**
 * 链家签名算法
 * @param signStr
 * @returns {*}
 */
function authSign(signStr) {
  signStr = LIAN_APP_SECRET + signStr
  signStr = LIAN_APP_ID + ":" + CryptoJS.SHA1(signStr)
  return base64_encode(signStr)
}

/**
 * 生成链家签名字符串
 * @param params
 */
function generateSignStr(params = {}) {
  let keys = Object.keys(params).sort();
  let s = "";
  for (let key of keys) {
    let val = params[key];
    if ((typeof val) == 'object') {
      s += key + "=" + JSON.stringify(val);
    } else if (val !== undefined) {//undefined类型不签名
      s += key + "=" + val;
    }
  }
  return s;
}

/**
 * 构建参数
 * @param data
 * @param encodeUrl
 * @returns {string}
 */
function buildParams(data, encodeUrl = false) {
  let params = [];
  if (data) for (let key of Object.getOwnPropertyNames(data)) {
    let value = data[key];
    if (typeof value == 'object') {
      value = JSON.stringify(value);
      params.push(key + "=" + (encodeUrl ? encodeURIComponent(value) : value));
    } else if (value !== undefined) {//undefined 类型不予提交
      params.push(key + "=" + (encodeUrl ? encodeURIComponent(value) : value));
    }
  }
  return params.join("&");
}

/**
 * 生成同城签名
 * @param signStr
 */
function generateTongChengSign(signStr) {
  return MD5(signStr);
}

const wiwj = {
  // * lng: 经度,
  // * lat: 纬度,
  // * nearby: 附近距离, 单位公里，参数范围（不传，1，2，5, 单选）
  // * districtids: 大区编号,
  // * sqids: 区域编号,
  // * communityid: 小区编号，从提示列表中获取
  // * zn: 提示文字，从提示列表中获取
  // * searchtype: 搜索类型（1：大区，2：商圈或者地铁线路，3：小区，5：地铁站）
  // * lineid: 地铁线路编号,
  // * stationid: 地铁站点编号,
  // * price: 价格区间, 单位元(最低价, 最高价),
  // * broom: 卧室数量(1, 2, 3, 4, 5, 9  9表示5室以上, 可以多选逗号分隔, 考虑链家只有四室以上, 将5室和5室以上合并为四室以上),
  //    * renttype: 租房类型（1：整租，2：合租, 单选）
  //    * buildarea: 建筑面积(最低, 最高), 考虑到链家没有租房面积，废弃该参数
  // * heading: 朝向(10：南北，3：南，1：东，2：西，4：北, 可以多选逗号分隔),
  //    * floortype: 楼层（-1：底层, 1：低楼层, 2：中楼层, 3：高楼层, 999：顶层, 可以多选逗号分隔, 考虑链家只有3个类型把底层和低楼层合并为低层, 高楼层和顶层合并为高层）,
  //    * decoratetype: 装修（1：毛坯，2：普通，3：精装，可以多选逗号分隔）考虑到链家没有装修类型，废弃该参数
  // * keywords: 搜索关键词 注意关键词和区域地铁彼此冲突只能选一个
  //   * psort: 排序（空字符串：默认，1：低价，2：高价, 3: 小面积, 4: 大面积）
  //    * tags: 标签（1：近地铁, 4: 随时看, 16: 可短租, 32: 拎包入住, 64: 集中供暖, 4095: 业主自荐, 4103: 7日新上, 可多选逗号分隔）
  rentSearch: function ({ city, page = DEFAULT_PAGE, filter = {} }) {
    let params = { page: page.num, pcount: page.size };
    const { lng, lat, nearby, sqids, districtids, searchtype, communityid, zn, stationid, lineid, price, broom, renttype, buildarea, heading, floortype, decoratetype, keywords, psort, tags } = filter;
    if (lng && lat) {//位置信息
      params.location = lng + ',' + lat;
    }
    Object.assign(params, { nearby, sqids, districtids, searchtype, communityid, zn, stationid, lineid, price, broom, renttype, buildarea, heading, floortype, decoratetype, keywords, psort, tags });
    return new Promise((resolve, reject) => {
      wx.request({
        url: wiwj_address + '/appapi/rent/' + city + '/v1/prolist',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: buildParams(params, true),
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          resolve(false)
          throwErrorResponse()
        }
      })
    })
  },
  // searchType: 1（行政区）， 2（商圈）， 3（小区）， 4（线路），5（站点）
  rentTip: function ({city, keywords}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: wiwj_address + '/appapi/search/' + city + '/v1/searchhome',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: { keywords: keywords, searchtype:2},
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          resolve(false)
          throwErrorResponse()
        }
      })
    })
  }
}

const lianjia = {
  // * {
  //    * condition: 合并条件 例如格式：xiacheng / bp0ep100ba100ea200l1f1gh1lc1de1rs,
  //    * }
  //    * 以下为合并条件参数说明:
  //   * 区域拼音+/  表示区域范围,如deshengdong/
  //     * li + 地铁线路Id + /    表示地铁线路范围,如li1820035120370916/
  //     * li + 地铁线路Id + s + 地铁站点Id + /  表示地铁站点范围,如li1820035120370916s100021572/
  //     * 以上合并条件只能同时存在一个 并且和下面附近距离五个参数冲突
  //    * poi为附近距离，单位米，
  // * lat为位置纬度（用于计算附近距离），6位有效数字
  //   * lng为位置经度（用于计算附近距离），6位有效数字
  //     * ra为面积（0: "≤40㎡", 1："40-60㎡", 2: "60-80㎡", 3: "80-100㎡", 4: "100-120㎡", 5: "≥120㎡" 单选）
  // * brp为最低租金
  //    * erp为最高租金
  //    * l为户型(0: 一居,1：二居,2：三居,3：四居和以上, 可多选如l1l2l3l4l5)
  //    * rt为租房类型（200600000001: 整租, 200600000002: 合租，代码可从租房筛选参数获取）
  // * f为朝向（100500000001: 东, 100500000005: 西, 100500000003: 南, 100500000007: 北, 100500000009: 南北  代码可租房筛选参数获取， 可多选）
  // * lc为楼层（200500000003: 低楼层, 200500000002: 中楼层, 200500000001: 高楼层  代码从租房筛选参数获取 可多选）
  // * rs为关键词 注意关键词和区域地铁彼此冲突只能选一个
  //    * r为排序（co21低价，co22: 高价， co31: 小面积，co32: 大面积，不传为默认）
  // * 亮点信息su1: 近地铁 bc1: 拎包入住 de1: 精装修  ct1: 集中供暖 rpw1: 押一付一 in1: 新上 ht1: 认证公寓 hk1: 随时看房 vr1: VR房源
  rentSearch: function ({city, page = DEFAULT_PAGE, filter = {}}) {
    let params = { city_id: city, offset: (page.num - 1) * page.size, limit: page.size, condition: filter.condition };
    let signStr = generateSignStr(params);
    let queryStr = buildParams(params, true);
    let auth = authSign(signStr);
    return new Promise((resolve, reject) => {
      wx.request({
        url: lianjia_address + '/Rentplat/v2/house/list?' + queryStr,
        method: 'GET',
        header: {
          Authorization: auth
        },
        data: buildParams(params, true),
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          resolve(false)
          throwErrorResponse()
        }
      })
    })
  },
  // type: bizcircle（商圈）， station（地铁站）， resblock（小区）， district（行政区）
  rentTip: function ({city, keywords}) {
    let queryUrl = `city_id=${city}&channel=rent&query=${encodeURIComponent(keywords)}`;
    let auth = authSign(`channel=rentcity_id=${city}query=${keywords}`);
    return new Promise((resolve, reject) => {
      wx.request({
        url: lianjia_address + '/Rentplat/v1/mapsug?' + queryUrl,
        method: 'GET',
        header: {
          Authorization: auth
        },
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          resolve(false)
          throwErrorResponse()
        }
      })
    })
  }
}

const fangtianxia = {
  // *   district: 大区名称
  //    *   comarea: 小区名称
  //    *   search_text: 地铁信息, 站点多个用逗号分隔如（湘湖站, 滨康路站）全线就直接用线路名称如（1号线）
  // *   X1: 附近经度,
  // *   Y1: 附近纬度,
  // *   distance: 附近距离 单位千米, 默认2千米
  //    * pricerange: 价格区间 数组[最低, 最高] 单位元
  //    * rtype: 出租类型(zz: 整租，hz: 合租)
  //    *   room：户型(1,2,3,4,5,99) 99表示5居以上，可以多选，逗号分隔
  //    * towards: 朝向(南北, 东西, 南, 东南, 西南, 北, 东北, 西北, 东, 东北, 东南, 西, 西北, 西南) 可多选，逗号分隔
  //    * key：搜索关键词
  //    * orderby：排序（3：高价，4：低价，8：小面积，7：大面积， 不传为默认）
  // *   tags: 标签（ 逗号分隔）
  rentSearch: function ({ city, page = DEFAULT_PAGE, filter = {} }) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: api_address + '/house/search/rent',
        method: 'POST',
        header: {},
        data: {
          ftx: { city, page, filter }
        },
        success: res => {
          resolve(xml2json(res.data.ftx))
        },
        fail: res => {
          resolve(false)
          throwErrorResponse()
        }
      })
    })
  },
  rentTip: function ({city, keywords}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: api_address + '/house/tip/rent',
        method: 'POST',
        header: {},
        data: {
          ftx: { city, keywords }
        },
        success: res => {
          console.log(xml2json(res.data.ftx))
          resolve(xml2json(res.data.ftx))
        },
        fail: res => {
          resolve(false)
          throwErrorResponse()
        }
      })
    })
  }
}

const wbtc = {
  // location: 位置信息(城市, 大区, 小区) 如79, 81, 2996
    //  * geoia：坐标信息，（纬度, 经度） 如30.000, 120.000
    //  * circleLon：附近距离经度，仅在使用附近查询时传参
    //  * circleLat：附近距离纬度，仅在使用附近查询时传参
    //  * key：搜索关键词
    //  * filterParams: 额外筛选参数
    //  * {
    //   *   "filterArea": "xihuqu", 大区dirname
    //  * "filterLocal": "cuiyuan", 小区dirname, 如果小区没有，填大区dirname
    //  * "param12557": "2617", 站点id, 可以多选逗号分隔
    //  * "ditieId": "40" 线路id
    //     * "distance": "default" 附近距离默认default 其它选项1000， 3000， 5000
    //  * "param1016--param1610": 租金区间 如"500_1000"
    //  * "cateid": 出租类型("8": 整租, "10": 合租)
    //  *   "param1590--param1612": 户型，可多选 （"1"：一室, "2"：二室, "3"：三室, "4|5|6|7"：四室及以上）
    //   *   "param1021--param1058": 朝向，可多选（"1#7#9--1#5#11": 东，"2#7#8--2#5#6": 南，"3#8#10--3#6#12"：西，"4#9#10--4#11#12"：北，"5--10": 南北）
    //   *   "sort": 排序 （"zufangprice_asc"：低价，"zufangprice_desc": 高价, "zufangarea_asc": 小面积，"zufangarea_desc": 大面积， 不传为默认）
    //   *   "param12135--param12482": 标签，可多选 字符串逗号分隔 （详见标签信息）
  rentSearch: function ({ city, page = DEFAULT_PAGE, filter = {} }) {
    let sidDict = { "PGTID": "194983956205443570889119688", "GTID": "102183851205443989792845262", "nameoflist": "23_index|gerenfangyuan|b" };
    let tParams = { "list_from": "index|gerenfangyuan|b", "list_extra": "geren", "showFilterNum": true };
    let ts = new Date().valueOf();
    let signature = generateTongChengSign(city + TONGCHENG_VER + "android" + SOUFUN_IMEI + "" + ts);
    let params = { tabkey: "allcity", action: "getListInfo", curVer: TONGCHENG_VER, appId: 1, signature, page: page.num, localname: city, os: "android", format: "json", geotype: "baidu", v: 1, ts, sidDict: JSON.stringify(sidDict), params: JSON.stringify(tParams) };
    let { location, filterParams, geoia, key, circleLon, circleLat } = filter;
    if (filterParams) {
      filterParams = JSON.stringify(filterParams);
    }
    Object.assign(params, { location, filterParams, geoia, key, circleLon, circleLat });
    return new Promise((resolve, reject) => {
      wx.request({
        url: wbtc_address + '/api/list/chuzu?' + buildParams(params, true),
        method: 'GET',
        header: {
          imei: SOUFUN_IMEI,
          productorid: 1
        },
        data: buildParams(params, true),
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          resolve(false)
          throwErrorResponse()
        }
      })
    })
  },
  rentTip: function ({city, keywords}) {
    let params = { action: "getHouseOnMapSuggestion", curVer: TONGCHENG_VER, appId: 1, v: 1, searchKey: keywords, format: "json", localname: city, os: "android" };
    return new Promise((resolve, reject) => {
      wx.request({
        url: wbtc_address + '/api/list/chuzu?' + buildParams(params, true),
        method: 'GET',
        header: {
          imei: SOUFUN_IMEI,
          productorid: 1
        },
        data: buildParams(params, true),
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          resolve(false)
          throwErrorResponse()
        }
      })
    })
  }
}

module.exports = { 
  wiwj,
  lianjia,
  fangtianxia,
  wbtc
}