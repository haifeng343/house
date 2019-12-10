import Http from "./http";
import { searchSecondDataStorage } from "./searchSecondDataStorage"
const getIndexSecondHouseData = () => {
  Http.get('/second/indexHouse.json').then(resp => {
    console.log(resp)
    const secondLayoutMap = resp.data.secondLayoutMap || []
    const secondSortTypeMap = resp.data.secondSortTypeMap || []
    const secondHouseDecorationMap = resp.data.secondHouseDecorationMap || []
    const secondHouseTagMap = resp.data.secondHouseTagMap || []
    const secondHouseUseMap = resp.data.secondHouseUseMap || []
    const hourSecondMoney = resp.data.hourMoney || 1
    wx.setStorageSync('secondLayoutMap', secondLayoutMap)
    wx.setStorageSync('secondSortTypeMap', secondSortTypeMap)
    wx.setStorageSync('secondHouseDecorationMap', secondHouseDecorationMap)
    wx.setStorageSync('secondHouseTagMap', secondHouseTagMap)
    wx.setStorageSync('secondHouseUseMap', secondHouseUseMap)
    wx.setStorageSync('hourSecondMoney', hourSecondMoney)
    searchSecondDataStorage.next(true)
  });
}

export default getIndexSecondHouseData;