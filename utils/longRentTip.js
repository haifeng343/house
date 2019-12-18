import { compareTwoStrings } from "./compareTwoStrings";
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
  if (name.replace(/[市区县]/gi, "") === matchName.replace(/[市区县]/gi, "")) {
    return true;
  }
  return false;
};

//匹配商圈
const matchBusiness = (name, matchName) => {
  if (name === matchName.replace(/\[.*\]/gi, "")) {
    return true;
  }
  return false;
};

//匹配地铁站
const matchSubway = (name, matchName) => {
  if (name.replace(/站/gi, "") === matchName.replace(/站/gi, "")) {
    return true;
  }
  return false;
};

//匹配小区名
const matchXiaoqu = (name, matchName, num = 0.6) => {
  var st1 = minWordsSet(name);
  var st2 = minWordsSet(matchName);
  var sameWords = sameWordsCount(st1, st2);
  var minWords = Math.min(st1.size, st2.size);
  var wordsRate = sameWords / minWords;
  if (wordsRate >= num) {
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

function returnData(wiwjData, lianjiaData, keywords, isSecond = false) {
  var requestData = { area: [], buiness: [], xiaoqu: [], line: [], subway: [] }; //地点、商圈、小区、线路、地铁站
  if (!!wiwjData && wiwjData.data && wiwjData.data instanceof Array) {
    var length1 = wiwjData.data.length < 15 ? wiwjData.data.length : 15;
    for (var index = 0; index < length1; index++) {
      if (wiwjData.data[index].searchType === 1) {
        requestData.area.push({
          name: wiwjData.data[index].searchName,
          wiwj: wiwjData.data[index],
          type: 10
        });
      }
      if (wiwjData.data[index].searchType === 2) {
        requestData.buiness.push({
          name: wiwjData.data[index].searchName,
          wiwj: wiwjData.data[index],
          type: 20
        });
      }
      if (wiwjData.data[index].searchType === 3) {
        requestData.xiaoqu.push({
          name: wiwjData.data[index].searchName,
          wiwj: wiwjData.data[index],
          type: 30
        });
      }
      if (wiwjData.data[index].searchType === 4) {
        requestData.line.push({
          name: wiwjData.data[index].searchName,
          wiwj: wiwjData.data[index],
          type: 40
        });
      }
      if (wiwjData.data[index].searchType === 5) {
        requestData.subway.push({
          name: wiwjData.data[index].searchName.replace(/\(.*\)/gi, ""),
          wiwj: wiwjData.data[index],
          type: 50
        });
      }
    }
  }
  if(!isSecond) {
    if (!!lianjiaData && lianjiaData.data && lianjiaData.data instanceof Array) {
      var length2 = lianjiaData.data.length < 15 ? lianjiaData.data.length : 15;
      for (var index = 0; index < length2; index++) {
        if (lianjiaData.data[index].type === "district") {
          var isMatch = false;
          for (var temp = 0; temp < requestData.area.length; temp++) {
            if (
              matchArea(requestData.area[temp].name, lianjiaData.data[index].name)
            ) {
              isMatch = true;
              if (requestData.area[temp].wiwj) {
                requestData.area[temp].lj = lianjiaData.data[index];
              }
              break;
            }
          }
          if (!isMatch) {
            requestData.area.push({
              name: lianjiaData.data[index].name,
              lj: lianjiaData.data[index],
              type: 10
            });
          }
        }
        if (lianjiaData.data[index].type === "bizcircle") {
          var isMatch = false;
          for (var temp = 0; temp < requestData.buiness.length; temp++) {
            if (requestData.buiness[temp].name === lianjiaData.data[index].name) {
              isMatch = true;
              if (requestData.buiness[temp].wiwj) {
                requestData.buiness[temp].lj = lianjiaData.data[index];
              }
              break;
            }
          }
          if (!isMatch) {
            requestData.buiness.push({
              name: lianjiaData.data[index].name,
              lj: lianjiaData.data[index],
              type: 20
            });
          }
        }
        if (lianjiaData.data[index].type === "resblock") {
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
                  if (!requestData.xiaoqu[temp].lj && !requestData.xiaoqu[temp].temp) {
                    isMatch = true;
                    requestData.xiaoqu[temp].lj = lianjiaData.data[index]
                    break;
                  } else {
                    isMatch = true;
                    requestData.xiaoqu[temp].temp = true
                    delete requestData.xiaoqu[temp].lj
                    break;
                  }
                }
              }
            }
          }
          if (!isMatch) {
            requestData.xiaoqu.push({
              name: lianjiaData.data[index].name,
              lj: lianjiaData.data[index],
              type: 30
            });
          }
        }
        if (lianjiaData.data[index].type === "subway_line") {
          var isMatch = false;
          for (var temp = 0; temp < requestData.line.length; temp++) {
            if (
              matchXiaoqu(
                requestData.line[temp].name,
                lianjiaData.data[index].name,
                1
              )
            ) {
              isMatch = true;
              requestData.line[temp].lj = lianjiaData.data[index]
            }
          }
          if (!isMatch) {
            requestData.line.push({
              name: lianjiaData.data[index].name,
              lj: lianjiaData.data[index],
              type: 40
            });
          }
        }
        if (lianjiaData.data[index].type === "station") {
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
                requestData.subway[temp].lj = lianjiaData.data[index];
              }
              break;
            }
          }
          if (!isMatch) {
            requestData.subway.push({
              name: lianjiaData.data[index].name.replace(/站/gi, ""),
              lj: lianjiaData.data[index],
              type: 50
            });
          }
        }
      }
    }
  } else {
    if (!!lianjiaData && lianjiaData.data && lianjiaData.data instanceof Array) {
      var length2 = lianjiaData.data.length < 15 ? lianjiaData.data.length : 15;
      let lineIsMax = false;
      for (var index = 0; index < length2; index++) {
        if (requestData.line.length === 0) {
          lineIsMax = false
        } if (requestData.line.length > 1) {
          lineIsMax = true
        }
        if (lianjiaData.data[index].level === "district") {
          var isMatch = false;
          for (var temp = 0; temp < requestData.area.length; temp++) {
            if (
              matchArea(requestData.area[temp].name, lianjiaData.data[index].text)
            ) {
              isMatch = true;
              if (requestData.area[temp].wiwj) {
                requestData.area[temp].lj = lianjiaData.data[index];
              }
              break;
            }
          }
          if (!isMatch) {
            requestData.area.push({
              name: lianjiaData.data[index].text,
              lj: lianjiaData.data[index],
              type: 10
            });
          }
        }
        if (lianjiaData.data[index].level === "bizcircle") {
          var isMatch = false;
          for (var temp = 0; temp < requestData.buiness.length; temp++) {
            if (requestData.buiness[temp].name === lianjiaData.data[index].text) {
              isMatch = true;
              if (requestData.buiness[temp].wiwj) {
                requestData.buiness[temp].lj = lianjiaData.data[index];
              }
              break;
            }
          }
          if (!isMatch) {
            requestData.buiness.push({
              name: lianjiaData.data[index].text,
              lj: lianjiaData.data[index],
              type: 20
            });
          }
        }
        if (lianjiaData.data[index].level === "community") {
          var isMatch = false;
          for (var temp = 0; temp < requestData.xiaoqu.length; temp++) {
            if (
              matchXiaoqu(
                requestData.xiaoqu[temp].name,
                lianjiaData.data[index].text
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
                  if (!requestData.xiaoqu[temp].lj && !requestData.xiaoqu[temp].temp) {
                    isMatch = true;
                    requestData.xiaoqu[temp].lj = lianjiaData.data[index]
                    break;
                  } else {
                    isMatch = true;
                    requestData.xiaoqu[temp].temp = true
                    delete requestData.xiaoqu[temp].lj
                    break;
                  }
                }
              }
            }
          }
          if (!isMatch) {
            requestData.xiaoqu.push({
              name: lianjiaData.data[index].text,
              lj: lianjiaData.data[index],
              type: 30
            });
          }
        }
        if (lianjiaData.data[index].level === "subway_line") {
          var isMatch = false;
          for (var temp = 0; temp < requestData.line.length; temp++) {
            if (lineIsMax) {
              if (requestData.line[temp].lj) {
                delete requestData.line[temp].lj
              }
              isMatch = true
              break
            } else {
              lineIsMax = true
            }
            if (
              matchXiaoqu(
                requestData.line[temp].name,
                lianjiaData.data[index].text,
                1
              )
            ) {
              isMatch = true;
              requestData.line[temp].lj = lianjiaData.data[index]
            }
          }
          if (!isMatch) {
            requestData.line.push({
              name: lianjiaData.data[index].text,
              lj: lianjiaData.data[index],
              type: 40
            });
          }
        }
        if (lianjiaData.data[index].level === "subway_station") {
          var isMatch = false;
          for (var temp = 0; temp < requestData.subway.length; temp++) {
            if (
              matchSubway(
                requestData.subway[temp].name,
                lianjiaData.data[index].text
              )
            ) {
              isMatch = true;
              if (requestData.subway[temp].wiwj) {
                requestData.subway[temp].lj = lianjiaData.data[index];
              }
              break;
            }
          }
          if (!isMatch) {
            requestData.subway.push({
              name: lianjiaData.data[index].text.replace(/站/gi, ""),
              lj: lianjiaData.data[index],
              type: 50
            });
          }
        }
      }
    }
  }
  var requsetTotal = [];
  requsetTotal = requsetTotal
    .concat(requestData.area)
    .concat(requestData.buiness)
    .concat(requestData.xiaoqu)
    .concat(requestData.line)
    .concat(requestData.subway);
  requsetTotal = requsetTotal.sort((item1, item2) => {
    var sameWords1 = compareTwoStrings(item1.name, keywords);
    var sameWords2 = compareTwoStrings(item2.name, keywords);
    return sameWords2 - sameWords1;
  });
  return requsetTotal;
}

