module.exports = class UserDto {
  id;
  email;
  name;
  surname;
  phone;
  role;
  isactivated;
  created_at;
  udated_at;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.name = model.name;
    this.surname = model.surname;
    this.phone = model.phone;
    this.role = model.role;
    this.isactivated = model.isactivated;
    this.created_at = model.created_at;
    this.udated_at = model.updated_at;
  }
};
