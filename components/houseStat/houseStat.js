const monitor = require('../../utils/monitor.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array
    },
    sort: {
      type: Boolean
    },
    rentType:{
      type: String
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
    navigateToPlatform(e) {
      let p = e.currentTarget.dataset.platform
      if (p == 'tj') { this.navigateToTj() }
      if (p == 'xz') { this.navigateToXz() }
      if (p == 'mn') { this.navigateToMn() }
      if (p == 'zg') { this.navigateToZg() }
      if (p == 'wiwj') { monitor.navigateToLongMiniProgram('wiwj') }
      if (p == 'lj') { monitor.navigateToLongMiniProgram('lj') }
      if (p == 'ftx') { monitor.navigateToLongMiniProgram('ftx') }
      if (p == 'tc') { monitor.navigateToLongMiniProgram('tc') }
    },
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
