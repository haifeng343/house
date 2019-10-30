import Http from '../../utils/http';

export default class UserFeedBackServie {
  getUserFeedBackList() {
    return Http.get('/fdd/user/replySuggestion.json')
      .then(resp => Promise.resolve(resp.data || []))
      .then(resp => {
        for (const s of resp) {
          s.updateTime = s.updateTime
            ? s.updateTime.substr(0, 10)
            : s.createTime.substr(0, 10);
        }
        return Promise.resolve(resp);
      });
  }
}
