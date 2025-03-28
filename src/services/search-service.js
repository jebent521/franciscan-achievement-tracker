const AchievementService = require('./achievement-service');
const ApiResult = require('../utils/api-result');
const GroupService = require('./group-service');
const UserService = require('./user-service');

class SearchService {
  async search(req) {
    var results = {};

    // argument parsing
    const query = req.params.query;
    var filter;
    if (!req.query.filter) filter = ['users', 'groups', 'achievements'];
    else filter = req.query.filter.split(',');

    // iterating through tables to search
    for (const f of filter) {
      switch (f) {
        case 'users':
          const userResult = await new UserService().search(query, [
            'name',
            'email',
          ]);
          if (userResult.status != 200) return userResult;
          results.users = userResult.message;
          break;
        case 'groups':
          const groupResult = await new GroupService().search(query, [
            'name',
            'description',
          ]);
          if (groupResult.status != 200) return groupResult;
          results.groups = groupResult.message;
          break;
        case 'achievements':
          const achievementResult = await new AchievementService().search(
            query,
            ['title', 'description']
          );
          if (achievementResult.status != 200) return achievementResult;
          results.achievements = achievementResult.message;
          break;
        default:
          return new ApiResult(400, `Invalid filter parameter '${f}'`);
      }
    }
    return new ApiResult(200, results);
  }
}

module.exports = SearchService;
