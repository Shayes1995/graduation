export default class JobAd {
    constructor(id, title, description, createdBy, createdAt = new Date()) {
      this.id = new Field(id);
      this.title = new Field(title);
      this.description = new Field(description);
      this.createdBy = new Field(createdBy);
      this.createdAt = new Field(createdAt);
    }
    setId(id) {
        this.id.set(id);
    }

    getId(h) {
        return this.id.get(h);
    }

    setTitle(title) {
        this.title.set(title);
    }

    getTitle(h) {
        return this.title.get(h);
    }

    setDescription(description) {
        this.description.set(description);
    }

    getDescription(h) {
        return this.description.get(h);
    }

    setCreatedBy(createdBy) {
        this.createdBy.set(createdBy);
    }

    getCreatedBy(h) {
        return this.createdBy.get(h);
    }

    setCreatedAt(createdAt) {
        this.createdAt.set(createdAt);
    }

    getCreatedAt(h) {
        return this.createdAt.get(h);
    }
}

