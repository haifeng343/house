// components/followBottom/followBottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    editFlag:{
      type: Boolean
    },
    selectAllFlag:{
      type:Boolean
    },
    selectNum:{
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
    goToSelectAll(){
      this.triggerEvent('selectAllEvent', '');
    },
    deleteBatchItem(){
      this.triggerEvent('deleteBatchEvent', '');
    }
  }
})
