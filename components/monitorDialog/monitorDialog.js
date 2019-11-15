Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ddCoin: {
      type: Number,
      value: 0
    },
    bindPublic:{
      type:Boolean
    },
    title:{
      type:String
    },
    type:{
      type: Number,
      value: 1 //1:短租，2长租
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
    fee: 0
  },

  attached: function () {
    if (this.properties.type ==1){
      this.setData({
        fee: wx.getStorageSync('hourMoney') || 0
      })
    }
    if (this.properties.type == 2) {
      this.setData({
        fee: wx.getStorageSync('hourLongMoney') || 0
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindCancel() {
      this.triggerEvent('monitorEvent', 'none')
      this.setData({
        publicSelect: false,
        noteSelect: true,
      })
    },
    bindConfirm() {
      //开启监控
      if (!this.data.publicSelect&&!this.data.noteSelect){
        wx.showToast({
          title: '请先选择通知方式',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let detail={
        show: 'none',
        publicSelect: this.data.publicSelect,
        noteSelect: this.data.noteSelect
      }
      this.triggerEvent('monitorConfirmEvent', detail)
      this.setData({
        publicSelect: false,
        noteSelect: true,
      })
    },
    bindPublic() {
      if (!this.data.bindPublic){
        this.triggerEvent('monitorPublicEvent', 'block')
        return;
      }
      this.setData({
        publicSelect: !this.data.publicSelect
      })
    },
    bindNote() {
      //if (this.data.publicSelect){
        this.setData({
          noteSelect: !this.data.noteSelect
        })
      //} 
    },
    stopEvent(){},
    preventTouchMove() { }
  }
})
