const monitor = require('../../utils/monitor.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tjCount: {
      type: Number
    },
    xzCount: {
      type: Number
    },
    mnCount: {
      type: Number
    },
    zgCount: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    bindConfirm() {
      this.triggerEvent('enoughEvent', 'none');
    },
    navigateToTj() {
      monitor.navigateToMiniProgram('tj');
    },
    navigateToXz() {
      monitor.navigateToMiniProgram('xz');
    },
    navigateToMn() {
      monitor.navigateToMiniProgram('mn');
    },
    navigateToZg() {
      monitor.navigateToMiniProgram('zg');
    },
    stopEvent() {
      console.log('.....');
    }
  }
});
