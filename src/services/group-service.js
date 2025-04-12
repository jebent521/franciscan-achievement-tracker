const Repository = require('../data/repository');
const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');

class GroupService extends CrudService {
  constructor() {
    super('groups');
  }

  async preprocess(req) {
    //check for a group with the same name
    const group_name = req.body.name;
    const group_with_same_name = (
      await this.repository.readByCustom('name', group_name)
    ).message[0];
    if (group_with_same_name) return new ApiResult(409, 'Duplicate group name');
    return null;
  }

  validate(req) {
    const missingFields = [];
    if (!req.body.hasOwnProperty('name')) missingFields.push('name');
    if (!req.body.hasOwnProperty('description'))
      missingFields.push('description');
    if (!req.body.hasOwnProperty('officer_user_id'))
      missingFields.push('officer_user_id');
    if (missingFields.length > 0) {
      return new ApiResult(400, `Missing fields: ${missingFields.join(', ')}`);
    }
    if (req.body.hasOwnProperty('id')) {
      return new ApiResult(400, 'Field "id" must not be provided.');
    }
  }

  async create(req) {
    const validateResult = this.validate(req);
    if (validateResult) return validateResult;

    const preprocess = await this.preprocess(req);
    if (preprocess) return preprocess;

    const group = { name: req.body.name, description: req.body.description };
    const creatingOfficer = { user_id: req.body.officer_user_id };

    //insert the group into the database
    const result = await this.repository.create(group);
    if (result.error) console.error(result.error);

    //get the group id after creation, name is unique
    const new_group = (await this.repository.readByCustom('name', group.name))
      .message;
    const officerGroupPair = {
      user_id: creatingOfficer.user_id,
      group_id: new_group[0].id,
    };
    //insert the creating officer into the members group, then the officers group

    const memberRepository = new Repository('group_members');
    await memberRepository.create(officerGroupPair);

    const officerRepository = new Repository('group_officers');
    await officerRepository.create(officerGroupPair);

    return result.status == 201
      ? new ApiResult(result.status, this.filter(result.message))
      : result;
  }
}

module.exports = GroupService;
