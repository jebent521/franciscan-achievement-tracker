const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');

const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserService extends CrudService {
  constructor() {
    super('users');
    this.sortByOptions = ['id', 'name', 'email', 'points'];
  }

  validate(req) {
    const missingFields = [];
    if (!req.body.hasOwnProperty('name')) missingFields.push('name');
    if (!req.body.hasOwnProperty('email')) missingFields.push('email');

    // TODO: discuss whether points should be required, permitted, or rejected on user creation
    // if (!req.body.hasOwnProperty('points')) missingFields.push('points');

    // Either password OR oauth_id must be provided
    if (
      !req.body.hasOwnProperty('password') &&
      !req.body.hasOwnProperty('oauth_id')
    ) {
      missingFields.push('password or oauth_id');
    }

    if (
      req.body.hasOwnProperty('password') &&
      req.body.hasOwnProperty('oauth_id')
    ) {
      return new ApiResult(400, 'user cannot have both password and oauth_id');
    }

    if (missingFields.length > 0) {
      return new ApiResult(400, 'Missing fields: ' + missingFields.join(', '));
    }
    if (req.body.hasOwnProperty('id')) {
      return new ApiResult(400, 'Field "id" must not be provided');
    }
  }

  async preprocess(obj) {
    if (obj.password) {
      obj.password = await bcrypt.hash(obj.password, saltRounds);
    }
    return obj;
  }

  filter(obj) {
    delete obj.password;
    return obj;
  }

  async addPoints(id, points) {
    return this.repository.addToColumn(id, 'points', points);
  }
}

module.exports = UserService;
