import Http from "../../utils/http";
import fetch from "../../utils/fecha";

const daysZH = {
  1: "一天",
  2: "两天",
  3: "三天",
  4: "四天",
  5: "五天"
};

export default class CouponService {
  getUseableCouponList() {
    return Http.get("/fdd/userCoupon/getUsable.json", { couponType: 1 })
      .then(resp => Promise.resolve(resp.data || []))
      .then(resp => {
        return resp.map(item => {
          return {
            message: item.remark,
            name: item.cname,
            status: item.status,
            id: item.userCouponId,
            expire: item.expireTime,
            expireTime: item.expireTime.substr(0, 10),
            canUse: true,
            canSelect: true,
            day: item.cvalue,
            type: item.ctype
          };
        });
      });
  }

  getUseableFreeCouponList() {
    return Http.get("/fdd/userCoupon/getUsable.json", { couponType: 2 })
      .then(resp => Promise.resolve(resp.data || []))
      .then(resp => {
        return resp.map(item => {
          return {
            message: `免费体验${daysZH[item.cvalue]}收费抢票功能`,
            name: item.cname,
            status: item.status,
            id: item.userCouponId,
            expire: item.expireTime,
            expireTime: item.expireTime.substr(0, 10),
            canUse: true,
            canSelect: true,
            day: item.cvalue,
            type: item.ctype
          };
        });
      });
  }

  getUseableFDDCouponList() {
    return Http.get("/fdd/userCoupon/getUsable.json", { couponType: 3 })
      .then(resp => Promise.resolve(resp.data || []))
      .then(resp => {
        return resp.map(item => {
          return {
            message: `兑换后获得${item.cvalue}盯盯币`,
            name: `${item.cvalue}币`,
            status: item.status,
            id: item.userCouponId,
            expire: item.expireTime,
            expireTime: item.expireTime.substr(0, 10),
            canUse: true,
            canSelect: true,
            day: item.cvalue,
            type: item.ctype
          };
        });
      });
  }

  getUnuseableCouponList() {
    return Http.get("/fdd/userCoupon/getExpired.json")
      .then(resp => Promise.resolve(resp.data || []))
      .then(resp => {
        return resp.map(item => {
          const type = item.ctype;
          const message =
            type === 3 ? `兑换后获得${item.cvalue}盯盯币` : item.remark;
          const name = type === 3 ? `${item.cvalue}币` : item.cname;
          return {
            message,
            name,
            status: item.status,
            id: item.userCouponId,
            expire: item.expireTime,
            expireTime: item.expireTime.substr(0, 10),
            canUse: false,
            canSelect: false,
            day: item.cvalue,
            type
          };
        });
      });
  }

  getCouponList() {
    let pddList = [];

    let fddList = [];

    return this.getUseableCouponList()
      .then(couponList => {
        pddList = couponList;
        return this.getUseableFDDCouponList();
      })
      .then(couponList => (fddList = couponList))
      .then(_ => {
        const couponList = []
          .concat(pddList)
          .concat(fddList)
          .sort(
            (a, b) =>
              fetch.parse(a.expire, "YYYY-MM-DD HH:mm:ss").getTime() -
              fetch.parse(b.expire, "YYYY-MM-DD HH:mm:ss").getTime()
          );

        return Promise.resolve(couponList);
      });
  }

  getData(tabValue) {
    if (typeof tabValue !== "number") {
      const tabList = [
        { label: "券包", value: 1 },
        { label: "历史卡券", value: 2 }
      ];
      return this.getUseableFreeCouponList().then(freeCouponList => {
        if (freeCouponList.length > 0) {
          tabList.unshift({ label: "卡包", value: 0 });
        }
        return this.getCouponList().then(couponList =>
          Promise.resolve({ couponList, tabList })
        );
      });
    }
    if (tabValue === 0) {
      return this.getUseableFreeCouponList().then(couponList =>
        Promise.resolve({ couponList })
      );
    } else if (tabValue === 1) {
      return this.getCouponList().then(couponList =>
        Promise.resolve({ couponList })
      );
    } else if (tabValue === 2) {
      return this.getUnuseableCouponList().then(couponList =>
        Promise.resolve({ couponList })
      );
    }
  }

  exchangeCoupon(userCouponId) {
    return Http.post("/fdd/user/fddUseCoupon.json", { userCouponId });
  }
}
