Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
    },
    followType:{
      type:Number
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
      let detail = {
        show: 'none',
        followType: this.properties.followType
      }
      this.triggerEvent('cancelEvent', detail)
    },
    bindConfirm() {
      let detail = {
        show: 'none',
        followType: this.properties.followType
      }
      this.triggerEvent('confirmEvent', detail)
    },
    knowConfirm(){
      let detail = {
        show: 'none',
        followType: this.properties.followType
      }
      this.triggerEvent('knowEvent', detail)
    },
    stopEvent() { },
    preventTouchMove() { }
  }
})
