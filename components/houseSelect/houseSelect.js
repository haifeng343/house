// components/houseData/houseData.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checkInDate: {
      // 属性名
      type: String // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型                    // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    checkOutDate: {
      type: String
    },
    cityName: {
      type: String
    },
    locationName: {
      type: String
    },
    budget: {
      type: String
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
    goDate() {
      this.reSetData();
      wx.navigateTo({
        url: "/pages/days/days?type=" + this.properties.type
      });
    },
    showLocationFilter() {
      var shown = this.data.shown;
      if (shown && this.data.showType === 2) {
        this.setData({ showType: 0, shown: false });
        this.triggerEvent("clickSelectItem", { type: 0 });
      } else {
        this.setData({ showType: 2, shown: true });
        this.triggerEvent("clickSelectItem", { type: 2 });
      }
    },
    showAdvanceFilter() {
      var shown = this.data.shown;
      if (shown && this.data.showType === 1) {
        this.setData({ showType: 0, shown: false });
        this.triggerEvent("clickSelectItem", { type: 0 });
      } else {
        this.setData({ showType: 1, shown: true });
        this.triggerEvent("clickSelectItem", { type: 1 });
      }
    },
    showSortFilter() {
      var shown = this.data.shown;
      if (shown && this.data.showType === 4) {
        this.setData({ showType: 0, shown: false });
        this.triggerEvent("clickSelectItem", { type: 0 });
      } else {
        this.setData({ showType: 4, shown: true });
        this.triggerEvent("clickSelectItem", { type: 4 });
      }
    },
    showBudgetFilter() {
      var shown = this.data.shown;
      if (shown && this.data.showType === 3) {
        this.setData({ showType: 0, shown: false });
        this.triggerEvent("clickSelectItem", { type: 0 });
      } else {
        this.setData({ showType: 3, shown: true });
        this.triggerEvent("clickSelectItem", { type: 3 });
      }
    },
    reSetData() {
      this.setData({
        shown: false,
        showType: 0
      });
    },
    preventTouchMove() {}
  }
});
