export class User {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  serialize = () => {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
    };
  };

  static fromJson = (json) => {
    return new User(json.id, json.username, json.email, json.role);
  };
}
