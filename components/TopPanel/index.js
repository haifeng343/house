Component({
  data: {
    show: false
  },
  methods: {
    handleClosePanel() {
      this.setData({ show: false });
      setTimeout(() => {
        this.triggerEvent('onClose');
      }, 220);
    }
  },
  lifetimes: {
    ready() {
      this.setData({ show: true });
    }
  }
});
