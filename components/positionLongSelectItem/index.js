import positionService from "./service";
const service = new positionService();
import { chooseArea } from "../../utils/longSetSearchData.js";
const typeNameEnum = {
  area: "行政",
  subway: "地铁"
};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object
    },
    key: {
      type: String
    },
    type: {
      type: String
    },
    isSecond: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    spread: false,
    isScroll: false,
    singleItemHeight: 0,
    lines: 0,
    page: 0,
    totalPage: 0,
    scrollTop: 0,
    showAll: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTab() {
      let page = this.data.page;
      if (page == this.data.totalPage) {
        page = -1;
      }
      page++;
      this.setData({ isScroll: true, page }, () => {
        let scrollTop = page * 4 * this.data.singleItemHeight;
        this.setData({
          scrollTop,
          isScroll: false
        });
      });
    },
    spreadItem() {
      if (this.properties.data.data.length <= 20) {
        let showAll = this.data.showAll;
        this.setData({
          showAll: !showAll
        });
      }
      let spread = this.data.spread;
      this.setData({
        spread: !spread
      });
    },
    calcPage() {
      let selectName = `#${this.properties.key}Box`;
      wx.createSelectorQuery()
        .in(this)
        .select(selectName)
        .boundingClientRect()
        .exec(rect => {
          if (rect) {
            let height = rect[0].height;
            let lines = height / this.data.singleItemHeight;
            let totalPage = Math.ceil(lines / 4);
            let lastPage = lines % 4;
            this.setData({
              lines,
              totalPage,
              lastPage
            });
          }
        });
    },
    chooseArea(event) {
      let name = event.currentTarget.dataset.name;
      let fullname = event.currentTarget.dataset.fullname;
      let isSecond = this.data.isSecond || false
      const app = getApp();
      let searchLongData = app.globalData.searchLongData;
      let secondSearchData = app.globalData.secondSearchData;
      let chooseType = 1
      if (!isSecond) {
        chooseType = searchLongData.chooseType || 1
      }
      chooseArea(fullname, searchLongData.city, chooseType).then(
        resp => {
          if (!isSecond) {
            app.globalData.searchLongData = Object.assign(
              app.globalData.searchLongData,
              resp
            );
          } else {
            app.globalData.secondSearchData = Object.assign(
              app.globalData.secondSearchData,
              resp
            );
          }
          wx.navigateBack({ delta: 1 });
        }
      );
    }
  },
  lifetimes: {
    attached() {
      let singleItemHeight = 0;
      setTimeout(() => {
        wx.createSelectorQuery()
          .in(this)
          .select(".item")
          .boundingClientRect()
          .exec(rect => {
            if (rect) {
              singleItemHeight = rect[0].height + 10;
              this.setData(
                {
                  singleItemHeight
                },
                () => {
                  this.calcPage();
                }
              );
            }
          });
      }, 500);
    }
  },
  observers: {
    data: function(data) {
      console.log(data);
    }
  }
});
