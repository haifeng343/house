import Http from '../../utils/http';
import { authSubject } from '../../utils/auth';

export default class index {
  getHotPosition(cityName) {
    return Http.get('/getHotPosition.json', { cityName });
  }
  indexParam() {
    return Http.get('/indexParam.json');
  }
  getCityList(cityName, type = 0) {
    return Http.get('/selectCity.json', { cityName, type });
  }
  getLongCityList() {
    return Http.get('/long/cityList.json');
  }
  getBanner() {
    return Http.get('/banner/index.json');
  }
  getUserInfo() {
    let token = wx.getStorageSync('token');
    return Http.get('/fdd/user/userInfo.json', { token }).then(resp => {
      const { nickname, headPortrait } = resp.data.userBase;
      const useableMoney = resp.data.userAccount.useMoney.toFixed(2);
      const useCoin = resp.data.coinAccount.useCoin.toFixed(2);
      const app = getApp();
      app.globalData.isUserBindPhone = !!resp.data.userBase.mobile;
      app.globalData.isUserBindPublic = !!resp.data.publicOpenId;
      const totalMoney = (
        +useableMoney + resp.data.userAccount.freezeMoney
      ).toFixed(2);
      return Promise.resolve({
        nickName: nickname,
        headPortrait,
        totalMoney,
        useableMoney,
        useCoin
      });
    });
  }

  auth(data) {
    return Http.post('/fddLogin/appletAuth.json', data).then(resp => {
      const token = resp.data;
      const app = getApp();
      app.globalData.isAuth = true;
      wx.setStorageSync('token', token);

      authSubject.next(true);
    });
  }
}
