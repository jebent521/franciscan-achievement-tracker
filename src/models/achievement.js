// Export anything needed for jest testing
class Achievement {
  constructor(id, title, group_id, description, prerequisite, points) {
    this.id = id;
    this.title = title;
    this.group_id = group_id;
    this.description = description;
    this.prerequisite = prerequisite;
    this.points = points;
  }

  equals(other) {
    // equals if exact matches in all properties
    return (
      this.id == other.id &&
      this.title == other.title &&
      this.group_id == other.group_id &&
      this.description == other.description &&
      this.prerequisite == other.prerequisite &&
      this.points == other.points
    );
  }
}

module.exports = Achievement;
