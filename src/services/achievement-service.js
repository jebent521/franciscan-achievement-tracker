const CrudService = require('./crud-service');
const ApiResult = require('../utils/api-result');

class AchievementService extends CrudService {
  constructor() {
    super('achievements');
  }

  validate(req) {
    const missingFields = [];
    if (!req.body.title) missingFields.push('title');
    if (!req.body.group_id) missingFields.push('group_id');
    if (!req.body.description) missingFields.push('description');
    if (!req.body.points) missingFields.push('points');
    if (missingFields.length > 0) {
      return new ApiResult(400, 'Missing fields: ' + missingFields.join(', '));
    }
    if (req.body.id) {
      return new ApiResult(400, 'Field "id" must not be provided');
    }
  }
}

module.exports = AchievementService;
