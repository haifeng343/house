// components/followEdit/followEdit.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    countFlag:{
      type:Number
    },
    scrollIng:{
      type: Boolean
    },
    editFlag:{
      type: Boolean
    },
    listType:{ 
      type: Number,
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
    goEdit(){
      this.triggerEvent('editEvent', '');
    }
  }
})
