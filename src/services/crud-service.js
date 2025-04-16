const Repository = require('../data/repository');
const ApiResult = require('../utils/api-result');

class CrudService {
  constructor(tableName) {
    if (this.constructor === CrudService) {
      throw new Error(
        'Abstract class "Service" cannot be instantiated directly.'
      );
    }
    this.repository = new Repository(tableName);
  }

  /**
   * Method used for validation of incoming request on create and update.
   * Returns null if it is valid, returns an ApiResult if there are
   * validation errors. If this function is not overridden, the object
   * will be assumed valid.
   *
   * Note, basic validation is enforced by the database (e.g. foreign
   * key constraints and type checking).
   *
   * @param {Request} obj - the incoming request.
   *
   * @returns {ApiResult?}
   */
  validate(obj) {
    return null;
  }

  /**
   * Method used for modifying incoming data on create and update.
   * This can be used e.g. for hashing a user's password before it is
   * inserted into the database. If this function is not overridden,
   * the object will be inserted as-is.
   *
   * @param {Object} obj - the incoming data.
   */
  async preprocess(obj) {
    return obj;
  }

  /**
   * Method used for filtering data to be returned by the service.
   * This can be used e.g. for hiding a user's password on api calls.
   *
   * @param {Object} obj - the data to be filtered.
   *
   * @returns {Object} - the filtered output.
   */
  filter(obj) {
    return obj;
  }

  async create(req) {
    const validateResult = this.validate(req);
    if (validateResult) return validateResult;

    const result = await this.repository.create(
      await this.preprocess(req.body)
    );
    if (result.error) console.error(result.error);

    return result.status == 201
      ? new ApiResult(result.status, this.filter(result.message))
      : result;
  }

  async read(req) {
    const limit = req.query?.limit || null;
    const offset = req.query?.offset || null;
    const result = await this.repository.read(limit, offset);
    if (result.error) console.error(result.error);

    return result.status == 200
      ? new ApiResult(
          result.status,
          result.message.map((row) => this.filter(row))
        )
      : result;
  }

  async readById(req) {
    const result = await this.repository.readById(req.params.id);
    if (result.error) console.error(result.error);

    return result.status == 200
      ? new ApiResult(result.status, this.filter(result.message))
      : result;
  }

  async update(req) {
    const validateResult = this.validate(req);
    if (validateResult) return validateResult;

    const result = await this.repository.update(
      req.params.id,
      this.preprocess(req.body)
    );
    if (result.error) console.error(result.error);

    return result;
  }

  async delete(req) {
    const result = await this.repository.delete(req.params.id);
    if (result.error) console.error(result.error);

    return result;
  }

  async search(pattern, columns = ['*']) {
    const result = await this.repository.search(pattern, columns);
    if (result.error) console.error(result.error);

    return result.status == 200
      ? new ApiResult(
          result.status,
          result.message.map((row) => this.filter(row))
        )
      : result;
  }
}

module.exports = CrudService;
