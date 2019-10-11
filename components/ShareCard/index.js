Component({
  data: {
    showDialog: false
  },
  properties: {
    warning: {
      type: Boolean
    },
    title: {
      type: String,
      value: '分享给好友'
    }
  },
  methods: {
    handleClose() {
      if (this.data.warning === true) {
        this.setData({ showDialog: true });
      } else {
        this.handleConfirmClose();
      }
    },

    handleCancelClose() {
      this.setData({ showDialog: false });
    },

    handleConfirmClose() {
      this.triggerEvent('onClose');
    }
  }
});
