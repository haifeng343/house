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
      type: Boolean,
      observer: function (scrollIng){
        if (scrollIng){
          this.setData({
            show: false
          })
        }
      }
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
      this.setData({
        show: false
      })
      this.triggerEvent('editEvent', '')
    },
    showSelect() {
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
