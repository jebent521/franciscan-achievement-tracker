const CrudService = require('./crud-service');
const ApiResult = require('../utils/api-result');

class Group_Service extends CrudService {
  constructor(tableName) {
    super(tableName);
  }

  validate(req) {
    req.body.group_id = req.params.group_id;

    if (!req.body.hasOwnProperty('user_id')) {
      return new ApiResult(400, 'Missing field: user_id');
    }
  }

  async delete(req) {
    const result = await this.repository.deleteByCriteria({
      group_id: req.params.group_id,
      user_id: req.params.user_id,
    });
    if (result.error) console.error(result.error);
    return result;
  }

  async read(req) {
    const result = await this.repository.readByCustom(
      'group_id',
      req.params.group_id
    );
    if (result.error) console.error(result.error);
    return result;
  }
}

class GroupMembersService extends Group_Service {
  constructor() {
    super('group_members');
  }
}

class GroupOfficersService extends Group_Service {
  constructor() {
    super('group_officers');
  }
}

module.exports = { GroupMembersService, GroupOfficersService };
