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
    },
    bottomType: {
      type: Number,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: ['全部', '新上', '降价'],
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goEdit(){
      this.triggerEvent('editEvent', '')
    },
    showSelsect() {
      this.setData({
        show: !this.data.show
      })
    },
    changeSelect(event) {
      this.setData({
        show: false
      })
      let index = +event.currentTarget.dataset.index
      
      this.triggerEvent('selectEvent', index)
    }
  }
})
