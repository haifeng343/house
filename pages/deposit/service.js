import Http from '../../utils/http';

export default class DepositService {
  createOrder(money, coinAmount) {
    return Http.post('/wechat/fdd/wxUnifiedOrder.json', {
      money,
      coinAmount
    }).then(resp => Promise.resolve(resp.data));
  }

  getUserInfo() {
    return Http.get('/fdd/user/userInfo.json').then(resp =>
      Promise.resolve(resp.data)
    );
  }

  doExchangeCion(exchangeAmount) {
    return Http.post('/fdd/user/fddExchangeUserCoin.json', {
      exchangeAmount
    }).then(resp => Promise.resolve(resp.data));
  }
}
