const AchievementService = require('./achievement-service');
const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');
const UserService = require('./user-service');
const { pool } = require('../data/connection');

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

  async create(req) {
    // create row
    const createResult = await super.create(req);

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

    return createResult;
  }

  async read(req) {
    try {
      const userId = req.params.user_id;

      // Query to get all achievements for the user with full achievement details
      const query = `
      SELECT a.*, ua.date_achieved 
      FROM achievements a
      JOIN user_achievements ua ON a.id = ua.achievement_id
      WHERE ua.user_id = $1
      ORDER BY ua.date_achieved DESC
    `;

      // Execute the query
      const { rows } = await pool.query(query, [userId]);

      return {
        status: 200,
        message: rows,
      };
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return {
        status: 500,
        message: { error: 'Internal server error' },
      };
    }
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
