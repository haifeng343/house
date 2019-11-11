import Http from "./http";
import { searchLongDataStorage } from "./searchLongDataStorage"
const getIndexLongHouseData = () => {
  Http.get('/long/indexHose.json').then(resp => {
    const longBuildAreas = []
    const longFloorTypes = []
    const longHeadings = []
    const longHouseTags = []
    const longLayouts = []
    const longRentTypes = []
    const longSortTypes = []
    const hourLongMoney = resp.data.hourMoney || 1
    for(let index = 0; index < 2; index++) {
      longBuildAreas[index] = resp.data[index + 1 + ''].longBuildAreas || undefined
      longFloorTypes[index] = resp.data[index + 1 + ''].longFloorTypes || undefined
      longHeadings[index]   = resp.data[index + 1 + ''].longHeadings || undefined
      longHouseTags[index]  = resp.data[index + 1 + ''].longHouseTags || undefined
      longLayouts[index]    = resp.data[index + 1 + ''].longLayouts || undefined
      longRentTypes[index]  = resp.data[index + 1 + ''].longRentTypes || undefined
      longSortTypes[index]  = resp.data[index + 1 + ''].longSortTypes || undefined
    }
    wx.setStorageSync('longBuildAreas', longBuildAreas)
    wx.setStorageSync('longFloorTypes', longFloorTypes)
    wx.setStorageSync('longHeadings', longHeadings)
    wx.setStorageSync('longHouseTags', longHouseTags)
    wx.setStorageSync('longLayouts', longLayouts)
    wx.setStorageSync('longRentTypes', longRentTypes)
    wx.setStorageSync('longSortTypes', longSortTypes)
    wx.setStorageSync('hourLongMoney', hourLongMoney)
    searchLongDataStorage.next(true)
  });
}

export default getIndexLongHouseData;