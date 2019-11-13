// components/houseData/houseData.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityName: {
      type: String,
    },
    locationName: {
      type: String,
    },
    budget:{
      type: String,
    },
    type: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shown: false,
    showType: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showLocationFilter() {
      var shown = this.data.shown
      if (shown && this.data.showType == 1) {
        this.setData({ showType: 0, shown:false })
        this.triggerEvent('clickSelectItem', { type: 0 })
      } else {
        this.setData({ showType: 1, shown: true })
        this.triggerEvent('clickSelectItem', { type: 1 })
      }
    },
    showRentTypeFilter(){
      var shown = this.data.shown
      if (shown && this.data.showType == 2) {
        this.setData({ showType: 0, shown: false })
        this.triggerEvent('clickSelectItem', { type: 0 })
      } else {
        this.setData({ showType: 2, shown: true })
        this.triggerEvent('clickSelectItem', { type: 2 })
      }
    },
    showBudgetFilter() {
      var shown = this.data.shown;
      if (shown && this.data.showType == 3) {
        this.setData({ showType: 0, shown: false })
        this.triggerEvent('clickSelectItem', { type: 0 })
      } else {
        this.setData({ showType: 3, shown: true })
        this.triggerEvent('clickSelectItem', { type: 3 })
      }
    },
    showAdvanceFilter() {
      var shown = this.data.shown;
      if (shown && this.data.showType==4) {
        this.setData({ showType: 0, shown: false })
        this.triggerEvent('clickSelectItem', { type: 0 })
      } else {
        this.setData({ showType: 4, shown: true })
        this.triggerEvent('clickSelectItem', { type: 4 })
      }
    },
    
    reSetData() {
      console.log('houseSelect,reSetData');
      this.setData({
        shown: false,
        showType: 0
      })
    },
    preventTouchMove() { }
  }
})
