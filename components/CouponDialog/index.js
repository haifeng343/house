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
      if (typeof this.props.onClose === "function") {
        this.props.onClose();
      }
    }
  }
});
