const monitor = require('../../utils/monitor.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lowPriceData:{
      type: Object,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      //value: {}          // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cur: 0,//改变当前索引
    index: 1,//当前的索引
    collectDisplay:'none',
    finishLoadFlag:false,
    isMonitorHouse: 0,//1;不可收藏；0；可收藏
  },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange(e){
      let current = e.detail.current;
      this.setData({
        index: current+1
      })
    },
    goToPlatformDetail(e) {
      let platform = e.currentTarget.dataset.platform
      let productid = e.currentTarget.dataset.productid
      monitor.navigateToMiniProgram(platform, productid)
    },
    goToCollection(e) {
      console.log(e.currentTarget.dataset.productid);
      //开启收藏
      this.setData({
        collectDisplay: 'block'
      })
    },
    getcollectEventEvent(e) {
      this.setData({
        collectDisplay: e.detail
      })
    },
    finishLoad: function (e) {
      this.setData({
        finishLoadFlag: true
      })
    }
  }
})
