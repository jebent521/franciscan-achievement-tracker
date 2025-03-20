const ApiResult = require('../utils/api-result');

class SearchService {
  async search(req, res) {
    const query = req.params.query;

    var users = false;
    var groups = false;
    var achievements = false;

    var filter;
    if (!req.query.filter) filter = ['users', 'groups', 'achievements'];
    else filter = req.query.filter.split(',');
    for (const f of filter) {
      switch (f) {
        case 'users':
          users = true;
          break;
        case 'groups':
          groups = true;
          break;
        case 'achievements':
          achievements = true;
          break;
        default:
          res.status(400).send(`Invalid filter parameter '${f}'`);
          return;
      }
    }
    res.send(`Query: ${query}
Filter:
  users: ${users}
  groups: ${groups}
  achievements: ${achievements}`);
  }
}

module.exports = SearchService;
