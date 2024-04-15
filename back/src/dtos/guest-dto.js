module.exports = class GuestDto {
  id;
  first_name;
  last_name;
  email;
  phone;

  constructor(model) {
    this.id = model.id;
    this.first_name = model.firstName;
    this.last_name = model.lastName;
    this.email = model.email;
    this.phone = model.phone;
  }
};
