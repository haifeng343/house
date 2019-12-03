// components/monitorEmpty/monitorEmpty.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bottomType: {
      type: Number
    },
    mSelect: {
      type: Number
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
    goSelect(e){
      let index = e.currentTarget.dataset.index
      this.triggerEvent('selectEvent', index);
    }
  }
})
