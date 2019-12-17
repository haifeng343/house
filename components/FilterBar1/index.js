import FilterMap from "./FilterMap";
const longRentTip = require("../../utils/longRentTip");
import {
  longSetSearchData,
  chooseSlectData,
  chooseArea,
  isShowNearby
} from "../../utils/longSetSearchData";
import getHeightStrArray from "../../utils/getHeightStrArray";

const areaKey = ["area", "areaId", "areaJson", "areaType"];

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
        title: "价格",
        action: "price",
        class: "",
        active: false,
        id: 2
      },
      {
        title: "房型",
        action: "type",
        class: "",
        active: false,
        id: 3
      },
      {
        title: "筛选",
        action: "advance",
        class: "",
        active: false,
        id: 4
      }
    ],
    map: {},
    areaList: [],
    currentAreaType: 0,
    currentArea: 0,
    currentStation: 0,
    city: "", //城市名
    cityId: {}, //城市ID
    cityJson: "",
    area: "", // 地点
    areaId: {}, //地点标识
    areaType: 0, //地点类型 0:未选择 10：行政区 20:商圈 30：小区 40：地铁线，50：地铁站 60：附近
    areaJson: "", //json
    minPrice: "", //最低价
    maxPrice: "", //最高价 不限空字符串 "99999"
    minArea: 0, //最低面积
    maxArea: 90, //最高面积 上限150
    secondHouseDecorationMap: [], //装修  1: 毛坯房 2: 普通装修 3: 精装修
    secondHouseTagMap: [1], //房源特色 1: 满二 2: 满五 3: 近地铁 4: 随时看房 5: VR房源 6: 新上房源
    secondHeadingMap: [], //朝向 1: 朝东 2: 朝西 3: 朝南 4: 朝北 10: 南北通透
    secondFloorTypeMap: [], //楼层 1: 低楼层 2: 中楼层 3: 高楼层
    secondHouseUseMap: [1], //用途 1: 普通住宅 2: 别墅 3: 其他
    secondBuildingAgeMap: 0, //楼龄 1: 5年以内 2: 10年以内 3: 15年以内 4: 20年以内 5: 20年以上
    secondLayoutMap: [], //户型 1: 一室 2: 二室 3: 三室 4: 四室 5: 四室以上
    secondSortTypeMap: 0, //房源偏好 1: 低总价优先 2: 低单价优先
    advSort: 0,
    rangeCustom: false,
    area: "",
    areaId: {},
    areaJson: "",
    areaType: 0,
    level2View: "",
    level3View: "",
    sortPanelActive: false
  },
  properties: {
    data: {
      type: Object,
      value: [],
      observer(newvalue) {
        if (newvalue && Object.keys(newvalue).length > 0) {
          const outsideData = newvalue;

          const insideData = this.data;

          const map = JSON.parse(FilterMap);

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
            const filterItem = map.filter.find(item => item.field === key);
            const isSort = map.sort.field === key;

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
            } else if (filterItem) {
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
            } else if (isSort) {
              const sortItem = map.sort;
              sortItem.list.forEach(item => {
                if (item.value === assginData[key]) {
                  item.active = true;
                } else {
                  item.active = false;
                }
              });
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
    handleChangeSecondPrice(event) {
      const { maxPrice, minPrice } = event.detail;
      this.changeList.add("maxPrice");
      this.changeList.add("minPrice");
      this.setData({ maxPrice, minPrice });
    },

    handleSizeChange(event) {
      const minArea = event.detail.min;
      const maxArea = event.detail.max;
      this.setData({ minArea, maxArea });
      this.changeList.add("minArea");
      this.changeList.add("maxArea");
    },
    handleSearchInputChange(event) {
      this.setData({ isSearch: true });
      const searchKey = event.detail.value;
      const { cityId } = this.data.data;
      this.setData({ searchKey });
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.promiseVersion += 1;
        longRentTip
          .getSecondIntermediaryData(cityId, searchKey, this.promiseVersion)
          .then(resp => {
            const { result, promiseVersion } = resp;
            if (this.promiseVersion === promiseVersion) {
              this.setData({
                searchResultList: result.map(item =>
                  Object.assign(
                    {
                      label: getHeightStrArray(item.name, searchKey),
                      tag: areaTagMap[item.type]
                    },
                    item
                  )
                )
              });
            }
          })
          .catch(error => {
            console.error(error);
            wx.showToast({
              title: "网络异常",
              icon: "none"
            });
          });
      }, 200);
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
    closeTopPanel() {
      this.animationFlag = true;
      const topPanel = this.selectComponent("#TopPanel");
      if (topPanel) {
        topPanel.handleClosePanel();
      } else {
        this.animationFlag = false;
      }
    },
    handleClickTabitem(event) {
      if (this.animationFlag === true) {
        return;
      }
      const tabItem = event.currentTarget.dataset.item;
      if (tabItem.active === true) {
        this.closeTopPanel();
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
    handleClickSortItem() {
      const active = !this.data.sortPanelActive;
      this.setData({
        filterList: this.data.filterList.map(item => {
          item.active = false;
          return item;
        }),
        sortPanelActive: active
      });

      if (active) {
        this.setData({ showTopPanel: true, currentPanel: "sort" });
      } else {
        this.closeTopPanel();
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
        sortPanelActive: false,
        filterList: this.data.filterList.map(item => {
          item.active = false;
          return item;
        })
      });
      this.checkReset();
    },

    handleSelectSort(event) {
      const { value } = event.currentTarget.dataset;

      const { field } = this.data.map.sort;

      const sortItem = this.data.map.sort.list.find(
        item => item.value === value
      );

      if (sortItem.active === false) {
        this.setData({
          "map.sort.list": this.data.map.sort.list.map(item => {
            if (item === sortItem) {
              item.active = true;
            } else {
              item.active = false;
            }
            return item;
          }),
          advSort: value
        });
        this.changeList.add(field);
        this.handleSubmit();
      }
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
      this.doResetFilter(true);
    },

    doResetFilter(resetToDefault) {
      const outsideData = this.data.data;

      const insideData = this.data;

      const assginData = {};

      Object.keys(insideData)
        .filter(key => typeof outsideData[key] !== "undefined")
        .filter(key => insideData.map.filter.find(item => item.field === key))
        .forEach(key => {
          this.changeList.add(key);
          if (resetToDefault) {
            const { defaultValue } = this.data.map.filter.find(
              item => item.field === key
            );
            if (Array.isArray(defaultValue)) {
              assginData[key] = Object.assign([], defaultValue);
            } else if (typeof outsideData[key] === "object") {
              assginData[key] = Object.assign({}, defaultValue);
            } else {
              assginData[key] = defaultValue;
            }
          } else {
            if (Array.isArray(outsideData[key])) {
              assginData[key] = Object.assign([], outsideData[key]);
            } else if (typeof outsideData[key] === "object") {
              assginData[key] = Object.assign({}, outsideData[key]);
            } else {
              assginData[key] = outsideData[key];
            }
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
      this.doResetFilter(false);
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
      wx.nextTick(() => {
        this.setData({
          level2View: "activelevel2"
        });
      });
    },

    handleSelectArea(event) {
      const { index } = event.currentTarget.dataset;
      const { areaList, currentAreaType } = this.data;
      const insideData = this.data.data;
      if (currentAreaType === 0) {
        const areaItem = areaList[currentAreaType].list[index];
        if (areaItem.value !== null) {
          chooseArea(areaItem.value, insideData.city, 1, true).then(resp => {
            Object.keys(resp).forEach(key => this.changeList.add(key));
            this.setData(resp);
          });
        } else {
          this.changeList.add("area");
          this.changeList.add("areaJson");
          this.changeList.add("areaType");
          this.changeList.add("areaId");
          this.setData({
            area: "",
            areaJson: "",
            areaType: 0,
            areaId: {}
          });
        }
      } else if (currentAreaType === 1) {
        const areaItem = areaList[currentAreaType].list[index];
        if (areaItem.value === null) {
          this.changeList.add("area");
          this.changeList.add("areaJson");
          this.changeList.add("areaType");
          this.changeList.add("areaId");
          this.setData({
            area: "",
            areaJson: "",
            areaType: 0,
            areaId: {}
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
          wx.nextTick(() => {
            this.setData({
              level3View: "activelevel3"
            });
          });
        }
      } else if (currentAreaType === 2) {
        const targetItem = areaList[currentAreaType].list[index];
        this.changeList.add("area");
        this.changeList.add("areaJson");
        this.changeList.add("areaType");
        this.changeList.add("areaId");
        if (targetItem.value === -1) {
          // -1 = 不限
          this.setData({
            area: "",
            areaJson: "",
            areaType: 0,
            areaId: {}
          });
        } else {
          this.setData({
            area: `附近 ${targetItem.label}`,
            areaJson: "",
            areaType: 60,
            areaId: Object.assign({ nearby: targetItem.value }, this.location)
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
        chooseArea(stationItem.value, insideData.city, 1, true).then(resp => {
          Object.keys(resp).forEach(key => this.changeList.add(key));
          this.setData(resp);
        });
      }
      this.setData({ currentStation: index });
    },

    handleSubmit() {
      var secondPrice = this.selectComponent("#secondPrice") || "";
      if (secondPrice) {
        secondPrice.changePrice();
      }
      this.setData({
        showRightPanel: false,
        showTopPanel: false,
        sortPanelActive: false,
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

      const { city } = outsideData;

      const history = wx.getStorageSync("searchSecondHistory_" + city) || [];
      if (outsideData.areaJson.includes('"isHistory":true')) {
        // 搜索结果
        currentAreaType = 3;
        let found = false;
        for (let i = 0; i < history.length; i++) {
          if (history[i].area === outsideData.area) {
            currentArea = i;
            found = true;
            break;
          }
        }

        if (found === false) {
          currentArea = 0;
          const { area, areaId, areaJson, areaType } = outsideData;
          history.unshift({ area, areaId, areaJson, areaType });
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
        const baseNearbyList = JSON.parse(this.baseNearbyList);
        const nearby = outsideData.areaId.nearby;
        currentAreaType = 2;
        for (let i = 0; i < baseNearbyList.length; i++) {
          if (baseNearbyList[i].value === nearby) {
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
          this.setData({ "areaList[2].list": [] });
        } else if (this.data.areaList[2].list.length === 0) {
          this.setData({
            "areaList[2].list": JSON.parse(this.baseNearbyList)
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

      chooseSlectData(item, true);

      const { city } = this.data.data;

      longSetSearchData(item, city, undefined, true);

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

      this.promiseVersion = 0;

      this.baseNearbyList = JSON.stringify([
        {
          label: "不限",
          value: -1
        },
        {
          label: "1km",
          value: 1
        },
        {
          label: "2km",
          value: 2
        },
        {
          label: "3km",
          value: 3
        }
      ]);

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
          list: []
        },
        {
          title: "搜索历史",
          list: []
        }
      ]);
    }
  }
});
