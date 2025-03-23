const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');

class GroupService extends CrudService {
  constructor() {
    super('groups');
  }

  validate(req) {
    const missingFields = [];
    if (!req.body.hasOwnProperty('name')) missingFields.push('name');
    if (!req.body.hasOwnProperty('description'))
      missingFields.push('description');
    if (missingFields.length > 0) {
      return new ApiResult(400, `Missing fields: ${missingFields.join(', ')}`);
    }
    if (req.body.hasOwnProperty('id')) {
      return new ApiResult(400, 'Field "id" must not be provided.');
    }
  }
}

module.exports = GroupService;
