const api = require('./api.js');
/**
 * 途家房源
 */
const getTjList = data => {
  return new Promise((resolve, reject) => {
    api.postApi(data).then(res => {
      if (res.statusCode == 200) {
        resolve(res)
      } else {
        resolve(false)
      }
    })
  })
}
/**
 * 小猪房源
 */
const getXzList = data => {
  return new Promise((resolve,reject)=>{
    api.postApi(data).then(res=>{
      if (res.statusCode == 200) {
        resolve(res)
      } else {
        resolve(false)
      }
    })
  })
}

/**
 * 木鸟房源
 */
const getMnList = data => {
  return new Promise((resolve, reject) => {
    api.postApi(data).then(res => {
      if (res.statusCode == 200) {
        resolve(res)
      } else {
        resolve(false)
      }
    })
  })
}
/**
 * 榛果房源
 */
const getZgList = data => {
  return new Promise((resolve, reject) => {
    api.postApi(data).then(res => {
      if (res.statusCode == 200){
        resolve(res)
      }else{
        resolve(false)
      }
      
    })
  })
}

module.exports={
  getTjList: getTjList,
  getXzList: getXzList,
  getMnList: getMnList,
  getZgList: getZgList
}