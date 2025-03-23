const Repository = require('../data/repository');

class SearchService {
  async search(req, res) {
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
          try {
            const searchResult = await this._searchTable(
              'users',
              query,
              ['name', 'email'],
              ['id', 'name', 'email', 'points']
            );
            results.users = searchResult;
          } catch (error) {
            res.status(error.status).send(error.message);
            return;
          }
          break;
        case 'groups':
          try {
            const searchResult = await this._searchTable('groups', query, [
              'name',
              'description',
            ]);
            results.groups = searchResult;
          } catch (error) {
            res.status(error.status).send(error.message);
            return;
          }
          break;
        case 'achievements':
          try {
            const searchResult = await this._searchTable(
              'achievements',
              query,
              ['title', 'description']
            );
            results.achievements = searchResult;
          } catch (error) {
            console.error(error);
            res.status(error.status).send(error.message);
            return;
          }
          break;
        default:
          res.status(400).send(`Invalid filter parameter '${f}'`);
          return;
      }
    }
    res.send(results);
  }

  /**
   * Searches `tableName` for rows matching a pattern in the specified columns.
   *
   * @param {string} tableName - The name of the table to search
   * @param {string} pattern - The search pattern
   * @param {string[]} searchColumns - The columns to search within, defaults to all.
   * @param {string[]} returnColumns - The columns to return in the result, defaults to all.
   * @returns {Promise<Array>} - A promise that resolves to an list of the search results.
   */
  async _searchTable(
    tableName,
    pattern,
    searchColumns = ['*'],
    returnColumns = ['*']
  ) {
    const repository = new Repository(tableName);
    const result = await repository.search(
      pattern,
      searchColumns,
      returnColumns
    );
    if (result.status != 200) throw result;
    return result.message;
  }
}

module.exports = SearchService;
