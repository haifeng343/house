import * as rxjs from "../../utils/rx.js";

const optionList = [{}];

Component({
  data: {
    x: 0,
    viewData: [],
    activeLeft: 0,
    currentIndex: null
  },
  properties: {
    value: {
      type: Number,
      value: -1
    }
  },
  methods: {
    handleClickOptionItem(event) {
      const { index } = event.currentTarget.dataset;
      const point = this.data.viewData.find(item => item.index === index);
      const x = point.left * -1 + 3 * this.itemWidth;
      this.setData({
        x,
        currentIndex: point.index
      });
      this.scrollLeftStream.next(x);
      this.triggerEvent("change", point.value === 11 ? -1 : point.value);
    },
    handleTouchStart() {
      this.touchEnd = false;
      this.scrollEndStream.next(false);
    },
    handleTouchMove(event) {
      if (this.touchEnd === true) {
        return;
      }
      this.isMoved = true;
      const { pageX } = event.touches[0];
      this.touchMoveStream.next(pageX);
    },
    handleTouchEnd() {
      if (this.isMoved === true) {
        this.touchMoveStream.next(0);
        this.touchEnd = true;
        this.scrollEndStream.next(true);
        this.isMoved = false;
      }
    },
    getDifferenceIndexes(slice, startIndex, endIndex) {
      const indexes = [];

      slice.forEach((item, i) => {
        if (item.index < startIndex || item.index > endIndex) {
          indexes.push(i);
        }
      });

      return indexes;
    },
    findClosestPoint(sl, iw) {
      const index = Math.round(sl / iw);
      const x = index * iw;
      this.setData({
        x
      });
      let point = null;
      if (index <= 0) {
        point = this.data.viewData.find(
          item => item.left === (Math.abs(index) + 3) * iw
        );
      } else {
        point = this.data.viewData.find(
          item => item.left === (index - 3) * iw * -1
        );
      }
      this.setData({ currentIndex: point.index });
      this.triggerEvent("change", point.value === 11 ? -1 : point.value);
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        viewData: optionList.slice()
      });
    },
    ready() {
      setTimeout(() => {
        this.touchEnd = true;
        this.scrollLeftStream = new rxjs.BehaviorSubject(0);
        this.itemWidthStream = new rxjs.BehaviorSubject(0);
        this.scrollEndStream = new rxjs.BehaviorSubject(false);
        this.touchMoveStream = new rxjs.BehaviorSubject(0);
        this.currentIndex = -1;
        this.inited = false;
        this.isMoved = false;

        this.touchMoveSubscription = this.touchMoveStream
          .pipe(
            rxjs.operators.pairwise(),
            rxjs.operators.filter(([p, n]) => n && p),
            rxjs.operators.map(([p, n]) => this.data.x + (n - p))
          )
          .subscribe(x => {
            this.setData({
              x
            });
            this.scrollLeftStream.next(x);
          });

        const scrollDirection = this.scrollLeftStream.pipe(
          rxjs.operators.pairwise(),
          rxjs.operators.map(([p, n]) => (n - p >= 0 ? 1 : -1)),
          rxjs.operators.startWith(-1)
        );

        const indexes = rxjs
          .combineLatest(
            this.scrollLeftStream,
            this.itemWidthStream,
            scrollDirection
          )
          .pipe(
            rxjs.operators.filter(([sl, iw, dir]) => iw > 0),
            rxjs.operators.map(([sl, iw, dir]) => {
              sl = sl * -1;
              let startIndex = 0;
              startIndex = Math.round(sl / iw) - 2;
              const endIndex = startIndex + 12;
              return [startIndex, endIndex];
            })
          );

        const shouldUpdate = indexes.pipe(
          rxjs.operators.filter(
            ([startIndex]) => startIndex !== this.currentIndex
          ),
          rxjs.operators.tap(([startIndex]) => {
            this.currentIndex = startIndex;
          })
        );

        let dataSlice = [];

        const dataInView = shouldUpdate.pipe(
          rxjs.operators.withLatestFrom(this.itemWidthStream, scrollDirection),
          rxjs.operators.map(([[startIndex, endIndex], iw, dir]) => {
            if (dataSlice.length === 0) {
              for (let i = startIndex; i <= endIndex; i++) {
                const item = {};
                item.left = i * iw;
                item.index = i;
                if (item.index >= 0) {
                  item.value = (item.index % 11) + 1;
                } else {
                  item.value = (item.index % 11) + 12;
                }
                if (item.value % 11 === 0) {
                  item.label = "不限";
                } else if (item.value % 11 === 10) {
                  item.label = "10人+";
                } else {
                  item.label = `${item.value % 11}人`;
                }
                dataSlice.push(item);
              }
              return dataSlice;
            }

            const differenceIndexes = this.getDifferenceIndexes(
              dataSlice,
              startIndex,
              endIndex
            );

            let newIndex =
              dir < 0 ? endIndex - differenceIndexes.length + 1 : startIndex;

            differenceIndexes.forEach(index => {
              const item = dataSlice[index];
              item.left = newIndex * iw;
              item.index = newIndex;
              if (newIndex >= 0) {
                item.value = (item.index % 11) + 1;
              } else {
                // -1 => 0
                // -2 => 10
                // -3 => 9
                // -4 => 8
                // -5 => 7
                // -6 => 6
                // -7 => 5
                // -8 => 4
                // -9 => 3
                // -10 => 2
                // -11 => 1
                // -12 => 0
                // -13 => 10
                // -14 => 9
                // -15 => 8
                // -16 => 7
                item.value = (item.index % 11) + 12;
              }
              if (item.value % 11 === 0) {
                item.label = "不限";
              } else if (item.value % 11 === 10) {
                item.label = "10人+";
              } else {
                item.label = `${item.value % 11}人`;
              }
              newIndex++;
            });

            return dataSlice;
          })
        );

        this.dataInViewSubscription = dataInView.subscribe(viewData => {
          if (this.inited === false) {
            this.inited = true;
            const value = (this.data.value === -1 ? 11 : this.data.value) - 4;
            const x = value * this.itemWidth * -1;
            const currentIndex =
              this.data.value === -1 ? 10 : this.data.value - 1;
            this.setData({
              x,
              currentIndex
            });
            this.scrollLeftStream.next(x);
          }
          this.setData({
            viewData
          });
        });

        this.createSelectorQuery()
          .select(`.option-item`)
          .boundingClientRect(rect => {
            if (rect) {
              this.itemWidth = rect.width;
              this.itemWidthStream.next(rect.width);
              this.setData({
                activeLeft: rect.width * 3
              });
            }
          })
          .exec();

        this.scrollEndStream
          .pipe(
            rxjs.operators.filter(se => se === true),
            rxjs.operators.withLatestFrom(
              this.scrollLeftStream,
              this.itemWidthStream,
              scrollDirection
            )
          )
          .subscribe(([, sl, iw, dir]) => {
            this.findClosestPoint(sl, iw, dir);
          });
      });
    },
    detached() {
      if (this.dataInViewSubscription) {
        this.dataInViewSubscription.unsubscribe();
      }
    }
  }
});
