// components/houseData/houseData.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    allCount: {            // 属性名
      type: Number,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0          // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    showCount:{
      type: Number, 
      value: 0
    },
    averagePrice: {
      type: Number,
      value: 0
    },
    lowPrice: {
      type: Number,
      value: 0
    },
    sort: {
      type: Boolean
    },
    rentType:{
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

  }
})
