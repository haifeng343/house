Component({
  data: {
    show: false
  },
  methods: {
    handleClosePanel() {
      this.setData({ show: false });
      setTimeout(() => {
        this.triggerEvent("onClose");
      }, 220);
    },
    preventTouchMove() {}
  },
  lifetimes: {
    ready() {
      this.setData({ show: true });
    }
  }
});
