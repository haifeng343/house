// components/houseStat/houseStat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 1
    },
    data: {
      type: Object
    },
    showDetail: {
      type: Boolean,
      value: false
    }
  },

  data: {
    isLoaded: false,
    expand: false,
    height: "auto",
    isListInit: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleShowDetail() {
      this.triggerEvent("onGotoDetail", this.data.data);
    },
    handleExpandClick() {
      const height = this.data.expand ? "0PX" : `${this.listHeight}PX`;
      this.setData({
        expand: !this.data.expand,
        height
      });
    }
  },
  lifetimes: {
    created() {
      this.listHeight = 0;
    },
    ready() {
      setTimeout(() => {
        if (this.data.data.logList && this.data.data.logList.length > 0) {
          this.createSelectorQuery()
            .select(".withdraw-list.init")
            .boundingClientRect(rect => {
              if (rect) {
                this.listHeight = rect.height;
                this.setData({ isListInit: true, height: "0PX" });
              }
            })
            .exec();
        }
        this.setData({ isLoaded: true });
      });
    }
  }
});
