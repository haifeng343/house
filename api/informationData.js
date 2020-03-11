import { tujia_address2, xiaozhu_address2, muniao_address2, meituan_address } from "../utils/httpAddress.js";
const DEFAULT_PAGE = { size: 15, num: 1 }; //默认分页参数
const LIAN_APP_ID = "20170324_android";
const LIAN_APP_SECRET = "93273ef46a0b880faf4466c48f74878f";
const SOUFUN_IMEI = "866135030723842";
const TONGCHENG_VER = "8.25.2";
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
            let requset = {
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
              requset.houseId = data.houseId
            }
            if (data.houseName) {
              requset.houseName = data.houseName
            }
            if (data.houseTags && data.houseTags.length) {
              for (let index = 0; index < data.houseTags.length; index++) {
                if (data.houseTags[index].text) {
                  requset.houseTags.push(data.houseTags[index].text)
                }
              }
            }
            if (data.housePicture && data.housePicture.housePics && data.housePicture.housePics.length) {
              for (let index = 0; index < data.housePicture.housePics.length; index++) {
                if (data.housePicture.housePics[index].url) {
                  requset.housePicture.push(data.housePicture.housePics[index].url)
                }
              }
            }
            if (data.houseSummarys && data.houseSummarys.length) {
              for (let index = 0; index < data.houseSummarys.length; index++) {
                if (data.houseSummarys[index].title) {
                  requset.houseSummarys.push(data.houseSummarys[index].title)
                }
              }
            }
            if (data.houseFacility && data.houseFacility.houseFacilitys && data.houseFacility.houseFacilitys.length) {
              for (let temp = 0; temp < data.houseFacility.houseFacilitys.length; temp++ ) {
                let listTemp = data.houseFacility.houseFacilitys[temp]
                if (listTemp.groupName == '基础设施') {
                  for (let index = 0; index < listTemp.facilitys.length; index++) {
                    if (listTemp.facilitys[index].name) {
                      requset.houseFacilitys.push(listTemp.facilitys[index].name)
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
                  requset.checkInRules.push(item)
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
              requset.landlordInfo = landlordInfo
            }
            resolve(requset);
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
            let requset = {
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
              requset.houseName = data.luDetail.lodgeUnitName
            }
            if (data.luTags && data.luTags.length) {
              for (let index = 0; index < data.luTags.length; index++) {
                if (data.luTags[index].title) {
                  requset.houseTags.push(data.luTags[index].title)
                }
              }
            }
            if (data.images && data.images.length) {
              for (let index = 0; index < data.images.length; index++) {
                if (data.images[index].imgUrl) {
                  requset.housePicture.push(data.images[index].imgUrl)
                }
              }
            }
            //头部特点分四块
            if (data.luDetail && data.luDetail.leaseType) {
              requset.houseSummarys.push(data.luDetail.leaseType)
            }
            if (data.luDetail && data.luDetail.houseType) {
              requset.houseSummarys.push(data.luDetail.houseType)
            }
            if (data.bed && data.bed.bedGuestTip) {
              requset.houseSummarys.push(data.bed.bedGuestTip)
            }
            if (data.addTenant && data.addTenant.addTenant && data.addTenant.addTenantTip) {
              requset.houseSummarys.push(data.addTenant.addTenantTip)
            }

            if (data.facility && data.facility.length){
              for (let temp = 0; temp < data.facility.length; temp++) {
                let listTemp = data.facility[temp]
                for (let index = 0; index < listTemp.items.length; index++) {
                  if (listTemp.items[index].name) {
                    requset.houseFacilitys.push(listTemp.items[index].name)
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
                  requset.checkInRules.push(item)
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
              requset.landlordInfo = landlordInfo
            }

            resolve(requset);
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
            let requset = {
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
              requset.houseName = data.title
            }
            //标签，3个
            if (data.room_type) {
              requset.houseTags.push(data.room_type)
            }
            if (data.rent_type) {
              requset.houseTags.push(data.rent_type)
            }
            if (data.size) {
              requset.houseTags.push(data.size + '㎡')
            }

            if (data.photo && data.photo.length) {
              for (let index = 0; index < data.photo.length; index++) {
                if (data.photo[index].img_url) {
                  requset.housePicture.push(data.photo[index].img_url)
                }
              }
            }

            //头部特点, 7块
            if (data.rent_type) {
              requset.houseSummarys.push(data.rent_type)
            }
            if (data.room_type) {
              requset.houseSummarys.push(data.room_type)
            }
            if (data.house_type) {
              requset.houseSummarys.push(data.house_type)
            }
            if (data.max_num) {
              requset.houseSummarys.push(data.max_num)
            }
            if (data.unit_str) {
              requset.houseSummarys.push(data.unit_str)
            }
            if (data.bathroom_self || data.bathroom_pub) {
              requset.houseSummarys.push((data.bathroom_self + data.bathroom_pub ) + '个卫生间')
            }
            if (data.beds && data.beds.count) {
              requset.houseSummarys.push(data.beds.count + '张床')
            }

            if (data.support && data.support.length) {
              for (let index = 0; index < data.support.length; index++) {
                if (data.support[index].name) {
                  requset.houseFacilitys.push(data.support[index].name)
                }
              }
            }

            // 入住须知 5个
            if (data.checkin_time) {
              let item = { items: [] };
              item.title = '最早入住时间'
              item.checkInRuleFloat = false
              item.items.push({ title: '当天' + data.checkin_time + ':00', isDeleted: false })
              requset.checkInRules.push(item)
            }
            if (data.checkout_time) {
              let item = { items: [] };
              item.title = '最晚退房时间'
              item.checkInRuleFloat = false
              item.items.push({ title: '当天' + data.checkout_time + ':00', isDeleted: false })
              requset.checkInRules.push(item)
            }
            if (data.deposit && data.deposit.is_deposit) {
              let item = { items: [] };
              item.title = '线下押金'
              item.checkInRuleFloat = false
              item.items.push({ title: data.deposit.money, isDeleted:false })
              requset.checkInRules.push(item)
            }
            if (data.need_idcard) {
              let item = { items: [] };
              item.title = '身份证'
              item.checkInRuleFloat = false
              item.items.push({ title: "需要", isDeleted: false })
              requset.checkInRules.push(item)
            } else {
              let item = { items: [] };
              item.title = '身份证'
              item.checkInRuleFloat = false
              item.items.push({ title: "不需要", isDeleted: false })
              requset.checkInRules.push(item)
            }
            if (data.rule && data.rule.length) {
              let item = { items: [] };
              item.title = '对客要求'
              item.checkInRuleFloat = true
              for (let index = 0; index < data.rule.length; index++) {
                item.items.push({ title: data.rule[index].name, isDeleted: data.rule[index].is_show === 1 ? true : false })
              }
              requset.checkInRules.push(item)
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
              requset.landlordInfo = landlordInfo
            }
            resolve(requset);
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
            console.log(data)
            if (Object.keys(data).length === 0) {
              reject(false);
            }
            let requset = {
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
              requset.houseName = data.title
            }
            if (data.productTagInfoList && data.productTagInfoList.length) {
              for (let index = 0; index < data.productTagInfoList.length; index++) {
                if (data.productTagInfoList[index].tagName) {
                  requset.houseTags.push(data.productTagInfoList[index].tagName)
                }
              }
            }

            if (data.productMediaInfoList && data.productMediaInfoList.length) {
              for (let index = 0; index < data.productMediaInfoList.length; index++) {
                if (data.productMediaInfoList[index].mediaUrl) {
                  requset.housePicture.push(data.productMediaInfoList[index].mediaUrl)
                }
              }
            }

            //头部特点, 5块
            if (data.layoutRoom) {
              requset.houseSummarys.push(data.layoutRoom + '间卧室')
            }
            if (data.layoutHall || data.layoutKitchen || data.layoutWc) {
              requset.houseSummarys.push(data.layoutHall + '厅' + data.layoutKitchen + '厨' + data.layoutWc + '卫')
            }
            if (data.usableArea) {
              requset.houseSummarys.push(data.usableArea + '㎡')
            }
            if (data.bedCount) {
              requset.houseSummarys.push(data.bedCount +'张床')
            }
            if (data.maxGuestNumber) {
              requset.houseSummarys.push('宜居' + data.maxGuestNumber + '人')
            }

            if (data.facilityList && data.facilityList.length) {
              for (let index = 0; index < data.facilityList.length; index++) {
                if (data.facilityList[index].value) {
                  requset.houseFacilitys.push(data.facilityList[index].value)
                }
              }
            }

            // 入住须知 3个
            if (data.productRpInfo && data.productRpInfo.earliestCheckinTime) {
              let item = { items: [] };
              item.title = '最早入住时间'
              item.checkInRuleFloat = false
              item.items.push({ title: '当天' + data.productRpInfo.earliestCheckinTime, isDeleted: false })
              requset.checkInRules.push(item)
            }
            if (data.productRpInfo && data.productRpInfo.latestCheckoutTime) {
              let item = { items: [] };
              item.title = '最晚退房时间'
              item.checkInRuleFloat = false
              item.items.push({ title: '当天' + data.productRpInfo.latestCheckoutTime, isDeleted: false })
              requset.checkInRules.push(item)
            }
            if (data.guestNoticeList && data.guestNoticeList.length) {
              let item = { items: [] };
              item.title = '房东要求'
              item.checkInRuleFloat = true
              for (let index = 0; index < data.guestNoticeList.length; index++) {
                item.items.push({ title: data.guestNoticeList[index].value, isDeleted: data.guestNoticeList[index].metaValue === '1' ? true : false })
              }
              requset.checkInRules.push(item)
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
              requset.landlordInfo = landlordInfo
              resolve(requset);
            }).catch(res=>{
              requset.landlordInfo = landlordInfo
              resolve(requset);
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

module.exports = {
  tujia,
  xiaozhu,
  muniao,
  zhenguo
};
