// components/houseStat/houseStat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 1
    },
    items: {
      type: Object
    },
    showDetail: {
      type: Boolean
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleShowDetail() {
      this.triggerEvent('onGotoDetail', this.data.items);
    }
  }
});
