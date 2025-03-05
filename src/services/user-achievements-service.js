const Service = require('./service');
const ApiResult = require('../utils/api-result');

class UserAchievementsService extends Service {
  constructor() {
    super('user_achievements');
  }

  validateCreate(req) {
    const user_id = req.params.user_id;

    if (!req.body.achievement_id) {
      return new ApiResult(400, 'Missing field: achievement_id');
    }
    if (req.body.date_achieved) {
      return new ApiResult(400, 'Field "date_achieved" must not be provided.');
    }
    req.body.user_id = user_id;
  }
}

module.exports = UserAchievementsService;
