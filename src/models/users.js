class User {
  constructor(id, username, password, email, oauth_id, points) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.points = points;
    this.oauth_id = oauth_id;
  }

  equals(other) {
    // equals if exact matches in all properties
    return (
      this.id == other.id &&
      this.username == other.username &&
      this.password == other.password &&
      this.email == other.email &&
      this.points == other.points &&
      this.oauth_id == other.oauth_id
    );
  }

  // This was never properly implemented: it was checking email before
  // to implement, username must be unique in the DB
  // usernameTaken(other) {
  //   return this.username == other.username;
  // }
  emailTaken(other) {
    return this.email == other.email;
  }
  oauthExists(other) {
    return this.oauth_id == other.oauth_id;
  }
}

module.exports = User;
