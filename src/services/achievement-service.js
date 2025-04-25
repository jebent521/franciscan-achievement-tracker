const CrudService = require('./crud-service');
const ApiResult = require('../utils/api-result');

class AchievementService extends CrudService {
  constructor() {
    super('achievements');
    this.sortByOptions = ['id', 'title', 'group_id', 'description', 'points'];
  }

  validate(req) {
    const missingFields = [];
    if (!req.body.hasOwnProperty('title')) missingFields.push('title');
    if (!req.body.hasOwnProperty('group_id')) missingFields.push('group_id');
    if (!req.body.hasOwnProperty('description'))
      missingFields.push('description');
    if (!req.body.hasOwnProperty('points')) missingFields.push('points');
    if (missingFields.length > 0) {
      return new ApiResult(400, 'Missing fields: ' + missingFields.join(', '));
    }
    if (req.body.hasOwnProperty('id')) {
      return new ApiResult(400, 'Field "id" must not be provided');
    }
  }
}

module.exports = AchievementService;
