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

  async create(req, res) {
    const validateResult = this.validate(req);
    if (validateResult) {
      res.status(validateResult.status).send(validateResult.message);
      return;
    }
    const result = await this.repository.create(
      await this.preprocess(req.body)
    );
    if (result.error) console.error(result.error);
    if (result.status == 201) {
      res.status(result.status).send(this.filter(result.message));
    } else {
      res.status(result.status).send(result.message);
    }
  }

  async read(res) {
    const result = await this.repository.read();
    if (result.error) console.error(result.error);
    if (result.status == 200) {
      res
        .status(result.status)
        .send(result.message.map((row) => this.filter(row)));
    } else {
      res.status(result.status).send(result.message);
    }
  }

  async readById(req, res) {
    const result = await this.repository.readById(req.params.id);
    if (result.error) console.error(result.error);
    if (result.status == 200) {
      res.status(result.status).send(this.filter(result.message));
    } else {
      res.status(result.status).send(result.message);
    }
  }

  async update(req, res) {
    const validateResult = this.validate(req);
    if (validateResult) {
      res.status(validateResult.status).send(validateResult.message);
      return;
    }
    const result = await this.repository.update(
      req.params.id,
      this.preprocess(req.body)
    );
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }

  async delete(req, res) {
    const result = await this.repository.delete(req.params.id);
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }
}

module.exports = CrudService;
