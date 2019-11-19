import FilterMap from "./FilterMap";
import { chooseArea } from "../../utils/longSetSearchData";
const longRentTip = require("../../utils/longRentTip");
import {
  longSetSearchData,
  chooseSlectData
} from "../../utils/longSetSearchData";
import { isShowNearby } from "../../utils/longSetSearchData.js";

const areaKey = ["area", "areaId", "areaJson", "areaType", "isHistory"];

const areaTagMap = {
  "0": "未选择",
  "10": "行政区",
  "20": "商圈",
  "30": "小区",
  "40": "地铁线",
  "50": "地铁站",
  "60": "附近"
};

Component({
  data: {
    showRightPanel: false,
    showTopPanel: false,
    currentPanel: "",
    isSearch: false,
    searchKey: "",
    searchResultList: [],
    filterList: [
      {
        title: "区域",
        action: "area",
        class: "",
        active: false,
        id: 1
      },
      {
        title: "类型",
        action: "type",
        class: "",
        active: false,
        id: 2
      },
      {
        title: "租金",
        action: "price",
        class: "",
        active: false,
        id: 3
      },
      {
        title: "高级筛选",
        action: "advance",
        class: "width80",
        active: false,
        id: 4
      }
    ],
    map: {},
    areaList: [],
    currentAreaType: 0,
    currentArea: 0,
    currentStation: 0,
    longBuildAreas: -1, // 0: ≤40㎡, 1: 40-60㎡, 2: 60-80㎡, 3: 80-100㎡, 4: 100-120㎡, 5: ≥120㎡, -1: 不限
    longFloorTypes: [], // 1: 低楼层, 2: 中楼层, 3: 高楼层
    longHeadings: [], // 1: 朝东, 2: 朝西, 3: 朝南, 4: 朝北, 10: 南北通透
    longHouseTags: [], // 1: 精装修, 2: 近地铁, 3: 拎包入住, 4: 随时看房, 5: 集中供暖, 6: 新上房源, 7: 配套齐全, 8: 视频看房
    longLayouts: [], // 1: 一室, 2: 二室, 3: 三室, 11: 三室及以上, 12: 四室及以上
    longRentTypes: 0, // 1: 整租, 2: 合租 3: 主卧, 4: 次卧
    longSortTypes: 0, // 1: 低价优先, 2: 空间优先, 3: 最新发布
    minPrice: 0, // 最低价
    maxPrice: 5500, // 最高价 不限99999
    rangeCustom: false,
    area: "",
    areaId: {},
    areaJson: "",
    areaType: 0,
    level2View: "",
    level3View: ""
  },
  properties: {
    data: {
      type: Object,
      value: [],
      observer(newvalue) {
        if (newvalue && Object.keys(newvalue).length > 0) {
          const outsideData = newvalue;

          const insideData = this.data;

          const { chooseType } = outsideData;

          const map = JSON.parse(FilterMap)[chooseType];

          const assginData = {};

          Object.keys(insideData)
            .filter(key => typeof outsideData[key] !== "undefined")
            .forEach(key => {
              if (Array.isArray(outsideData[key])) {
                assginData[key] = Object.assign([], outsideData[key]);
              } else if (typeof outsideData[key] === "object") {
                assginData[key] = Object.assign({}, outsideData[key]);
              } else {
                assginData[key] = outsideData[key];
              }
            });

          Object.keys(assginData).forEach(key => {
            const typeItem = map.type.find(item => item.field === key);

            if (typeItem) {
              typeItem.list.forEach(item => {
                if (
                  Array.isArray(assginData[key]) &&
                  assginData[key].includes(item.value)
                ) {
                  item.active = true;
                } else if (item.value === assginData[key]) {
                  item.active = true;
                }
              });
            } else {
              const filterItem = map.filter.find(item => item.field === key);
              if (filterItem) {
                filterItem.list.forEach(item => {
                  if (
                    Array.isArray(assginData[key]) &&
                    assginData[key].includes(item.value)
                  ) {
                    item.active = true;
                  } else if (item.value === assginData[key]) {
                    item.active = true;
                  }
                });
              }
            }
          });

          this.setData(
            Object.assign(
              {
                map
              },
              assginData
            )
          );
        }
      }
    },
    positionData: {
      type: Object,
      value: [],
      observer(newvalue) {
        if (newvalue && newvalue.length > 0) {
          const baseAreaList = JSON.parse(this.baseAreaList);
          newvalue
            .map(item => item.split("_"))
            .forEach(([name, type, subname]) => {
              const target = baseAreaList.find(item => item.type === type);
              if (target) {
                if (!subname) {
                  target.list.push({
                    label: name,
                    value: `${name}_${type}`
                  });
                } else {
                  const sub = target.list.find(item => item.label === subname);
                  if (!sub) {
                    target.list.push({
                      label: subname,
                      list: [
                        {
                          label: name,
                          value: `${name}_${type}_${subname}`
                        }
                      ]
                    });
                  } else {
                    sub.list.push({
                      label: name,
                      value: `${name}_${type}_${subname}`
                    });
                  }
                }
              }
            });
          this.setData({ areaList: baseAreaList });
        }
      }
    }
  },
  animationFlag: false,
  methods: {
    handleSearchInputChange(event) {
      this.setData({ isSearch: true });
      const searchKey = event.detail.value;
      const { cityId, chooseType } = this.data.data;
      this.setData({ searchKey });
      if (chooseType === 1) {
        longRentTip
          .getIntermediaryData(cityId, searchKey)
          .then(resp => {
            this.setData({
              searchResultList: resp.map(item =>
                Object.assign(
                  {
                    label: item.name,
                    tag: areaTagMap[item.type]
                  },
                  item
                )
              )
            });
          })
          .catch(error => {
            console.error(error);
            wx.showToast({
              title: "网络异常",
              icon: "none"
            });
          });
      } else {
        longRentTip
          .getPersonalData(cityId, searchKey)
          .then(resp => {
            this.setData({
              searchResultList: resp.map(item =>
                Object.assign(
                  {
                    label: item.name,
                    tag: areaTagMap[item.type]
                  },
                  item
                )
              )
            });
          })
          .catch(error => {
            console.error(error);
            wx.showToast({
              title: "网络异常",
              icon: "none"
            });
          });
      }
    },
    handleClearSearchKey() {
      this.setData({ searchKey: "", searchResultList: [] });
    },
    handleCancelSearch() {
      if (this.data.isSearch === true) {
        this.setData({ isSearch: false, searchKey: "" });
      } else {
        this.animationFlag = true;
        const topPanel = this.selectComponent("#TopPanel");
        if (topPanel) {
          topPanel.handleClosePanel();
        } else {
          this.animationFlag = false;
        }
      }
    },
    handleClickTabitem(event) {
      if (this.animationFlag === true) {
        return;
      }
      const tabItem = event.currentTarget.dataset.item;
      if (tabItem.active === true) {
        this.animationFlag = true;
        const topPanel = this.selectComponent("#TopPanel");
        if (topPanel) {
          topPanel.handleClosePanel();
        } else {
          this.animationFlag = false;
        }
      } else {
        this.setData({
          filterList: this.data.filterList.map(item => {
            if (item.id === tabItem.id) {
              item.active = true;
            } else {
              item.active = false;
            }
            return item;
          })
        });
        this.handleTabitemAction(tabItem);
      }
    },
    handleTabitemAction(tabItem) {
      switch (tabItem.action) {
        case "advance":
          this.setData({ showRightPanel: true, showTopPanel: false });
          break;
        case "price":
          this.setData({ showTopPanel: true, currentPanel: "price" });
          break;
        case "type":
          this.setData({ showTopPanel: true, currentPanel: "type" });
          break;
        case "area":
          this.setData({
            showTopPanel: true,
            currentPanel: "area"
          });
          this.getAreaData();
          wx.nextTick(() => {
            this.setData({
              level2View: "activelevel2",
              level3View: "activelevel3"
            });
          });
          break;
      }
    },
    handleHideRightPanel() {
      this.setData({
        showRightPanel: false,
        filterList: this.data.filterList.map(item => {
          item.active = false;
          return item;
        })
      });

      this.checkReset();
    },
    handleHideTopPanel() {
      this.animationFlag = false;
      this.setData({
        showTopPanel: false,
        filterList: this.data.filterList.map(item => {
          item.active = false;
          return item;
        })
      });
      this.checkReset();
    },
    handleSelectType(event) {
      const { value, field } = event.currentTarget.dataset;

      const typeItem = this.data.map.type.find(item => item.field === field);

      if (typeItem) {
        const optionItem = typeItem.list.find(item => item.value === value);

        let action = "";

        if (optionItem.active === true) {
          if (typeItem.multi) {
            action = "cancelselectmulti";
          } else if (typeItem.cancelable === true) {
            action = "cancelselect";
          }
        } else {
          if (typeItem.multi) {
            action = "selectmulti";
          } else {
            action = "selectandcancel";
          }
        }

        const arr = this.data[field];

        switch (action) {
          case "cancelselectmulti":
            optionItem.active = false;
            arr.splice(arr.indexOf(optionItem.value), 1);
            this.setData({
              [field]: arr.slice().sort((a, b) => a - b)
            });
            break;
          case "cancelselect":
            optionItem.active = false;
            this.setData({
              [field]: typeItem.defaultValue
            });
            break;
          case "selectmulti":
            optionItem.active = true;
            arr.push(optionItem.value);
            this.setData({
              [field]: arr.slice().sort((a, b) => a - b)
            });
            break;
          case "selectandcancel":
            optionItem.active = true;
            this.setData({
              [field]: optionItem.value
            });
            typeItem.list.forEach(item => {
              if (item.value !== optionItem.value) {
                item.active = false;
              }
            });
            break;
        }
        this.setData({
          ["map.type"]: this.data.map.type.map(item => item)
        });

        this.changeList.add(field);

        const { resetList } = typeItem;

        if (typeof resetList !== "undefined") {
          for (const [dataField, targetField] of resetList) {
            const targetItem = this.data.map[dataField].find(
              item => item.field === targetField
            );
            targetItem.list.forEach(item => {
              if (item.value !== targetItem.defaultValue) {
                item.active = false;
              } else {
                item.action = true;
              }
            });

            this.setData({
              [`map.${dataField}`]: this.data.map[dataField].slice(),
              [targetField]: Array.isArray(this.data[targetField])
                ? []
                : targetItem.defaultValue
            });

            this.changeList.add(targetField);
          }
        }
      }
    },

    handleSelectFilter(event) {
      const { value, field } = event.detail;
      const filterItem = this.data.map.filter.find(
        item => item.field === field
      );

      if (filterItem) {
        const optionItem = filterItem.list.find(item => item.value === value);

        let action = "";

        if (optionItem.active === true) {
          if (filterItem.multi) {
            action = "cancelselectmulti";
          } else if (filterItem.cancelable === true) {
            action = "cancelselect";
          }
        } else {
          if (filterItem.multi) {
            action = "selectmulti";
          } else {
            action = "selectandcancel";
          }
        }

        const arr = this.data[field];

        switch (action) {
          case "cancelselectmulti":
            optionItem.active = false;
            arr.splice(arr.indexOf(optionItem.value), 1);
            this.setData({
              [field]: arr.slice().sort((a, b) => a - b)
            });
            break;
          case "cancelselect":
            optionItem.active = false;
            this.setData({
              [field]: filterItem.defaultValue
            });
            break;
          case "selectmulti":
            optionItem.active = true;
            arr.push(optionItem.value);
            this.setData({
              [field]: arr.slice().sort((a, b) => a - b)
            });
            break;
          case "selectandcancel":
            optionItem.active = true;
            this.setData({
              [field]: optionItem.value
            });
            filterItem.list.forEach(item => {
              if (item.value !== optionItem.value) {
                item.active = false;
              }
            });
            break;
        }

        this.setData({
          ["map.filter"]: this.data.map.filter.map(item => item)
        });

        this.changeList.add(field);
      }
    },

    handleResetFilter() {
      const outsideData = this.data.data;

      const insideData = this.data;

      const assginData = {};

      Object.keys(insideData)
        .filter(key => typeof outsideData[key] !== "undefined")
        .filter(key => insideData.map.filter.find(item => item.field === key))
        .forEach(key => {
          if (Array.isArray(outsideData[key])) {
            assginData[key] = Object.assign([], outsideData[key]);
          } else if (typeof outsideData[key] === "object") {
            assginData[key] = Object.assign({}, outsideData[key]);
          } else {
            assginData[key] = outsideData[key];
          }
        });

      Object.keys(assginData).forEach(key => {
        const filterItem = insideData.map.filter.find(
          item => item.field === key
        );
        if (filterItem) {
          filterItem.list.forEach(item => {
            if (
              Array.isArray(assginData[key]) &&
              assginData[key].includes(item.value)
            ) {
              item.active = true;
            } else if (item.value === assginData[key]) {
              item.active = true;
            } else {
              item.active = false;
            }
          });
        }
      });

      this.setData(Object.assign({}, assginData, { map: insideData.map }));
    },

    handleResetSearch() {
      this.setData({ searchKey: "", isSearch: false, searchResultList: [] });
    },

    handleResetType() {
      const outsideData = this.data.data;

      const insideData = this.data;

      const assginData = {};

      Object.keys(insideData)
        .filter(key => typeof outsideData[key] !== "undefined")
        .filter(key => insideData.map.type.find(item => item.field === key))
        .forEach(key => {
          if (Array.isArray(outsideData[key])) {
            assginData[key] = Object.assign([], outsideData[key]);
          } else if (typeof outsideData[key] === "object") {
            assginData[key] = Object.assign({}, outsideData[key]);
          } else {
            assginData[key] = outsideData[key];
          }
        });

      Object.keys(assginData).forEach(key => {
        const typeItem = insideData.map.type.find(item => item.field === key);
        if (typeItem) {
          typeItem.list.forEach(item => {
            if (
              Array.isArray(assginData[key]) &&
              assginData[key].includes(item.value)
            ) {
              item.active = true;
            } else if (item.value === assginData[key]) {
              item.active = true;
            } else {
              item.active = false;
            }
          });
        }
      });

      this.setData(Object.assign({}, assginData, { map: insideData.map }));
    },

    handleResetPrice() {
      const { minPrice, maxPrice } = this.data.data;
      this.setData({ minPrice, maxPrice, rangeCustom: this.rangeCustom });
      this.changeList.add("minPrice");
      this.changeList.add("maxPrice");
    },

    checkReset() {
      wx.nextTick(() => {
        if (
          this.data.showRightPanel === false &&
          this.data.showTopPanel === false
        ) {
          this.resetAll();
        }
      });
    },

    resetAll() {
      this.handleResetFilter();
      this.handleResetType();
      this.handleResetPrice();
      this.handleResetSearch();
      this.handleResetView();
    },

    handleResetView() {
      this.setData({
        level2View: "",
        level3View: ""
      });
    },

    handlePriceCustom(event) {
      const rangeCustom = event.detail;
      this.setData({
        rangeCustom,
        maxPrice: this.data.maxPrice === 10000 ? 9999 : this.data.maxPrice
      });
      this.changeList.add("minPrice");
      this.changeList.add("maxPrice");
    },

    handlePriceChange(event) {
      const { max, min } = event.detail;
      this.setData({ maxPrice: max, minPrice: min });
      this.changeList.add("minPrice");
      this.changeList.add("maxPrice");
    },

    handleSelectAreaType(event) {
      const { index } = event.currentTarget.dataset;
      this.setData({ currentAreaType: index, currentArea: 0 });
      const e = {
        currentTarget: {
          dataset: {
            index: 0
          }
        }
      };
      this.handleSelectArea(e);
    },

    handleSelectArea(event) {
      const { index } = event.currentTarget.dataset;
      const { areaList, currentAreaType } = this.data;
      const insideData = this.data.data;
      if (currentAreaType === 0) {
        const areaItem = areaList[currentAreaType].list[index];
        if (areaItem.value !== null) {
          chooseArea(
            areaItem.value,
            insideData.city,
            insideData.chooseType
          ).then(resp => {
            Object.keys(resp).forEach(key => this.changeList.add(key));
            this.setData(resp);
          });
        } else {
          this.changeList.add("area");
          this.changeList.add("areaJson");
          this.changeList.add("areaType");
          this.changeList.add("areaId");
          this.changeList.add("isHistory");
          this.setData({
            area: "",
            areaJson: "",
            areaType: 0,
            areaId: {},
            isHistory: false
          });
        }
      } else if (currentAreaType === 1) {
        const areaItem = areaList[currentAreaType].list[index];
        if (areaItem.value === null) {
          this.changeList.add("area");
          this.changeList.add("areaJson");
          this.changeList.add("areaType");
          this.changeList.add("areaId");
          this.changeList.add("isHistory");
          this.setData({
            area: "",
            areaJson: "",
            areaType: 0,
            areaId: {},
            isHistory: false
          });
        } else {
          const e = {
            currentTarget: {
              dataset: {
                index: 0
              }
            }
          };
          wx.nextTick(() => {
            this.handleSelectStation(e);
          });
        }
      } else if (currentAreaType === 2) {
        const targetItem = areaList[currentAreaType].list[index];
        this.changeList.add("area");
        this.changeList.add("areaJson");
        this.changeList.add("areaType");
        this.changeList.add("areaId");
        this.changeList.add("isHistory");
        if (targetItem.label !== "不限") {
          this.setData({
            area: `附近 ${targetItem.label}`,
            areaJson: "",
            areaType: 60,
            areaId: Object.assign(
              { nearby: +targetItem.label.replace("km", "") },
              this.location
            ),
            isHistory: false
          });
        } else {
          this.setData({
            area: "",
            areaJson: "",
            areaType: 0,
            areaId: {},
            isHistory: false
          });
        }
      } else if (currentAreaType === 3) {
        const targetItem = areaList[currentAreaType].list[index];
        Object.keys(targetItem)
          .filter(key => areaKey.includes(key))
          .forEach(key => this.changeList.add(key));
        this.setData(targetItem);
      }

      this.setData({ currentArea: index, currentStation: 0 });
    },

    handleSelectStation(event) {
      const { index } = event.currentTarget.dataset;
      const { areaList, currentAreaType, currentArea } = this.data;
      const insideData = this.data.data;
      if (currentAreaType === 1) {
        const stationItem =
          areaList[currentAreaType].list[currentArea].list[index];
        chooseArea(
          stationItem.value,
          insideData.city,
          insideData.chooseType
        ).then(resp => {
          Object.keys(resp).forEach(key => this.changeList.add(key));
          this.setData(resp);
        });
      }
      this.setData({ currentStation: index });
    },

    handleSubmit() {
      if (
        Number.isNaN(this.data.minPrice) ||
        this.data.minPrice < 0 ||
        this.data.minPrice > 10000 ||
        this.data.minPrice !== ~~this.data.minPrice
      ) {
        wx.showToast({ title: "请输入正确的最低价", icon: "none" });
        return;
      }

      if (
        Number.isNaN(this.data.minPrice) ||
        this.data.maxPrice < 100 ||
        this.data.maxPrice > 10000 ||
        this.data.maxPrice !== ~~this.data.maxPrice
      ) {
        wx.showToast({ title: "请输入正确的最高价", icon: "none" });
        return;
      }

      if (this.data.minPrice >= this.data.maxPrice) {
        wx.showToast({ title: "最高价必须高于最低价", icon: "none" });
        return;
      }

      this.setData({
        showRightPanel: false,
        showTopPanel: false,
        filterList: this.data.filterList.map(item => {
          item.active = false;
          return item;
        })
      });

      const outsideData = this.data.data;

      const insideData = this.data;

      const result = {};

      for (const field of this.changeList) {
        if (
          JSON.stringify(insideData[field]) !==
          JSON.stringify(outsideData[field])
        ) {
          result[field] = insideData[field];
        }
      }

      this.rangeCustom = this.data.rangeCustom;

      this.changeList = new Set();

      this.triggerEvent("onSubmit", result);
    },

    getAreaData() {
      const outsideData = this.data.data;

      const insideData = this.data;

      let currentAreaType = 0;

      let currentArea = 0;

      let currentStation = 0;

      const { areaList } = insideData;

      const { city, chooseType } = outsideData;

      const history =
        wx.getStorageSync("longSearchHistory_" + city + "_" + chooseType) || [];
      if (outsideData.isHistory === true) {
        // 搜索结果
        currentAreaType = 3;
        for (let i = 0; i < history.length; i++) {
          if (history[i].area === outsideData.area) {
            currentArea = i;
            break;
          }
        }
      } else if (outsideData.areaType === 0) {
      } else if (outsideData.areaType === 10) {
        currentArea = areaList[currentAreaType].list.findIndex(
          item => item.label === outsideData.area
        );
      } else if (outsideData.areaType === 50) {
        currentAreaType = 1;
        let found = false;
        areaList[currentAreaType].list.forEach((item, index) => {
          if (item.list && found === false) {
            for (let i = 0; i < item.list.length; i++) {
              if (item.list[i].label === outsideData.area) {
                currentStation = i;
                currentArea = index;
                found = true;
                break;
              }
            }
          }
        });
      } else if (outsideData.areaType === 60) {
        // 附近
        const area = outsideData.area.replace("附近 ", "");
        currentAreaType = 2;
        for (let i = 0; i < areaList[currentAreaType].list.length; i++) {
          if (areaList[currentAreaType].list[i].label === area) {
            currentArea = i;
            break;
          }
        }
      }

      isShowNearby(city).then(resp => {
        if (!resp) {
          currentAreaType = 0;
          currentArea = 0;
          currentStation = 0;
          this.setData({ "areaList[2]": [] });
        } else if (this.data.areaList[2].length === 0) {
          this.setData({
            "areaList[2].list": [
              ,
              {
                label: "不限"
              },
              {
                label: "1km"
              },
              {
                label: "2km"
              },
              {
                label: "3km"
              }
            ]
          });
        }
        this.location = resp;
      });

      this.setData({
        currentAreaType,
        currentArea,
        currentStation,
        "areaList[3].list": history.map(item =>
          Object.assign({ label: item.area }, item)
        )
      });
    },

    handleSelectSearchResult(event) {
      const { item } = event.currentTarget.dataset;

      chooseSlectData(item);

      const { city, chooseType } = this.data.data;

      longSetSearchData(item, city, chooseType);

      this.getAreaData();

      this.setData({
        searchResultList: [],
        isSearch: false,
        searchKey: "",
        currentAreaType: 3,
        currentArea: 0
      });

      const e = {
        currentTarget: {
          dataset: {
            index: 0
          }
        }
      };

      this.handleSelectArea(e);
    }
  },
  lifetimes: {
    attached() {
      this.changeList = new Set();

      this.rangeCustom = false;

      this.baseAreaList = JSON.stringify([
        {
          title: "行政区",
          type: "10",
          list: [
            {
              label: "不限",
              value: null
            }
          ]
        },
        {
          title: "地铁站",
          type: "20",
          list: [
            {
              label: "不限",
              value: null
            }
          ]
        },
        {
          title: "附近",
          list: [
            {
              label: "不限"
            },
            {
              label: "1km"
            },
            {
              label: "2km"
            },
            {
              label: "3km"
            }
          ]
        },
        {
          title: "搜索历史",
          list: []
        }
      ]);
    }
  }
});
