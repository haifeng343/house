// components/checkDetail/checkDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    houseType:{
      type: Number //1：短租 2：长租 2:二手房
    },
    sortType:{ //1推荐 2低价有限
      type:Number
    },
    longSortTypes: {//1: 低价优先, 2: 空间优先, 3: 最新发布
      type: Number
    },
    secondSortType: {//1: 低总价优先 2: 低单价优先
      type: Number
    },
    allCount:{
      type: Number
    },
    lowPrice: {
      type: Number
    },
    showCount: {
      type: Number
    },
    lowUnitPrice:{//二手房的最低平均价
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
    goToDetail(){
      this.triggerEvent('detailEvent', '');
    }
  }
})