const getIntermediaryData = (data, keywords, promiseVersion) => {
  return new Promise(resolve => {
    var count = 0;
    var results1 = null;
    var results2 = null;
    longrent.wiwj
      .rentTip({ city: data.wiwj, keywords: keywords })
      .then(resp => {
        const results = [];
        const resultMap = [];
        for (const r of resp.data) {
          if (resultMap.includes(`%%${r.searchType}%%__${r.searchName}`)) {
            continue;
          }
          results.push(r);
          resultMap.push(`%%${r.searchType}%%__${r.searchName}`);
        }
        return Promise.resolve({ data: results });
      })
      .then(results => {
        results1 = results;
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData(results1, results2, keywords)
          });
        }
      })
      .catch(() => {
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData(results1, results2, keywords)
          });
        }
      });
    longrent.lianjia
      .rentTip({ city: data.lj, keywords: keywords })
      .then(resp => {
        const results = [];
        const resultMap = [];
        for (const r of resp.data) {
          if (resultMap.includes(`%%${r.type}%%__${r.name}`)) {
            continue;
          }
          results.push(r);
          resultMap.push(`%%${r.type}%%__${r.name}`);
        }
        return Promise.resolve({ data: results });
      })
      .then(results => {
        results2 = results;
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData(results1, results2, keywords)
          });
        }
      })
      .catch(() => {
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData(results1, results2, keywords)
          });
        }
      });
  });
};

