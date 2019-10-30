import Http from '../../utils/http';

export default class FeedBackServie {
  submitFeedBack(suggestion) {
    return Http.get('/fdd/user/addSuggestion.json', { suggestion });
  }
}
