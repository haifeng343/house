import * as rxjs from '../../utils/rx';
const monitor = require('../../utils/monitor.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value: {}
    },
    type: { //1：查询房源列表  2：监控房源列表
      type:Number
    },
    idx: {
      type: Number
    },
    isMonitorHouse:{  //是否可以收藏按钮
      type: Number,
      value:0
    },
    bottom:{ //是否最后底部，统计详情页
      type: Boolean,
      value: true
    },
    isStatist:{ //是否不是统计详情页  false：统计详情
      type: Boolean,
      value: true
    },
    isFirst:{
      type: Boolean,
      value: false
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
  },
  lifetimes: {
    created() {
      this.touchmoveStream = new rxjs.BehaviorSubject(0);

      this.touchendStream = new rxjs.BehaviorSubject(false);

      const moveDirectionStream = this.touchmoveStream.pipe(
        rxjs.operators.pairwise(),
        rxjs.operators.map(([p, n]) => (n - p > 0 ? 1 : -1)),
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
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleMovableChange(e) {
      if (e.detail.source === 'touch') {
        this.touchmoveStream.next(e.detail.x);
      }
    },
    handleTouchend() {
      this.touchendStream.next(true);
    },
    goToCollection(e) {
      let detail = {
        index: e.currentTarget.dataset.index,
      }
      this.triggerEvent('collectionEvent', detail);
    },
    goToPlatformDetail(e) {
      let app = getApp()
      let platform = e.currentTarget.dataset.platform
      let productid = e.currentTarget.dataset.productid
      let city = this.properties.type == 1 ? app.globalData.searchLongData.cityId : app.globalData.monitorSearchLongData.cityId
      monitor.navigateToLongMiniProgram(
        platform,
        productid,
        city
      )
    },
    delItem(e) {
      let detail = {
        index: e.currentTarget.dataset.index,
      }
      this.triggerEvent('deleteEvent', detail);
    }
  }
})
