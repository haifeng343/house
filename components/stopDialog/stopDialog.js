// components/stopDialog/stopDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    startTimeName:{
      type:String
    },
    taskTime: {
      type: String
    },
    fee: {
      type: String
    },
    totalFee: {
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
    bindCancel() {
      this.triggerEvent('stopEvent', 'none')
    },
    bindConfirm() {
      this.triggerEvent('stopConfrimEvent', 'none')
    },
    stopEvent() { },
    preventTouchMove() {}
  }
})
