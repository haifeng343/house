// components/checkDetail/checkDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    houseType:{
      type: Number //1：短租 2：长租
    },
    sortType:{
      type:Number
    },
    longSortTypes:{
      type: Number
    },
    allCount:{
      type: Number
    },
    lowPrice: {
      type: Number
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
    goToDetail(){
      this.triggerEvent('detailEvent', '');
    }
  }
})
