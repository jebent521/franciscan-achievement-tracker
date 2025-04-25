const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');

class UserFriendService extends CrudService {
  constructor() {
    super('friends');
  }

  validate(req) {
    req.body.id = req.params.id;

    if (!req.body.hasOwnProperty('id')) {
      return new ApiResult(400, 'Missing field: id');
    }
    if (!req.body.hasOwnProperty('friend_id')) {
      return new ApiResult(400, 'Field "friend_id" must not be provided.');
    }
  }

  async read(req) {
    const result = await this.repository.readByCustom('id', req.params.id);
    if (result.error) console.error(result.error);
    return result;
  }

  async delete(req) {
    const Id = req.params.id;
    const friendId = req.params.friend_id;

    // delete row
    const deleteResult = await this.repository.deleteByCriteria({
      id: Id,
      friend_id: friendId,
    });
    if (deleteResult.error) console.error(deleteResult.error);
    if (deleteResult.status != 200) return deleteResult;

    return deleteResult;
  }
}

module.exports = UserFriendService;
