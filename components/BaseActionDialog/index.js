Component({
  properties: {
    title: {
      type: String,
      value: '提示'
    },
    confirmButtonText: {
      type: String,
      value: '立即前往'
    },
    confirmButtonColor: {
      type: String,
      value: '#F1612A'
    },
    cancelButtonText: {
      type: String,
      value: '以后再说'
    },
    cancelButtonColor: {
      type: String,
      value: '#1D1D1D'
    }
  },

  data: {},

  methods: {
    handleCancel() {
      this.triggerEvent('onCancel');
    },

    handleConfirm() {
      this.triggerEvent('onConfirm');
    }
  }
});
