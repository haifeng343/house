Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
    },
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
      this.triggerEvent('monitorEndEvent', 'none')
    },
    bindConfirm() {
      this.triggerEvent('monitorEndConfirmEvent', 'none')
    },
    stopEvent() {
      console.log(".....")
    }
  }
})
