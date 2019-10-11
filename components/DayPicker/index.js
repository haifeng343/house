import fecha from '../../utils/fecha.js';
import {
  getPickerStream
} from "../../utils/pickerStream.js";

Component({
  data: {
    dayList: [],
    title: ''
  },
  properties: {
    month: {
      type: String,
    },
  },
  methods: {
    subscribe() {
      const {
        month
      } = this.properties;
      const {
        dateStream
      } = this.stream;
      if (month) {
        this.dataSubscription = dateStream.subscribe(date => {
          this.setData({
            dayList: this.data.dayList.map(item => {
              if (!!item.date) {
                let className = '';
                const index = date.indexOf(item.date);
                const currentDate = fecha.parse(item.date, 'YYYY-MM-DD');
                if (index > -1) {
                  className += ' select ';
                  if (date.length === 2) {
                    className += `${index === 0 ? ' start ' : ' end '}`;
                  }
                } else if (date.length === 2) {
                  const startDate = fecha.parse(date[0], 'YYYY-MM-DD');
                  const endDate = fecha.parse(date[1], 'YYYY-MM-DD');

                  if (currentDate > startDate && currentDate < endDate) {
                    className += ' active ';
                  }
                } else if (date.length === 1) {
                  const maxTime = 365 * 24 * 60 * 60 * 1000;
                  const targetDate = fecha.parse(date[0], 'YYYY-MM-DD');
                  if (
                    Math.abs(targetDate.getTime() - currentDate.getTime()) >
                    maxTime
                  ) {
                    item.disabled = true;
                  }
                }
                if (date.length !== 1) {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  item.disabled = yesterday > currentDate;
                }

                className += item.disabled ? 'disabled' : '';
                item.className = className;
              }

              return item;
            })
          });
        });
      }
    },
    calcDayList() {
      const {
        month
      } = this.properties;
      if (month) {
        const holidays = JSON.parse(wx.getStorageSync('holidays'));
        const dayList = [];
        const date = fecha.parse(month, 'YYYY-MM');
        const title = fecha.format(date, 'YYYY年M月');
        const dayOfWeek = date.getDay();
        const currentMonth = date.getMonth();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        for (let i = 1; i <= dayOfWeek; i++) {
          dayList.push({
            label: -1 * i,
            className: '',
            disabled: true,
            date: null
          });
        }
        let index = 0;
        while (currentMonth === date.getMonth()) {
          const day = date.getDate();
          const week = date.getDay();
          const title = holidays[`${month}-${day.toString().padStart(2, '0')}`];
          dayList.push({
            label: day,
            className: '',
            disabled: yesterday > date,
            index,
            mark: week === 0 || week === 6 || typeof title !== 'undefined',
            date: fecha.format(date, 'YYYY-MM-DD'),
            title
          });
          const nextDay = day + 1;
          index += 1;
          date.setDate(nextDay);
        }

        this.setData({
          dayList,
          title: title
        }, () => {
          this.subscribe();
        });
      }
    },
    handleSelectDay(event) {
      const index = event.currentTarget.dataset.index;
      const day = this.data.dayList[index];
      if (!!day.date) {
        this.stream.selectStream.next(day);
      }
    }
  },
  lifetimes: {
    ready() {
      this.stream = getPickerStream();
      this.calcDayList();
    },
    detached() {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
      }
    }
  }
})