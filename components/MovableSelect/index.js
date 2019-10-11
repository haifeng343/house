Component({
  data: {
    x: 0
  },
  properties: {
    optionList: {
      type: Array,
      value: []
    }
  },
  methods: {
    handleSelectItem(event) {
      const { index } = event.currentTarget.dataset;
      this.triggerEvent('onSelect', index);
    }
  },
  lifetimes: {
    ready() {
      const index = this.data.optionList.findIndex(item => item.active);
      if (index > -1) {
        this.setData({ x: ~~(index / 2) * -46 });
      }
    },
    detached() {}
  }
});
