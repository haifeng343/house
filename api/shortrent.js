import { api_address, tujia_address, xiaozhu_address, muniao_address, meituan_address } from "../utils/httpAddress.js"
const DEFAULT_PAGE = { size: 15, num: 1 };//默认分页参数

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

const tujiaClient = { "appId": "com.tujia.hotel", "appVersion": "203_203", "channelCode": "qqqudao", "devType": 2, "osVersion": "9" };
const tujiaReq = {
  /**
     * 查询列表, 考虑到通用其它渠道,筛选参数仅提供有限类型
     * @param cityId 当前城市ID
     * @param page 分页参数{size: 单页数量, num: 页码}
     * @param filter 筛选参数, 以下为所有支持的参数
     * {
     * beginDate: 开始日期,
     * endDate: 结束日期,
     * conditions: 其它过滤参数数组, 参考上面过滤条件给出的结果,注意gType为1的所有类型查询可以复选，gType为2中所有类型查询只能选择一个
     * {gType:1,type:6 入住人数, value取值范围501-509表示1到9人，510表示10人以上 }     ******仅供参考具体以过滤参数接口为准
     * {gType:2,type:5 行政区域或者位置信息或者定位坐标(定位坐标value值为14+"_"+经度+","+纬度)}  *********仅供参考具体以过滤参数接口为准
     * {gType:2,type:8 附近距离，单位米}
     * {gType:4,type:4 排序方式,参考其它渠道保留推荐1，好评5，低价2，高价3} *********仅供参考具体以过滤参数接口为准
     * {gType:1,type:6 户型  value为 1，2，3，4（四居及以上）}
     * {gType:1,type:6 出租类型 value为 901（整租），902（单间）}
     * {gType:1,type:6 配套设备 203（热水）,201（WIFI）,206（空调）,205（电视）,209（浴缸）,204（洗衣机）,202（电梯）,207（冰箱）,211（投影仪）,212（麻将机）}
     * {gType:1,type:7 价格}
     * }
     */
  searchList: function ({cityId, page = DEFAULT_PAGE, filter = {}}) {
    let conditions = [];
    conditions.push({ "gType": 0, "type": 1, "value": cityId });//添加城市ID
    filter.beginDate && conditions.push({ "gType": 0, "type": 2, "value": filter.beginDate });//开始日期
    filter.endDate && conditions.push({ "gType": 0, "type": 3, "value": filter.endDate });//结束日期
    filter.conditions && (conditions = conditions.concat(filter.conditions));//其它过滤参数
    let params = { "client": tujiaClient, "type": "searchhouse", "bi": "{\"picturemode\":\"big\"}", "parameter": { "conditions": conditions, "pageIndex": page.num - 1, "pageSize": page.size, "returnAllConditions": false } };
    return new Promise((resolve, reject) => {
      wx.request({
        url: tujia_address + '/bingo/app/search/searchhouse',
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(params),
        success: res => {
          if (typeof res.data ==='string'){
            res.data = JSON.parse(res.data.replace(/\r?\n/g, ''))
          }
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

const xzdzReq = {
 
}

const muniaoReq = {
  /**
     * 查询列表, 考虑到通用其它渠道,筛选参数仅提供有限类型
     * @param cityId 当前城市ID
     * @param page 分页参数{size: 单页数量, num: 页码}
     * @param filter 筛选参数, 以下为所有支持的参数
     * {
     * beginDate: 开始日期
     * endDate：结束日期
     * areaId：大区ID (和位置id、定位彼此冲突,只能选一个)
     * landmarkId:位置id (大区ID、定位彼此冲突,只能选一个)
     * lat: 纬度,在没有位置areaId和landmarkId的情况下传定位纬度，否则传对应位置的纬度
     * lng: 经度,在没有位置areaId和landmarkId的情况下传定位经度，否则传对应位置的经度
     * guestNum：人数
     * sort: 排序方式,参考其它渠道保留推荐0，好评7，低价2，高价1
     * roomNum：户型,数组 如[2]
     * rentType: 出租类型,数组 如[2] （整租1， 单间2）
     * priceMax： 最高价
     * priceMin： 最低价
     * support: 配套，数组如[2,17,9,7,3,5,8,22] （参考筛选条件返回结果）
     * }
     */
  searchList: function ({cityId, page = DEFAULT_PAGE, filter = {}}) {
    let params = { "cityId": cityId, "channel": "2013", "page": page.num };
    const { beginDate, endDate, areaId, landmarkId, lat, lng, guestNum, sort, roomNum, priceMax, priceMin, rentType, support } = filter;
    Object.assign(params, { beginDate, endDate, areaId, landmarkId, lat, lng, guestNum, sort, roomNum, priceMax, priceMin, rentType, support });
    params.searchType = landmarkId ? "2" : "1";//有具体位置则为2，否则为1
    return new Promise((resolve, reject) => {
      wx.request({
        url: muniao_address + '/V6_9_8/FK_Room_List',
        method: 'POST',
        header: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        data: JSON.stringify(params),
        success: res => {
          // console.log(res.data)
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

const zhenguoReq = {
  /**
     * 查询列表, 考虑到通用其它渠道,筛选参数仅提供有限类型
     * @param cityId 当前城市ID
     * @param page 分页参数{size: 单页数量, num: 页码}
     * @param filter 筛选参数, 以下为所有支持的参数
     * {
     *  dateBegin:开始日期
     *  dateEnd：结束日期
     *  locationId：位置id（包含区域商圈高校等） 从位置信息筛选接口获取，默认为-4
     *  locationCategoryId：位置分类（6:行政区，8附近，5：商圈，1：景区，2：高校，4：医院），默认填-4
     *  mrn_page_create_time：下拉刷新时间 科学计数法（上拉加载就不要更新时间了）
     *  currentTimeMillis：当前时间
     *  locationLongitude：区域经度或者定位经度 从位置信息筛选接口获取
     *  locationLatitude：区域纬度或者定位经度 从位置信息筛选接口获取
     *  minPrice：最低价（精确到分 需乘100）
     *  maxPrice: 最高价 （精确到分 需乘100）
     *  rentTypeList: 出租类型 数组 如 [0, 1] （0整租， 1单间， 2合住）
     *  minCheckInNumber：最低人数
     *  maxCheckInNumber：最高人数
     *  layoutRoomList: [1,2,3,4] 户型可以多选，数组
     *  facilities: [ 1, 4, 8, 9, 10, 14, 27, 35 ] 配套设备 (1:wifi, 4:电梯，8：电视，9：投影，10：空调，14：洗衣机，27：厨具，35：停车)
     *  sortType: 排序方式,参考其它渠道保留推荐0，好评1，低价2，高价3
     * }
     */
  searchList: function ({cityId, page = DEFAULT_PAGE, filter = {}}) {
    let params = { cityId, pageSize: page.size, pageNow: page.num, rawOffset: 28800, locationGroupId: -4, bigMode: true };
    let searchQuery = buildParams({ uuid: "4E1152E2A94EB1A00D492D77671C9FD5C12E7D402D46228E8D022E63B47410DF", phx_appnm: "phoenix" }, true);
    const { dateBegin, dateEnd, locationId, locationCategoryId, mrn_page_create_time, currentTimeMillis, locationLongitude, locationLatitude, minPrice, maxPrice, minCheckInNumber, maxCheckInNumber, layoutRoomList } = filter;
    Object.assign(params, { dateBegin, dateEnd, locationId, locationCategoryId, mrn_page_create_time, currentTimeMillis, locationLongitude, locationLatitude, minPrice, maxPrice, minCheckInNumber, maxCheckInNumber, layoutRoomList });
    return new Promise((resolve, reject) => {
      wx.request({
        url: muniao_address + '/search/api/v2/searchProduct/search?' + searchQuery,
        method: 'POST',
        header: {
          'Content-Type': 'application/json8'
        },
        data: JSON.stringify(params),
        success: res => {
          // console.log(res.data)
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
  tujiaReq,
  xzdzReq,
  muniaoReq,
  zhenguoReq
}