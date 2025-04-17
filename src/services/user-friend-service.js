const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');

class UserFriendService extends CrudService {
  constructor() {
    super('friends');
  }

  validate(req) {
    req.body.user_id = req.params.user_id;

    if (!req.body.hasOwnProperty('id')) {
      return new ApiResult(400, 'Missing field: id');
    }
    if (req.body.hasOwnProperty('friend_id')) {
      return new ApiResult(400, 'Field "friend_id" must not be provided.');
    }
  }

  async read(req) {
    const result = await this.repository.readByCustom(
      'user_id',
      req.params.user_id
    );
    if (result.error) console.error(result.error);
    return result;
  }

  async delete(req) {
    const userId = req.params.user_id;
    const achievementId = req.params.achievement_id;

    // delete row
    const deleteResult = await this.repository.deleteByCriteria({
      id: Id,
      friend_id: friend_id,
    });
    if (deleteResult.error) console.error(deleteResult.error);
    if (deleteResult.status != 200) return deleteResult;

    return deleteResult;
  }
}

module.exports = UserFriendService;
