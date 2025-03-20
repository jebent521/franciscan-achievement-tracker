const Repository = require('../data/repository');

class Service {
  constructor(tableName) {
    if (this.constructor === Service) {
      throw new Error(
        'Abstract class "Service" cannot be instantiated directly.'
      );
    }
    this.repository = new Repository(tableName);
  }

  validate(_) {
    throw new Error('Abstract method not implemented.');
  }

  async create(req, res) {
    const validateResult = this.validate(req);
    if (validateResult) {
      res.status(validateResult.status).send(validateResult.message);
      return;
    }
    const result = await this.repository.create(req.body);
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }

  async read(res) {
    const result = await this.repository.read();
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }

  async readById(req, res) {
    const result = await this.repository.readById(req.params.id);
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }

  async update(req, res) {
    const validateResult = this.validate(req);
    if (validateResult) {
      res.status(validateResult.status).send(validateResult.message);
      return;
    }
    const result = await this.repository.update(req.params.id, req.body);
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }

  async delete(req, res) {
    const result = await this.repository.delete(req.params.id);
    if (result.error) console.error(result.error);
    res.status(result.status).send(result.message);
  }
}

module.exports = Service;
