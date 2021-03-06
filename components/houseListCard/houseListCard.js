import * as rxjs from "../../utils/rx";
const monitor = require("../../utils/monitor.js");
import { tujia, xiaozhu, muniao, zhenguo } from "../../api/informationData.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    type: {
      type: Number
    },
    monitorType: {
      type: Number
    },
    idx: {
      type: Number
    },
    dayCount: {
      type: Number
    },
    IsSearch:{
      type:Boolean
    },
    editFlag: {
      type: Boolean,
      observer: function(editFlag) {
        console.log(editFlag);
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
    allCount: {
      type: Number
    },
    bottomType: {
      type: Number
    },
    isStatist: {
      //是否不是统计详情页  false：统计详情
      type: Boolean,
      value: true
    },
    singleEditFlag: {
      type: Boolean,
      observer: function(singleEditFlag) {
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
    preven:false,//默认可以点击
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
        rxjs.operators.map(([touchend, direction]) => (direction > 0 ? 0 : -67))
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
          x: -67
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
    goToPlatformDetail(e) {
      if(this.data.preven){
        return
      }
      this.data.preven = true;
      let app = getApp();
      let platform = e.currentTarget.dataset.platform;
      let money = e.currentTarget.dataset.money;
      let productid = e.currentTarget.dataset.productid;
      let dayCount = e.currentTarget.dataset.daycount;
      let beginDate =
        this.properties.monitorType == 1
          ? app.globalData.searchData.beginDate
          : app.globalData.monitorSearchData.beginDate;
      let endDate =
        this.properties.monitorType == 1
          ? app.globalData.searchData.endDate
          : app.globalData.monitorSearchData.endDate;
      if (this.properties.editFlag && this.data.isStatist) {
        this.selectItem(e);
        return;
      }
      let r = e.currentTarget.dataset;
      let arr1 = {tj:tujia,xz:xiaozhu,mn:muniao,zg:zhenguo};
      for(var i in arr1){
        if(platform == i){
          if(this.data.preven){
            arr1[i].getData(productid).then((res)=>{
              if(res){
                let that = this;
                wx.navigateTo({
                  url: '/pages/houseDetail/houseDetail?money='+money+'&platform='+platform+'&productid='+productid+'&beginDate='+beginDate+'&endDate='+endDate+'&type='+this.properties.type+'&index='+r.index+'&dayCount='+dayCount,
                  complete:function(){
                    that.setData({
                      preven:false
                    })
                  }
                });
                app.globalData.houseSortData = res;
              }else{
                wx.showToast({
                  icon:'none',
                  title: '该房源暂无详情页',
                })
              }
            })
          }
        }
      }

      // monitor.navigateToMiniProgram(platform, productid, beginDate, endDate);
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
