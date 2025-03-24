const CrudService = require('./crud-service');
const ApiResult = require('../utils/api-result');

class UserAchievementService extends CrudService {
  constructor() {
    super('user_achievements');
  }

  validate(req) {
    req.body.user_id = req.params.user_id;

    if (!req.body.hasOwnProperty('achievement_id')) {
      return new ApiResult(400, 'Missing field: achievement_id');
    }
    if (req.body.hasOwnProperty('date_achieved')) {
      return new ApiResult(400, 'Field "date_achieved" must not be provided.');
    }
  }

  async delete(req, res) {
    const result = await this.repository.deleteByCriteria({
      user_id: req.params.user_id,
      achievement_id: req.params.achievement_id,
    });
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }

  async read(req, res) {
    const result = await this.repository.readByCustom(
      'user_id',
      req.params.user_id
    );
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }
}

module.exports = UserAchievementService;
