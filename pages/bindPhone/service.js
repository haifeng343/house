import Http from '../../utils/http';

export default class BindPhoneService {
  getCode(mobile) {
    return Http.get('/fdd/user/validate/code.json', {
      validateType: 'bind_Mobile',
      mobile
    });
  }

  bindMoblie(mobile, code) {
    return Http.post('/fdd/user/bindMobile.json', { mobile, code });
  }
}
