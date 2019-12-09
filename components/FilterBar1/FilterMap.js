const iconEnum = {
  red:
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTEgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjUuMDAwMDAwLCAtMzY2LjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2LjAwMDAwMCwgMzYxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD0iI0U3NUQyOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC45ODMwNDcsIDcuMTU2ODU0KSByb3RhdGUoNDUuMDAwMDAwKSB0cmFuc2xhdGUoLTQuOTgzMDQ3LCAtNy4xNTY4NTQpICIgcG9pbnRzPSIxLjQ4MzA0NjUzIDMuNjU2ODU0MjUgOC40ODMwNDY1MyAzLjY1Njg1NDI1IDguNDgzMDQ2NTMgMTAuNjU2ODU0MiAxLjQ4MzA0NjUzIDEwLjY1Njg1NDIiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgc3Ryb2tlPSIjMUQxRDFEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0Ljk0OTc0NywgNC45NDk3NDcpIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtNC45NDk3NDcsIC00Ljk0OTc0NykgIiBwb2ludHM9IjEuNDQ5NzQ3NDcgOC40NDk3NDc0NyAxLjQ0OTc0NzQ3IDEuNDQ5NzQ3NDcgOC40NDk3NDc0NyAxLjQ0OTc0NzQ3Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
  thistle:
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTEgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjUuMDAwMDAwLCAtMzY2LjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2LjAwMDAwMCwgMzYxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD0iIzc5OTlFNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC45ODMwNDcsIDcuMTU2ODU0KSByb3RhdGUoNDUuMDAwMDAwKSB0cmFuc2xhdGUoLTQuOTgzMDQ3LCAtNy4xNTY4NTQpICIgcG9pbnRzPSIxLjQ4MzA0NjUzIDMuNjU2ODU0MjUgOC40ODMwNDY1MyAzLjY1Njg1NDI1IDguNDgzMDQ2NTMgMTAuNjU2ODU0MiAxLjQ4MzA0NjUzIDEwLjY1Njg1NDIiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgc3Ryb2tlPSIjMUQxRDFEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0Ljk0OTc0NywgNC45NDk3NDcpIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtNC45NDk3NDcsIC00Ljk0OTc0NykgIiBwb2ludHM9IjEuNDQ5NzQ3NDcgOC40NDk3NDc0NyAxLjQ0OTc0NzQ3IDEuNDQ5NzQ3NDcgOC40NDk3NDc0NyAxLjQ0OTc0NzQ3Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
  wheat:
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTEgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjUuMDAwMDAwLCAtMzY2LjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2LjAwMDAwMCwgMzYxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD0iI0VCQzA4MyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC45ODMwNDcsIDcuMTU2ODU0KSByb3RhdGUoNDUuMDAwMDAwKSB0cmFuc2xhdGUoLTQuOTgzMDQ3LCAtNy4xNTY4NTQpICIgcG9pbnRzPSIxLjQ4MzA0NjUzIDMuNjU2ODU0MjUgOC40ODMwNDY1MyAzLjY1Njg1NDI1IDguNDgzMDQ2NTMgMTAuNjU2ODU0MiAxLjQ4MzA0NjUzIDEwLjY1Njg1NDIiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgc3Ryb2tlPSIjMUQxRDFEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0Ljk0OTc0NywgNC45NDk3NDcpIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtNC45NDk3NDcsIC00Ljk0OTc0NykgIiBwb2ludHM9IjEuNDQ5NzQ3NDcgOC40NDk3NDc0NyAxLjQ0OTc0NzQ3IDEuNDQ5NzQ3NDcgOC40NDk3NDc0NyAxLjQ0OTc0NzQ3Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",
  cadetblue:
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTEgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjUuMDAwMDAwLCAtMzY2LjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2LjAwMDAwMCwgMzYxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD0iIzZDQzlCQSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC45ODMwNDcsIDcuMTU2ODU0KSByb3RhdGUoNDUuMDAwMDAwKSB0cmFuc2xhdGUoLTQuOTgzMDQ3LCAtNy4xNTY4NTQpICIgcG9pbnRzPSIxLjQ4MzA0NjUzIDMuNjU2ODU0MjUgOC40ODMwNDY1MyAzLjY1Njg1NDI1IDguNDgzMDQ2NTMgMTAuNjU2ODU0MiAxLjQ4MzA0NjUzIDEwLjY1Njg1NDIiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgc3Ryb2tlPSIjMUQxRDFEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0Ljk0OTc0NywgNC45NDk3NDcpIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtNC45NDk3NDcsIC00Ljk0OTc0NykgIiBwb2ludHM9IjEuNDQ5NzQ3NDcgOC40NDk3NDc0NyAxLjQ0OTc0NzQ3IDEuNDQ5NzQ3NDcgOC40NDk3NDc0NyAxLjQ0OTc0NzQ3Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
};

