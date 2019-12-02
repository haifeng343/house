import Http from "../../utils/http";

const platformName = {
  2: "房盯盯",
  1: "票盯盯"
};

const typeUpon = {
  6: 3,
  8: 2
};

const fundIcon = {
  "1": "uniE905",
  "6": "uniE906",
  "7": "uniE95F",
  "8": "uniE93C",
  "33": "uniE93B"
};

const coinFundIcon = {
  "1": "uniE93B",
  "2": "uniE93C",
  "3": "uniE962",
  "4": "uniE960",
  "5": "uniE963",
  "6": "uniE93C"
};

export default class FundService {
  getFundList(timeRange, billType) {
    return Http.get("/fdd/user/getFundLog.json", { timeRange, billType })
      .then(resp => Promise.resolve(resp.data))
      .then(resp => {
        resp.out.forEach(item => {
          item.date = item.createTime.substr(5, 11);
          item.money = item.money.toFixed(2);
          item.icon = fundIcon[item.type];

          const orderNo = item.orderNo;

          const logList =
            resp.in && resp.in.filter(item => item.orderNo === orderNo);

          if (logList && logList.length > 0) {
            item.logList = logList;
          }
        });
        return Promise.resolve(resp.out);
      });
  }

  getCoinFundList(timeRange, billType) {
    return Http.get("/fdd/user/getUserCoinLog.json", { timeRange, billType })
      .then(resp => Promise.resolve(resp.data || {}))
      .then(fundlist => {
        return (
          fundlist.out &&
          fundlist.out.map(item => {
            const platform = "房盯盯";
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
              money: `${optCoin}币`,
              direction,
              createTime,
              remark,
              logName,
              platformType: 2,
              icon: coinFundIcon[type],
              payList: !payList
                ? []
                : payList.map(item => {
                    const { optCoin, direction, createTime } = item;
                    return {
                      date: createTime,
                      money: `${direction > 0 ? "+" : "-"}${optCoin}`,
                      direction
                    };
                  })
            };
          })
        );
      });
  }
}
