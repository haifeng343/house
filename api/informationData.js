import { tujia_address2, xiaozhu_address2, muniao_address2, meituan_address, wiwj_address, lianjia_address2, lianjia_address3, lianjia_address1 } from "../utils/httpAddress.js";
var base64_encode = require("../utils/base64.js").base64_encode;
import { CryptoJS } from "../utils/sha1.js";
import { xml2json } from "../utils/xml2json.js";
import MD5 from "../utils/md5";

const tujia = {
  getData: function (houseId) {
    let data = { houseId: houseId, preview: false }
    return new Promise((resolve, reject) => {
      wx.request({
        url: tujia_address2 + "/mphouse/gethouse",
        method: "POST",
        data: data,
        success: res => {
          if (res.data) {
            // console.log(res.data)
            let data = res.data.data || {}
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let request = {
              houseId: '', //房子id
              houseName: '', //标题
              houseTags: [], //标签
              housePicture: [], //图片
              houseSummarys: [], //头部特点
              houseFacilitys: [], //配套设施
              checkInRules: [], //入住须知
              landlordInfo: {} //房东介绍
            }
            if (data.houseId) {
              request.houseId = data.houseId
            }
            if (data.houseName) {
              request.houseName = data.houseName
            }
            if (data.houseTags && data.houseTags.length) {
              for (let index = 0; index < data.houseTags.length; index++) {
                if (data.houseTags[index].text) {
                  request.houseTags.push(data.houseTags[index].text)
                }
              }
            }
            if (data.housePicture && data.housePicture.housePics && data.housePicture.housePics.length) {
              for (let index = 0; index < data.housePicture.housePics.length; index++) {
                if (data.housePicture.housePics[index].url) {
                  request.housePicture.push(data.housePicture.housePics[index].url)
                }
              }
            }
            if (data.houseSummarys && data.houseSummarys.length) {
              for (let index = 0; index < data.houseSummarys.length; index++) {
                if (data.houseSummarys[index].title) {
                  request.houseSummarys.push(data.houseSummarys[index].title)
                }
              }
            }
            if (data.houseFacility && data.houseFacility.houseFacilitys && data.houseFacility.houseFacilitys.length) {
              for (let temp = 0; temp < data.houseFacility.houseFacilitys.length; temp++ ) {
                let listTemp = data.houseFacility.houseFacilitys[temp]
                if (listTemp.groupName == '基础设施') {
                  for (let index = 0; index < listTemp.facilitys.length; index++) {
                    if (listTemp.facilitys[index].name) {
                      request.houseFacilitys.push(listTemp.facilitys[index].name)
                    }
                  }
                }
              }
            }
            if (data.checkInRules && data.checkInRules.length) {
              for (let index = 0; index < data.checkInRules.length; index++) {
                if (data.checkInRules[index].title) {
                  let item = { items:[] };
                  item.title = data.checkInRules[index].title
                  item.checkInRuleFloat = data.checkInRules[index].checkInRuleFloat
                  for(let temp = 0; temp < data.checkInRules[index].items.length; temp++ ){
                    item.items.push({ title: data.checkInRules[index].items[temp].introduction, isDeleted: data.checkInRules[index].items[temp].isDeleted})
                  }
                  request.checkInRules.push(item)
                }
              }
            }
            if (data.landlordInfo) {
              let landlordInfo = { hotelName: '', hotelLogo: '', hotelTags: [], reply_rate: '', reply_time: '' }
              if (data.landlordInfo.hotelName) {
                landlordInfo.hotelName = data.landlordInfo.hotelName
              }
              if (data.landlordInfo.hotelLogo) {
                landlordInfo.hotelLogo = data.landlordInfo.hotelLogo
              }
              if (data.landlordInfo.hotelTags && data.landlordInfo.hotelTags.length) {
                for (let index = 0; index < data.landlordInfo.hotelTags.length; index++) {
                  if (data.landlordInfo.hotelTags[index].text) {
                    landlordInfo.hotelTags.push(data.landlordInfo.hotelTags[index].text)
                  }
                }
              }
              request.landlordInfo = landlordInfo
            }
            resolve(request);
          } else {
            reject(false);
          }
        },
        fail: res => {
          reject(false);
        }
      });
    });
  }
};

