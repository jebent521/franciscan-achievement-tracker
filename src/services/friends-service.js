const CrudService = require('./crud-service');
const ApiResult = require('../utils/api-result');

class FriendService extends CrudService {
  constructor() {
    super('friends');
  }

  validate(req) {
    const missingFields = [];
    if (!req.body.hasOwnProperty('id')) missingFields.push('id');
    if (!req.body.hasOwnProperty('friend_id')) missingFields.push('friend_id');
    if (missingFields.length > 0) {
      return new ApiResult(400, 'Missing fields: ' + missingFields.join(', '));
    }
    if (req.body.hasOwnProperty('id')) {
      return new ApiResult(400, 'Field "id" must not be provided');
    }
  }
}

module.exports = FriendService;
