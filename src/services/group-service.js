const ApiResult = require('../utils/api-result');
const Service = require('./service');

class GroupService extends Service {
  constructor() {
    super('groups');
  }

  validateCreate(req) {
    const missingFields = [];
    if (!req.body.name) missingFields.push('name');
    if (!req.body.description) missingFields.push('description');
    if (missingFields.length > 0) {
      return new ApiResult(400, `Missing fields: ${missingFields.join(', ')}`);
    }
    if (req.body.id) {
      return new ApiResult(400, 'Field "id" must not be provided.');
    }
  }
}

module.exports = GroupService;
