// Export anything needed for jest testing
class Achievement {
    constructor(id, title, category, description, prerequisite, points) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.prerequisite = prerequisite;
        this.points = points;
    }

    equals(other) {
        // equals if exact matches in all properties
        return (this.id == other.id) && 
        (this.title == other.title) && 
        (this.category == other.category) && 
        (this.description == other.description) && 
        (this.prerequisite == other.prerequisite) && 
        (this.points == other.points);
    }
}

module.exports = Achievement;