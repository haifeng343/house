// components/publicDialog/publicDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    bindClose(){
      this.triggerEvent('publicEvent', 'none')
    },
    bindConfirm(){
      this.triggerEvent('publicConfrimEvent', 'none')
    },
    stopEvent() {},
    preventTouchMove() { }
  }
})
