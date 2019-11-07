import Http from "./http";
import { searchDataStorage } from "./searchDataStorage"
const getIndexHouseData = (app)=>{
  Http.get('/indexHose.json').then(resp => {
    const houseType = resp.data.shortLayout
    const equipments = resp.data.shortFacilities
    const numberList = resp.data.shortPeople
    const leaseType = resp.data.shortRentType
    const hourMoney = resp.data.hourMoney
    const fddRequestPlatformName = resp.data.fddRequestPlatformName || ''
    if (fddRequestPlatformName.indexOf('tj') > -1) {
      app.globalData.tjSwitch = false
    }
    if (fddRequestPlatformName.indexOf('xz') > -1) {
      app.globalData.xzSwitch = true
    }
    if (fddRequestPlatformName.indexOf('mn') > -1) {
      app.globalData.mnSwitch = true
    }
    if (fddRequestPlatformName.indexOf('zg') > -1) {
      app.globalData.zgSwitch = true
    }
    wx.setStorageSync('houseType', houseType)
    wx.setStorageSync('equipments', equipments)
    wx.setStorageSync('numberList', numberList)
    wx.setStorageSync('leaseType', leaseType)
    wx.setStorageSync('hourMoney', hourMoney)
    searchDataStorage.next(true)
    let temp = resp.data.shortFacilitiesPram || ''
    let tempArray = temp.split(',')
    let equipment = []
    for (let index = 0; index < tempArray.length; index++) {
      let number = parseInt(tempArray[index]);
      if (number > 0) {
        equipment.push(number + '')
      }
    }
    if (!equipment.length) {
      equipment = ['1', '2']
    }
    app.globalData.searchData.equipment = equipment
  });
}

export default getIndexHouseData;