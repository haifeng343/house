import Http from "../../utils/http";
import { authSubject } from "../../utils/auth";
const daysZH = {
  1: "一天",
  2: "两天",
  3: "三天",
  4: "四天",
  5: "五天"
};

const activityCouponId = [12, 13];

export default class UserService {
  requestShare() {
    return Http.post("/fdd/user/fddDailyShareBack.json")
      .then(resp => Promise.resolve(resp.data))
      .then(item => {
        const type = item.ctype;
        const message =
          type === 1
            ? `限大于${item.cvalue}天的监控`
            : type === 2
            ? `免费体验${daysZH[item.cvalue]}收费抢票功能`
            : `可兑换${item.cvalue}盯盯币`;
        const name =
          type === 1
            ? item.cname
            : type === 2
            ? `${item.cvalue}天`
            : `${item.cvalue}币`;
        return Promise.resolve([
          {
            activity: activityCouponId.includes(item.couponId),
            couponId: item.couponId,
            type,
            message,
            name,
            id: item.userCouponId,
            expireTime: item.expireTime.substr(0, 10)
          }
        ]);
      });
  }

  checkFirstShare() {
    return Http.get("/fdd/user/checkFddDailyShare.json").then(
      resp => resp.data
    );
  }

  getBalance() {
    return Http.get("/user/account/getAccountBalance.json").then(resp => {
      const money = resp.data;
      return Promise.resolve(money);
    });
  }

  getUserInfo() {
    let token = wx.getStorageSync("token");
    return Http.get("/fdd/user/userInfo.json", { token }).then(resp => {
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
    return Http.post("/fddLogin/appletAuth.json", data).then(resp => {
      const token = resp.data;
      const app = getApp();
      app.globalData.isAuth = true;
      wx.setStorageSync("token", token);
      // 注意: 不要把这代码段放在存储token之前
      authSubject.next(true);
      // 注意: 不要把这代码段放在存储token之前
    });
  }

  getCouponCount() {
    return Http.get("/fdd/userCoupon/getUsable.json", { couponType: 3 })
      .then(resp => Promise.resolve(resp.data || []))
      .then(couponList => Promise.resolve(couponList.length));
  }
}
