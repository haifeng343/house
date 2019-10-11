import Http from '../../utils/http';

const platformName = {
  2: '房盯盯',
  1: '票盯盯'
};

const typeUpon = {
  6: 3,
  8: 2
};

export default class FundService {
  getFundList(timeRange, billType) {
    return Http.get('/fdd/user/getFundLog.json', { timeRange, billType })
      .then(resp => Promise.resolve(resp.data))
      .then(fundlist => {
        return fundlist.map(item => {
          const platform = platformName[item.platformType] || '未知来源';
          const {
            type,
            money,
            direction,
            orderNo,
            createTime,
            remark,
            logName
          } = item;
          return {
            platform,
            type: typeUpon[type] || type, //账单类型
            number: orderNo,
            money: `${direction > 0 ? '+' : '-'}${money.toFixed(2)}`,
            direction,
            date: createTime,
            remark,
            logName
          };
        });
      });
  }

  getCoinFundList(timeRange, billType) {
    return Http.get('/fdd/user/getUserCoinLog.json', { timeRange, billType })
      .then(resp => Promise.resolve(resp.data || {}))
      .then(fundlist => {
        return (
          fundlist.out &&
          fundlist.out.map(item => {
            const platform = '房盯盯';
            const {
              type,
              optCoin,
              direction,
              orderNo,
              createTime,
              remark,
              logName
            } = item;
            const payList =
              fundlist.in &&
              fundlist.in.filter(item => item.orderNo === orderNo);

            return {
              platform,
              type, //账单类型
              number: orderNo,
              money: `${direction > 0 ? '+' : '-'}${optCoin}币`,
              direction,
              date: createTime,
              remark,
              logName,
              payList: !payList
                ? []
                : payList.map(item => {
                    const { optCoin, direction, createTime } = item;
                    return {
                      date: createTime,
                      money: `${direction > 0 ? '+' : '-'}${optCoin}`,
                      direction
                    };
                  })
            };
          })
        );
      });
  }
}
