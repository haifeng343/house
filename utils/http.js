import { default_address } from './httpAddress.js'
// process.env.NODE_ENV === 'production'
//   ? 'https://piao.bangdingding.cn'
//   : process.env.NODE_ENV === 'test'
//   ? 'https://piaotest.bangdingding.cn'
//   : 'https://piaodev.bangdingding.cn';

const get = (url, data = null) => {
  return request(url, 'GET', data);
};

const post = (url, data, header) => {
  return request(url, 'POST', data, header);
};

const del = (url, data) => {
  return request(url, 'DELETE', data);
};
const put = (url, data) => {
  return request(url, 'PUT', data);
};

const request = (
  url,
  method = 'GET',
  data = {},
  header = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
) => {
  const token = wx.getStorageSync('token');
  if (url.startsWith('/')) {
    url = `${default_address}${url}`;
    data = Object.assign({
      token
    }, data);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      header,
      data,
      success(resp) {
        if (resp.statusCode !== 200) {
          return reject({
            code: resp.statusCode,
            message: '接口请求失败'
          });
          wx.hideLoading();
          wx.showToast({title:'',icon:'none',duration:1});
        }
        if (typeof resp.data.code === 'number') {
          if (resp.data.code !== 200) {
            return reject({
              code: resp.data.code,
              message: resp.data.resultMsg,
              data: resp.data.data
            });
          }
        }
        resolve(resp.data);
      },
      fail() {
        reject({
          message: '你的网络可能开小差了~'
        });
        wx.hideLoading();
        wx.showToast({title:'',icon:'none',duration:1});
      }
    });
  });
};

const Http = {
  get,
  post,
  del,
  put,
  request
};

export default Http;