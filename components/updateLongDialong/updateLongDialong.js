Component({
  /**
   * 组件的属性列表
   */
  properties: {
    locationName: {
      type: String,
    },
    rentType:{
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

  /**
   * 组件的初始数据
   */
  data: {
    publicSelect: false,
    noteSelect: true,
    unselect: '../../assets/image/unselect.png',
    selected: '../../assets/image/selected.png',
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
