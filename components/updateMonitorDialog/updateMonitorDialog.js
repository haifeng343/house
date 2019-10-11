Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityName: {
      type: String,
    },
    beginDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    locationName:{
      type: String,
    },
    updateMinPrice:{
      type:Number
    },
    updateMaxPrice: {
      type: Number
    },
    defaultCityName: {
      type: String,
    },
    defaultBeginDate: {
      type: String,
    },
    defaultEndDate: {
      type: String,
    },
    defaultLocationName: {
      type: String,
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

    stopEvent() {
      console.log(".....")
    }
  }
})
