const longrent = require("../api/longrent");

const EARTH_RADIUS = 6378137.0; //单位M
const PI = Math.PI;

function getRad(d) {
  return (d * PI) / 180.0;
}

// 匹配球面距离
function getFlatternDistance(lat1, lng1, lat2, lng2) {
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

//匹配行政区
const matchArea = (name, matchName) => {
  if (name.replace(/[市区县]/gi, "") == matchName.replace(/[市区县]/gi, "")) {
    return true;
  }
  return false;
};

//匹配商圈
const matchBusiness = (name, matchName) => {
  if (name == matchName.replace(/\[.*\]/gi, "")) {
    return true;
  }
  return false;
};

//匹配地铁站
const matchSubway = (name, matchName) => {
  if (name.replace(/站/gi, "") == matchName.replace(/站/gi, "")) {
    return true;
  }
  return false;
};

//匹配小区名
const matchXiaoqu = (name, matchName) => {
  var st1 = minWordsSet(name);
  var st2 = minWordsSet(matchName);
  var sameWords = sameWordsCount(st1, st2);
  var minWords = Math.min(st1.size, st2.size);
  var wordsRate = sameWords / minWords;
  if (wordsRate >= 0.6) {
    return true;
  }
  return false;
};

function minWordsSet(words) {
  words = words.replace(/[()]/gi, "");
  return new Set(words.split(""));
}

function sameWordsCount(set1 = "", set2 = "") {
  var count = 0;
  for (var word of set2.keys()) {
    if (set1.has(word)) {
      count++;
    }
  }
  return count;
}

function returnData(wiwjData, lianjiaData) {
  var requestData = { area: [], buiness: [], xiaoqu: [], line: [], subway: [] }; //地点、商圈、小区、线路、地铁站
  if (wiwjData.data && wiwjData.data instanceof Array) {
    var length1 = wiwjData.data.length < 15 ? wiwjData.data.length : 15;
    for (var index = 0; index < length1; index++) {
      if (wiwjData.data[index].searchType == 1) {
        requestData.area.push({
          name: wiwjData.data[index].searchName,
          wiwj: wiwjData.data[index],
          type: 10
        });
      }
      if (wiwjData.data[index].searchType == 2) {
        requestData.buiness.push({
          name: wiwjData.data[index].searchName,
          wiwj: wiwjData.data[index],
          type: 20
        });
      }
      if (wiwjData.data[index].searchType == 3) {
        requestData.xiaoqu.push({
          name: wiwjData.data[index].searchName,
          wiwj: wiwjData.data[index],
          type: 30
        });
      }
      if (wiwjData.data[index].searchType == 4) {
        requestData.line.push({
          name: wiwjData.data[index].searchName,
          wiwj: wiwjData.data[index],
          type: 40
        });
      }
      if (wiwjData.data[index].searchType == 5) {
        requestData.subway.push({
          name: wiwjData.data[index].searchName.replace(/\(.*\)/gi, ""),
          wiwj: wiwjData.data[index],
          type: 50
        });
      }
    }
  }
  if (lianjiaData.data && lianjiaData.data instanceof Array) {
    var length2 = lianjiaData.data.length < 15 ? lianjiaData.data.length : 15;
    for (var index = 0; index < length2; index++) {
      // console.log(index, lianjiaData.data[index])
      if (lianjiaData.data[index].type == "district") {
        var isMatch = false;
        for (var temp = 0; temp < requestData.area.length; temp++) {
          if (
            matchArea(requestData.area[temp].name, lianjiaData.data[index].name)
          ) {
            isMatch = true;
            if (requestData.area[temp].wiwj) {
              requestData.area[temp].lianjia = lianjiaData.data[index];
            }
            break;
          }
        }
        if (!isMatch) {
          requestData.area.push({
            name: lianjiaData.data[index].name,
            lianjia: lianjiaData.data[index],
            type: 10
          });
        }
      }
      if (lianjiaData.data[index].type == "bizcircle") {
        var isMatch = false;
        for (var temp = 0; temp < requestData.buiness.length; temp++) {
          if (requestData.buiness[temp].name == lianjiaData.data[index].name) {
            isMatch = true;
            if (requestData.buiness[temp].wiwj) {
              requestData.buiness[temp].lianjia = lianjiaData.data[index];
            }
            break;
          }
        }
        if (!isMatch) {
          requestData.buiness.push({
            name: lianjiaData.data[index].name,
            lianjia: lianjiaData.data[index],
            type: 20
          });
        }
      }
      if (lianjiaData.data[index].type == "resblock") {
        var isMatch = false;
        for (var temp = 0; temp < requestData.xiaoqu.length; temp++) {
          if (
            matchXiaoqu(
              requestData.xiaoqu[temp].name,
              lianjiaData.data[index].name
            )
          ) {
            if (requestData.xiaoqu[temp].wiwj) {
              var distance = getFlatternDistance(
                requestData.xiaoqu[temp].wiwj.y,
                requestData.xiaoqu[temp].wiwj.x,
                lianjiaData.data[index].latitude,
                lianjiaData.data[index].longitude
              );
              if (distance < 500) {
                isMatch = true;
                // requestData.xiaoqu[temp].lianjia = lianjiaData.data[index]
                break;
              }
            }
          }
        }
        if (!isMatch) {
          // requestData.xiaoqu.push({ name: lianjiaData.data[index].name, lianjia: lianjiaData.data[index], type: 30 })
          requestData.xiaoqu.push({
            name: lianjiaData.data[index].name,
            type: 30
          });
        }
      }
      if (lianjiaData.data[index].type == "station") {
        var isMatch = false;
        for (var temp = 0; temp < requestData.subway.length; temp++) {
          if (
            matchSubway(
              requestData.subway[temp].name,
              lianjiaData.data[index].name
            )
          ) {
            isMatch = true;
            if (requestData.subway[temp].wiwj) {
              requestData.subway[temp].lianjia = lianjiaData.data[index];
            }
            break;
          }
        }
        if (!isMatch) {
          requestData.subway.push({
            name: lianjiaData.data[index].name.replace(/站/gi, ""),
            lianjia: lianjiaData.data[index],
            type: 50
          });
        }
      }
    }
  }
  let dataArray = [];
  for (let index = 0; index < requestData.xiaoqu.length; index++) {
    dataArray.push({
      name: requestData.xiaoqu[index].name,
      type: requestData.xiaoqu[index].type
    });
  }
  var requsetTotal = [];
  requsetTotal = requsetTotal
    .concat(requestData.area)
    .concat(requestData.buiness)
    .concat(dataArray)
    .concat(requestData.line)
    .concat(requestData.subway);
  return requsetTotal;
}

const getIntermediaryData = (data, keywords, promiseVersion) => {
  return new Promise(resolve => {
    var count = 0;
    var results1 = null;
    var results2 = null;
    longrent.wiwj
      .rentTip({ city: data.wiwj, keywords: keywords })
      .then(results => {
        results1 = results;
        count++;
        if (count == 2) {
          resolve({ promiseVersion, result: returnData(results1, results2) });
        }
      })
      .catch(() => {
        count++;
        if (count == 2) {
          resolve({ promiseVersion, result: returnData(results1, results2) });
        }
      });
    longrent.lianjia
      .rentTip({ city: data.lj, keywords: keywords })
      .then(results => {
        results2 = results;
        count++;
        if (count == 2) {
          resolve({ promiseVersion, result: returnData(results1, results2) });
        }
      })
      .catch(() => {
        count++;
        if (count == 2) {
          resolve({ promiseVersion, result: returnData(results1, results2) });
        }
      });
  });
};

function returnData2(ftxData, wbtcData) {
  var requestData = { area: [], buiness: [], xiaoqu: [], line: [], subway: [] }; //地点、商圈、小区、线路、地铁站
  if (ftxData.hits && ftxData.hits.hit && ftxData.hits.hit instanceof Array) {
    var data = ftxData.hits.hit;
    if (!data instanceof Array) {
      data = [];
      data.push(ftxData.hits.hit);
    }
    var length1 = data.length < 15 ? data.length : 15;
    for (var index = 0; index < length1; index++) {
      if (data[index].wordtype.text == "商圈") {
        requestData.buiness.push({
          name: data[index].word.text,
          ftx: data[index],
          type: 20
        });
      }
      if (
        data[index].wordtype.text == "楼盘" &&
        data[index].ywtype.text == "出租"
      ) {
        data[index].coord_x.text = parseFloat(
          parseFloat(data[index].coord_x.text).toFixed(6)
        );
        data[index].coord_y.text = parseFloat(
          parseFloat(data[index].coord_y.text).toFixed(6)
        );
        requestData.xiaoqu.push({
          name: data[index].projmainname.text,
          ftx: data[index],
          type: 30
        });
      }
    }
  }
  if (
    wbtcData.result &&
    wbtcData.result.getHouseOnMapSuggestion &&
    wbtcData.result.getHouseOnMapSuggestion.dataList instanceof Array
  ) {
    var data2 = wbtcData.result.getHouseOnMapSuggestion.dataList;
    var length2 = data2.length < 15 ? data2.length : 15;
    for (var index = 0; index < length2; index++) {
      if (data2[index].type == 1) {
        requestData.area.push({
          name: data2[index].name.replace(/\[.*\]/gi, ""),
          wbtc: data2[index],
          type: 10
        });
      }
      if (data2[index].type == 2) {
        var isMatch = false;
        for (var temp = 0; temp < requestData.buiness.length; temp++) {
          if (
            matchBusiness(requestData.buiness[temp].name, data2[index].name)
          ) {
            isMatch = true;
            if (requestData.buiness[temp].ftx) {
              requestData.buiness[temp].wbtc = data2[index];
            }
            break;
          }
        }
        if (!isMatch) {
          requestData.buiness.push({
            name: data2[index].name.replace(/\[.*\]/gi, ""),
            wbtc: data2[index],
            type: 20
          });
        }
      }
      if (data2[index].type == 3) {
        // requestData.xiaoqu.push({ name: data2[index].name.replace(/\[.*\]/ig, ''), wbtc: data2[index] })
        var isMatch = false;
        for (var temp = 0; temp < requestData.xiaoqu.length; temp++) {
          var name = data2[index].name.replace(/\[.*\]/gi, "");
          if (matchXiaoqu(requestData.xiaoqu[temp].name, name)) {
            if (requestData.xiaoqu[temp].ftx) {
              var distance = getFlatternDistance(
                requestData.xiaoqu[temp].ftx.coord_y.text,
                requestData.xiaoqu[temp].ftx.coord_x.text,
                data2[index].lat,
                data2[index].lon
              );
              if (distance < 500) {
                isMatch = true;
                // requestData.xiaoqu[temp].wbtc = data2[index]
                break;
              }
            }
          }
        }
        if (!isMatch) {
          // requestData.xiaoqu.push({ name: data2[index].name.replace(/\[.*\]/ig, ''), wbtc: data2[index], type: 30 })
          requestData.xiaoqu.push({
            name: data2[index].name.replace(/\[.*\]/gi, ""),
            type: 30
          });
        }
      }

      if (data2[index].type == 4) {
        requestData.subway.push({
          name: data2[index].name.replace(/\[.*\]/gi, ""),
          wbtc: data2[index],
          type: 50
        });
      }
    }
  }
  let dataArray = [];
  for (let index = 0; index < requestData.xiaoqu.length; index++) {
    dataArray.push({
      name: requestData.xiaoqu[index].name,
      type: requestData.xiaoqu[index].type
    });
  }
  var requsetTotal = [];
  requsetTotal = requsetTotal
    .concat(requestData.area)
    .concat(requestData.buiness)
    .concat(dataArray)
    .concat(requestData.line)
    .concat(requestData.subway);
  return requsetTotal;
}

const getPersonalData = (data, keywords, promiseVersion) => {
  // console.log(data,keywords)
  return new Promise(resolve => {
    var count = 0;
    var results1 = null;
    var results2 = null;
    longrent.fangtianxia
      .rentTip({ city: data.ftx, keywords: keywords })
      .then(results => {
        results1 = results;
        count++;
        if (count == 2) {
          resolve({ promiseVersion, result: returnData2(results1, results2) });
        }
      })
      .catch(() => {
        count++;
        if (count == 2) {
          resolve({ promiseVersion, result: returnData2(results1, results2) });
        }
      });
    longrent.wbtc
      .rentTip({ city: data.tc, keywords: keywords })
      .then(results => {
        results2 = results;
        count++;
        if (count == 2) {
          resolve({ promiseVersion, result: returnData2(results1, results2) });
        }
      })
      .catch(() => {
        count++;
        if (count == 2) {
          resolve({ promiseVersion, result: returnData2(results1, results2) });
        }
      });
  });
};

module.exports = {
  getIntermediaryData,
  getPersonalData
};
