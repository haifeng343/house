const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

const formatDateS = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join("")
}
const formatMonthDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [month, day].map(formatNumber).join('-')
}

const datedifference = (sDate1, sDate2) => { //sDate1和sDate2是2006-12-18格式  
  var dateSpan,
    tempDate,
    iDays;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
};
const getDays =(strDateStart, strDateEnd) => {
  var strSeparator = "-"; //日期分隔符
  var strSeparatorT = " "; //日期分隔符
  var oDate1;
  var oDate2;
  var iDays;
  oDate1 = strDateStart.split(strSeparatorT)[0].split(strSeparator);
  oDate2 = strDateEnd.split(strSeparatorT)[0].split(strSeparator);
  var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
  var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
  iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24);//把相差的毫秒数转换为天数
  return iDays;
}
const objectDiff = (obj1, obj2)=>{
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }
  else {
    for (let key in obj1) {
      if (!obj2.hasOwnProperty(key)) {
        return false;
      }
      //类型相同
      if (typeof obj1[key] === typeof obj2[key]) {
        //同为引用类型
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          const equal = objectDiff(obj1[key], obj2[key]);
          if (!equal) {
            return false;
          }
        }
        //同为基础数据类型
        if (typeof obj1[key] !== 'object' && typeof obj2[key] !== 'object' && obj1[key] !== obj2[key]) {
          return false;
        }
      }
      else {
        return false;
      }
    }
  }
  return true;
}
/*
* 数组对象 排序 asc升序，desc倒叙
**/
const compareSort =(e,type)=>{
  if(type == 'asc'){
    return function (a, b) {
      var value1 = a[e];
      var value2 = b[e];
      return value1 - value2;
    }
  }else{
    return function (a, b) {
      var value1 = a[e];
      var value2 = b[e];
      return value2 - value1;
    }
  }
  
}

const arrFilter = (array,key,value) =>{
  var arr = array.filter(function (item) {
    return item[key] == value;
  })
  return arr
}

const compareVersion = (v1,v2)=>{
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
const compareArr = (array, array2, key1 ='platformId', key2='productId')=>{
  let result = []
  for(let key in array){
    let stra = array[key];
    let count = 0;
    for (let j = 0; j < array2.length; j++) {
      let strb = array2[j];
      if (stra.platform == 'tj' && strb[key1] =='tj') {
        if (stra.data.unitId == strb[key2]){
          count++;
        }
      }
      if (stra.platform == 'xz' && strb[key1] == 'xz') {
        if (stra.data.luId == strb[key2]) {
          count++;
        }
      }
      if (stra.platform == 'mn' && strb[key1] == 'mn') {
        if (stra.data.room_id == strb[key2]) {
          count++;
        }
      }
      if (stra.platform == 'zg' && strb[key1] == 'zg') {
        if (stra.data.productId == strb[key2]) {
          count++;
        }
      }
      if (stra.platform == 'wiwj' && strb[key1] == 'wiwj') {
        if (stra.data.housesid == strb[key2]) {
          count++;
        }
      }
      if (stra.platform == 'lj' && strb[key1] == 'lj') {
        if (stra.data.house_code == strb[key2]) {
          count++;
        }
      }
      if (stra.platform == 'ftx' && strb[key1] == 'ftx') {
        if (stra.data.houseid.text == strb[key2]) {
          count++;
        }
      }
      if (stra.platform == 'tc' && strb[key1] == 'tc') {
        if (stra.data.infoID == strb[key2]) {
          count++;
        }
      }
    }
    if(count>0){
      result.push(stra);
    }
  }
  return result
}
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDateS: formatDateS,
  formatMonthDay: formatMonthDay,
  datedifference: datedifference,
  objectDiff: objectDiff,
  compareSort: compareSort,
  getDays: getDays,
  arrFilter: arrFilter,
  compareVersion,
  compareArr
}