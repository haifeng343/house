import Http from "../../utils/http";
import { authSubject } from "../../utils/auth";
const daysZH = {
  1: "一天",
  2: "两天",
  3: "三天",
  4: "四天",
  5: "五天"
};

export default class index {
  getHotPosition(cityName) {
    return Http.get("/getHotPosition.json", { cityName });
  }
  indexParam() {
    return Http.get("/indexParam.json");
  }
  getCityList(cityName, type = 0) {
    return Http.get("/selectCity.json", { cityName, type });
  }
  getLongCityList() {
    return Http.get("/long/cityList.json");
  }
  getBanner() {
    return Http.get("/banner/index.json");
  }
  getUnReadCouponList() {
    return Http.get("/fdd/userCoupon/getUnRead.json")
      .then(resp => Promise.resolve(resp.data || []))
      .then(resp => {
        return resp.map(item => {
          const type = item.ctype;
          const message =
            type === 1
              ? item.remark
              : type === 2
              ? `免费体验${daysZH[item.cvalue]}收费抢票功能`
              : `兑换后获得${item.cvalue}盯盯币`;
          const name =
            type === 1
              ? item.cname
              : type === 2
              ? `${item.cvalue}天`
              : `${item.cvalue}币`;
          return {
            type,
            message,
            name,
            id: item.userCouponId,
            expireTime: item.expireTime.substr(0, 10)
          };
        });
      });
  }
  getUserInfo() {
    let token = wx.getStorageSync("token");
    return Http.get("/fdd/user/userInfo.json", { token }).then(resp => {
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
    return Http.post("/fddLogin/appletAuth.json", data).then(resp => {
      const token = resp.data;
      const app = getApp();
      app.globalData.isAuth = true;
      wx.setStorageSync("token", token);

      authSubject.next(true);
    });
  }
}
