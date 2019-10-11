import * as rxjs from '../../utils/rx.js';
const touchmoveStream = new rxjs.BehaviorSubject(0);
const moveDirectionStream = new rxjs.BehaviorSubject('right');
const touchendStream = new rxjs.BehaviorSubject(false);

Component({
  data: {
    leftX: 0,
    rightX: 0,
    containerWidth: 0,
    itemWidth: 0,
    long: 0
  },
  properties: {
    priceType: {
      type: Object,
      value: {}
    },
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 99999
    }
  },
  containerLeft: 0,
  touchEnd: true,
  isMoved: false,
  blockHalfWidth: 0,
  methods: {
    handleLeftTouchStart(event) {
      moveDirectionStream.next('left');
      touchendStream.next(false);
      this.touchEnd = false;
    },
    handleLeftTouchMove(event) {
      if (this.touchEnd === false) {
        this.isMoved = true;
        let { pageX } = event.touches[0];
        pageX = ~~(pageX - this.containerLeft - this.blockHalfWidth);
        if (this.data.rightX - pageX <= this.data.itemWidth) {
          pageX = this.data.rightX - this.data.itemWidth;
        }
        if (pageX >= this.data.containerWidth) {
          pageX = this.data.containerWidth;
        }
        if (pageX < 0) {
          pageX = 0;
        }
        touchmoveStream.next(pageX);
        this.setData({
          leftX: pageX
        });
      }
    },
    handleLeftTouchEnd(event) {
      touchendStream.next(true);
      this.touchEnd = true;
    },
    handleRightTouchEnd(event) {
      touchendStream.next(true);
      this.touchEnd = true;
    },
    handleRightTouchStart(event) {
      moveDirectionStream.next('right');
      touchendStream.next(false);
      this.touchEnd = false;
    },
    handleGotoPrice(event) {
      const leftIndex = ~~(this.data.leftX / (this.data.itemWidth || 1));
      const rightIndex = ~~(this.data.rightX / (this.data.itemWidth || 1));
      const targetIndex = ~~event.currentTarget.dataset.index;

      if (targetIndex === leftIndex || targetIndex === rightIndex) {
        // point is selected already
        return;
      }

      // find closest block
      const leftDeltaIndex = Math.abs(leftIndex - targetIndex);
      const rightDeltaIndex = Math.abs(rightIndex - targetIndex);

      const pageX = targetIndex * this.data.itemWidth;

      if (rightDeltaIndex > leftDeltaIndex) {
        // click point are on left of left block
        // move left block
        this.setData({
          leftX: pageX
        });
        moveDirectionStream.next('left');
      } else {
        this.setData({
          rightX: pageX
        });

        moveDirectionStream.next('right');
      }

      // in order to update data, must set isMoved to true
      this.isMoved = true;

      touchmoveStream.next(pageX);
      touchendStream.next(true);
    },
    handleRightTouchMove(event) {
      if (this.touchEnd === false) {
        this.isMoved = true;
        let { pageX } = event.touches[0];
        pageX = ~~(pageX - this.containerLeft - this.blockHalfWidth);
        if (pageX - this.data.leftX < this.data.itemWidth) {
          pageX = this.data.leftX + this.data.itemWidth;
        }
        if (pageX >= this.data.containerWidth) {
          pageX = this.data.containerWidth;
        }
        if (pageX < 0) {
          pageX = 0;
        }
        touchmoveStream.next(pageX);
        this.setData({
          rightX: pageX
        });
      }
    }
  },
  lifetimes: {
    ready() {
      let long = 0;
      const { priceType } = this.data;
      let leftIndex = -1;
      let rightIndex = -1;
      Object.keys(priceType).forEach((key, index) => {
        if (priceType[key] === this.data.min) {
          leftIndex = index;
        } else if (priceType[key] === this.data.max) {
          rightIndex = index;
        }

        long += 1;
      });
      this.setData({ long });
      this.createSelectorQuery()
        .select(`.move-view`)
        .boundingClientRect(rect => {
          this.blockHalfWidth = rect.width / 2;
        })
        .exec();

      this.createSelectorQuery()
        .select(`.background-line`)
        .boundingClientRect(rect => {
          const containerWidth = rect.width;
          const itemWidth = rect.width / (long - 1);
          this.setData({
            rightX: rightIndex > -1 ? rightIndex * itemWidth : containerWidth,
            leftX: leftIndex > -1 ? leftIndex * itemWidth : 0,
            containerWidth,
            itemWidth
          });
        })
        .exec();

      this.createSelectorQuery()
        .select(`.container`)
        .boundingClientRect(rect => {
          this.containerLeft = rect.left;
        })
        .exec();

      const xStream = touchendStream.pipe(
        rxjs.operators.withLatestFrom(touchmoveStream, moveDirectionStream),
        rxjs.operators.filter(
          ([touchend]) => touchend === true && this.isMoved === true
        ),
        rxjs.operators.tap(() => (this.isMoved = false)),
        rxjs.operators.map(([touchend, x, dir]) => [x, dir])
      );

      this.xSubscription = xStream.subscribe(([x, dir]) => {
        const closestX =
          Math.round(x / this.data.itemWidth) * this.data.itemWidth;
        const min = Math.round(
          (this.data.leftX / this.data.containerWidth) * (long - 1)
        );
        const max = Math.round(
          (this.data.rightX / this.data.containerWidth) * (long - 1)
        );
        if (!isNaN(min) && !isNaN(max)) {
          if (dir === 'left') {
            this.setData({
              leftX: closestX
            });
          } else {
            this.setData({
              rightX: closestX
            });
          }
          this.triggerEvent('changePrice', { min, max });
        }
      });
    },
    detached() {
      if (this.xSubscription) {
        this.xSubscription.unsubscribe();
      }
    }
  }
});
