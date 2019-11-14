export default JSON.stringify({
  1: {
    title: '品牌中介',
    type: [
      {
        title: '类型',
        field: 'longRentTypes',
        list: [
          {
            label: '整租',
            value: 1
          },
          {
            label: '合租',
            value: 2
          },
          {
            label: '主卧',
            value: 3
          },
          {
            label: '次卧',
            value: 4
          }
        ]
      },
      {
        title: '户型',
        multi: true,
        field: 'longLayouts',
        showType: [1, 2, 3, 4],
        list: [
          {
            label: '一室',
            value: 1,
            showType: [1]
          },
          {
            label: '二室',
            value: 2
          },
          {
            label: '三室',
            value: 3,
            showType: [2, 3, 4]
          },
          {
            label: '三室及以上',
            value: 11,
            showType: [1]
          },
          {
            label: '四室及以上',
            value: 12,
            showType: [2, 3, 4]
          }
        ]
      }
    ],
    filter: [
      {
        title: '优先级',
        field: 'longSortTypes',
        list: [
          {
            label: '低价优先',
            value: 1
          },
          {
            label: '空间优先',
            value: 2
          },
          {
            label: '最新发布',
            value: 3
          }
        ]
      },
      {
        title: '面积',
        field: 'longBuildAreas',
        showType: [1],
        list: [
          {
            label: '不限',
            value: -1
          },
          {
            label: '≤40㎡',
            value: 0
          },
          {
            label: '40-60㎡',
            value: 1
          },
          {
            label: '60-80㎡',
            value: 2
          },
          {
            label: '80-100㎡',
            value: 3
          },
          {
            label: '100-120㎡',
            value: 4
          },
          {
            label: '≥120㎡',
            value: 5
          }
        ]
      },
      {
        title: '楼层',
        multi: true,
        field: 'longFloorTypes',
        list: [
          {
            label: '低楼层',
            value: 1
          },
          {
            label: '中楼层',
            value: 2
          },
          {
            label: '高楼层',
            value: 3
          }
        ]
      },
      {
        title: '朝向',
        field: 'longHeadings',
        multi: true,
        list: [
          {
            label: '朝东',
            value: 1
          },
          {
            label: '朝西',
            value: 2
          },
          {
            label: '朝南',
            value: 3
          },
          {
            label: '朝北',
            value: 4
          },
          {
            label: '南北通透',
            value: 10
          }
        ]
      },
      {
        title: '房源亮点',
        multi: true,
        field: 'longHouseTags',
        list: [
          {
            label: '精装修',
            value: 1
          },
          {
            label: '近地铁',
            value: 2
          },
          {
            label: '拎包入住',
            value: 3
          },
          {
            label: '随时看房',
            value: 4
          },
          {
            label: '集中供暖',
            value: 5
          },
          {
            label: '新上房源',
            value: 6
          },
          {
            label: '配套齐全',
            value: 7
          },
          {
            label: '视频看房',
            value: 8
          }
        ]
      }
    ]
  },
  2: {
    title: '个人房源',
    type: [
      {
        title: '类型',
        field: 'longRentTypes',
        list: [
          {
            label: '整租',
            value: 1
          },
          {
            label: '合租',
            value: 2
          }
        ]
      },
      {
        title: '户型',
        multi: true,
        field: 'longLayouts',
        list: [
          {
            label: '一室',
            value: 1
          },
          {
            label: '二室',
            value: 2
          },
          {
            label: '三室',
            value: 3
          },
          {
            label: '三室及以上',
            value: 11
          },
          {
            label: '四室及以上',
            value: 12
          }
        ]
      }
    ],
    filter: [
      {
        title: '优先级',
        field: 'longSortTypes',
        list: [
          {
            label: '低价优先',
            value: 1
          },
          {
            label: '空间优先',
            value: 2
          },
          {
            label: '最新发布',
            value: 3
          }
        ]
      },
      {
        title: '朝向',
        multi: true,
        field: 'longHeadings',
        list: [
          {
            label: '朝东',
            value: 1
          },
          {
            label: '朝西',
            value: 2
          },
          {
            label: '朝南',
            value: 3
          },
          {
            label: '朝北',
            value: 4
          },
          {
            label: '南北通透',
            value: 10
          }
        ]
      },
      {
        title: '房源亮点',
        multi: true,
        field: 'longHouseTags',
        list: [
          {
            label: '精装修',
            value: 1
          },
          {
            label: '近地铁',
            value: 2
          },
          {
            label: '配套齐全',
            value: 7
          },
          {
            label: '视频看房',
            value: 8
          }
        ]
      }
    ]
  }
});
