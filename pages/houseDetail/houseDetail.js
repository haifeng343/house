// pages/houseDetail/houseDetail.js

import { tujia, xiaozhu, muniao, zhenguo } from "../../api/informationData.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,//区别 1.短租 2.长租的品牌中介 3.长租的个人房源 4.二手房
    imgUrls:[],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    circular: true,//循环播放
    current: 0, //初始化时第一个显示的图片 下标值（从0）index

    title:'',
    tags:[],//标签
    surroundings:[],//环境
    facility:[],//短租配套设施
    Landlord:{
      img:'',//头像
      name:'',//姓名
      tags:[],//标签
      response:0,//回复率
      duration:0,//回复时长
    },
    checkInNotice:{//入住须知
      startTime:'',
      endTime:'',
      claim:'',
      money:0,
      tags:[]
    },
    bottomObject:{
      //短租地步数据
      money:0,//单价
      dayCount:0,//短租 几晚
    },
    houseDetails:{},//除短租外的房源详情信息

    houseListData:{},//短租的传递参数

    productid:null,//接口传入的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
      
  },
  onLoad:function(options){
    console.log(options);
    let tabIndex = wx.getStorageSync('tabIndex');
    let monitorIndex = wx.getStorageSync('monitorIndex');
    console.log(tabIndex)
      this.setData({
        houseListData:Object.assign(this.data.houseListData,options),
        productid:options.productid,
      });

      //短租
      if(tabIndex == 1 ||  monitorIndex == 1){
        wx.setNavigationBarTitle({
          title: '短租-房源详情',
        });
        let houseShortGetData = JSON.parse(decodeURIComponent(options.houseGetData));
        console.log(houseShortGetData)
        this.setData({
          imgUrls:houseShortGetData.housePicture,
          title:houseShortGetData.houseName,
          tags:houseShortGetData.houseTags,
          surroundings :houseShortGetData.houseSummarys,
          Landlord:houseShortGetData.landlordInfo,
          checkInNotice :houseShortGetData.checkInRules,
          facility:houseShortGetData.houseFacilitys,
          type:1,
        })
      };

      //长租
      if(tabIndex == 2 || monitorIndex == 2){
        wx.setNavigationBarTitle({
          title: '长租-房源详情',
        });
        this.setData({//长租的品牌中介和个人房源区分
          type:app.globalData.searchLongData.chooseType == 1?2:3
        })
      }

      //二手房
      if(tabIndex == 3 || monitorIndex == 3){
        let houseSecondGetData = app.globalData.houseSecondGetData;
        let city = options.city;
        console.log(houseSecondGetData)
        wx.setNavigationBarTitle({
          title: '二手房-房源详情',
        });

        this.setData({
          imgUrls:houseSecondGetData.housePicture,
          title:houseSecondGetData.houseName,
          tags:houseSecondGetData.houseTags,
          type:4,
          city:city,
        })
      }

  },
  goToSelect(e){
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})