function returnData2(ftxData, wbtcData, keywords) {
  var requestData = { area: [], buiness: [], xiaoqu: [], line: [], subway: [] }; //地点、商圈、小区、线路、地铁站
  if (
    !!ftxData &&
    ftxData.hits &&
    ftxData.hits.hit &&
    ftxData.hits.hit instanceof Array
  ) {
    console.log('ftx')
    var data = ftxData.hits.hit;
    if (!data instanceof Array) {
      data = [];
      data.push(ftxData.hits.hit);
    }
    var length1 = data.length < 15 ? data.length : 15;
    for (var index = 0; index < length1; index++) {
      if (data[index].wordtype === "商圈") {
        requestData.buiness.push({
          name: data[index].word,
          ftx: data[index],
          type: 20
        });
      }
      if (
        data[index].wordtype === "楼盘" &&
        data[index].ywtype === "出租"
      ) {
        data[index].coord_x = parseFloat(
          parseFloat(data[index].coord_x).toFixed(6)
        );
        data[index].coord_y = parseFloat(
          parseFloat(data[index].coord_y).toFixed(6)
        );
        requestData.xiaoqu.push({
          name: data[index].projmainname,
          ftx: data[index],
          type: 30
        });
      }
    }
  }
  if (
    !!wbtcData &&
    wbtcData.result &&
    wbtcData.result.getHouseOnMapSuggestion &&
    wbtcData.result.getHouseOnMapSuggestion.dataList instanceof Array
  ) {
    console.log('wbtc')
    var data2 = wbtcData.result.getHouseOnMapSuggestion.dataList;
    var length2 = data2.length < 15 ? data2.length : 15;
    for (var index = 0; index < length2; index++) {
      if (data2[index].type === 1) {
        requestData.area.push({
          name: data2[index].name.replace(/\[.*\]/gi, ""),
          wbtc: data2[index],
          type: 10
        });
      }
      if (data2[index].type === 2) {
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
      if (data2[index].type === 3) {
        var isMatch = false;
        for (var temp = 0; temp < requestData.xiaoqu.length; temp++) {
          var name = data2[index].name.replace(/\[.*\]/gi, "").replace(/\(.*\)/gi, "");
          if (name === requestData.xiaoqu[temp].name) {
            isMatch = true;
          } else if (matchXiaoqu(requestData.xiaoqu[temp].name, name)) {
            if (requestData.xiaoqu[temp].ftx) {
              var distance = getFlatternDistance(
                requestData.xiaoqu[temp].ftx.coord_y,
                requestData.xiaoqu[temp].ftx.coord_x,
                data2[index].lat,
                data2[index].lon
              );
              if (distance < 500) {
                isMatch = true;
                break;
              }
            }
          }
        }
        if (!isMatch) {
          requestData.xiaoqu.push({
            name: data2[index].name.replace(/\[.*\]/gi, ""),
            type: 30
          });
        }
      }

      if (data2[index].type === 4) {
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
  requsetTotal = requsetTotal.sort((item1, item2) => {
    var sameWords1 = compareTwoStrings(item1.name, keywords);
    var sameWords2 = compareTwoStrings(item2.name, keywords);
    return sameWords2 - sameWords1;
  });
  return requsetTotal;
}

const getPersonalData = (data, keywords, promiseVersion) => {
  return new Promise(resolve => {
    var count = 0;
    var results1 = null;
    var results2 = null;
    longrent.fangtianxia
      .rentTip({ city: data.ftx, keywords: keywords })
      .then(resp => {

        if (!!resp.hits && !!resp.hits.hit) {
          const results = [];
          const resultMap = [];
          for (const r of resp.hits.hit) {
            if (resultMap.includes(`%%${r.wordtype}%%__${r.word}`)) {
              continue;
            }
            results.push(r);
            resultMap.push(`%%${r.wordtype}%%__${r.word}`);
          }
          return Promise.resolve({
            hits: {
              hit: results
            }
          });
        } else {
          return Promise.resolve(resp);
        }
      })
      .then(results => {
        results1 = results;
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData2(results1, results2, keywords)
          });
        }
      })
      .catch(error => {
        console.error(error);
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData2(results1, results2, keywords)
          });
        }
      });
    longrent.wbtc
      .rentTip({ city: data.tc, keywords: keywords })
      .then(resp => {
        if (
          !!resp.result &&
          !!resp.result.getHouseOnMapSuggestion &&
          !!resp.result.getHouseOnMapSuggestion.dataList
        ) {
          const results = [];
          const resultMap = [];
          let dataList = [];
          for(let item of resp.result.getHouseOnMapSuggestion.dataList) {
            for (let temp of item.detail) {
              dataList.push(temp)
            }
          }
          for (const r of dataList) {
            if (resultMap.includes(`%%${r.type}%%__${r.name}`)) {
              continue;
            }
            results.push(r);
            resultMap.push(`%%${r.type}%%__${r.name}`);
          }
          return Promise.resolve({
            result: {
              getHouseOnMapSuggestion: {
                dataList: results
              }
            }
          });
        }
        return Promise.resolve(resp);
      })
      .then(results => {
        results2 = results;
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData2(results1, results2, keywords)
          });
        }
      })
      .catch(error => {
        console.error(error);
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData2(results1, results2, keywords)
          });
        }
      });
  });
};

