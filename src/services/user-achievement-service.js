const AchievementService = require('./achievement-service');
const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');
const UserService = require('./user-service');

class UserAchievementService extends CrudService {
  constructor() {
    super('user_achievements');
    this.sortByOptions = ['id', 'title', 'group_id', 'points', 'date_achieved'];
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

  async postprocess(req) {
    // get achievement's points
    const achievementResult = await new AchievementService().readById({
      params: { id: req.body.achievement_id },
    });
    if (achievementResult.status != 200) return achievementResult;
    const points = achievementResult.message.points;

    // modify user's points
    const pointsResult = await new UserService().addPoints(
      req.params.user_id,
      points
    );
    if (pointsResult.status != 200) return pointsResult;
  }

  async read(req) {
    const limit = req.query?.limit || null;
    const offset = req.query?.offset || null;
    const sort = req.query?.sort || null;

    if (sort && !this.sortByOptions.includes(sort))
      return new ApiResult(400, 'Invalid sort parameter');

    const achievementResult = await this.repository.readUserAchievement(
      req.params.user_id,
      'user_id',
      'achievements',
      limit,
      offset,
      sort
    );
    if (achievementResult.error) console.error(achievementResult.error);
    return achievementResult;
    if (achievementResult.error) console.error(achievementResult.error);
    return achievementResult;
  }

  async delete(req) {
    const userId = req.params.user_id;
    const achievementId = req.params.achievement_id;

    // delete row
    const deleteResult = await this.repository.deleteByCriteria({
      user_id: userId,
      achievement_id: achievementId,
    });
    if (deleteResult.error) console.error(deleteResult.error);
    if (deleteResult.status != 200) return deleteResult;

    // get achievement's points
    const achievementResult = await new AchievementService().readById({
      params: { id: achievementId },
    });
    if (achievementResult.status != 200) return achievementResult;
    const points = achievementResult.message.points;

    // modify user's points
    const pointsResult = await new UserService().addPoints(userId, -1 * points);
    if (pointsResult.status != 200) return pointsResult;

    return deleteResult;
  }
}

module.exports = UserAchievementService;
