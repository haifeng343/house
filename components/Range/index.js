import * as rxjs from "../../utils/rx.js";

Component({
  data: {
    leftX: 0,
    rightX: 0,
    minValue: 0,
    maxValue: 0,
    minText: "",
    maxText: "",
    containerWidth: 0,
    isLoaded: false,
    useCustom: false,
    minInputValue: "",
    maxInputValue: ""
  },
  properties: {
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 10000
    },
    showInput: {
      type: Boolean,
      value: false
    },
    custom: {
      type: Boolean,
      value: false,
      observer(newvalue) {
        this.setData({
          useCustom: newvalue,
          maxText: this.data.maxValue,
          minText: this.data.minValue
        });
      }
    }
  },
  containerLeft: 0,
  touchEnd: true,
  isMoved: false,
  blockHalfWidth: 0,
  blockWidth: 0,
  methods: {
    handleLeftTouchStart() {
      this.moveDirectionStream.next("left");
      this.touchendStream.next(false);
      this.touchEnd = false;
    },
    handleLeftTouchMove(event) {
      if (this.touchEnd === false) {
        this.isMoved = true;
        let { pageX } = event.touches[0];
        pageX = ~~(pageX - this.containerLeft - this.blockHalfWidth);
        if (this.data.rightX - pageX <= this.blockWidth) {
          pageX = this.data.rightX - this.blockWidth;
        }
        if (pageX >= this.data.containerWidth) {
          pageX = this.data.containerWidth;
        }
        if (pageX < 0) {
          pageX = 0;
        }
        this.touchmoveStream.next(pageX);
        this.setData({
          leftX: pageX
        });
      }
    },
    handleClickCustom() {
      const useCustom = !this.data.useCustom;
      this.setData({
        useCustom
      });
      if (useCustom) {
        this.setData({
          maxInputValue:
            this.data.maxValue === 10000 ? 9999 : this.data.maxValue,
          minInputValue: this.data.minValue
        });
      } else {
        this.setData({
          maxInputValue: "",
          minInputValue: ""
        });
      }
      this.triggerEvent("onCustom", useCustom);
    },
    handleMinPriceChange(event) {
      const maxValue = +this.data.maxInputValue;
      let minValue = event.detail.value;
      if (minValue) {
        minValue = +minValue;
        if (minValue > 9999) {
          minValue = 9999;
        }

        this.setData({
          minInputValue: minValue
        });
      }

      this.triggerEvent("onChange", {
        min: minValue,
        max: maxValue
      });
    },
    handleMaxPriceChange(event) {
      const minValue = +this.data.minInputValue;
      let maxValue = event.detail.value;
      if (maxValue) {
        maxValue = +maxValue;
        if (maxValue > 9999) {
          maxValue = 9999;
        }

        this.setData({
          maxInputValue: maxValue
        });
      }

      this.triggerEvent("onChange", {
        min: minValue,
        max: maxValue
      });
    },
    handleLeftTouchEnd() {
      this.touchendStream.next(true);
      this.touchEnd = true;
    },
    handleRightTouchEnd() {
      this.touchendStream.next(true);
      this.touchEnd = true;
    },
    handleRightTouchStart() {
      this.moveDirectionStream.next("right");
      this.touchendStream.next(false);
      this.touchEnd = false;
    },
    handleRightTouchMove(event) {
      if (this.touchEnd === false) {
        this.isMoved = true;
        let { pageX } = event.touches[0];
        pageX = ~~(pageX - this.containerLeft - this.blockHalfWidth);
        if (pageX - this.data.leftX < this.blockWidth) {
          pageX = this.data.leftX + this.blockWidth;
        }
        if (pageX >= this.data.containerWidth) {
          pageX = this.data.containerWidth;
        }
        if (pageX < 0) {
          pageX = 0;
        }
        this.touchmoveStream.next(pageX);
        this.setData({
          rightX: pageX
        });
      }
    },
    calcLeftX() {
      const leftX = ~~(((this.data.min / 100) * 100) / this.funX);
      this.setData({
        leftX
      });
    },
    calcRightX() {
      const rightX = (~~(this.data.max / 100) * 100 - this.funY) / this.funX;
      this.setData({
        rightX
      });
    }
  },
  lifetimes: {
    ready() {
      setTimeout(() => {
        this.inited = false;

        this.touchmoveStream = new rxjs.BehaviorSubject(0);
        this.moveDirectionStream = new rxjs.BehaviorSubject("right");
        this.touchendStream = new rxjs.BehaviorSubject(false);
        this.containerWidthStream = new rxjs.BehaviorSubject(0);
        this.blockWidthStream = new rxjs.BehaviorSubject(0);
        this.funX = 0;
        this.funY = 0;

        this.createSelectorQuery()
          .select(`.move-view`)
          .boundingClientRect(rect => {
            const blockWidth = rect.width;
            this.blockWidth = blockWidth;
            this.blockHalfWidth = blockWidth / 2;
            this.blockWidthStream.next(blockWidth);
          })
          .exec();

        this.widthSubscription = rxjs
          .combineLatest(this.containerWidthStream, this.blockWidthStream)
          .subscribe(([containerWidth, blockWidth]) => {
            const deltaWidth = containerWidth - blockWidth;

            const funX = +(9900 / deltaWidth).toFixed(2);

            const funY = +(10000 - funX * containerWidth).toFixed(2);

            this.funX = funX;

            this.funY = funY;

            if (this.data.min > 0) {
              this.calcLeftX();
            }

            if (this.data.max < 10000) {
              this.calcRightX();
            }

            this.setData({
              minValue: this.data.min,
              maxValue: this.data.max
            });

            if (this.data.custom === true) {
              this.setData({
                useCustom: true,
                minText: this.data.min,
                maxText: this.data.max,
                minInputValue: this.data.min,
                maxInputValue: this.data.max
              });
            }

            setTimeout(() => {
              this.setData({
                isLoaded: true
              });
            }, 50);
          });

        this.createSelectorQuery()
          .select(`.background-line`)
          .boundingClientRect(rect => {
            const containerWidth = rect.width;
            this.setData({
              rightX: containerWidth,
              leftX: 0,
              containerWidth
            });

            this.containerWidthStream.next(containerWidth);
          })
          .exec();

        this.createSelectorQuery()
          .select(`.container`)
          .boundingClientRect(rect => {
            this.containerLeft = rect.left;
          })
          .exec();

        this.touchmoveSubscription = this.touchmoveStream
          .pipe(rxjs.operators.withLatestFrom(this.moveDirectionStream))
          .subscribe(([x, dir]) => {
            if (this.inited === false) {
              this.inited = true;
              return;
            }
            /**
             * 公式推导过程
             *
             * 左滑块极值点: 0 => 0 ; 线宽 - 1 * 滑块宽度 => 9900
             *
             * 右滑块极值点 线宽 => 10000 ; 0 + 1 * 滑块宽度 => 100
             *
             * 观察可以得到 Δw = 线宽 - 1 * 滑块宽度
             *
             * 由左滑块极值推出公式
             *
             * ① 0 * x + y = 0
             *
             * ② Δw * x + y = 9900
             *
             * ② - ① 后移项得 x = 9900 / Δw y = 0
             *
             * 由右滑块极值推出公式为
             *
             * ① 线宽 * x + y = 10000
             *
             * ② 1 * 滑块宽度 * x + y = 100
             *
             * ① - ② 得 (线宽 - 1 * 滑块宽度) * x = 9900
             *
             * 即 Δw * x = 9900
             *
             * 代入后可得
             *
             * y = 10000 - x * Δw
             *
             **/

            if (dir === "left") {
              const min = Math.round((this.data.leftX * this.funX) / 100) * 100;

              this.setData({
                minValue: this.data.max - min < 100 ? this.data.max - 100 : min
              });
            } else if (dir === "right") {
              const max =
                Math.round((this.data.rightX * this.funX + this.funY) / 100) *
                100;

              this.setData({
                maxValue: max - this.data.min < 100 ? this.data.min + 100 : max
              });
            }
          });

        const xStream = this.touchendStream.pipe(
          rxjs.operators.withLatestFrom(
            this.touchmoveStream,
            this.moveDirectionStream
          ),
          rxjs.operators.filter(
            ([touchend]) => touchend === true && this.isMoved === true
          ),
          rxjs.operators.tap(() => (this.isMoved = false)),
          rxjs.operators.map(([touchend, x, dir]) => [x, dir])
        );

        this.xSubscription = xStream.subscribe(([x, dir]) => {
          const { minValue, maxValue } = this.data;

          this.triggerEvent("onChange", {
            min: minValue,
            max: maxValue
          });
        });
      });
    },
    detached() {
      if (this.xSubscription) {
        this.xSubscription.unsubscribe();
      }
      if (this.touchmoveSubscription) {
        this.touchmoveSubscription.unsubscribe();
      }
      if (this.widthSubscription) {
        this.widthSubscription.unsubscribe();
      }
      this.touchmoveStream.complete();
      this.moveDirectionStream.complete();
      this.touchendStream.complete();
      this.containerWidthStream.complete();
      this.blockWidthStream.complete();
    }
  }
});
