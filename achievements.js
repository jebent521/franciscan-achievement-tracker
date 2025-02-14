// Export anything needed for jest testing
class achievements {
    constructor(id = -1, title = "Empty Title", category = "No category", description = "Empty description", 
        prerequisite = null, points = 10) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.prerequisite = prerequisite;
        this.points = points;
    }

    valueOf() {
        // value used in comparisions
        return this.points;
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

module.exports = achievements;