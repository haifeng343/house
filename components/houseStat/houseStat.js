const monitor = require('../../utils/monitor.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tjCount: {
      type: Number,
    },
    tjFilterCount: {
      type: Number,
    },
    tjLowPriceData: {
      type: Object,
    },
    xzCount: {
      type: Number,
    },
    xzFilterCount: {
      type: Number,
    },
    xzLowPriceData: {
      type: Object,
    },
    mnCount: {
      type: Number,
    },
    mnFilterCount: {
      type: Number,
    },
    mnLowPriceData: {
      type: Object,
    },
    zgCount: {
      type: Number,
    },
    zgFilterCount: {
      type: Number,
    },
    zgLowPriceData: {
      type: Object,
    },
    sort: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToTj() {
      monitor.navigateToMiniProgram('tj')
    },
    navigateToXz() {
      monitor.navigateToMiniProgram( 'xz')
    },
    navigateToMn() {
      monitor.navigateToMiniProgram('mn')
    },
    navigateToZg() {
      monitor.navigateToMiniProgram('zg')
    },
  }
})
