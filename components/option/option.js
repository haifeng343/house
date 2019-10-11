// components/houseStat/houseStat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label: {
      type: String
    },
    value: {
      type: String
    },
    onChange: {
      type: Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

    select: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange() {
      const { onChange } = this.data;
      if (typeof onChange === 'function') {
        onChange(this.properties.value);
      }
    }
  }
})
