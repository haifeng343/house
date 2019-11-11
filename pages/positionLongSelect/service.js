
import Http from '../../utils/http';

export default class positionService {
    getPositionList(cityName) {
        return Http.post('/indexPosition.json', { cityName });
    }
    getPositionInfoByName(param) {
        return Http.post('/selectPlatDate.json', { param });
    }
    getCityInfo(cityName, type) {
        return Http.get('/selectCity.json', { cityName, type })
    }
}
