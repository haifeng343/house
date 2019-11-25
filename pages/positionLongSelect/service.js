
import Http from '../../utils/http';

export default class positionService {
  getSearchHoset(cityName, type) {
    return Http.post('/long/searchHose.json', { cityName, type });
  }
    getPositionInfoByName(param) {
        return Http.post('/selectPlatDate.json', { param });
    }
    getCityInfo(cityName, type) {
        return Http.get('/selectCity.json', { cityName, type })
    }
}
