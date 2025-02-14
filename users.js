class users {
    constructor(username= null, password=null, email=null) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    equals(other) {
        // equals if exact matches in all properties
        return (this.username == other.username) && 
        (this.password == other.password) && 
        (this.email == other.email);
    }

    emailTaken(other) {
        // maybe used when checking a list of users and seeing if any have the same email.
        return (this.username == other.username);
    }
}

module.exports = users;