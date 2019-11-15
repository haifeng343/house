Component({
  data: {
    show: false
  },
  properties: {
    filter: {
      type: Array,
      value: []
    },
    type: {
      type: Number,
      value: 0
    }
  },
  methods: {
    handleClosePanel() {
      this.setData({ show: false });
      setTimeout(() => {
        this.triggerEvent("onClose");
      }, 220);
    },

    handleSelectFilter(event) {
      const { value, field } = event.currentTarget.dataset;
      this.triggerEvent("onSelect", { value, field });
    },

    preventTouchMove() {},

    handleSubmit() {
      this.triggerEvent("onSubmit");
    },

    handleReset() {
      this.triggerEvent("onReset");
    }
  },
  lifetimes: {
    ready() {
      this.setData({ show: true });
    }
  }
});
