const Service = require('./service');
const ApiResult = require('../utils/api-result');

class AchievementService extends Service {
    constructor() {
        super('achievements');
    }

    validateCreate(req) {
        const missingFields = [];
        if (!req.body.title) missingFields.push('title');
        if (!req.body.category) missingFields.push('category');
        if (!req.body.description) missingFields.push('description');
        if (!req.body.points) missingFields.push('points');
        if (missingFields.length > 0) {
            return new ApiResult(400, 'Missing fields: ' + missingFields.join(', '));
        }
        if (req.body.id) {
            return new ApiResult(400, 'Field "id" must not be provided');
        }
    }
}

module.exports = AchievementService;