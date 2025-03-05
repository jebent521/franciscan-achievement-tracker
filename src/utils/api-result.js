class ApiResult {
  constructor(status, message, error = null) {
    this.status = status;
    this.message = message;
    this.error = error;
  }
}

module.exports = ApiResult;
