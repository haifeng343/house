import MD5 from './md5';
import Http from './http';

const key = 'DR3BZ-H4SLR-EICWG-WGVGO-37IC6-5DBUA';
const secret = 'yF1RvcDhPWJi63Zy3A1RfJPR4ClxbcXh';


const getLocationInfo =  location => {
  const { latitude, longitude } = location;
  const sig = MD5(`/ws/geocoder/v1/?key=${key}&location=${latitude},${longitude}${secret}`);
  return Http.request(`https://apis.map.qq.com/ws/geocoder/v1/?key=${key}&location=${latitude},${longitude}&sig=${sig}`, 'GET', {}, {});
};

export { getLocationInfo };
