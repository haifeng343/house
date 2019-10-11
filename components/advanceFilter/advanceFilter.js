import Http from '../../utils/http';
import { SearchDataSubject } from '../../utils/searchDataStream';

const typeEnum = {
  11: 'secnic',
  12: 'highschool',
  13: 'airport',
  14: 'hospital',
  15: 'buiness',
  16: 'area',
  17: 'subway',
  18: 'airport',
  10: 'all'
};

Component({
  /**
   * 页面的初始数据
   */
  properties: {
    shownType: {
      type: String
    },
    type: {
      type: String
    },
    cityName: {
      type: String
    }
  },
  data: {
    priceText: '',
    priceType: '',
    houseType: {},
    leaseType: {},
    isLoaded: false,
    optionList: [
      {
        value: 1,
        label: '1人',
        active: false
      },
      {
        value: 2,
        label: '2人',
        active: false
      },
      {
        value: 3,
        label: '3人',
        active: false
      },
      {
        value: 4,
        label: '4人',
        active: false
      },
      {
        value: 5,
        label: '5人',
        active: false
      },
      {
        value: 6,
        label: '6人',
        active: false
      },
      {
        value: 7,
        label: '7人',
        active: false
      },
      {
        value: 8,
        label: '8人',
        active: false
      },
      {
        value: 9,
        label: '9人',
        active: false
      },
      {
        value: 10,
        label: '10人+',
        active: false
      },
      {
        value: -1,
        label: '不限',
        active: false
      }
    ],
    priceType: {
      '0': 0,
      '1': 200,
      '2': 300,
      '3': 400,
      '4': 500,
      '5': 600,
      '6': 99999
    },
    equipments: {},
    searchData: {
      cityType: '',
      area: '',
      areaId: {},
      areaType: '',
      city: '', //城市名
      cityId: {}, //城市ID
      beginDate: '', //开始日期
      endDate: '', //离开日期
      dayCount: 0,
      gueseNumber: 1, //入住人数
      leaseType: '', //房间类型  0单间 1整租
      houseType: [], //户型 0 一居室 1 二居室 2 三居室 3 4居以上
      minPrice: 0, //最低价
      maxPrice: 99999, //最高价
      sort: 0, //搜索方式 0推荐 1低价有限
      equipment: []
    },
    area: {},
    positionList: [],
    typeActive: '',
    middleList: [],
    middleActive: '',
    lastList: [],
    lastActive: '',
    initAreaData: {
      secnic: {
        name: '景点',
        data: {},
        length: 0
      },
      highschool: {
        name: '高校',
        data: {},
        length: 0
      },
      airport: {
        name: '机场/车站',
        data: {},
        length: 0
      },
      hospital: {
        name: '医院',
        data: {},
        length: 0
      },
      buiness: {
        name: '商圈',
        data: {},
        length: 0
      },
      area: {
        name: '行政区',
        data: {},
        length: 0
      },
      subway: {
        name: '地铁',
        data: {},
        length: 0
      }
    },
    initSelect: {}
  },
  methods: {
    handleSelectNumber(event) {
      const index = event.detail;
      const optionList = this.data.optionList.map((item, itemIndex) => {
        if (index === itemIndex) {
          this.data.searchData.gueseNumber = item.value;
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
      this.setData({
        optionList,
        searchData: this.data.searchData
      });
    },
    chooseType(event) {
      let type = '';
      let key = this.data.middleActive;
      if (event) {
        type = event.currentTarget.dataset.type;
      } else {
        type = this.data.initSelect.initType;
        if (type == 'subway') {
          for (var keys in this.data.area[type].data[this.data.initSelect.initLine]) {
            if (this.data.area[type].data[this.data.initSelect.initLine][keys].name == this.data.initSelect.initName) {
              key = keys
            }
          }
        } else {

          for (var keys in this.data.area[type].data) {
            if (this.data.area[type].data[keys].name == this.data.initSelect.initName) {
              key = keys
            }
          }
        }
      }
      if (type === 'subway') {
        let middleList = {};
        let lineName = '';
        for (let item in this.data.area.subway.data) {
          if (!lineName) {
            lineName = item
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
                  type: event ? lineName : this.data.initSelect.initLine,
                  station: event ? Object.keys(this.data.area.subway.data[lineName])[0] :key
                }
              }
            }, 'subway');
          }
        );
      } else {
        this.setData({
          middleList: this.data.area[type].data,
          lastList: [],
          typeActive: type,
          middleActive: key
        });
      }
    },
    chooseSecond(event, way) {
      var data = event.currentTarget.dataset;
      let type = data.type;
      this.setData({
        lastList: this.data.middleList[type].line || {},
        middleActive: type
      }, () => {
        if (way == 'subway') {
          this.chooseLast({
            currentTarget: {
              dataset: {
                type: data.station
              }
            }
          });
        } else {
          this.chooseLast({
            currentTarget: {
              dataset: {
                type: Object.keys(this.data.lastList)[0]
              }
            }
          });
        }
      });
    },
    chooseLast(event) {
      let type = event.currentTarget.dataset.type||'';
      this.setData({
        lastActive: type
      });
    },
    checkPositionId(name) {
      Http.post('/selectPlatDate.json', {
        param: name
      }).then(resp => {
        let data = resp.data;
        let info = JSON.parse(data.json);
        let searchData = this.data.searchData;
        if (data.lineId) {//地铁
          searchData.area = data.stations;
          searchData.areaType = '17';
        } else {

          searchData.areaType = data.type.toString();
          searchData.area = data.name;
        }


        if (data.type == 16) {
          //行政区  只有areaid
          searchData.areaId = {
            mn: info.mn && info.mn.area_id,
            tj: info.tj && info.tj.value,
            xz: info.xz && info.xz.id,
            zg: info.zg && info.zg.id
          };
        } else {
          searchData.ltude = {
            mn: info.mn && info.mn.lat + ',' + info.mn.lng,
            tj: info.tj && info.tj.latitude + ',' + info.tj.longitude,
            xz: info.xz && info.xz.latitude + ',' + info.xz.longitude,
            zg: info.zg && info.zg.latitude + ',' + info.zg.longitude
          };
          searchData.areaId = {
            mn: info.mn && info.mn.id,
            tj: info.tj && info.tj.value,
            xz: info.xz && info.xz.id,
            zg: info.zg && info.zg.id
          };
        }

        const app = getApp();
        if (this.properties.type == 'monitor') {
          app.globalData.monitorSearchData = Object.assign({}, searchData);
        } else {
          app.globalData.searchData = Object.assign({}, searchData);
          SearchDataSubject.next();
        }
        this.setData(
          {
            searchData
          },
          () => {
            this.triggerEvent('submit');
          }
        );
      });
    },
    selectLeaseType(event) {
      let index = event.currentTarget.dataset.index;
      let searchData = this.data.searchData;
      if (searchData.leaseType == index) {
        searchData.leaseType = '';
      } else {
        searchData.leaseType = Number(index);
      }

      this.setData({
        searchData
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
      searchData.sort = sort == 1 ? 2 : 1;
      this.setData({
        searchData
      });
    },
    searchPositionSubmit() {
      if (Object.values(this.data.middleList).length <= 0) {
        let searchData = this.data.searchData;
        searchData.areaType = '';
        searchData.area = '';
        searchData.ltude = {};
        searchData.areaId = {};
        const app = getApp();
        if (this.properties.type == 'monitor') {
          app.globalData.monitorSearchData = Object.assign({}, searchData);
        } else {
          app.globalData.searchData = Object.assign({}, searchData);
          SearchDataSubject.next();
        }
        this.setData(
          {
            searchData
          },
          () => {
            this.triggerEvent('submit');
          }
        );
      } else if (Object.values(this.data.lastList).length <= 0) {
        if (this.data.middleActive == 0) {
          let searchData = this.data.searchData;

          searchData.areaType = '';
          searchData.area = '';
          searchData.areaId = {};
          searchData.ltude = {};

          const app = getApp();
          if (this.properties.type == 'monitor') {
            app.globalData.monitorSearchData = Object.assign({}, searchData);
          } else {
            app.globalData.searchData = Object.assign({}, searchData);
            SearchDataSubject.next();
          }
          this.setData(
            {
              searchData
            },
            () => {
              this.triggerEvent('submit');
            }
          );
        } else {
          let fullname = this.data.positionList[this.data.middleActive] || this.data.positionList[this.data.lastActive];
          this.checkPositionId(fullname);
        }
      } else {
        let fullname = this.data.positionList[this.data.lastActive];
        this.checkPositionId(fullname);
      }
    },
    searchSubmit() {
      const searchData = this.data.searchData;
      const app = getApp();
      if (this.properties.type == 'monitor') {
        app.globalData.monitorSearchData = searchData;
      } else {
        app.globalData.searchData = searchData;
        SearchDataSubject.next();
      }
      this.triggerEvent('submit');
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
      let priceText = '';
      if (price.detail.min === 0 && price.detail.max >= length - 1) {
        priceText = '不限';
      } else if (price.detail.min !== 0 && price.detail.max === length - 1) {
        priceText = '￥' + this.data.priceType[price.detail.min] + '以上';
      } else if (price.detail.min === 0 && price.detail.max !== length - 1) {
        priceText = '￥' + this.data.priceType[price.detail.max] + '以下';
      } else if (price.detail.min !== 0 && price.detail.max !== length - 1) {
        priceText =
          '￥' +
          this.data.priceType[price.detail.min] +
          '-' +
          '￥' +
          this.data.priceType[price.detail.max];
      }
      this.setData({
        searchData: this.data.searchData,
        priceText: priceText
      });
    },
    getHotPosition() {
      const app = getApp();
      Http.get('/indexPosition.json', {
        cityName: this.data.city
      }).then(rslt => {
        let data = rslt.data;
        data.unshift(`${this.data.city}_全城_16`);
        this.setData({
          positionList: data
        });
        let area = {
          secnic: {
            name: '景点',
            data: {},
            length: 0
          },
          highschool: {
            name: '高校',
            data: {},
            length: 0
          },
          airport: {
            name: '机场/车站',
            data: {},
            length: 0
          },
          hospital: {
            name: '医院',
            data: {},
            length: 0
          },
          buiness: {
            name: '商圈',
            data: {},
            length: 0
          },
          area: {
            name: '行政区',
            data: {},
            length: 1
          },
          subway: {
            name: '地铁',
            data: {},
            length: 0
          }
        };
        let globalAreaName = '',
          globalAreaType = '';
        if (this.properties.type == 'monitor') {
          globalAreaName = app.globalData.monitorSearchData.area;
          globalAreaType = app.globalData.monitorSearchData.areaType;
        } else {
          globalAreaName = app.globalData.searchData.area;
          globalAreaType = app.globalData.searchData.areaType;
        }
        let initSelect = {
          initName: '',
          initType: '',
          initKey: ''
        };
        let randomKey = '';
        data.map((item, index) => {
          let position = item.split('_');
          let cityName = position[0];
          let areaName = position[1];
          let areaType = position[2];
          area[typeEnum[areaType]].length++;
          if (areaName === globalAreaName && areaType == globalAreaType) {
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
            area[typeEnum[areaType]].data[lineType].length++
          }
        });
        if (!globalAreaName && !globalAreaType) {
          initSelect.initType = area.area.length > 1 ? 'area' : randomKey;
          initSelect.initName = area.area.length > 1 ? '全城' : '';
          initSelect.initKey = area.area.length > 1 ? '0' : '';
        }
        if(area.subway.length){
          let keysSorted = Object.keys(area.subway.data).sort();
          let newSubway = {};
          for(let i=0;i<keysSorted.length;i++){
            newSubway[keysSorted[i]]=area.subway.data[keysSorted[i]];
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
          }
        );
      });
    }
  },
  lifetimes: {
    ready() {
      let houseType = wx.getStorageSync('houseType');
      let equipments = wx.getStorageSync('equipments');
      let leaseType = wx.getStorageSync('leaseType');
      const app = getApp();
      let searchData = {};
      if (this.properties.type == 'monitor') {
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
        if (item == searchData.minPrice) {
          min = key;
        } else if (item == searchData.maxPrice) {
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
        leaseType
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
    cityName: function(city) {
      if (!city || city == '--') {
        return;
      }
      let searchData = {};
      const app = getApp();
      if (this.properties.type == 'monitor') {
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
          this.getHotPosition();
        }
      );
    }
  }
});
