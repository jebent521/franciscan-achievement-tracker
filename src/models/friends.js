// Export anything needed for jest testing
class Friend {
  constructor(id, friend_id) {
    this.id = id;
    this.friend_id = friend_id;
  }

  equals(other) {
    // equals if exact matches in all properties
    return this.id == other.id && this.friend_id == other.friend_id;
  }
}

module.exports = Friend;
