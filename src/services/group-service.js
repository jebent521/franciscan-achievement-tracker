const Repository = require('../data/repository');
const ApiResult = require('../utils/api-result');
const CrudService = require('./crud-service');

class GroupService extends CrudService {
  constructor() {
    super('groups');
    this.sortByOptions = ['id', 'name', 'description'];
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

  async preprocess(req_body) {
    return { name: req_body.name, description: req_body.description };
  }

  /**
   * For this service, post process takes the officer information
   * from the request and adds them to the group as both a member and an officer
   *
   * @param {Object} req
   * @returns {ApiResult} if there are any errors in the insertions
   */
  async postprocess(req) {
    const creatingOfficer = { user_id: req.body.officer_user_id };

    const new_group = (
      await this.repository.readByCustom('name', req.body.name)
    ).message;
    const officerGroupPair = {
      user_id: creatingOfficer.user_id,
      group_id: new_group[0].id,
    };

    //insert the creating officer into the members group, then the officers group
    const memberRepository = new Repository('group_members');
    const memberResult = await memberRepository.create(officerGroupPair);
    if (memberResult.error) {
      console.error(memberResult.error);
      return new ApiResult(500, 'Error inserting group member');
    }

    const officerRepository = new Repository('group_officers');
    const officerResult = await officerRepository.create(officerGroupPair);
    if (officerResult.error) {
      console.error(officerResult.error);
      return new ApiResult(500, 'Error inserting officer');
    }
  }
}

module.exports = GroupService;
