import * as rxjs from '../../utils/rx';

Component({
  properties: {
    data: {
      type: Object,
      value: {}
    },
    rentType:{
      type:Number
    }
  },

  data: {
    x: {
      type: Number,
      value: 0
    }
  },

  lifetimes: {
    created() {
      let obj = this.properties;
      this.touchmoveStream = new rxjs.BehaviorSubject(0);

      this.touchendStream = new rxjs.BehaviorSubject(false);

      const moveDirectionStream = this.touchmoveStream.pipe(
        rxjs.operators.pairwise(),
        rxjs.operators.map(([p, n]) => (n - p > 0 ? 1 : -1)),
        rxjs.operators.startWith(1)
      );

      const xStream = this.touchendStream.pipe(
        rxjs.operators.withLatestFrom(moveDirectionStream),
        rxjs.operators.filter(([touchend]) => touchend === true),
        rxjs.operators.map(([touchend, direction]) => (direction > 0 ? 0 : -70))
      );

      this.xSubscription = xStream.subscribe(x => {
        this.setData({ x });
      });
    },
    detached() {
      this.touchmoveStream.complete();
      this.touchendStream.complete();
      if (this.xSubscription) {
        this.xSubscription.unsubscribe();
      }
    }
  },

  methods: {
    handleMovableChange(e) {
      if (e.detail.source === 'touch') {
        this.touchmoveStream.next(e.detail.x);
      }
    },

    handleTouchend() {
      this.touchendStream.next(true);
    },

    handleRemoveClick() {
      this.triggerEvent('onRemove', this.data.data.id);
    }
  }
});
