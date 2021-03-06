import * as rxjs from "../../utils/rx";
const monitor = require("../../utils/monitor.js");
import { wiwj, lianjia,wbtc } from "../../api/informationData.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    monitorType: {
      //1：查询房源列表  2：监控房源列表
      type: Number,
      value: ""
    },
    type: {
      //2.长租的品牌中介 3.长租的个人房源 4.二手房
      type: Number
    },
    rentType: {
      //2长租，3：二手房
      type: Number
    },
    idx: {
      type: Number
    },
    bottom: {
      //是否最后底部，统计详情页
      type: Boolean,
      value: true
    },
    isStatist: {
      //是否不是统计详情页  false：统计详情
      type: Boolean,
      value: true
    },
    editFlag: {
      type: Boolean,
      observer: function (editFlag) {
        if (editFlag) {
          this.setData({
            x: 30
          });
        } else {
          this.touchmoveStream.next(0);
          this.touchendStream.next(true);
        }
      }
    },
    bottomType: {
      type: Number
    },
    singleEditFlag: {
      type: Boolean,
      observer: function (singleEditFlag) {
        if (singleEditFlag) {
          this.touchmoveStream.next(0);
          this.touchendStream.next(true);
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    x: {
      type: Number,
      value: 0
    },
    preven: false,
  },
  lifetimes: {
    created() {
      this.touchmoveStream = new rxjs.BehaviorSubject(0);

      this.touchendStream = new rxjs.BehaviorSubject(false);

      const moveDirectionStream = this.touchmoveStream.pipe(
        rxjs.operators.pairwise(),
        rxjs.operators.map(([p, n]) => (n - p >= 0 ? 1 : -1)),
        rxjs.operators.startWith(1)
      );

      const xStream = this.touchendStream.pipe(
        rxjs.operators.withLatestFrom(moveDirectionStream),
        rxjs.operators.filter(([touchend]) => touchend === true),
        rxjs.operators.map(([touchend, direction]) => (direction > 0 ? 0 : -64))
      );

      this.xSubscription = xStream.subscribe(x => {
        this.setData({ x });
      });
    },
    detached() {
      this.touchmoveStream.complete();
      this.touchendStream.complete();
      if (this.xSubscription) {
        this.xSubscription.unsubscribe();
      }
    },
    ready() {
      let num = wx.getStorageSync("autoswiperNum");
      if (this.properties.idx == 0 && !num && this.properties.isStatist) {
        wx.setStorageSync("autoswiperNum", 1);
        this.setData({
          x: -64
        });
        setTimeout(() => {
          this.setData({
            x: 0
          });
        }, 2000);
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleMovableChange(e) {
      if (this.properties.editFlag) {
        return;
      }
      if (e.detail.source === "touch") {
        let x = e.detail.x;
        if (x > 0) {
          x = 0;
        }
        if (x < -64) {
          x = -64;
        }
        this.touchmoveStream.next(x);
      }
    },
    handleTouchend() {
      if (this.properties.editFlag) {
        return;
      }
      this.touchendStream.next(true);
    },
    goToCollection(e) {
      let detail = {
        index: e.currentTarget.dataset.index
      };
      this.triggerEvent("collectionEvent", detail);
    },
    goToPlatformDetail(e) {
      console.log(this.data.preven)
      if (this.data.preven) {
        return;
      }
      this.data.preven = true;
      let app = getApp();
      let platform = e.currentTarget.dataset.platform;
      let productid = e.currentTarget.dataset.productid;
      console.log(productid)
      //长租
      if (this.properties.rentType == 2) {
        let type = app.globalData.searchLongData.chooseType == 1 ? 2 : 3;
        let city =
          this.properties.monitorType == 1
            ? app.globalData.searchLongData.cityId
            : app.globalData.monitorSearchLongData.cityId;
        if (this.properties.editFlag && this.data.isStatist) {
          this.selectItem(e);
          return;
        }
        console.log(city)
        if(platform == 'wiwj'){
          wiwj.getLongData({ houseId:productid, cityId:city.wiwj }).then(res => {
            if (res) {
              let that = this;
              wx.navigateTo({
                url: '/pages/houseDetail/houseDetail?platform=' + platform + '&productid=' + productid + '&type=' + type + '&city=' + encodeURIComponent(JSON.stringify(city)),
                complete:function(){
                  that.setData({
                    preven:false
                  })
                }
              });
              app.globalData.houseLongData = res;
              console.log(app.globalData.houseLongData)
            } else {
              wx.showToast({
                icon: 'none',
                title: '该房源暂无详情页',
              })
            }
          })
        }
        if(platform == 'tc'){
          wbtc.getLongData(productid).then(res => {
            if (res) {
              let that = this;
              wx.navigateTo({
                url: '/pages/houseDetail/houseDetail?platform=' + platform + '&productid=' + productid + '&type=' + type + '&city=' + encodeURIComponent(JSON.stringify(city)),
                complete:function(){
                  that.setData({
                    preven:false
                  })
                }
              });
              app.globalData.houseLongData = res;
              app.globalData.houseLongData.buildarea = app.globalData.houseLongData.buildarea.replace('㎡','');
              console.log(app.globalData.houseLongData)
            } else {
              wx.showToast({
                icon: 'none',
                title: '该房源暂无详情页',
              })
            }
          })
        }

        // monitor.navigateToLongMiniProgram(platform, productid, city);
      }
      //二手房
      if (this.properties.rentType == 3) {
        let type = 4;
        let city =
          this.properties.monitorType == 1
            ? app.globalData.secondSearchData.cityId
            : app.globalData.monitorSecondSearchData.cityId;
        if (this.properties.editFlag && this.data.isStatist) {
          this.selectItem(e);
          return;
        }
        console.log(platform)
        console.log(city)
          if (platform == 'wiwj') {
            wiwj.getHouseData({ houseId: productid, cityId: city.wiwj }).then(res => {
              if (res) {
                console.log('res', res);
                let that = this;
                wx.navigateTo({
                  url: '/pages/houseDetail/houseDetail?platform=' + platform + '&productid=' + productid + '&type=' + type + '&city=' + encodeURIComponent(JSON.stringify(city)),
                  complete:function(){
                    that.setData({
                      preven:false
                    })
                  }
                });
                app.globalData.houseSecondData = res;
          
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '该房源暂无详情页',
                })
              }
            })
          }
          if (platform == 'lj') {
            lianjia.getHouseData({ house_code: productid, city_id: city.lj }).then(res => {
              if (res) {
                console.log('res', res);
                let that = this;
                wx.navigateTo({
                  url: '/pages/houseDetail/houseDetail?platform=' + platform + '&productid=' + productid + '&type=' + type + '&city=' + encodeURIComponent(JSON.stringify(city)),
                  complete:function(){
                    that.setData({
                      preven:false
                    })
                  }
                });
                app.globalData.houseSecondGetData = res;
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '该房源暂无详情页',
                })
              }
            })
          }

        // monitor.navigateToSecondMiniProgram(platform, productid, city);
      }
    },
    delItem(e) {
      let detail = {
        index: e.currentTarget.dataset.index
      };
      this.triggerEvent("deleteEvent", detail);
    },
    selectItem(e) {
      let detail = {
        index: e.currentTarget.dataset.index
      };
      this.triggerEvent("collectionEvent", detail);
    }
  }
});
