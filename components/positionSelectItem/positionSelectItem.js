import positionService from "./service";
const service = new positionService();
const typeNameEnum = {
  secnic: "景点",
  highschool: "高校",
  airport: "机场/车站",
  hospital: "医院",
  buiness: "商圈",
  area: "行政",
  subway: "地铁",
  airport: "机场/车站"
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
      let type = event.currentTarget.dataset.type;
      const app = getApp();
      service
        .getPositionInfoByName(fullname)
        .then(resp => {
          let data = resp.data;
          let info = JSON.parse(resp.data.json);
          if (type == 16) {
            //行政区  只有areaid
            app.globalData.searchData.areaId = {
              mn: info.mn && info.mn.area_id,
              tj: info.tj && info.tj.value,
              xz: info.xz && info.xz.id,
              zg: info.zg && info.zg.id
            };
          } else {
            app.globalData.searchData.ltude = {
              mn: info.mn && info.mn.lat + "," + info.mn.lng,
              tj: info.tj && info.tj.latitude + "," + info.tj.longitude,
              xz: info.xz && info.xz.latitude + "," + info.xz.longitude,
              zg: info.zg && info.zg.latitude + "," + info.zg.longitude
            };
            app.globalData.searchData.areaId = {
              mn: info.mn && info.mn.id,
              tj: info.tj && info.tj.value,
              xz: info.xz && info.xz.id,
              zg: info.zg && info.zg.id
            };
          }
          app.globalData.searchData.area = name;
          app.globalData.searchData.areaType = type;
          wx.navigateBack({ delta: 1 });
        })
        .catch(error => {
          console.error(error);
        });
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
