import Http from '../../utils/http';
import { authSubject } from '../../utils/auth';

export default class UserService {
  getBalance() {
    return Http.get('/user/account/getAccountBalance.json').then(resp => {
      const money = resp.data;
      return Promise.resolve(money);
    });
  }

  getUserInfo() {
    let token = wx.getStorageSync('token');
    return Http.get('/fdd/user/userInfo.json', { token }).then(resp => {
      const { nickname, mobile, headPortrait } = resp.data.userBase;
      const useableMoney = resp.data.userAccount.useMoney.toFixed(2);
      const useCoin = resp.data.coinAccount.useCoin;
      const app = getApp();
      app.globalData.isUserBindPhone = !!resp.data.userBase.mobile;
      app.globalData.isUserBindPublic = !!resp.data.publicOpenId;
      const totalMoney = (
        +useableMoney + resp.data.userAccount.freezeMoney
      ).toFixed(2);
      return Promise.resolve({
        nickName: nickname,
        mobile,
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
      // 注意: 不要把这代码段放在存储token之前
      authSubject.next(true);
      // 注意: 不要把这代码段放在存储token之前
    });
  }
}
