import Http from "../../utils/http";

export default class CitySelectService {
    getCityList() {
        return Http.get('/long/cityList.json');
    }
}
