import Http from '../../utils/http';
import { authSubject } from '../../utils/auth';

export default class ContactService {
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
