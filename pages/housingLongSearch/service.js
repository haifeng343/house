import Http from '../../utils/http';

const typeEnum = {
  0: '景点',
  1: '国家',
  2: '省/州',
  3: '机场',
  4: '城市',
  5: '城市'
};

export default class SearchService {
  doSearch(param, cityName = '') {
    return Http.get('/getPositionByQuery.json', { cityName, param })
  }
  getCityInfo(cityName, type) {
    return Http.get('/selectCity.json', { cityName, type })
  }
  getPositionInfoByName(param) {
    return Http.post('/selectPlatDate.json', { param });
  }
}