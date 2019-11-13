import positionService from './service';
const service = new positionService();
const typeNameEnum = {
  "area": '行政',
  "subway": '地铁'
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
        page = -1
      }
      page++;
      this.setData({ isScroll: true, page }, () => {
        let scrollTop = page * 4 * this.data.singleItemHeight;
        this.setData({
          scrollTop,
          isScroll: false
        })
      })
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
        .boundingClientRect().exec(rect => {
          let height = rect[0].height;
          let lines = height / this.data.singleItemHeight;
          let totalPage = Math.ceil(lines / 4);
          let lastPage = lines % 4;
          this.setData({
            lines,
            totalPage,
            lastPage
          })
        });
    },
    chooseArea(event) {
      let name = event.currentTarget.dataset.name
      let fullname = event.currentTarget.dataset.fullname
      let type = event.currentTarget.dataset.type
      const app = getApp();
      let searchLongData = app.globalData.searchLongData
      service.getPositionInfoByName(fullname, searchLongData.city, searchLongData.chooseType).then(resp => {
        let data = resp.data;
        let info = JSON.parse(resp.data.json);
        // console.log(data, info)
        searchLongData.area = info.name
        searchLongData.areaJson = resp.data.json
        if (type == 10) {//行政区
          searchLongData.areaType = 10
          if (info.wiwj && info.wiwj[0]) {
            searchLongData.areaId.wiwj = info.wiwj[0].id
          }
          if (info.lj && info.lj[0]) {
            searchLongData.areaId.lj = info.lj[0].district_quanpin
          }
          if (info.ftx && info.ftx[0]) {
            searchLongData.areaId.ftx = info.ftx[0].name
          }
          if (info.tc && info.tc[0]) {
            searchLongData.areaId.tc = info.tc[0].dirname
          }
        } else {
          searchLongData.areaType = 50
          searchLongData.areaId.subwaysLine = resp.data.subwaysLine
          if (info.wiwj) {
            searchLongData.areaId.wiwj = {
              id : info.wiwj.id,
              lineid: info.wiwj.lineid
            }
          }
          if (info.lj) {
            let pData = JSON.parse(resp.data.pjson)
            searchLongData.areaId.lj = {
              id: info.lj.subway_station_id,
              lineid: pData.lj.subway_line_id
            }
          }
          if (info.ftx) {
            searchLongData.areaId.ftx = {
              id: info.ftx.name
            }
          }
          if (info.tc) {
            let pData = JSON.parse(resp.data.pjson)
            searchLongData.areaId.tc = {
              id: info.tc.siteid,
              lineid: pData.tc.lineid
            }
          }
        }
        // console.log(info,searchLongData)
        wx.navigateBack({ delta: 1 });
      }).catch(error => {
        console.error(error);
      });
    },
  },
  lifetimes: {
    attached() {
      let singleItemHeight = 0;
      setTimeout(() => {
        wx.createSelectorQuery()
          .in(this)
          .select('.item')
          .boundingClientRect().exec(rect => {
            singleItemHeight = rect[0].height + 10;
            this.setData({
              singleItemHeight
            }, () => {
              this.calcPage();
            })
          });
      }, 500);
    }
  },
  observers: {
    data: function (data) {
      console.log(data);
    }
  }
})
