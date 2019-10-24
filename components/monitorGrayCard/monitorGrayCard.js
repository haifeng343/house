import * as rxjs from '../../utils/rx';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    ddCoin:{
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    x: {
      type: Number,
      value: 0
    }
  },
  lifetimes: {
    created() {
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
        rxjs.operators.map(([touchend, direction]) => (direction > 0 ? 0 : -67))
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
  /**
   * 组件的方法列表
   */
  methods: {
    handleMovableChange(e) {
      if (e.detail.source === 'touch') {
        this.touchmoveStream.next(e.detail.x);
      }
    },

    handleTouchend() {
      this.touchendStream.next(true);
    },
    handleClick(e){
      let detail={
        index: e.currentTarget.dataset.index,
        type: e.currentTarget.dataset.type,
      }
      this.triggerEvent('clickEvent', detail);
    },

    delItem(e){
      let detail = {
        index: e.currentTarget.dataset.index,
      }
      this.triggerEvent('clickDelete', detail);
    },
    openTask(e){
      let detail = {
        index: e.currentTarget.dataset.index,
      }
      this.triggerEvent('clickOpen', detail);
    },
    recharge(e){
      let detail = {
        type: e.currentTarget.dataset.type,
      }
      this.triggerEvent('clickRecharge', detail);
    }
  }
})
