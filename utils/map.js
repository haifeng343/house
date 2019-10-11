import MD5 from './md5';
import Http from './http';

const key = '73EBZ-AVOCX-IFT4W-T5N4X-A3MRE-JMBDB';
const secret = 'r72JjfAky3sq3gTzdF7IsO0HBK54XHe8';


const getLocationInfo =  location => {
  const { latitude, longitude } = location;
  const sig = MD5(`/ws/geocoder/v1/?key=${key}&location=${latitude},${longitude}${secret}`);
  return Http.request(`https://apis.map.qq.com/ws/geocoder/v1/?key=${key}&location=${latitude},${longitude}&sig=${sig}`, 'GET', {}, {});
};

export { getLocationInfo };
