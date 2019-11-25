const api = require('./api.js');
const shortrent = require('./shortrent')
/**
 * 途家房源
 */
const getTjList = data => {
  return new Promise((resolve, reject) => {
    shortrent.tujiaReq.searchList(data).then(res => {
      if (res.content) {
        resolve({
          data:res.content,
          statusCode: 200
        })
      } else {
        resolve(false)
      }
    })
  })
  // return new Promise((resolve, reject) => {
  //   api.postApi(data).then(res => {
  //     if (res.statusCode == 200) {
  //       resolve(res)
  //     } else {
  //       resolve(false)
  //     }
  //   })
  // })
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
    shortrent.muniaoReq.searchList(data).then(res => {
      console.log(res)
      if (res.data) {
        resolve({
          data: res.data,
          statusCode: 200
        })
      } else {
        resolve(false)
      }
    })
  })
  // return new Promise((resolve, reject) => {
  //   api.postApi(data).then(res => {
  //     if (res.statusCode == 200) {
  //       resolve(res)
  //     } else {
  //       resolve(false)
  //     }
  //   })
  // })
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