const xiaozhu = {
  getData: function (houseId) {
    let timer = new Date().getTime()
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${xiaozhu_address2}/app/xzfk/WeChatApplet/5.12.0/lucenter/luDetailPage?hideLoading=true&luId=${houseId}&t=${timer}`,
        method: "GET",
        success: res => {
          if (res.data) {
            // console.log(res.data)
            let data = res.data.content || {}
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let request = {
              houseId: houseId,//房子id
              houseName: '', //标题
              houseTags: [], //标签
              housePicture: [], //图片
              houseSummarys: [], //头部特点
              houseFacilitys: [], //配套设施
              checkInRules: [], //入住须知
              landlordInfo: {} //房东介绍
            }
            if (data.luDetail && data.luDetail.lodgeUnitName) {
              request.houseName = data.luDetail.lodgeUnitName
            }
            if (data.luTags && data.luTags.length) {
              for (let index = 0; index < data.luTags.length; index++) {
                if (data.luTags[index].title) {
                  request.houseTags.push(data.luTags[index].title)
                }
              }
            }
            if (data.images && data.images.length) {
              for (let index = 0; index < data.images.length; index++) {
                if (data.images[index].imgUrl) {
                  request.housePicture.push(data.images[index].imgUrl)
                }
              }
            }
            //头部特点分四块
            if (data.luDetail && data.luDetail.leaseType) {
              request.houseSummarys.push(data.luDetail.leaseType)
            }
            if (data.luDetail && data.luDetail.houseType) {
              request.houseSummarys.push(data.luDetail.houseType)
            }
            if (data.bed && data.bed.bedGuestTip) {
              request.houseSummarys.push(data.bed.bedGuestTip)
            }
            if (data.addTenant && data.addTenant.addTenant && data.addTenant.addTenantTip) {
              request.houseSummarys.push(data.addTenant.addTenantTip)
            }

            if (data.facility && data.facility.length){
              for (let temp = 0; temp < data.facility.length; temp++) {
                let listTemp = data.facility[temp]
                for (let index = 0; index < listTemp.items.length; index++) {
                  if (listTemp.items[index].name) {
                    request.houseFacilitys.push(listTemp.items[index].name)
                  }
                }
              }
            }

            if (data.bookNotice && data.bookNotice.dealRule && data.bookNotice.dealRule.length) {
              for (let index = 0; index < data.bookNotice.dealRule.length; index++) {
                if (data.bookNotice.dealRule[index].name) {
                  let item = { items: [] };
                  item.title = data.bookNotice.dealRule[index].name
                  item.checkInRuleFloat = false
                  item.items.push({ title: data.bookNotice.dealRule[index].detail, isDeleted:false })
                  request.checkInRules.push(item)
                }
              }
            }

            if (data.landlord) {
              let landlordInfo = { hotelName: '', hotelLogo: '', hotelTags: [], reply_rate: '', reply_time: '' }
              if (data.landlord.landlordName) {
                landlordInfo.hotelName = data.landlord.landlordName
              }
              if (data.landlord.headImageUrl) {
                landlordInfo.hotelLogo = data.landlord.headImageUrl
              }
              if (data.landlord.realIdentity) {
                landlordInfo.hotelTags.push("实名认证")
              }
              request.landlordInfo = landlordInfo
            }

            resolve(request);
          } else {
            reject(false);
          }
        },
        fail: res => {
          reject(false);
        }
      });
    });
  }
};

const muniao = {
  getData: function (houseId) {
    let data = { roomId: houseId }
    return new Promise((resolve, reject) => {
      wx.request({
        url: muniao_address2 + "/V2_0/FK_Room_Detail",
        method: "POST",
        data: data,
        success: res => {
          if (res.data) {
            console.log(res.data)
            let data = res.data.room || {}
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let request = {
              houseId: houseId, //房子id
              houseName: '', //标题
              houseTags: [], //标签
              housePicture: [], //图片
              houseSummarys: [], //头部特点
              houseFacilitys: [], //配套设施
              checkInRules: [], //入住须知
              landlordInfo: {} //房东介绍
            }
            if (data.title) {
              request.houseName = data.title
            }
            //标签，3个
            if (data.room_type) {
              request.houseTags.push(data.room_type)
            }
            if (data.rent_type) {
              request.houseTags.push(data.rent_type)
            }
            if (data.size) {
              request.houseTags.push(data.size + '㎡')
            }

            if (data.photo && data.photo.length) {
              for (let index = 0; index < data.photo.length; index++) {
                if (data.photo[index].img_url) {
                  request.housePicture.push(data.photo[index].img_url)
                }
              }
            }

            //头部特点, 7块
            if (data.rent_type) {
              request.houseSummarys.push(data.rent_type)
            }
            if (data.room_type) {
              request.houseSummarys.push(data.room_type)
            }
            if (data.house_type) {
              request.houseSummarys.push(data.house_type)
            }
            if (data.max_num) {
              request.houseSummarys.push(data.max_num)
            }
            if (data.unit_str) {
              request.houseSummarys.push(data.unit_str)
            }
            if (data.bathroom_self || data.bathroom_pub) {
              request.houseSummarys.push((data.bathroom_self + data.bathroom_pub ) + '个卫生间')
            }
            if (data.beds && data.beds.count) {
              request.houseSummarys.push(data.beds.count + '张床')
            }

            if (data.support && data.support.length) {
              for (let index = 0; index < data.support.length; index++) {
                if (data.support[index].name) {
                  request.houseFacilitys.push(data.support[index].name)
                }
              }
            }

            // 入住须知 5个
            if (data.checkin_time) {
              let item = { items: [] };
              item.title = '最早入住时间'
              item.checkInRuleFloat = false
              item.items.push({ title: '当天' + data.checkin_time + ':00', isDeleted: false })
              request.checkInRules.push(item)
            }
            if (data.checkout_time) {
              let item = { items: [] };
              item.title = '最晚退房时间'
              item.checkInRuleFloat = false
              item.items.push({ title: '当天' + data.checkout_time + ':00', isDeleted: false })
              request.checkInRules.push(item)
            }
            if (data.deposit && data.deposit.is_deposit) {
              let item = { items: [] };
              item.title = '线下押金'
              item.checkInRuleFloat = false
              item.items.push({ title: data.deposit.money, isDeleted:false })
              request.checkInRules.push(item)
            }
            if (data.need_idcard) {
              let item = { items: [] };
              item.title = '身份证'
              item.checkInRuleFloat = false
              item.items.push({ title: "需要", isDeleted: false })
              request.checkInRules.push(item)
            } else {
              let item = { items: [] };
              item.title = '身份证'
              item.checkInRuleFloat = false
              item.items.push({ title: "不需要", isDeleted: false })
              request.checkInRules.push(item)
            }
            if (data.rule && data.rule.length) {
              let item = { items: [] };
              item.title = '对客要求'
              item.checkInRuleFloat = true
              for (let index = 0; index < data.rule.length; index++) {
                item.items.push({ title: data.rule[index].name, isDeleted: data.rule[index].is_show === 1 ? true : false })
              }
              request.checkInRules.push(item)
            }


            if (data.host) {
              let landlordInfo = { hotelName: '', hotelLogo: '', hotelTags: [], reply_rate: '', reply_time: '' }
              if (data.host.name) {
                landlordInfo.hotelName = data.host.name
              }
              if (data.host.pic) {
                landlordInfo.hotelLogo = data.host.pic
              }
              if (data.host.hostlabel && data.host.hostlabel.length) {
                for (let index = 0; index < data.host.hostlabel.length; index++) {
                  if (data.host.hostlabel[index].labelname) {
                    landlordInfo.hotelTags.push(data.host.hostlabel[index].labelname)
                  }
                }
              }
              if (data.host.reply_rate) {
                landlordInfo.reply_rate = data.host.reply_rate + '%'
              }
              if (data.host.reply_time) {
                landlordInfo.reply_time = data.host.reply_time
              }
              request.landlordInfo = landlordInfo
            }
            resolve(request);
          } else {
            reject(false);
          }
        },
        fail: res => {
          reject(false);
        }
      });
    });
  }
};

const zhenguo = {
  getData: function (houseId) {
    let data = { productId: houseId, fieldList: [0, 200, 100, 2300] }
    return new Promise((resolve, reject) => {
      wx.request({
        url: meituan_address + "/cprod/api/v2/product/detail",
        method: "POST",
        data: data,
        success: res => {
          if (res.data) {
            // console.log(res.data)
            let data = res.data.data || {}
            data = data.product || {}
            data = data.productAllInfoResult || {}
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let request = {
              houseId: houseId, //房子id
              houseName: '', //标题
              houseTags: [], //标签
              housePicture: [], //图片
              houseSummarys: [], //头部特点
              houseFacilitys: [], //配套设施
              checkInRules: [], //入住须知
              landlordInfo: {} //房东介绍
            }
            if (data.title) {
              request.houseName = data.title
            }
            if (data.productTagInfoList && data.productTagInfoList.length) {
              for (let index = 0; index < data.productTagInfoList.length; index++) {
                if (data.productTagInfoList[index].tagName) {
                  request.houseTags.push(data.productTagInfoList[index].tagName)
                }
              }
            }

            if (data.productMediaInfoList && data.productMediaInfoList.length) {
              for (let index = 0; index < data.productMediaInfoList.length; index++) {
                if (data.productMediaInfoList[index].mediaUrl) {
                  request.housePicture.push(data.productMediaInfoList[index].mediaUrl)
                }
              }
            }

            //头部特点, 5块
            if (data.layoutRoom) {
              request.houseSummarys.push(data.layoutRoom + '间卧室')
            }
            if (data.layoutHall || data.layoutKitchen || data.layoutWc) {
              request.houseSummarys.push(data.layoutHall + '厅' + data.layoutKitchen + '厨' + data.layoutWc + '卫')
            }
            if (data.usableArea) {
              request.houseSummarys.push(data.usableArea + '㎡')
            }
            if (data.bedCount) {
              request.houseSummarys.push(data.bedCount +'张床')
            }
            if (data.maxGuestNumber) {
              request.houseSummarys.push('宜居' + data.maxGuestNumber + '人')
            }

            if (data.facilityList && data.facilityList.length) {
              for (let index = 0; index < data.facilityList.length; index++) {
                if (data.facilityList[index].value) {
                  request.houseFacilitys.push(data.facilityList[index].value)
                }
              }
            }

            // 入住须知 3个
            if (data.productRpInfo && data.productRpInfo.earliestCheckinTime) {
              let item = { items: [] };
              item.title = '最早入住时间'
              item.checkInRuleFloat = false
              item.items.push({ title: '当天' + data.productRpInfo.earliestCheckinTime, isDeleted: false })
              request.checkInRules.push(item)
            }
            if (data.productRpInfo && data.productRpInfo.latestCheckoutTime) {
              let item = { items: [] };
              item.title = '最晚退房时间'
              item.checkInRuleFloat = false
              item.items.push({ title: '当天' + data.productRpInfo.latestCheckoutTime, isDeleted: false })
              request.checkInRules.push(item)
            }
            if (data.guestNoticeList && data.guestNoticeList.length) {
              let item = { items: [] };
              item.title = '房东要求'
              item.checkInRuleFloat = true
              for (let index = 0; index < data.guestNoticeList.length; index++) {
                item.items.push({ title: data.guestNoticeList[index].value, isDeleted: data.guestNoticeList[index].metaValue === '1' ? true : false })
              }
              request.checkInRules.push(item)
            }
            let landlordInfo = { hotelName: '', hotelLogo: '', hotelTags: [], reply_rate: '', reply_time: '' }
            let hostId = data.hostId
            return new Promise((resolve, reject) => {
              wx.request({
                url: meituan_address + `/user/api/v1/user/info/${hostId}`,
                method: "GET",
                success: req => {
                  let reqData = req.data || {}
                  reqData = reqData.data || {}
                  if (Object.keys(reqData).length === 0) {
                    reject(false);
                  }
                  resolve(reqData)
                },
                fail: res=>{
                  reject(false)
                }
              })
            }).then(res=>{
              // console.log('user', res);
              if (res.nickName) {
                landlordInfo.hotelName = res.nickName
              }
              if (res.avatarUrl) {
                landlordInfo.hotelLogo = res.avatarUrl
              }
              if (res.isSuperHost) {
                landlordInfo.hotelTags.push('超赞房东')
              }
              if (res.hostEnterpriseVerifyStatus) {
                landlordInfo.hotelTags.push('实名认证')
              }
              if (res.replyTime) {
                landlordInfo.reply_time = parseInt(res.replyTime/60)
              }
              request.landlordInfo = landlordInfo
              resolve(request);
            }).catch(res=>{
              request.landlordInfo = landlordInfo
              resolve(request);
            })
          } else {
            reject(false);
          }
        },
        fail: res => {
          reject(false);
        }
      });
    });
  }
};

const listMap = { '1': '洗衣机', '2': '冰箱', '3': '电视', '4': '空调', '5': '热水器', '6': '天然气', '7': '暖气', '8': '床', '9': '网络', '10': '电梯' }
const wiwj = {
  getLongData: function ({ houseId, cityId }) {
    let data = { hid: houseId }
    return new Promise((resolve, reject) => {
      wx.request({
        url: wiwj_address + `/appapi/rent/${cityId}/v1/allinfo`,
        method: "POST",
        data: data,
        success: res => {
          if (res.data) {
            console.log(res.data)
            let data = res.data.data || {}
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let request = {
              houseId: houseId, //房子id
              houseName: '', //标题
              price: '', //售价
              layout: '', //户型
              buildarea: '', //面积
              houseTags: [], //标签
              looktime: '', //看房时间
              gettime: '', //入住
              houseFacilitys: [], //配套设施
              decoratelevel: '', //装修
              heading: '', //朝向
              floorStr: '', //楼层
              housePicture: [], //图片
              housememo: '', // 房源描述
              address: '', //小区名称
              startData: '', //建成年代
              communitytype: '', //建筑类型
              plotRatio: '', //容积率
              virescence: '', //绿化率
              house_address: '' //位置
            }
            let houseinfo = data.houseinfo || {}
            if (houseinfo.housetitle) {
              request.houseName = (houseinfo.rentmodename ? houseinfo.rentmodename + '/' : '') + houseinfo.housetitle
            }
            if (houseinfo.price) {
              request.price = houseinfo.price
            }
            if (houseinfo.tagwall && houseinfo.tagwall.length) {
              request.houseTags = houseinfo.tagwall
            }
            if (houseinfo.bedroom || houseinfo.livingroom || houseinfo.toilet) {
              request.layout = houseinfo.bedroom + '室' + houseinfo.livingroom + '厅' + houseinfo.toilet + '卫'
            }
            if (houseinfo.area) {
              request.buildarea = houseinfo.area
            }
            if (houseinfo.contacttime) {
              request.looktime = houseinfo.contacttime
            }
            // if (houseinfo.contacttime) {
            //   request.gettime = houseinfo.contacttime
            // }
            if (houseinfo.equipments && houseinfo.equipments.length) {
              for (let index = 0; index < houseinfo.equipments.length; index++) {
                if (listMap[houseinfo.equipments[index]]) {
                  request.houseFacilitys.push(listMap[houseinfo.equipments[index]])
                }
              }
            }
            if (houseinfo.decoratelevel) {
              request.decoratelevel = houseinfo.decoratelevel
            }
            if (houseinfo.heading) {
              request.heading = houseinfo.heading
            }
            if (houseinfo.floorStr) {
              request.floorStr = houseinfo.floorStr
            }
            if (houseinfo.imgs && houseinfo.imgs.length) {
              request.housePicture = houseinfo.imgs
            }
            if (houseinfo.memo1) {
              request.housememo = houseinfo.memo1
            }
            let community = data.community || {}
            if (community.address) {
              request.address = community.address
            }
            if (community.startData) {
              request.startData = community.startData
            }
            if (community.communitytype) {
              request.communitytype = community.communitytype
            }
            let communityid = '';
            if (data.houseinfo && data.houseinfo.communityid) {
              communityid = data.houseinfo.communityid
            }
            return new Promise((resolve, reject) => {
              wx.request({
                url: wiwj_address + `/community/2/v1/allinfo`,
                method: "POST",
                data: { communityid },
                success: req => {
                  let reqData = req.data || {}
                  reqData = reqData.data || {}
                  if (Object.keys(reqData).length === 0) {
                    reject(false);
                  }
                  resolve(reqData)
                },
                fail: res => {
                  reject(false)
                }
              })
            }).then(res => {
              let communityInfo = res.communityInfo || {}
              request.plotRatio = communityInfo.plotRatio || ''
              request.virescence = communityInfo.virescence || ''
              request.house_address = (communityInfo.qyname ? communityInfo.qyname + '-' : '') + (communityInfo.selladd ? communityInfo.selladd : '')
              resolve(request);
            }).catch(res => {
              resolve(request);
            })
          } else {
            reject(false);
          }
        },
        fail: res => {
          reject(false);
        }
      });
    });
  },
  getHouseData: function ({houseId,cityId}) {
    let data = { hid: houseId }
    return new Promise((resolve, reject) => {
      wx.request({
        url: wiwj_address + `/appapi/exchange/${cityId}/v1/allinfo`,
        method: "POST",
        data: data,
        success: res => {
          if (res.data) {
            // console.log(res.data)
            let data = res.data.data || {}
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let request = {
              houseId: houseId, //房子id
              houseName: '', //标题
              price: '', //售价
              layout: '', //户型
              buildarea: '', //面积
              houseTags: [], //标签
              looktime: '', //看房时间
              gettime: '', //入住
              decoratelevel: '', //装修
              heading: '', //朝向
              floorStr: '', //楼层
              housePicture: [], //图片
              memo:'', //核心卖点
              rim:'', //周边配套
              address: '', //小区名称
              xqprice: '', //小区均价
              salecount: '', //小区在售房源
              rentcount: '', //小区在租房源
              startData: '', //建成年代
              communitytype: '', //建筑类型
              plotRatio: '', //容积率
              virescence: '', //绿化率
              develop: '', //开发商
            }
            let houseinfo = data.houseinfo || {}
            if (houseinfo.housetitle) {
              request.houseName = houseinfo.housetitle
            }
            if (houseinfo.price) {
              request.price = houseinfo.price
            }
            if (houseinfo.tagwall && houseinfo.tagwall.length) {
              request.houseTags = houseinfo.tagwall
            }
            if (houseinfo.bedroom || houseinfo.livingroom || houseinfo.toilet) {
              request.layout = houseinfo.bedroom + '室' + houseinfo.livingroom + '厅' + houseinfo.toilet + '卫'
            }
            if (houseinfo.buildarea) {
              request.buildarea = houseinfo.buildarea
            }
            if (houseinfo.looktime) {
              request.looktime = houseinfo.looktime
            }
            if (houseinfo.decoratelevel) {
              request.decoratelevel = houseinfo.decoratelevel
            }
            if (houseinfo.heading) {
              request.heading = houseinfo.heading
            }
            if (houseinfo.floorStr) {
              request.floorStr = houseinfo.floorStr
            }
            if (houseinfo.imgs && houseinfo.imgs.length) {
              request.housePicture = houseinfo.imgs
            }
            if (houseinfo.memo && houseinfo.memo) {
              request.memo = houseinfo.memo
            }
            if (houseinfo.rim && houseinfo.rim) {
              request.rim = houseinfo.rim
            }

            let community = data.community || {}
            if (community.address) {
              request.address = community.address
            }
            if (community.price) {
              request.xqprice = community.price
            }
            if (community.salecount) {
              request.salecount = community.salecount
            }
            if (community.startData) {
              request.startData = community.startData
            }
            if (community.communitytype) {
              request.communitytype = community.communitytype
            }
            if (community.develop) {
              request.develop = community.develop
            }
            let communityid = '';
            if (data.houseinfo && data.houseinfo.communityid) {
              communityid = data.houseinfo.communityid
            }
            return new Promise((resolve, reject) => {
              wx.request({
                url: wiwj_address + `/community/2/v1/allinfo`,
                method: "POST",
                data: { communityid },
                success: req => {
                  let reqData = req.data || {}
                  reqData = reqData.data || {}
                  if (Object.keys(reqData).length === 0) {
                    reject(false);
                  }
                  resolve(reqData)
                },
                fail: res => {
                  reject(false)
                }
              })
            }).then(res => {
              let communityInfo = res.communityInfo || {}
              request.plotRatio = communityInfo.plotRatio || ''
              request.virescence = communityInfo.virescence || ''
              request.rentcount = communityInfo.rentcount || ''
              resolve(request);
            }).catch(res => {
              resolve(request);
            })
          } else {
            reject(false);
          }
        },
        fail: res => {
          reject(false);
        }
      });
    });
  }
};

const lianjia = {
  getLongData: function (r = { house_code: '', city_id: '' }) {
    let { house_code, city_id } = r;
    let ts = new Date().valueOf() / 1000;
    let signStr = 'cd02613a5cfaf7ad91e565d668b6056c' + `house_code=${house_code}` + `ts=${ts}` + 'v1/house/detail'
    let sign = MD5(signStr);
    return new Promise((resolve, reject) => {
      wx.request({
        url: lianjia_address1 + `/v1/house/detail?house_code=${house_code}&ts=${ts}`,
        method: "GET",
        header: {
          "rent-sign": sign,
          "rent-app-id": "rent-xcx"
        },
        success: res => {
          if (res.data) {
            let data = res.data.data || {}
            console.log(data)
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let request = {
              houseId: r.house_code, //房子id
              houseName: '', //标题
              price: '', //售价
              layout: '', //户型
              buildarea: '', //面积
              houseTags: [], //标签
              looktime: '', //看房时间
              gettime: '', //入住
              houseFacilitys: [], //配套设施
              decoratelevel: '', //装修
              heading: '', //朝向
              floorStr: '', //楼层
              housePicture: [], //图片
              housememo: '', // 房源描述
              address: '', //小区名称
              startData: '', //建成年代
              communitytype: '', //建筑类型
              plotRatio: '', //容积率
              virescence: '', //绿化率
              house_address: '' //位置
            }
            let houseinfo = data.base_info || {}
            if (houseinfo.house_title) {
              request.houseName = houseinfo.house_title
            }
            if (houseinfo.rent_price_listing) {
              request.price = houseinfo.rent_price_listing
            }
            if (houseinfo.layout) {
              request.layout = houseinfo.layout
            }
            if (houseinfo.rent_area) {
              request.buildarea = houseinfo.rent_area
            }
            if (houseinfo.house_tags && houseinfo.house_tags.length) {
              for (let index = 0; index < houseinfo.house_tags.length; index++) {
                if (houseinfo.house_tags[index].name) {
                  request.houseTags.push(houseinfo.house_tags[index].name)
                }
              }
            }

            //入住时间，看房时间, 楼层
            if (houseinfo.meta_info && houseinfo.meta_info.length) {
              for (let index = 0; index < houseinfo.meta_info.length; index++) {
                if (houseinfo.meta_info[index].key === 'available_see_time') {
                  request.looktime = houseinfo.meta_info[index].desc
                }
                if (houseinfo.meta_info[index].key === 'available_rent_time') {
                  request.gettime = houseinfo.meta_info[index].desc
                }
                if (houseinfo.meta_info[index].key === 'floor_level') {
                  request.floorStr = houseinfo.meta_info[index].desc
                }
              }
            }

            let house_intro = data.house_intro || {}
            if (house_intro.furniture && house_intro.furniture.length) {
              for (let index = 0; index < house_intro.furniture.length; index++) {
                if (house_intro.furniture[index].name && house_intro.furniture[index].val) {
                  request.houseFacilitys.push(house_intro.furniture[index].name)
                }
              }
            }

            // if (houseinfo.decoration_type) {
            //   request.decoratelevel = houseinfo.decoration_type
            // }
            if (houseinfo.frame_orientation) {
              request.heading = houseinfo.frame_orientation
            }

            let house_picture = data.house_picture || {}
            if (house_picture && house_picture.length) {
              for (let index = 0; index < house_picture.length; index++) {
                request.housePicture.push(house_picture[index].house_picture_url)
              }
            }

            let house_feature = data.house_feature || {}
            house_feature = house_feature.content || {}
            house_feature = house_feature.list || {}
            if (house_feature.sellPoint && house_feature.sellPoint.desc) {
              request.memo = house_feature.sellPoint.desc
            }
            if (house_feature.surroundMating && house_feature.surroundMating.desc) {
              request.memo = house_feature.surroundMating.desc
            }

            // let community = data.community || {}
            if (houseinfo.resblock_name) {
              request.address = houseinfo.resblock_name
            }

            if (houseinfo && houseinfo.resblock_id) {
              let resblock_code = houseinfo.resblock_id
              let test = { resblock_code: resblock_code };
              let n = "resblock_code=" + resblock_code;
              n += "6e8566e348447383e16fdd1b233dbb49"
              n = "ljwxapp:" + (n = MD5(n))
              return new Promise((resolve, reject) => {
                wx.request({
                  url: lianjia_address3 + `/xiaoqu/detail?resblock_code=${resblock_code}`,
                  method: "GET",
                  header: {
                    authorization: base64_encode(n),
                    "lianjia-source": "ljwxapp",
                    "time-stamp": new Date().getTime()
                  },
                  success: req => {
                    let reqData = req.data || {}
                    reqData = reqData.data || {}
                    if (Object.keys(reqData).length === 0) {
                      reject(false);
                    }
                    resolve(reqData)
                  },
                  fail: res => {
                    reject(false)
                  }
                })
              }).then(res => {
                // console.log('user',res)
                let communityInfo = res.info || {}
                if (communityInfo.developers && communityInfo.developers.name) {
                  request.develop = ommunityInfo.developers.name
                }
                if (communityInfo.price_unit_avg) {
                  request.xqprice = ommunityInfo.price_unit_avg
                }
                if (communityInfo.building_year && communityInfo.building_year.length) {
                  request.startData = communityInfo.building_year[0]
                }
                if (communityInfo.building_types && communityInfo.building_types.length) {
                  request.communitytype = communityInfo.building_types[0]
                }
                if (communityInfo.bizcircle_name) {
                  request.house_address = communityInfo.bizcircle_name
                }
                resolve(request);
              }).catch(res => {
                resolve(request);
              })
            } else {
              resolve(request);
            }
          } else {
            reject(false);
          }
        },
        fail: res => {
          reject(false);
        }
      });
    });
  },
  getHouseData: function (r = { house_code: '', city_id: '' }) {
    let { house_code, city_id } = r;
    let n = "";
    Object.keys(r).sort().forEach(function (e) {
      void 0 !== r[e] ? n += e + "=" + ("object" === typeof(r[e]) ? JSON.stringify(r[e]) : r[e]) : delete r[e]
    })
    n += "6e8566e348447383e16fdd1b233dbb49"
    n = "ljwxapp:" + (n = MD5(n))
    return new Promise((resolve, reject) => {
      wx.request({
        url: lianjia_address2 + `/ershoufang/detail?house_code=${house_code}&city_id=${city_id}`,
        method: "GET",
        header: {
          authorization: base64_encode(n),
          "lianjia-source": "ljwxapp",
          "time-stamp": new Date().getTime()
        },
        success: res => {
          if (res.data) {
            let data = res.data.data || {}
            // console.log(data)
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let request = {
              houseId: r.house_code, //房子id
              houseName: '', //标题
              price: '', //售价
              layout: '', //户型
              buildarea: '', //面积
              houseTags: [], //标签
              looktime: '', //看房时间
              gettime: '', //入住
              decoratelevel: '', //装修
              heading: '', //朝向
              floorStr: '', //楼层
              housePicture: [], //图片
              memo: '', //核心卖点
              rim: '', //周边配套
              address: '', //小区名称
              xqprice: '', //小区均价
              salecount: '', //小区在售房源
              rentcount: '', //小区在租房源
              startData: '', //建成年代
              communitytype: '', //建筑类型
              plotRatio: '', //容积率
              virescence: '', //绿化率
              develop: '', //开发商
            }
            let houseinfo = data.house_info || {}
            if (houseinfo.title) {
              request.houseName = houseinfo.title
            }
            if (houseinfo.list_price) {
              request.price = houseinfo.list_price
            }
            if (houseinfo.tags && houseinfo.tags.length) {
              for (let index = 0; index < houseinfo.tags.length; index++ ) {
                if (houseinfo.tags[index].title) {
                  request.houseTags.push(houseinfo.tags[index].title)
                }
              }
            }
            if (houseinfo.frame_type) {
              request.layout = houseinfo.frame_type
            }
            if (houseinfo.house_area) {
              request.buildarea = houseinfo.house_area
            }
            // if (houseinfo.looktime) {
            //   request.looktime = houseinfo.looktime
            // }
            if (houseinfo.decoration_type) {
              request.decoratelevel = houseinfo.decoration_type
            }
            if (houseinfo.frame_orientation) {
              request.heading = houseinfo.frame_orientation
            }
            if (houseinfo.floor_level) {
              request.floorStr = houseinfo.floor_level + (houseinfo.floor_total ? '/' + houseinfo.floor_total :'')
            }
            if (houseinfo.picture_uri_list && houseinfo.picture_uri_list.length) {
              for (let index = 0; index < houseinfo.picture_uri_list.length; index++) {
                request.housePicture.push(houseinfo.picture_uri_list[index] + "!m_fill,w_750,h_562,lg_north_west,lx_0,ly_0,l_fbk,f_jpg,ls_50") 
              }
            }

            let house_feature = data.house_feature || {}
            house_feature = house_feature.content || {}
            house_feature = house_feature.list || {}
            if (house_feature.sellPoint && house_feature.sellPoint.desc) {
              request.memo = house_feature.sellPoint.desc
            }
            if (house_feature.surroundMating && house_feature.surroundMating.desc) {
              request.memo = house_feature.surroundMating.desc
            }

            // let community = data.community || {}
            if (houseinfo.resblock_name) {
              request.address = houseinfo.resblock_name
            }
            // if (community.salecount) {
            //   request.salecount = community.salecount
            // }
            if (houseinfo.building_year) {
              request.startData = houseinfo.building_year
            }
            if (houseinfo.building_type) {
              request.communitytype = houseinfo.building_type
            }
          
            if (houseinfo && houseinfo.resblock_id) {
              let resblock_code = houseinfo.resblock_id
              let test = { resblock_code: resblock_code };
              let n = "resblock_code=" + resblock_code;
              n += "6e8566e348447383e16fdd1b233dbb49"
              n = "ljwxapp:" + (n = MD5(n))
              return new Promise((resolve, reject) => {
                wx.request({
                  url: lianjia_address3 + `/xiaoqu/detail?resblock_code=${resblock_code}`,
                  method: "GET",
                  header: {
                    authorization: base64_encode(n),
                    "lianjia-source": "ljwxapp",
                    "time-stamp": new Date().getTime()
                  },
                  success: req => {
                    let reqData = req.data || {}
                    reqData = reqData.data || {}
                    if (Object.keys(reqData).length === 0) {
                      reject(false);
                    }
                    resolve(reqData)
                  },
                  fail: res => {
                    reject(false)
                  }
                })
              }).then(res => {
                // console.log('user',res)
                let communityInfo = res.info || {}
                if (communityInfo.developers && communityInfo.developers.name) {
                  request.develop = ommunityInfo.developers.name
                }
                if (communityInfo.price_unit_avg) {
                  request.xqprice = ommunityInfo.price_unit_avg
                }
                // request.plotRatio = communityInfo.plotRatio || ''
                // request.virescence = communityInfo.virescence || ''
                // request.rentcount = communityInfo.rentcount || ''
                resolve(request);
              }).catch(res => {
                resolve(request);
              })
            } else {
              resolve(request);
            }
          } else {
            reject(false);
          }
        },
        fail: res => {
          reject(false);
        }
      });
    });
  }
}

module.exports = {
  tujia,
  xiaozhu,
  muniao,
  zhenguo,
  wiwj,
  lianjia
};