export default JSON.stringify({
  1: {
    title: "品牌中介",
    type: [
      {
        title: "户型",
        field: "longRentTypes",
        cancelable: true,
        defaultValue: 0,
        icon: iconEnum["red"],
        resetList: [
          ["type", "longLayouts"],
          ["filter", "longBuildAreas"]
        ],
        list: [
          {
            label: "一室",
            value: 1
          },
          {
            label: "二室",
            value: 2
          },
          {
            label: "三室",
            value: 3
          },
          {
            label: "四室",
            value: 4
          },
          {
            label: "四室以上",
            value: 12
          }
        ]
      },
      {
        title: "户型",
        multi: true,
        field: "longLayouts",
        showType: [1, 2, 3, 4],
        icon: iconEnum["thistle"],
        list: [
          {
            label: "一室",
            value: 1,
            showType: [1]
          },
          {
            label: "二室",
            value: 2
          },
          {
            label: "三室",
            value: 3,
            showType: [2, 3, 4]
          },
          {
            label: "三室及以上",
            value: 11,
            showType: [1]
          },
          {
            label: "四室及以上",
            value: 12,
            showType: [2, 3, 4]
          }
        ]
      }
    ],
    filter: [
      {
        title: "用途",
        field: "longSortTypes",
        cancelable: true,
        defaultValue: 0,
        icon: iconEnum["red"],
        list: [
          {
            label: "普通住宅",
            value: 1
          },
          {
            label: "别墅",
            value: 2
          },
          {
            label: "其他",
            value: 3
          }
        ]
      },
      {
        title: "装修",
        field: "longBuildAreas",
        showType: [1],
        defaultValue: -1,
        icon: iconEnum["wheat"],
        list: [
          {
            label: "精装修",
            value: 1
          },
          {
            label: "普通装修",
            value: 2
          },
          {
            label: "毛胚房",
            value: 3
          }
        ]
      },
      {
        title: "楼层",
        multi: true,
        field: "longFloorTypes",
        icon: iconEnum["thistle"],
        list: [
          {
            label: "低楼层",
            value: 1
          },
          {
            label: "中楼层",
            value: 2
          },
          {
            label: "高楼层",
            value: 3
          }
        ]
      },
      {
        title: "朝向",
        field: "longHeadings",
        multi: true,
        icon: iconEnum["wheat"],
        list: [
          {
            label: "朝东",
            value: 1
          },
          {
            label: "朝西",
            value: 2
          },
          {
            label: "朝南",
            value: 3
          },
          {
            label: "朝北",
            value: 4
          },
          {
            label: "南北通透",
            value: 10
          }
        ]
      },
      {
        title: "房源特色",
        multi: true,
        field: "longHouseTags",
        icon: iconEnum["cadetblue"],
        list: [
          {
            label: "满二",
            value: 1
          },
          {
            label: "满五",
            value: 2
          },
          {
            label: "近地铁",
            value: 3
          },
          {
            label: "随时看房",
            value: 4
          },
          {
            label: "VR房源",
            value: 5
          },
          {
            label: "新上房源",
            value: 6
          }
        ]
      },
      {
        title: "楼龄",
        multi: true,
        field: "longHouseTags",
        icon: iconEnum["thistle"],
        list: [
          {
            label: "5年以内",
            value: 1
          },
          {
            label: "10年以内",
            value: 2
          },
          {
            label: "15年以内",
            value: 3
          },
          {
            label: "20年以内",
            value: 4
          },
          {
            label: "20年以上",
            value: 10
          }
        ]
      }
    ],
    sort: {
      title: "排序",
      field: "advSort",
      list: [
        {
          label: "总价从低到高",
          value: 1,
          active: false
        },
        {
          label: "总价从高到低",
          value: 11,
          active: false
        },
        {
          label: "单价从低到高",
          value: 2,
          active: false
        },
        {
          label: "单价从高到低",
          value: 21,
          active: false
        },
        {
          label: "面积从大到小",
          value: 31,
          active: false
        },
      ]
    }
  },
  2: {
    title: "个人房源",
    type: [
      {
        title: "类型",
        field: "longRentTypes",
        cancelable: true,
        defaultValue: 0,
        icon: iconEnum["red"],
        list: [
          {
            label: "整租",
            value: 1
          },
          {
            label: "合租",
            value: 2
          },
          {
            label: "主卧",
            value: 3
          },
          {
            label: "次卧",
            value: 4
          }
        ]
      },
      {
        title: "户型",
        multi: true,
        field: "longLayouts",
        icon: iconEnum["thistle"],
        list: [
          {
            label: "一室",
            value: 1
          },
          {
            label: "二室",
            value: 2
          },
          {
            label: "三室",
            value: 3
          },
          {
            label: "四室及以上",
            value: 12
          }
        ]
      }
    ],
    filter: [
      {
        title: "优先级",
        field: "longSortTypes",
        cancelable: true,
        defaultValue: 0,
        icon: iconEnum["red"],
        list: [
          {
            label: "低价优先",
            value: 1
          },
          {
            label: "空间优先",
            value: 2
          },
          {
            label: "最新发布",
            value: 3
          }
        ]
      },
      {
        title: "朝向",
        multi: true,
        field: "longHeadings",
        icon: iconEnum["wheat"],
        list: [
          {
            label: "朝东",
            value: 1
          },
          {
            label: "朝西",
            value: 2
          },
          {
            label: "朝南",
            value: 3
          },
          {
            label: "朝北",
            value: 4
          },
          {
            label: "南北通透",
            value: 10
          }
        ]
      },
      {
        title: "房源亮点",
        multi: true,
        field: "longHouseTags",
        icon: iconEnum["cadetblue"],
        list: [
          {
            label: "精装修",
            value: 1
          },
          {
            label: "近地铁",
            value: 2
          },
          {
            label: "配套齐全",
            value: 7
          },
          {
            label: "视频看房",
            value: 8
          }
        ]
      }
    ],
    sort: {
      title: "排序",
      field: "advSort",
      list: [
        {
          label: "价格从低到高",
          value: 1,
          active: false
        },
        {
          label: "价格从高到低",
          value: 11,
          active: false
        },
        {
          label: "面积从大到小",
          value: 2,
          active: false
        },
        {
          label: "面积从小到小",
          value: 21,
          active: false
        }
      ]
    }
  }
});
