// Export anything needed for jest testing
class UserAchievements {
  constructor(user_id, achievement_id, date_achieved) {
    this.user_id = user_id;
    this.achievement_id = achievement_id;
    this.date_achieved = date_achieved;
  }

  equals(other) {
    // equals if exact matches in all properties
    return (
      this.user_id == other.user_id &&
      this.achievement_id == other.achievement_id &&
      this.date_achieved == other.date_achieved
    );
  }
}

module.exports = UserAchievements;
