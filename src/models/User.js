export default class User {
    constructor(id, name, email, password){
        this.id = new Field(id);
        this.name = new Field(name);
        this.email = new Field(email);
        this.password = new Field(password);
    }

    setId(id) {
        this.id.set(id);
    }

    getId(h) {
        return this.id.get(h);
    }

    setName(name) {
        this.name.set(name);
    }

    getName(h) {
        return this.name.get(h);
    }

    setEmail(email) {
        this.email.set(email);
    }

    getEmail(h) {
        return this.email.get(h);
    }

    setPassword(password) {
        this.password.set(password);
    }

    getPassword(h) {
        return this.password.get(h);
    }
}

