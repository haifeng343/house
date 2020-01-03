import Http from './http';

const loginUrl = '/fddLogin/appletLogin.json';

const doWechatLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resp =>
        resp.code ? resolve(resp.code) : reject(new Error('no code')),
      fail: error => reject(error)
    });
  })
    .then(code => {
      return Http.post(loginUrl, { code }).then(resp => {
        wx.hideLoading();
        wx.showToast({title:'',icon:'none',duration:0});
        const sessionKey = resp.data.session_key;
        wx.setStorageSync('sessionKey', sessionKey);
        return Promise.resolve(resp);
      });
    })
    .catch(error => {
      if (error.data && error.data.session_key) {
        const sessionKey = error.data.session_key;
        wx.setStorageSync('sessionKey', sessionKey);
      } else {
        wx.removeStorageSync('sessionKey');
      }

      return Promise.reject(error);
    });
};

const getSessionKey = () => {
  return new Promise(resolve => {
    const sessionKey = wx.getStorageSync('sessionKey');
    if (sessionKey) {
      wx.checkSession({
        success: () => {
          console.log('sessionkey 有效');
          resolve(sessionKey);
        },
        fail: () => {
          console.log('sessionkey 无效');
          resolve();
        }
      });
    } else {
      resolve();
    }
  }).then(sessionKey => {
    console.log(`sessionkey 有值 = ${!!sessionKey}`);
    if (!sessionKey) {
      return doWechatLogin().then(resp => resp.data.session_key);
    }
    return Promise.resolve(sessionKey);
  });
};

const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: resp => resolve(resp),
      fail: () => reject()
    });
  });
};

const getLocationSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        /**
         * false = 拒绝授权
         * undefined = 未确认
         * true = 同意授权
         */
        if (res.authSetting['scope.userLocation'] === false) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: dataAu => {
                    if (dataAu.authSetting['scope.userLocation'] == true) {
                      resolve();
                    } else {
                      reject();
                    }
                  }
                });
              } else {
                reject();
              }
            }
          });
        } else {
          resolve();
        }
      }
    });
  });
};

export { doWechatLogin, getSessionKey, getLocationSetting, getLocation };
