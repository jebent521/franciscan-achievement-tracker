class User {
    constructor(id, username, password, email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    equals(other) {
        // equals if exact matches in all properties
        return (this.id == other.id) &&
        (this.username == other.username) && 
        (this.password == other.password) && 
        (this.email == other.email);
    }

    emailTaken(other) {
        // maybe used when checking a list of users and seeing if any have the same email.
        return (this.username == other.username);
    }
}

module.exports = User;