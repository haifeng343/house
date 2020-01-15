import Http from "../../utils/http";

const typeEnum = {
  11: "secnic",
  12: "highschool",
  13: "airport",
  14: "hospital",
  15: "buiness",
  16: "area",
  17: "subway",
  18: "airport",
  10: "all"
};

Component({
  /**
   * 页面的初始数据
   */
  properties: {
    shownType: {
      type: Number
    },
    type: {
      type: String
    },
    cityName: {
      type: String
    },
    sort: {
      type: Number
    }
  },
  data: {
    priceText: "",
    priceType: "",
    houseType: {},
    leaseType: {},
    level1View: "activelevel1",
    level2View: "activelevel2",
    level3View: "activelevel3",
    isLoaded: false,
    sortList: [
      {
        label: "价格从低到高",
        value: 2,
        active: false
      },
      {
        label: "价格从高到低",
        value: 3,
        active: false
      }
    ],
    optionList: [
      {
        value: 1,
        label: "1人",
        active: false
      },
      {
        value: 2,
        label: "2人",
        active: false
      },
      {
        value: 3,
        label: "3人",
        active: false
      },
      {
        value: 4,
        label: "4人",
        active: false
      },
      {
        value: 5,
        label: "5人",
        active: false
      },
      {
        value: 6,
        label: "6人",
        active: false
      },
      {
        value: 7,
        label: "7人",
        active: false
      },
      {
        value: 8,
        label: "8人",
        active: false
      },
      {
        value: 9,
        label: "9人",
        active: false
      },
      {
        value: 10,
        label: "10人+",
        active: false
      },
      {
        value: -1,
        label: "不限",
        active: false
      }
    ],
    priceType: {
      "0": 0,
      "1": 200,
      "2": 300,
      "3": 400,
      "4": 500,
      "5": 600,
      "6": 99999
    },
    equipments: {},
    searchData: {
      cityType: "",
      area: "",
      areaId: {},
      areaType: "",
      city: "", //城市名
      cityId: {}, //城市ID
      beginDate: "", //开始日期
      endDate: "", //离开日期
      dayCount: 0,
      gueseNumber: 1, //入住人数
      leaseType: "", //房间类型  0单间 1整租
      houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0, //最低价
      maxPrice: 99999, //最高价
      sort: 0, //搜索方式 0推荐 1低价有限
      equipment: [],
      advSort: 1
    },
    area: {},
    positionList: [],
    typeActive: "",
    middleList: [],
    middleActive: "",
    lastList: [],
    lastActive: "",
    initAreaData: {
      secnic: {
        name: "景点",
        data: {},
        length: 0
      },
      highschool: {
        name: "高校",
        data: {},
        length: 0
      },
      airport: {
        name: "机场/车站",
        data: {},
        length: 0
      },
      hospital: {
        name: "医院",
        data: {},
        length: 0
      },
      buiness: {
        name: "商圈",
        data: {},
        length: 0
      },
      area: {
        name: "行政区",
        data: {},
        length: 0
      },
      subway: {
        name: "地铁",
        data: {},
        length: 0
      }
    },
    initSelect: {}
  },
  methods: {
    handleSelectNumber(event) {
      const index = event.detail;
      this.data.searchData.gueseNumber = index;
      this.setData({
        searchData: this.data.searchData
      });
    },
    chooseType(event) {
      let type = "";
      let key = "";
      if (event) {
        type = event.currentTarget.dataset.type;
      } else {
        type = this.data.initSelect.initType;
        if (type === "subway") {
          for (var keys in this.data.area[type].data[
            this.data.initSelect.initLine
          ]) {
            if (
              this.data.area[type].data[this.data.initSelect.initLine][keys]
                .name === this.data.initSelect.initName
            ) {
              key = keys;
            }
          }
        } else {
          for (var keys in this.data.area[type].data) {
            if (
              this.data.area[type].data[keys].name ==
              this.data.initSelect.initName
            ) {
              key = keys;
            }
          }
        }
      }
      if (type === "subway") {
        let middleList = {};
        let lineName = "";
        for (let item in this.data.area.subway.data) {
          if (!lineName) {
            lineName = item;
          }
          middleList[item] = {
            name: item,
            line: this.data.area.subway.data[item]
          };
        }
        this.setData(
          {
            middleList,
            typeActive: type
          },
          () => {
            this.chooseSecond({
              currentTarget: {
                dataset: {
                  way: "subway",
                  type: event ? lineName : this.data.initSelect.initLine,
                  station: event
                    ? Object.keys(this.data.area.subway.data[lineName])[0]
                    : key
                }
              }
            });
          }
        );
      } else {
        this.setData({
          middleList: this.data.area[type].data,
          lastList: [],
          typeActive: type,
          middleActive: key || Object.keys(this.data.area[type].data)[0]
        });
      }

      wx.nextTick(() => {
        this.setData({ level2View: "activelevel2" });
      });
    },
    chooseSecond(event) {
      var data = event.currentTarget.dataset;
      const { type, way } = data;
      const station = data.station;

      this.setData(
        {
          lastList: this.data.middleList[type].line || {},
          middleActive: type
        },
        () => {
          if (
            way === "subway" &&
            data.type === this.data.initSelect.initLine &&
            +station === +this.data.initSelect.initKey
          ) {
            this.setData({
              lastActive: station
            });
          } else {
            this.setData({
              lastActive: Object.keys(this.data.lastList)[0]
            });
          }

          wx.nextTick(() => {
            this.setData({ level3View: "activelevel3" });
          });
        }
      );
    },
    chooseLast(event) {
      let type = event.currentTarget.dataset.type || "";
      this.setData({
        lastActive: type
      });
    },
    checkPositionId(name) {
      Http.post("/selectPlatDate.json", {
        param: name
      }).then(resp => {
        let data = resp.data;
        let searchData = this.data.searchData;
        if (data) {
          let info = JSON.parse(data.json);
          if (data.lineId) {
            //地铁
            searchData.area = data.stations;
            searchData.areaType = "17";
          } else {
            searchData.area = data.name;
            searchData.areaType = data.type.toString();
          }

          if (data.type === 16) {
            //行政区  只有areaid
            searchData.areaId = {
              mn: info.mn && info.mn.area_id,
              tj: info.tj && info.tj.value,
              xz: info.xz && info.xz.id,
              zg: info.zg && info.zg.id
            };
          } else {
            searchData.ltude = {
              mn: info.mn && info.mn.lat + "," + info.mn.lng,
              tj: info.tj && info.tj.latitude + "," + info.tj.longitude,
              xz: info.xz && info.xz.latitude + "," + info.xz.longitude,
              zg: info.zg && info.zg.latitude + "," + info.zg.longitude
            };
            searchData.areaId = {
              mn: info.mn && info.mn.id,
              tj: info.tj && info.tj.value,
              xz: info.xz && info.xz.id,
              zg: info.zg && info.zg.id
            };
          }
        } else {
          searchData.area = "";
          searchData.areaType = "";
          searchData.ltude = {};
          searchData.areaId = {};
        }

        const app = getApp();
        if (this.data.type === "monitor") {
          app.globalData.monitorSearchData = Object.assign({}, searchData);
        } else {
          app.globalData.searchData = Object.assign({}, searchData);
        }

        this.setData(
          {
            searchData
          },
          () => {
            this.triggerEvent("submit");
          }
        );
      });
    },
    selectLeaseType(event) {
      let index = event.currentTarget.dataset.index;
      let { leaseType } = this.data.searchData;
      if (leaseType === index) {
        leaseType = "";
      } else {
        leaseType = index;
      }

      this.setData({
        "searchData.leaseType": leaseType
      });
    },
    selectHouseType(event) {
      let index = event.currentTarget.dataset.index;
      let searchData = this.data.searchData;
      let isIndexOf = searchData.houseType.indexOf(index);
      if (isIndexOf >= 0) {
        searchData.houseType.splice(isIndexOf, 1);
      } else {
        searchData.houseType.push(index);
      }
      this.setData({
        searchData
      });
    },
    selectEquipments(event) {
      let index = event.currentTarget.dataset.index;
      let searchData = this.data.searchData;
      let isIndexOf = searchData.equipment.indexOf(index);
      if (isIndexOf >= 0) {
        searchData.equipment.splice(isIndexOf, 1);
      } else {
        searchData.equipment.push(index);
      }
      this.setData({
        searchData
      });
    },
    changeSort() {
      let searchData = this.data.searchData;
      var sort = searchData.sort;
      searchData.sort = sort === 1 ? 2 : 1;
      this.setData({
        searchData
      });
    },
    searchPositionSubmit() {
      if (Object.values(this.data.middleList).length <= 0) {
        let searchData = this.data.searchData;
        searchData.areaType = "";
        searchData.area = "";
        searchData.ltude = {};
        searchData.areaId = {};
        const app = getApp();
        if (this.data.type === "monitor") {
          app.globalData.monitorSearchData = Object.assign({}, searchData);
        } else {
          app.globalData.searchData = Object.assign({}, searchData);
        }
        this.setData(
          {
            searchData
          },
          () => {
            this.triggerEvent("submit");
          }
        );
      } else if (Object.values(this.data.lastList).length <= 0) {
        if (this.data.middleActive === 0) {
          let searchData = this.data.searchData;

          searchData.areaType = "";
          searchData.area = "";
          searchData.areaId = {};
          searchData.ltude = {};

          const app = getApp();
          if (this.data.type === "monitor") {
            app.globalData.monitorSearchData = Object.assign({}, searchData);
          } else {
            app.globalData.searchData = Object.assign({}, searchData);
          }
          this.setData(
            {
              searchData
            },
            () => {
              this.triggerEvent("submit");
            }
          );
        } else {
          let fullname =
            this.data.positionList[this.data.middleActive] ||
            this.data.positionList[this.data.lastActive];
          this.checkPositionId(fullname);
        }
      } else {
        let fullname = this.data.positionList[this.data.lastActive];
        this.checkPositionId(fullname);
      }
    },
    handleSelectSort(event) {
      const { value } = event.currentTarget.dataset;

      const sortItem = this.data.sortList.find(item => item.value === value);

      if (sortItem.active === false) {
        this.setData({
          sortList: this.data.sortList.map(item => {
            if (item === sortItem) {
              item.active = true;
            } else {
              item.active = false;
            }
            return item;
          }),
          "searchData.advSort": value
        });

        this.searchSubmit();
      }
    },
    handleClosePanel() {
      this.triggerEvent("onClose");
    },
    searchSubmit() {
      const searchData = this.data.searchData;
      const app = getApp();
      if (this.data.type === "monitor") {
        app.globalData.monitorSearchData = searchData;
      } else {
        app.globalData.searchData = searchData;
      }
      this.triggerEvent("submit");
    },
    changePrices(price) {
      this.data.searchData.minPrice = parseInt(
        this.data.priceType[price.detail.min]
      );
      this.data.searchData.maxPrice = parseInt(
        this.data.priceType[price.detail.max]
      );
      let length = 0;
      for (const key in this.data.priceType) {
        length++;
      }
      let priceText = "";
      if (price.detail.min === 0 && price.detail.max >= length - 1) {
        priceText = "不限";
      } else if (price.detail.min !== 0 && price.detail.max === length - 1) {
        priceText = "￥" + this.data.priceType[price.detail.min] + "以上";
      } else if (price.detail.min === 0 && price.detail.max !== length - 1) {
        priceText = "￥" + this.data.priceType[price.detail.max] + "以下";
      } else if (price.detail.min !== 0 && price.detail.max !== length - 1) {
        priceText =
          "￥" +
          this.data.priceType[price.detail.min] +
          "-" +
          "￥" +
          this.data.priceType[price.detail.max];
      }
      this.setData({
        searchData: this.data.searchData,
        priceText: priceText
      });
    },
    getHotPosition(update) {
      const app = getApp();
      (update || !this.positionData
        ? Http.get("/indexPosition.json", {
            cityName: this.data.city
          })
            .then(resp => Promise.resolve(resp.data))
            .then(data => {
              data.unshift(`${this.data.city}_全城_16`);
              return Promise.resolve(data);
            })
        : Promise.resolve(this.positionData)
      ).then(data => {
        this.positionData = data;
        this.setData({
          positionList: data
        });
        let area = {
          secnic: {
            name: "景点",
            data: {},
            length: 0
          },
          highschool: {
            name: "高校",
            data: {},
            length: 0
          },
          airport: {
            name: "机场/车站",
            data: {},
            length: 0
          },
          hospital: {
            name: "医院",
            data: {},
            length: 0
          },
          buiness: {
            name: "商圈",
            data: {},
            length: 0
          },
          area: {
            name: "行政区",
            data: {},
            length: 1
          },
          subway: {
            name: "地铁",
            data: {},
            length: 0
          }
        };
        let globalAreaName = "",
          globalAreaType = "";
        if (this.data.type === "monitor") {
          globalAreaName = app.globalData.monitorSearchData.area;
          globalAreaType = app.globalData.monitorSearchData.areaType.toString();
        } else {
          globalAreaName = app.globalData.searchData.area;
          globalAreaType = app.globalData.searchData.areaType.toString();
        }
        let initSelect = {
          initName: "",
          initType: "",
          initKey: ""
        };
        let randomKey = "";
        data.map((item, index) => {
          let position = item.split("_");
          let cityName = position[0];
          let areaName = position[1];
          let areaType = position[2];
          area[typeEnum[areaType]].length++;
          if (areaName === globalAreaName && areaType === globalAreaType) {
            initSelect.initName = areaName;
            initSelect.initType = typeEnum[areaType];
            initSelect.initKey = index;
            if (position.length === 4) {
              initSelect.initLine = position[3];
            }
          }
          randomKey = typeEnum[areaType];
          if (position.length === 3) {
            area[typeEnum[areaType]].data[index] = {
              name: areaName
            };
          } else {
            let lineType = position[3];
            if (!area[typeEnum[areaType]].data[lineType]) {
              area[typeEnum[areaType]].data[lineType] = {};
              area[typeEnum[areaType]].data[lineType].length = 0;
            }
            area[typeEnum[areaType]].data[lineType][index] = {
              name: areaName
            };
            area[typeEnum[areaType]].data[lineType].length++;
          }
        });
        if (!globalAreaName && !globalAreaType) {
          initSelect.initType = area.area.length > 1 ? "area" : randomKey;
          initSelect.initName = area.area.length > 1 ? "全城" : "";
          initSelect.initKey = area.area.length > 1 ? "0" : "";
        }
        if (area.subway.length) {
          let keysSorted = Object.keys(area.subway.data).sort();
          let newSubway = {};
          for (let i = 0; i < keysSorted.length; i++) {
            newSubway[keysSorted[i]] = area.subway.data[keysSorted[i]];
          }
          area.subway.data = newSubway;
        }
        this.setData(
          {
            area,
            initSelect: initSelect
          },
          () => {
            this.chooseType();

            wx.nextTick(() => {
              this.setData({
                level1View: "activelevel1",
                level2View: "activelevel2",
                level3View: "activelevel3"
              });
            });
          }
        );
      });
    },
    goCity() {
      if (this.data.type === "monitor") {
        return;
      }
      wx.navigateTo({
        url: "/pages/citySelect/citySelect"
      });
    },
    preventTouchMove() {}
  },
  lifetimes: {
    ready() {
      let houseType = wx.getStorageSync("houseType");
      let equipments = wx.getStorageSync("equipments");
      let leaseType = wx.getStorageSync("leaseType");
      const app = getApp();
      let searchData = {};
      if (this.data.type === "monitor") {
        searchData = Object.assign({}, app.globalData.monitorSearchData);
      } else {
        searchData = Object.assign({}, app.globalData.searchData);
      }
      const optionList = this.data.optionList.map(item => {
        item.active = item.value === +searchData.gueseNumber;
        return item;
      });
      let min = 0,
        max = 0;
      for (const key in this.data.priceType) {
        const item = this.data.priceType[key];
        if (item === searchData.minPrice) {
          min = key;
        } else if (item === searchData.maxPrice) {
          max = key;
        } else if (searchData.maxPrice === 99999) {
          max = 4;
        }
      }
      this.setData({
        searchData,
        isLoaded: true,
        optionList,
        houseType,
        equipments,
        leaseType,
        sortList: this.data.sortList.map(item => {
          if (item.value === searchData.advSort) {
            item.active = true;
          } else {
            item.active = false;
          }
          return item;
        })
      });
      this.changePrices({
        detail: {
          min: parseInt(min),
          max: parseInt(max)
        }
      });
    }
  },
  observers: {
    shownType: function(shownType) {
      if (shownType === 2) {
        let searchData = {};
        const app = getApp();
        if (this.data.type === "monitor") {
          searchData = Object.assign({}, app.globalData.monitorSearchData);
        } else {
          searchData = Object.assign({}, app.globalData.searchData);
        }
        this.setData(
          {
            searchData
          },
          () => {
            this.getHotPosition(false);
          }
        );
      }
    },
    cityName: function(city) {
      if (!city || city === "--") {
        return;
      }
      let searchData = {};
      const app = getApp();
      if (this.data.type === "monitor") {
        searchData = Object.assign({}, app.globalData.monitorSearchData);
      } else {
        searchData = Object.assign({}, app.globalData.searchData);
      }
      this.setData(
        {
          city,
          searchData
        },
        () => {
          this.getHotPosition(true);
        }
      );
    },
    sort(newValue) {
      console.log(newValue);
      if (this.data.isLoaded && typeof newValue === "number") {
        this.setData({
          sortList: this.data.sortList.map(item => {
            if (item.value === newValue) {
              item.active = true;
            } else {
              item.active = false;
            }
            return item;
          })
        });
      }
    }
  }
});
