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
}

module.exports = achievements;