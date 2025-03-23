const CrudService = require('./crud-service');
const ApiResult = require('../utils/api-result');

class UserService extends CrudService {
  constructor() {
    super('users');
  }

  validate(req) {
    const missingFields = [];
    if (!req.body.name) missingFields.push('name');
    if (!req.body.email) missingFields.push('email');
    if (!req.body.password) missingFields.push('password');
    if (!req.body.points) missingFields.push('points');
    if (missingFields.length > 0) {
      return new ApiResult(400, 'Missing fields: ' + missingFields.join(', '));
    }
    if (req.body.id) {
      return new ApiResult(400, 'Field "id" must not be provided');
    }
  }

  // TODO: override preprocess to hash password
  // preprocess(obj) {}

  // TODO: override filter to remove password field
  // filter(obj) {}
}

module.exports = UserService;
