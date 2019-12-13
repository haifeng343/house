
import Http from '../../utils/http';

export default class positionService {
  getPositionInfoByName(positionKey, cityName, type=1) {
    return Http.post('/long/positionDetail.json', { positionKey, cityName, type });
  }
}