const getSecondIntermediaryData = (data, keywords, promiseVersion) => {
  return new Promise(resolve => {
    var count = 0;
    var results1 = null;
    var results2 = null;
    longrent.wiwj
      .ershouTip({ city: data.wiwj, keywords: keywords })
      .then(resp => {
        const results = [];
        const resultMap = [];
        for (const r of resp.data) {
          if (resultMap.includes(`%%${r.searchType}%%__${r.searchName}`)) {
            continue;
          }
          results.push(r);
          resultMap.push(`%%${r.searchType}%%__${r.searchName}`);
        }
        return Promise.resolve({ data: results });
      })
      .then(results => {
        results1 = results;
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData(results1, results2, keywords, true)
          });
        }
      })
      .catch(() => {
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData(results1, results2, keywords, true)
          });
        }
      });
    longrent.lianjia
      .ershouTip({ city: data.lj, keywords: keywords })
      .then(resp => {
        const results = [];
        const resultMap = [];
        for (const r of resp) {
          if (resultMap.includes(`%%${r.type}%%__${r.text}`)) {
            continue;
          }
          results.push(r);
          resultMap.push(`%%${r.type}%%__${r.text}`);
        }
        return Promise.resolve({ data: results });
      })
      .then(results => {
        results2 = results;
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData(results1, results2, keywords, true)
          });
        }
      })
      .catch(() => {
        count++;
        if (count === 2) {
          resolve({
            promiseVersion,
            result: returnData(results1, results2, keywords, true)
          });
        }
      });
  });
};

module.exports = {
  getIntermediaryData,
  getPersonalData,
  getSecondIntermediaryData //二手房数据
};
