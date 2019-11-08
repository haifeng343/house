Component({
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  data: {
    isLoaded: false
  },

  methods: {
    handleClickButton() {
      this.triggerEvent('onUse');
    }
  },
  lifetimes: {
    ready() {
      this.setData({ isLoaded: true });
    }
  }
});
