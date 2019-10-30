import fecha from '../../utils/fecha.js';
import * as rxjs from "../../utils/rx.js";
import {
  getPickerStream,
  destoryPickerStream
} from "../../utils/pickerStream.js";


Component({
  data: {
    pickerList: [{
      index: -1
    }],
    dayCount: 0
  },
  properties: {
    startDate: {
      type: String
    },
    endDate: {
      type: String
    },
    onChange: {
      type: Function,
    },
    type: {
      type: String
    }
  },
  methods: {
    init() {
      this.baseMonth = -1;

      this.baseYear = -1;

      this.currentIndex = -1;

      this.createSelectorQuery()
        .select(`.picker-item`)
        .boundingClientRect(rect => {
          this.stream.itemHeightStream.next(rect.height);
        })
        .exec();

      this.dateData = [];

      const {
        startDate,
        endDate,
        onChange,
      } = this.properties;
      if (startDate) {
        this.dateData.push(startDate);

        if (endDate && startDate !== endDate) {
          this.dateData.push(endDate);
          const dayCount = this.calcDayCount(startDate, endDate);
          this.setData({ dayCount });
        }

        this.stream.dateStream.next(this.dateData);
      }

      this.stream.selectStream
        .pipe(rxjs.operators.filter(item => !!item))
        .subscribe(item => {
          const {
            date
          } = item;
          const index = this.dateData.indexOf(date);
          if (index > -1) {
            this.dateData.splice(index, 1);
          } else if (item.disabled) {
            return;
          } else if (this.dateData.length === 0) {
            this.dateData.push(date);
          } else if (this.dateData.length === 1) {
            const selectedDate = fecha.parse(this.dateData[0], 'YYYY-MM-DD');
            const currentDate = fecha.parse(date, 'YYYY-MM-DD');
            if (selectedDate > currentDate) {
              this.dateData.unshift(date);
            } else {
              this.dateData.push(date);
            }
          } else if (this.dateData.length === 2) {
            this.dateData = [date];
          }

          let dayCount = 0;

          if (this.dateData.length === 1) {
            dayCount = 0;
          } else if (this.dateData.length === 2) {
            const startDate = fecha.parse(this.dateData[0], 'YYYY-MM-DD');
            const endDate = fecha.parse(this.dateData[1], 'YYYY-MM-DD');
            const timeSpan = endDate.getTime() - startDate.getTime();
            dayCount = timeSpan / 1000 / 60 / 60 / 24;
          }

          this.stream.dateStream.next(this.dateData);
          this.setData({ dayCount })


          this.triggerEvent('onChange', {
            startDate: this.dateData[0],
            endDate: this.dateData[1],
            dayCount
          })
        });

      const scrollDirection = this.stream.scrollStream.pipe(
        rxjs.operators.pairwise(),
        rxjs.operators.map(([p, n]) => (n - p > 0 ? 1 : -1)),
        rxjs.operators.startWith(1)
      );

      const indexes = rxjs
        .combineLatest(this.stream.scrollStream, this.stream.itemHeightStream)
        .pipe(
          rxjs.operators.filter(([st, ih]) => ih > 0),
          rxjs.operators.map(([st, ih]) => {
            const startIndex = Math.max(Math.floor((st - 10) / ih), 0);
            return [startIndex, startIndex + 3];
          })
        );

      const shouldUpdate = indexes.pipe(
        rxjs.operators.filter(([startIndex]) => startIndex !== this.currentIndex),
        rxjs.operators.tap(([startIndex]) => {
          this.currentIndex = startIndex;
        })
      );

      let dataSlice = [];

      const dataInView = shouldUpdate.pipe(
        rxjs.operators.withLatestFrom(this.stream.itemHeightStream, scrollDirection),
        rxjs.operators.map(([
          [startIndex, endIndex], ih, dir
        ]) => {
          if (dataSlice.length === 0) {
            const date = new Date();

            this.baseMonth = date.getMonth() + 1;

            this.baseYear = date.getFullYear();

            for (let i = 0; i < 4; i++) {
              dataSlice.push({
                month: this.calcMonth(i),
                top: i * ih,
                index: i
              });
            }

            return dataSlice;
          }

          const differenceIndexes = this.getDifferenceIndexes(
            dataSlice,
            startIndex,
            endIndex
          );

          let newIndex =
            dir > 0 ? endIndex - differenceIndexes.length + 1 : startIndex;

          differenceIndexes.forEach(index => {
            const item = dataSlice[index];
            item.top = newIndex * ih;
            item.month = this.calcMonth(newIndex);
            item.index = newIndex++;
          });

          return dataSlice;
        })
      );

      this.dataInViewSubscription = dataInView.subscribe(pickerList => {
        this.setData({ pickerList });
      });
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
    calcDayCount(startDate, endDate) {
      let dayCount = 0;

      if (startDate === endDate) {
        dayCount = 0;
      } else {
        startDate = fecha.parse(startDate, 'YYYY-MM-DD');
        endDate = fecha.parse(endDate, 'YYYY-MM-DD');
        const timeSpan = endDate.getTime() - startDate.getTime();
        dayCount = timeSpan / 1000 / 60 / 60 / 24;
      }

      return dayCount;
    },
    calcMonth(count) {
      count = count += this.baseMonth;
      const month = count % 12;
      const year = Math.floor((count - 1) / 12);
      const result = `${this.baseYear + year}-${(month || 12).toString().padStart(2, 0)}`;
      return result;
    },
    handleScroll(event) {
      this.stream.scrollStream.next(event.detail.scrollTop);
    },
    handleSelectDate() {
      if (this.dateData && this.dateData.length > 1) {
        const app = getApp();
        if (this.properties.type == 'monitor') {
          app.globalData.monitorSearchData.beginDate = this.dateData[0];
          app.globalData.monitorSearchData.endDate = this.dateData[1] || this.dateData[0];
          app.globalData.monitorSearchData.dayCount = this.data.dayCount;
        } else {
          app.globalData.searchData.beginDate = this.dateData[0];
          app.globalData.searchData.endDate = this.dateData[1] || this.dateData[0];
          app.globalData.searchData.dayCount = this.data.dayCount;
        }
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面

        //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          isBack: true
        }, () => {
          wx.navigateBack({
            delta: 1,
            success:function(){
              prevPage.submitAdvance()
            }
          });
        });
      }
    }
  },
  lifetimes: {
    created() {
      this.stream = getPickerStream();
    },
    ready() {
      this.init();
    },
    detached() {
      destoryPickerStream();
      if (this.dataInViewSubscription) {
        this.dataInViewSubscription.unsubscribe();
      }
    }
  }
})