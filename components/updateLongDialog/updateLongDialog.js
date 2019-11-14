Component({
  /**
   * 组件的属性列表
   */
  properties: {
    updateData:{
      type:Object
    },
    defalutData: {
      type: Object
    },
    locationName: {
      type: String,
    },
    rentType: {
      type: Number
    },
    updateMinPrice: {
      type: Number
    },
    updateMaxPrice: {
      type: Number
    },
    defaultLocationName: {
      type: String,
    },
    defaultRentType: {
      type: Number
    },
    defaultMInPrice: {
      type: Number
    },
    defaultMaxPrice: {
      type: Number
    }
  },
  lifetimes: {
    attached: function () {
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindCancel() {
      this.triggerEvent('updateCancelEvent', 'none')
    },
    bindConfirm() {
      this.triggerEvent('updateConfrimEvent', 'none')
    },
    stopEvent() { },
    preventTouchMove() { }
  }
})
