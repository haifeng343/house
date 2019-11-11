
import Http from '../../utils/http';

export default class positionService {
  getPositionInfoByName(positionKey, cityName, type) {
    return Http.post('/long/positionDetail.json', { positionKey, cityName, type });
  }
}
