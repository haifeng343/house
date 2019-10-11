// components/image-extend.js
Component({
  /**
   * 组件的属性列表
   */
  data: {
    isLoaded: false,
    isDestroyBase: false
  },
  properties: {
    src: {
      type: String
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleImageLoaded(e) {
      this.setData(
        {
          isLoaded: true
        },
        () => {
          setTimeout(() => {
            this.setData({ isDestroyBase: true });
          }, 3000);
        }
      );
    }
  }
});
