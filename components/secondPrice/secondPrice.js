// components/secondPrice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    minPrice: {
      type: String,
      value: "",
      observer(newvalue) {
        this.setPriceData(newvalue,1)
      }
    },
    maxPrice: {
      type: String,
      value: "",
      observer(newvalue) {
        this.setPriceData(newvalue, 2)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    min: '',
    max: ''
  },

  lifetimes: {
    ready() {
      this.setPriceData(this.data.minPrice, 1)
      this.setPriceData(this.data.maxPrice, 2)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setPriceData(value, type = 1) {
      if(type === 1) {
        this.setData({ min: value })
      } else {
        this.setData({ max: value })
      }
    },

    //二手房最小价格
    changeMinPrice(e) {
      let min = e.detail.value.replace(/\D/g, '')
      this.setData({ min })
      this.triggerEvent("changeSecondPrice", { minPrice:min, maxPrice:this.data.max })
    },
    //二手房最大价格
    changeMaxPrice(e) {
      let max = e.detail.value.replace(/\D/g, '')
      if(max === '0') {
        max = ''
      }
      this.setData({ max })
      this.triggerEvent("changeSecondPrice", { minPrice:this.data.min, maxPrice:max })
    },
    //二手房更换价格
    changePrice() {
      this.triggerEvent("focus", true)
      let minPrice = +this.data.min
      let maxPrice = +this.data.max
      if (minPrice && maxPrice) {
        let temp = false
        if (minPrice > maxPrice) {
          minPrice = minPrice + maxPrice
          maxPrice = minPrice - maxPrice
          minPrice = minPrice - maxPrice
          temp = true
        }
        if (minPrice === maxPrice) {
          minPrice -= 1
          temp = true
        }
        if (temp) {
          this.setData({ min: minPrice + '', max: maxPrice + '' })
          this.triggerEvent("changeSecondPrice", { minPrice: minPrice + '', maxPrice: maxPrice + '' })
        }
      }
    },
    bindfocus() {
      console.log('focus')
      this.triggerEvent("focus", false)
    }
  }
})
