Component({
  properties: {
    couponList: {
      type: Array,
      value: []
    },
    title: {
      type: String,
      value: ""
    }
  },
  methods: {
    handleClose() {
      this.triggerEvent("onClose");
    }
  }
});
