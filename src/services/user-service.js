const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');

const bcrypt = require('bcrypt');
const saltRounds = 10;

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

  async preprocess(obj) {
    obj.password = await bcrypt.hash(obj.password, saltRounds);
    return obj;
  }

  filter(obj) {
    delete obj.password;
    return obj;
  }
}

module.exports = UserService;
