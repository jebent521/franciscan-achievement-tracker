const Service = require('./service');
const ApiResult = require('../utils/api-result');

class UserAchievementsService extends Service {
  constructor() {
    super('user_achievements');
  }

  validateCreate(req) {
    const missingFields = [];
    if (!req.body.user_id) missingFields.push('user_id');
    if (!req.body.achievement_id) missingFields.push('achievement_id');

    if (missingFields.length > 0) {
      return new ApiResult(400, `Missing fields: ${missingFields.join(', ')}`);
    }
    if (req.body.date_achieved) {
      return new ApiResult(400, 'Field "date_achieved" must not be provided.');
    }
  }
}

module.exports = UserAchievementsService;
