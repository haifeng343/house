import Http from "../../utils/http";

export default class CitySelectService {
    getCityList() {
        return Http.get('/selectCity.json?type=0');
    }
    getForeignCityList() {
        return Http.get('/selectCity.json?type=1');
    }
    getCityInfo(cityName, type) {
        return Http.get('/selectCity.json', { cityName, type })
    }
    indexParam() {
        return Http.get('/indexParam.json');
    }
    getPositionInfoByName(param) {
      return Http.post('/selectPlatDate.json', { param });
    }
}
